import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 xl:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400">
              <ShoppingBag className="h-6 w-6" />
              <span>MERN<span className="text-slate-800 dark:text-slate-200">Shop</span></span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              A modern e-commerce web application built on the MERN stack with rich, premium UI elements.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {/*<Github className="h-5 w-5" />*/}
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {/*<Twitter className="h-5 w-5" />*/}
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {/*<Github className="h-5 w-5" />*/}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Shop
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link to="/products" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link to="/cart" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      Shopping Cart
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Support
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Cash on Delivery
                    </span>
                  </li>
                  <li>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Free Shipping {'>'} $100
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:grid md:grid-cols-1">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Contact
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <li>Email: support@mernshop.com</li>
                  <li>Phone: +1 (555) 019-2834</li>
                  <li>Address: 123 E-Commerce Way, Suite 100</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
        
        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 flex items-center justify-between">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} MERNShop. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-slate-400 dark:text-slate-500">Terms of Service</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
