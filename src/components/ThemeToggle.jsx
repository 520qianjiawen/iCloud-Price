import React from 'react';

const ThemeToggle = ({ theme, setTheme }) => {
  const options = [
    {
      id: 'system',
      label: '自动',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.19l.72 2.16a.75.75 0 01-1.42.48L11.04 15H8.96l-.82 2.64a.75.75 0 01-1.42-.48L7.44 15H4.25A2.25 2.25 0 012 12.75v-8.5zm2.25-.75a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h11.5a.75.75 0 00.75-.75v-8.5a.75.75 0 00-.75-.75H4.25z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: 'light',
      label: '浅色',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zm0 13a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zm0-8a3 3 0 100 6 3 3 0 000-6zm5.657-1.657a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 11-1.062-1.06l1.061-1.061a.75.75 0 011.061 0zm-9.193 9.193a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 11-1.061-1.06l1.06-1.061a.75.75 0 011.061 0zm11.314-3.536a.75.75 0 01.75.75h1.5a.75.75 0 010-1.5h-1.5a.75.75 0 01-.75.75zm-14 0a.75.75 0 01.75.75h1.5a.75.75 0 010-1.5h-1.5a.75.75 0 01-.75.75zm11.314 5.657a.75.75 0 010-1.061l1.06-1.06a.75.75 0 111.062 1.06l-1.061 1.061a.75.75 0 01-1.061 0zm-9.193-9.193a.75.75 0 010-1.06l1.06-1.061a.75.75 0 111.061 1.06l-1.06 1.061a.75.75 0 01-1.061 0z" />
        </svg>
      ),
    },
    {
      id: 'dark',
      label: '深色',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <div className="inline-flex items-center rounded-full border border-slate-200/80 bg-slate-100/90 p-0.5 shadow-inner backdrop-blur-md dark:border-white/10 dark:bg-black/30">
      {options.map((opt) => {
        const active = theme === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            title={`切换到${opt.label}模式`}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
              active
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white dark:shadow-slate-950/40'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {opt.icon}
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
