import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LayoutDashboard, ShoppingBag, ClipboardList, ArrowLeft } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  const linkClass = (target) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
      path === target
        ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
    }`;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      
      <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Admin Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 h-fit">
          <div className="px-4 py-2 mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Admin Control</h2>
          </div>
          
          <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          
          <Link to="/admin/products" className={linkClass('/admin/products')}>
            <ShoppingBag className="h-5 w-5" />
            <span>Products</span>
          </Link>
          
          <Link to="/admin/orders" className={linkClass('/admin/orders')}>
            <ClipboardList className="h-5 w-5" />
            <span>Orders</span>
          </Link>
          
          <hr className="my-2 border-slate-100 dark:border-slate-800" />
          
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Store</span>
          </Link>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-grow bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminLayout;
