import { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [keyword, setKeyword] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="relative flex items-center w-full">
        <div className="absolute left-4 text-slate-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-12 pr-24 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm dark:text-slate-100 transition-all shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-2 px-4 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm transition-all focus:outline-none"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
