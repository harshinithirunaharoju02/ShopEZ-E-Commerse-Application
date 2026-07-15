import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { Filter } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeCategory = searchParams.get('category') || '';
  const activeKeyword = searchParams.get('keyword') || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = '/products';
        const params = [];
        
        if (activeCategory) params.push(`category=${activeCategory}`);
        if (activeKeyword) params.push(`keyword=${encodeURIComponent(activeKeyword)}`);
        
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const { data } = await api.get(url);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Error loading products. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, activeKeyword]);

  const handleSearch = (keyword) => {
    const params = new URLSearchParams(searchParams);
    if (keyword) {
      params.set('keyword', keyword);
    } else {
      params.delete('keyword');
    }
    setSearchParams(params);
  };

  const handleCategorySelect = (categoryId) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  return (
    <div className="space-y-8">
      
      {/* Title & Search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">
            {activeKeyword ? `Search Results for "${activeKeyword}"` : 'All Products'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{products.length} products available</p>
        </div>
        
        <SearchBar onSearch={handleSearch} initialValue={activeKeyword} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Category Filters (Sidebar on desktop, row on mobile) */}
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-800 pb-3">
            <Filter className="h-4 w-4" />
            <span>Filter Categories</span>
          </div>

          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
            {/* Clear Filters */}
            <button
              onClick={() => handleCategorySelect('')}
              className={`px-4 py-2.5 rounded-xl text-left text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === ''
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650'
              }`}
            >
              All Categories
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat._id)}
                className={`px-4 py-2.5 rounded-xl text-left text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat._id
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Products Grid Content */}
        <div className="flex-grow">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center py-12 text-red-500 font-medium">{error}</div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>

      </div>

    </div>
  );
};

export default Products;
