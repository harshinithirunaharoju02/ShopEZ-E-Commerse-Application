import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please select a category'],
      ref: 'Category',
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      default: 0.0,
    },
    countInStock: {
      type: Number,
      required: [true, 'Please add stock count'],
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
