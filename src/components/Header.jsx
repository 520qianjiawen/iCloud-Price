import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header = ({ currentProduct = 'icloud', showIphone17 = false, theme, setTheme }) => {
  const activeMode = currentProduct ?? (showIphone17 ? 'iphone17' : 'icloud');
  const isIphone18 = activeMode === 'iphone18';
  const isIphoneDuo = activeMode === 'iphoneduo';
  const isIphone17 = activeMode === 'iphone17';
  const isIphone = isIphone18 || isIphoneDuo || isIphone17;

  let title = 'iCloud+ 全球价格地图';
  let desc = '对比全球各地区官方订阅月费，按实时汇率折算人民币，快速锁定高性价比方案。';
  let regionCount = '41';
  let tierCount = '5';
  let tierLabel = '容量档位';

  if (isIphone18) {
    title = 'iPhone 18 Pro 全球价格地图';
    desc = '涵盖全球主要发售地区 Apple Store 官方售价，容量全版本覆盖与实时汇率换算。';
    regionCount = '11';
    tierCount = '2';
    tierLabel = '机型系列';
  } else if (isIphoneDuo) {
    title = 'iPhone Duo 全球价格地图';
    desc = '苹果首款横向书本折叠屏旗舰，多国家/地区官方售价比对与实时人民币折算。';
    regionCount = '11';
    tierCount = '4';
    tierLabel = '容量档位';
  } else if (isIphone17) {
    title = 'iPhone 17 全球价格地图';
    desc = '一览 iPhone 17 全系全球官方售价、容量版本与人民币实时折算比价。';
    regionCount = '11';
    tierCount = '4';
    tierLabel = '机型系列';
  }

  return (
    <header className="relative mb-6 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-2xl transition-all duration-300 dark:border-white/10 dark:bg-slate-900/50 dark:shadow-2xl dark:shadow-slate-950/40 sm:mb-8 sm:p-10">
      {/* Decorative ambient gradient glows */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-500/10" />
      <div className="pointer-events-none absolute -left-20 -bottom-24 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/10" />

      {/* Top Navbar Row */}
      <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-5 dark:border-white/[0.08]">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/[0.08] px-3.5 py-1.5 text-xs font-semibold text-sky-700 shadow-sm dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500 dark:bg-sky-400" />
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.07.65-2.73 1.42-.58.67-.99 1.74-.92 2.78 1.07.08 2.06-.57 2.64-1.33z" />
          </svg>
          <span>Neutemu Price Atlas</span>
        </div>

        {/* Top Right: Status & Theme Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 md:flex">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            <span>实时汇率自动换算</span>
          </div>
          {theme && setTheme && (
            <ThemeToggle theme={theme} setTheme={setTheme} />
          )}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="text-balance text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-slate-900 via-sky-800 to-indigo-900 bg-clip-text text-transparent dark:from-white dark:via-sky-200 dark:to-indigo-200">
            {title}
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
          {desc}
        </p>

        {/* Quick KPI Stat Highlights */}
        <div className="mx-auto mt-7 grid max-w-xl grid-cols-3 divide-x divide-slate-200/80 rounded-2xl border border-slate-200/80 bg-slate-50/80 py-3.5 shadow-sm backdrop-blur-md dark:divide-white/10 dark:border-white/10 dark:bg-black/20">
          <div className="px-2">
            <div className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">{regionCount}</div>
            <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">覆盖地区</div>
          </div>
          <div className="px-2">
            <div className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">{tierCount}</div>
            <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{tierLabel}</div>
          </div>
          <div className="px-2">
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-300 sm:text-2xl">CNY</div>
            <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">实时汇率折算</div>
          </div>
        </div>

        {/* Model and Version Notice Alerts */}
        {isIphone18 && (
          <div className="mx-auto mt-6 flex max-w-3xl items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-50/70 p-4 text-left text-xs leading-relaxed text-amber-900 shadow-sm backdrop-blur-md dark:border-amber-400/20 dark:bg-amber-400/[0.08] dark:text-amber-200 sm:text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-100">购机版本提示：</span>
              iPhone 18 Pro 与 18 Pro Max 的美国等部分地区版本仅支持 eSIM；中国大陆版本支持双实体 nano-SIM 卡，不支持 eSIM。海外购机请提前确认国内运营商频段兼容与联保政策。
            </div>
          </div>
        )}

        {isIphoneDuo && (
          <div className="mx-auto mt-6 flex max-w-3xl items-start gap-3 rounded-2xl border border-sky-500/25 bg-sky-50/70 p-4 text-left text-xs leading-relaxed text-sky-950 shadow-sm backdrop-blur-md dark:border-sky-400/20 dark:bg-sky-400/[0.08] dark:text-sky-200 sm:text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-300">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
            <div>
              <span className="font-bold text-sky-950 dark:text-sky-100">折叠屏首发提示：</span>
              iPhone Duo 为苹果首款横向书本折叠屏手机，配备 5.4 英寸外屏与 7.6 英寸可折叠内屏。中国大陆版本支持双实体 nano-SIM 卡；部分海外版本仅支持 eSIM。首批预购将于 10 月 16 日开启，10 月 23 日正式发售。
            </div>
          </div>
        )}

        {isIphone17 && (
          <div className="mx-auto mt-6 max-w-3xl space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-50/70 p-4 text-left text-xs leading-relaxed text-amber-900 shadow-sm backdrop-blur-md dark:border-amber-400/20 dark:bg-amber-400/[0.08] dark:text-amber-200 sm:text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="font-bold text-amber-900 dark:text-amber-100">版本差异提示：</span>
                iPhone 17 Air 全地区仅支持 eSIM；17 / Pro / Pro Max 的美国、日本、加拿大版本仅支持 eSIM。中国大陆版本使用双实体 SIM，不支持 eSIM。
              </div>
            </div>
            <div>
              <a
                href={encodeURI(import.meta.env.BASE_URL + 'iPhone 17 Pro 各地区版本区别.jpg')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:border-sky-400/30 dark:hover:bg-sky-400/10 dark:hover:text-white sm:text-sm"
              >
                <span>查看各地区详细版本与频段区别</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        )}

        {!isIphone && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
            <span>数据源自</span>
            <a
              href="https://support.apple.com/en-us/108047"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sky-600 transition hover:underline dark:text-sky-300"
            >
              Apple 官方价格支持文档
            </a>
            <span>· 全球基准汇率每日同步</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
