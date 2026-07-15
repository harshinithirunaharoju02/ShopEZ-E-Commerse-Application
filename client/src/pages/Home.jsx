import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CategoryCard from '../components/CategoryCard';
import ProductGrid from '../components/ProductGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowRight, ShoppingBag, Truck, CreditCard, ShieldCheck } from 'lucide-react';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?featured=true'),
        ]);
        setCategories(catRes.data);
        setFeaturedProducts(prodRes.data);
      } catch (err) {
        setError('Error loading storefront data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-16">
      
      {/* Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[450px] flex items-center shadow-xl">
        {/* Decorative background design */}
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80')]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-900/80 to-transparent"></div>
        
        <div className="relative max-w-2xl px-8 py-16 sm:px-12 lg:px-16 space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/25 px-3 py-1 text-xs font-bold text-primary-300 ring-1 ring-inset ring-primary-500/35">
            Summer Season Sale
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Discover a New Way to <span className="text-primary-400">Shop Online</span>
          </h1>
          <p className="text-lg text-slate-350 leading-relaxed">
            Get premium products across gadgets, fashion apparel, home appliances, and books with instant delivery and secure Cash on Delivery payments.
          </p>
          <div className="pt-4 flex gap-4">
            <Link
              to="/products"
              className="flex items-center gap-2 rounded-2xl bg-primary-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-primary-500 hover:shadow-primary-500/35 transition-all duration-200"
            >
              <span>Explore Products</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Free Shipping</h4>
            <p className="text-xs text-slate-400 mt-0.5">On all orders over $100</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Cash on Delivery</h4>
            <p className="text-xs text-slate-400 mt-0.5">Pay safely at your doorstep</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Guaranteed Quality</h4>
            <p className="text-xs text-slate-400 mt-0.5">Handpicked premium products</p>
          </div>
        </div>
      </section>

      {/* Error display */}
      {error && (
        <div className="text-center text-red-500 py-8 font-medium">
          {error}
        </div>
      )}

      {/* Categories Section */}
      {!error && categories.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Browse Categories
            </h2>
            <Link to="/products" className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline">
              View all
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {!error && featuredProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Featured Products
            </h2>
            <Link to="/products" className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline">
              Shop more
            </Link>
          </div>

          <ProductGrid products={featuredProducts} />
        </section>
      )}

    </div>
  );
};

export default Home;
