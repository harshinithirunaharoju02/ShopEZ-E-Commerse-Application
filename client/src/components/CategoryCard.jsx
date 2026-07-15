import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/products?category=${category._id}`}
      className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
        <span className="text-xl font-bold uppercase">{category.name.substring(0, 2)}</span>
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {category.name}
      </h3>
      
      {category.description && (
        <p className="mt-1.5 text-center text-xs text-slate-400 dark:text-slate-500 line-clamp-2 max-w-[180px]">
          {category.description}
        </p>
      )}
    </Link>
  );
};

export default CategoryCard;
