import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Package, Tag, ShoppingCart, Plus, ArrowRight,
  TrendingUp, Loader2, Star, AlertTriangle
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, iconColor, iconBg, linkTo, linkLabel }) => (
  <div className="flex flex-col gap-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
        <Icon className="h-6 w-6" />
      </div>
      {linkTo && (
        <Link to={linkTo} className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
          {linkLabel} <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
    <div>
      <p className="text-3xl font-black text-slate-900 dark:text-slate-100">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0, featured: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories'),
        ]);
        const prods = prodRes.data;
        setStats({
          products: prods.length,
          categories: catRes.data.length,
          featured: prods.filter((p) => p.isFeatured).length,
          outOfStock: prods.filter((p) => p.countInStock === 0).length,
        });
        setRecentProducts(prods.slice(0, 5));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Welcome back! Here's your store at a glance.</p>
        </div>
        <Link to="/admin/products"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold shadow-lg shadow-primary-600/25 transition-all w-fit">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Package} label="Total Products" value={stats.products}
              iconColor="text-primary-600 dark:text-primary-400"
              iconBg="bg-primary-50 dark:bg-primary-950/40"
              linkTo="/admin/products" linkLabel="Manage"
            />
            <StatCard
              icon={Tag} label="Categories" value={stats.categories}
              iconColor="text-violet-600 dark:text-violet-400"
              iconBg="bg-violet-50 dark:bg-violet-950/40"
            />
            <StatCard
              icon={Star} label="Featured Products" value={stats.featured}
              iconColor="text-amber-600 dark:text-amber-400"
              iconBg="bg-amber-50 dark:bg-amber-950/40"
              linkTo="/admin/products" linkLabel="View"
            />
            <StatCard
              icon={AlertTriangle} label="Out of Stock" value={stats.outOfStock}
              iconColor="text-red-600 dark:text-red-400"
              iconBg="bg-red-50 dark:bg-red-950/40"
              linkTo="/admin/products" linkLabel="Fix"
            />
          </div>

          {/* Recent Products */}
          {recentProducts.length > 0 && (
            <div className="rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary-500" />
                  <h2 className="font-black text-slate-900 dark:text-slate-100">Recent Products</h2>
                </div>
                <Link to="/admin/products" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentProducts.map((p) => (
                  <div key={p._id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="h-10 w-10 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {p.image && <img src={p.image} alt={p.name} className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.category?.name || '—'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-sm text-slate-900 dark:text-slate-100">${Number(p.price).toFixed(2)}</p>
                      <p className={`text-xs font-semibold ${p.countInStock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                        {p.countInStock > 0 ? `${p.countInStock} in stock` : 'Out of stock'}
                      </p>
                    </div>
                    {p.isFeatured && <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Manage Products', desc: 'Add, view, or delete products', to: '/admin/products', icon: Package, color: 'text-primary-600' },
              { label: 'Manage Orders', desc: 'Review and track customer orders', to: '/admin/orders', icon: ShoppingCart, color: 'text-violet-600' },
              { label: 'Browse Store', desc: 'See how your store looks live', to: '/', icon: TrendingUp, color: 'text-emerald-600' },
            ].map(({ label, desc, to, icon: Icon, color }) => (
              <Link key={to} to={to}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <Icon className={`h-6 w-6 ${color} shrink-0`} />
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 ml-auto shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
