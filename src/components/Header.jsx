import React from 'react';

const Header = ({ showIphone17 = false }) => {
  return (
    <header className="relative mb-5 overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/55 px-5 py-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:mb-7 sm:px-10 sm:py-11">
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200 sm:text-xs">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M18.5 10.2A6.5 6.5 0 0 0 6 8.2 4.75 4.75 0 0 0 6.75 17.6h11a3.75 3.75 0 0 0 .75-7.4Z" />
          </svg>
          Neutemu Price Atlas
        </div>

        <h1 className="text-balance text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
          {showIphone17 ? 'iPhone 17 全球价格地图' : 'iCloud+ 全球价格地图'}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          {showIphone17
            ? '一次看懂各地区官方售价、容量版本和人民币换算。'
            : '比较全球订阅价格，快速找到每个容量档位的高性价比地区。'}
        </p>

        <div className="mx-auto mt-6 grid max-w-xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-black/15 py-3">
          <div>
            <div className="text-lg font-bold text-white sm:text-xl">{showIphone17 ? '11' : '41'}</div>
            <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500 sm:text-xs">地区</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white sm:text-xl">{showIphone17 ? '4' : '5'}</div>
            <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500 sm:text-xs">{showIphone17 ? '机型' : '容量'}</div>
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-300 sm:text-xl">CNY</div>
            <div className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500 sm:text-xs">实时换算</div>
          </div>
        </div>

      {showIphone17 && (
        <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-4 text-left text-xs leading-6 text-slate-400 sm:text-sm">
          <span className="mr-2 font-semibold text-amber-200">版本提示</span>
          Air 全地区仅支持 eSIM；17 / Pro / Pro Max 的美国、日本、加拿大版本仅支持 eSIM。中国大陆版本使用双实体 SIM，不支持 eSIM。
        </div>
      )}
      {showIphone17 ? (
        <div className="mt-4">
          <a
            href={encodeURI(import.meta.env.BASE_URL + 'iPhone 17 Pro 各地区版本区别.jpg')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400/60 sm:text-sm"
          >
            查看各地区版本区别
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-slate-500 sm:text-sm">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          <span>数据源自</span>
          <a href="https://support.apple.com/en-us/108047" target="_blank" rel="noopener noreferrer" className="font-medium text-sky-300 transition hover:text-sky-200">
            Apple 官方价格
          </a>
          <span>· 汇率每日同步</span>
        </div>
      )}
      </div>
    </header>
  );
};

export default Header;
