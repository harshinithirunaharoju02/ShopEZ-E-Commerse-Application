import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import { Trash2, Minus, Plus } from 'lucide-react';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleQtyChange = (newQty) => {
    if (newQty < 1 || newQty > item.countInStock) return;
    dispatch(
      addToCart({
        ...item,
        qty: newQty,
      })
    );
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.product));
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0 transition-colors">
      
      {/* Product Image */}
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Item info */}
      <div className="flex-grow flex flex-col text-center sm:text-left">
        <Link
          to={`/products/${item.product}`}
          className="text-sm font-bold text-slate-800 hover:text-primary-600 dark:text-slate-200 dark:hover:text-primary-400 transition-colors line-clamp-1"
        >
          {item.name}
        </Link>
        <span className="text-xs text-slate-400 mt-0.5">${item.price.toFixed(2)} each</span>
      </div>

      {/* Quantity adjustment & Delete */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-3 sm:mt-0">
        {/* Quantity control */}
        <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-1">
          <button
            onClick={() => handleQtyChange(item.qty - 1)}
            disabled={item.qty <= 1}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-30 transition-all"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          
          <span className="w-8 text-center text-sm font-bold text-slate-800 dark:text-slate-200">
            {item.qty}
          </span>

          <button
            onClick={() => handleQtyChange(item.qty + 1)}
            disabled={item.qty >= item.countInStock}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-30 transition-all"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Total Price for this item */}
        <div className="w-20 text-right text-sm font-black text-slate-900 dark:text-slate-100">
          ${(item.price * item.qty).toFixed(2)}
        </div>

        {/* Delete button */}
        <button
          onClick={handleRemove}
          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
          aria-label="Delete item"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>

    </div>
  );
};

export default CartItem;
