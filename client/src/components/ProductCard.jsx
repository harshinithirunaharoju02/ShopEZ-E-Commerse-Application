import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { ShoppingCart, Eye, Sparkles } from 'lucide-react';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: 1,
      })
    );
  };

  const isOutOfStock = product.countInStock === 0;

  return (
    <div className="group relative flex flex-col w-full bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
      
      {/* Badges (Featured / Out of Stock) */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        {product.isFeatured && (
          <span className="flex items-center gap-1.5 rounded-full bg-amber-500/90 px-3 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">
            <Sparkles className="h-3 w-3" />
            <span>Featured</span>
          </span>
        )}
        {isOutOfStock && (
          <span className="rounded-full bg-red-600/90 px-3 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link
            to={`/products/${product._id}`}
            className="flex items-center justify-center p-3 rounded-full bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 shadow-md hover:bg-slate-50 dark:hover:bg-slate-900 hover:scale-110 transition-all duration-200"
            title="View Details"
          >
            <Eye className="h-5 w-5" />
          </Link>
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center p-3 rounded-full bg-primary-600 text-white shadow-md hover:bg-primary-750 hover:scale-110 transition-all duration-200"
              title="Add to Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow p-5">
        {/* Category Tag */}
        {product.category && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary-500 dark:text-primary-400">
            {product.category.name}
          </span>
        )}

        {/* Product Title */}
        <Link
          to={`/products/${product._id}`}
          className="mt-1 text-base font-bold text-slate-850 hover:text-primary-600 dark:text-slate-200 dark:hover:text-primary-400 transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        {/* Short description */}
        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Cart Trigger */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-400">Price</span>
            <span className="text-lg font-black text-slate-900 dark:text-slate-100">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-primary-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:hover:bg-primary-500 dark:text-slate-200 dark:hover:text-white px-3.5 py-2 text-xs font-bold transition-all duration-200 focus:outline-none"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
