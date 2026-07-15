const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[40vh] w-full">
      <div className="relative flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-primary-600 dark:border-t-primary-500 animate-spin"></div>
        <div className="absolute h-6 w-6 rounded-full border-4 border-transparent border-t-slate-400 dark:border-t-slate-500 animate-spin-reverse"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
