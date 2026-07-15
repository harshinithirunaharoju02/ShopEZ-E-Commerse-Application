import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const categoryFilter = req.query.category ? { category: req.query.category } : {};
  const isFeaturedFilter = req.query.featured === 'true' ? { isFeatured: true } : {};

  // Combine filters
  const filter = { ...keyword, ...categoryFilter, ...isFeaturedFilter };

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });

  res.json(products);
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, countInStock, isFeatured } = req.body;

  if (!name || !price || !description || !image || !category) {
    res.status(400);
    throw new Error('Please enter all required fields');
  }

  const product = new Product({
    name,
    price,
    description,
    image,
    category,
    countInStock: countInStock || 0,
    isFeatured: isFeatured || false,
    user: req.user._id,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, countInStock, isFeatured } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price !== undefined ? price : product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.category = category || product.category;
    product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.user = req.user._id; // Track admin who updated it

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
