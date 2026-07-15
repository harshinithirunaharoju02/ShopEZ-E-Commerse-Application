import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { clearCartItems } from '../redux/slices/cartSlice';
import { ShoppingCart, User, Sun, Moon, Menu, X, ChevronDown, LogOut, LayoutDashboard, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Calculate total items in the cart
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCartItems());
    setIsDropdownOpen(false);
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full transition-all duration-300 glass shadow-md dark:shadow-slate-900 border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary-600 dark:text-primary-400">
              <ShoppingBag className="h-6 w-6" />
              <span>Shop<span className="text-slate-800 dark:text-slate-200">EZ-E-Commerse Application</span></span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors">
              Products
            </Link>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-400" />}
            </button>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-all flex items-center"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-primary-600 dark:text-slate-200 dark:hover:text-primary-400 focus:outline-none transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>{userInfo.name}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white dark:bg-slate-900 p-1.5 shadow-xl ring-1 ring-black/5 dark:ring-white/5 border border-slate-100 dark:border-slate-800 focus:outline-none animate-fadeIn">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                    
                    {userInfo.isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    
                    <hr className="my-1 border-slate-100 dark:border-slate-800" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-primary-600 dark:text-slate-200 dark:hover:text-primary-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 transition-all"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-400" />}
            </button>

            {/* Shopping Cart */}
            <Link to="/cart" className="relative p-2 rounded-full text-slate-600 dark:text-slate-300">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger Trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md animate-slideDown">
          <div className="space-y-1 px-4 py-3">
            <Link
              to="/products"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Products
            </Link>
            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  My Profile
                </Link>
                {userInfo.isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left rounded-lg px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-center text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center rounded-lg bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
