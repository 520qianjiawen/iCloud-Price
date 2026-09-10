import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 px-4 py-8 text-xs text-slate-500 transition-colors duration-200 dark:border-white/[0.08] dark:text-slate-400 sm:flex-row">
      <div className="flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
        <p>价格数据自动拉取同步，实际结算金额以当地 Apple Store 标价及发卡行汇率为准。</p>
      </div>
      <p className="flex items-center gap-1.5">
        <span>Designed & Developed by</span>
        <a
          href="https://neutemu.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-slate-700 transition-colors hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
        >
          Neutemu ↗
        </a>
      </p>
    </footer>
  );
};

export default Footer;
