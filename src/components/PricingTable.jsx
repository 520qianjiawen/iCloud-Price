import React, { useMemo, useState } from 'react';
import { pricingData, iphone17PricingData, iphone18PricingData } from '../data/pricingData';

const plans = ['50GB', '200GB', '2TB', '6TB', '12TB'];
const iphoneStorages = ['256G', '512G', '1TB', '2TB'];

const iphone18ModelChips = ['18 Pro', '18 Pro Max'];
const iphone18DisplayToKey = {
  '18 Pro': '18 Pro',
  '18 Pro Max': '18 Pro Max',
};

const iphone17ModelChips = ['17', '17 Air', '17 Pro', '17 Pro Max'];
const iphone17DisplayToKey = {
  '17': '17',
  '17 Air': 'Air',
  '17 Pro': '17 Pro',
  '17 Pro Max': '17 Pro Max',
};

const formatCny = (value, decimals = 2) =>
  new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

const SearchIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" strokeLinecap="round" />
  </svg>
);

const ClearIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
  </svg>
);

const SortIcon = ({ direction, active }) => (
  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className={`h-3.5 w-3.5 ${active ? 'text-sky-600 dark:text-sky-300' : 'text-slate-400 dark:text-slate-500'}`}>
    <path d="m5 6 3-3 3 3M11 10l-3 3-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={active ? 1 : 0.7} />
    {active && direction === 'ascending' && <path d="M8 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
    {active && direction === 'descending' && <path d="M8 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
  </svg>
);

const LowestBadge = () => (
  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-300/30 dark:bg-emerald-400/15 dark:text-emerald-300">
    <span aria-hidden="true" className="text-emerald-600 dark:text-emerald-300">✦</span>
    最低价
  </span>
);

const RankBadge = ({ rank }) => {
  if (rank === 1) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/20 text-xs font-black text-amber-600 dark:bg-amber-400/25 dark:text-amber-300">
        🥇
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-300/30 text-xs font-black text-slate-600 dark:bg-slate-300/20 dark:text-slate-300">
        🥈
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-400/20 text-xs font-black text-orange-600 dark:bg-orange-400/25 dark:text-orange-300">
        🥉
      </span>
    );
  }
  return (
    <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-slate-500">
      #{String(rank).padStart(2, '0')}
    </span>
  );
};

const EmptyState = ({ query, onReset }) => (
  <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
    <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-100 p-4 text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-500">
      <SearchIcon />
    </div>
    <p className="font-bold text-slate-800 dark:text-slate-200">没有找到匹配的地区或货币</p>
    <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
      搜索关键词{query ? `：“${query}”` : ''}未匹配到任何记录，请尝试搜索国家名、地区名或货币代码（如 HKD、JPY、USD）。
    </p>
    {query && (
      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-sky-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:border-sky-400/40"
      >
        清空搜索条件
      </button>
    )}
  </div>
);

const PricingTable = ({
  currentProduct: controlledProduct,
  setCurrentProduct: controlledSetCurrentProduct,
  showIphone17,
  setShowIphone17,
}) => {
  const [internalProduct, setInternalProduct] = useState('iphone18');

  const currentProduct = controlledProduct !== undefined
    ? controlledProduct
    : (showIphone17 !== undefined ? (showIphone17 ? 'iphone17' : 'icloud') : internalProduct);

  const setCurrentProduct = (mode) => {
    if (controlledSetCurrentProduct) {
      controlledSetCurrentProduct(mode);
    }
    if (setShowIphone17) {
      setShowIphone17(mode === 'iphone17');
    }
    setInternalProduct(mode);
  };

  const isIphone18 = currentProduct === 'iphone18';
  const isIphone17 = currentProduct === 'iphone17';
  const isIphone = isIphone18 || isIphone17;

  const [activePlan, setActivePlan] = useState('50GB');
  const [activeIphone18Model, setActiveIphone18Model] = useState('18 Pro');
  const [activeIphone17Model, setActiveIphone17Model] = useState('17');
  const [sortDirection, setSortDirection] = useState('ascending');
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLocaleLowerCase();

  const currentIphoneData = isIphone18 ? iphone18PricingData : iphone17PricingData;
  const currentModelChips = isIphone18 ? iphone18ModelChips : iphone17ModelChips;
  const activeModel = isIphone18 ? activeIphone18Model : activeIphone17Model;
  const setActiveModel = isIphone18 ? setActiveIphone18Model : setActiveIphone17Model;
  const modelKey = (isIphone18 ? iphone18DisplayToKey : iphone17DisplayToKey)[activeModel] || activeModel;

  // iCloud Min Price by Plan
  const minPriceByPlan = useMemo(() => (
    Object.fromEntries(
      plans.map((plan) => [
        plan,
        Math.min(...pricingData.map((row) => row.plans[plan]?.cny ?? Infinity)),
      ])
    )
  ), []);

  // Filtered & Sorted iCloud Data
  const sortedData = useMemo(() => {
    const rows = pricingData.filter((row) =>
      `${row.country} ${row.currency}`.toLocaleLowerCase().includes(normalizedQuery)
    );

    return rows.sort((a, b) => {
      const difference = (a.plans[activePlan]?.cny ?? Infinity) - (b.plans[activePlan]?.cny ?? Infinity);
      return sortDirection === 'ascending' ? difference : -difference;
    });
  }, [activePlan, normalizedQuery, sortDirection]);

  // Filtered & Sorted iPhone Data
  const visibleIphoneData = useMemo(() => {
    if (!isIphone) return [];
    const rows = currentIphoneData.filter((row) =>
      `${row.country} ${row.currency}`.toLocaleLowerCase().includes(normalizedQuery)
    );

    return rows.sort((a, b) => {
      const cheapest = (row) => Math.min(...Object.values(row.models[modelKey] ?? {}).map((item) => item.cny));
      return cheapest(a) - cheapest(b);
    });
  }, [currentIphoneData, isIphone, modelKey, normalizedQuery]);

  const visibleIphoneStorages = iphoneStorages.filter((storage) =>
    visibleIphoneData.some((row) => row.models[modelKey]?.[storage])
  );

  // China Mainland benchmark comparison
  const chinaIphoneRow = useMemo(() => {
    if (!isIphone) return null;
    return currentIphoneData.find((r) => r.country.includes('中国大陆'));
  }, [currentIphoneData, isIphone]);

  const chinaIcloudRow = useMemo(() => {
    return pricingData.find((r) => r.country.includes('中国大陆'));
  }, []);

  const switchProduct = (mode) => {
    setCurrentProduct(mode);
    setQuery('');
  };

  // Best Deal Summary Insights
  const bestDealSummary = useMemo(() => {
    if (isIphone) {
      if (!visibleIphoneData.length) return null;
      const baseStorage = visibleIphoneStorages[0] || '256G';
      const cheapestRow = visibleIphoneData.reduce((prev, curr) => {
        const prevPrice = prev.models[modelKey]?.[baseStorage]?.cny ?? Infinity;
        const currPrice = curr.models[modelKey]?.[baseStorage]?.cny ?? Infinity;
        return currPrice < prevPrice ? curr : prev;
      }, visibleIphoneData[0]);

      const bestItem = cheapestRow?.models[modelKey]?.[baseStorage];
      const chinaItem = chinaIphoneRow?.models[modelKey]?.[baseStorage];

      let savingsText = '';
      if (chinaItem && bestItem && chinaItem.cny > bestItem.cny) {
        const diff = chinaItem.cny - bestItem.cny;
        const pct = ((diff / chinaItem.cny) * 100).toFixed(1);
        savingsText = `，比国行 (¥${formatCny(chinaItem.cny, 0)}) 便宜 ¥${formatCny(diff, 0)} (-${pct}%)`;
      }

      return {
        country: cheapestRow?.country,
        title: `${activeModel} · ${baseStorage}`,
        price: bestItem?.price,
        cny: bestItem?.cny ? `¥${formatCny(bestItem.cny, 0)}` : null,
        savingsText,
      };
    } else {
      if (!sortedData.length) return null;
      const cheapestRow = sortedData[0];
      const bestPlan = cheapestRow?.plans[activePlan];
      const chinaPlan = chinaIcloudRow?.plans[activePlan];

      let savingsText = '';
      if (chinaPlan && bestPlan && chinaPlan.cny > bestPlan.cny) {
        const diff = (chinaPlan.cny - bestPlan.cny).toFixed(2);
        const pct = (((chinaPlan.cny - bestPlan.cny) / chinaPlan.cny) * 100).toFixed(0);
        savingsText = `，比中国大陆 (¥${chinaPlan.cny}) 便宜 ¥${diff} (-${pct}%)`;
      }

      return {
        country: cheapestRow?.country,
        title: `${activePlan} / 月`,
        price: bestPlan?.price,
        cny: bestPlan?.cny ? `¥${formatCny(bestPlan.cny)}` : null,
        savingsText,
      };
    }
  }, [isIphone, visibleIphoneData, visibleIphoneStorages, modelKey, chinaIphoneRow, activeModel, sortedData, activePlan, chinaIcloudRow]);

  const CellContent = ({ planData, isMin, isActive, chinaPrice }) => {
    if (!planData) return <span className="text-xs text-slate-400 dark:text-slate-600">—</span>;

    const diff = chinaPrice && planData.cny < chinaPrice ? (chinaPrice - planData.cny).toFixed(2) : null;

    return (
      <div
        className={`ml-auto flex w-fit min-w-[7.5rem] flex-col items-end rounded-xl px-3 py-2 transition-all duration-200 ${
          isMin
            ? 'border border-emerald-500/30 bg-emerald-50/90 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-400/[0.08] dark:shadow-[0_0_24px_rgba(52,211,153,0.06)]'
            : isActive
            ? 'bg-sky-50 dark:bg-sky-400/[0.05]'
            : ''
        }`}
      >
        <span className="whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-slate-100">{planData.price}</span>
        <div className="mt-1 flex items-center gap-1.5 font-mono text-xs">
          <span className={`font-semibold ${isMin ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>
            ¥{formatCny(planData.cny)}
          </span>
        </div>
        {isMin && <span className="mt-1"><LowestBadge /></span>}
        {!isMin && diff && (
          <span className="mt-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">
            省 ¥{diff}
          </span>
        )}
      </div>
    );
  };

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/70 shadow-xl shadow-slate-200/30 backdrop-blur-2xl transition-all duration-300 dark:border-white/10 dark:bg-slate-900/50 dark:shadow-2xl dark:shadow-slate-950/30">
      {/* Top Controls Toolbar */}
      <div className="border-b border-slate-200/60 p-5 dark:border-white/[0.08] sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* 3-Way Segmented Product Tabs */}
          <div className="grid grid-cols-3 rounded-2xl border border-slate-200/80 bg-slate-100/90 p-1.5 shadow-inner backdrop-blur-md dark:border-white/10 dark:bg-black/30 sm:w-fit">
            {/* Tab: iCloud+ */}
            <button
              type="button"
              onClick={() => switchProduct('icloud')}
              aria-pressed={currentProduct === 'icloud'}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 sm:px-5 sm:text-sm ${
                currentProduct === 'icloud'
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-200/50 dark:bg-slate-800 dark:text-white dark:shadow-slate-950/40'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M1 12.5A4.5 4.5 0 005.5 17H15a4 4 0 001.866-7.539 3.504 3.504 0 00-4.504-4.272A4.5 4.5 0 004.06 8.235 4.502 4.502 0 001 12.5z" />
              </svg>
              <span>iCloud+</span>
            </button>

            {/* Tab: iPhone 18 Pro */}
            <button
              type="button"
              onClick={() => switchProduct('iphone18')}
              aria-pressed={currentProduct === 'iphone18'}
              className={`relative inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 sm:px-5 sm:text-sm ${
                currentProduct === 'iphone18'
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-200/50 dark:bg-slate-800 dark:text-white dark:shadow-slate-950/40'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-sky-500 dark:text-sky-400">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
              </svg>
              <span>iPhone 18 Pro</span>
              <span className="hidden rounded-full bg-sky-500/15 px-1.5 py-0.2 text-[9px] font-extrabold uppercase text-sky-600 dark:bg-sky-400/20 dark:text-sky-300 sm:inline">
                NEW
              </span>
            </button>

            {/* Tab: iPhone 17 */}
            <button
              type="button"
              onClick={() => switchProduct('iphone17')}
              aria-pressed={currentProduct === 'iphone17'}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 sm:px-5 sm:text-sm ${
                currentProduct === 'iphone17'
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-200/50 dark:bg-slate-800 dark:text-white dark:shadow-slate-950/40'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              <span>iPhone 17</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:max-w-xs">
            <label className="group relative block w-full">
              <span className="sr-only">搜索地区或货币</span>
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400 transition group-focus-within:text-sky-500 dark:text-slate-500 dark:group-focus-within:text-sky-300">
                <SearchIcon />
              </span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索地区（如 香港、日本）或货币…"
                className="w-full rounded-2xl border border-slate-200/90 bg-white/90 py-2.5 pl-10 pr-9 text-sm text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-white/20 dark:focus:border-sky-400/40 dark:focus:ring-sky-400/10"
              />
            </label>
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                title="清除输入"
              >
                <ClearIcon />
              </button>
            )}
          </div>
        </div>

        {/* Capacity / Model Chips Filter Row */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              {isIphone ? '切换机型规格' : '选择存储容量档位'}
            </p>
            <div className="no-scrollbar overflow-x-auto">
              <div className="flex min-w-max gap-2 pb-1">
                {(isIphone ? currentModelChips : plans).map((item) => {
                  const isActive = isIphone ? activeModel === item : activePlan === item;
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => (isIphone ? setActiveModel(item) : setActivePlan(item))}
                      aria-pressed={isActive}
                      className={`inline-flex min-w-[5rem] items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400/50 ${
                        isActive
                          ? 'border-sky-500/40 bg-sky-50 text-sky-800 shadow-sm shadow-sky-500/10 dark:border-sky-400/40 dark:bg-sky-400/15 dark:text-sky-200 dark:shadow-[0_0_20px_rgba(56,189,248,0.1)]'
                          : 'border-slate-200/80 bg-white/60 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-400 dark:hover:border-white/15 dark:hover:text-slate-200'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>收录</span>
            <span className="rounded-md bg-slate-200/60 px-2 py-0.5 font-mono font-bold text-slate-700 dark:bg-white/10 dark:text-slate-300">
              {isIphone ? visibleIphoneData.length : sortedData.length}
            </span>
            <span>个地区</span>
          </div>
        </div>

        {/* Global Lowest Price Insight Bar */}
        {bestDealSummary && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-50/70 px-4 py-3 text-xs leading-relaxed text-emerald-950 backdrop-blur-md dark:border-emerald-400/20 dark:bg-emerald-400/[0.07] dark:text-emerald-100">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 font-bold text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300">
                🏆
              </span>
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-100">当前全球最低：</span>
                <span className="font-semibold">{bestDealSummary.country}</span> · {bestDealSummary.title} 售价{' '}
                <span className="font-mono font-bold">{bestDealSummary.price}</span>
                {bestDealSummary.cny && (
                  <span className="ml-1 font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    (约 {bestDealSummary.cny})
                  </span>
                )}
                {bestDealSummary.savingsText && (
                  <span className="font-medium text-emerald-800 dark:text-emerald-300">
                    {bestDealSummary.savingsText}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Table Content */}
      {isIphone ? (
        visibleIphoneData.length ? (
          <>
            {/* Mobile Cards View */}
            <div className="space-y-3.5 p-4 sm:hidden">
              {visibleIphoneData.map((row, index) => {
                const storageOptions = iphoneStorages.filter((storage) => row.models[modelKey]?.[storage]);
                const chinaRow = chinaIphoneRow;

                return (
                  <article
                    key={row.country}
                    className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md transition-colors dark:border-white/[0.07] dark:bg-white/[0.025]"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <RankBadge rank={index + 1} />
                        <h3 className="font-bold text-slate-900 dark:text-white">{row.country}</h3>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-600 dark:bg-white/[0.08] dark:text-slate-400">
                        {row.currency}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {storageOptions.map((storage) => {
                        const item = row.models[modelKey][storage];
                        const chinaPrice = chinaRow?.models?.[modelKey]?.[storage]?.cny;
                        const diff = chinaPrice && item.cny < chinaPrice ? chinaPrice - item.cny : null;

                        return (
                          <div
                            key={storage}
                            className={`rounded-xl border p-3 transition ${
                              item.best
                                ? 'border-emerald-500/30 bg-emerald-50/90 dark:border-emerald-400/25 dark:bg-emerald-400/[0.08]'
                                : 'border-slate-200/70 bg-slate-50/60 dark:border-white/[0.06] dark:bg-black/20'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                {storage}
                              </span>
                              {item.best && <LowestBadge />}
                            </div>
                            <div className="mt-2 whitespace-nowrap text-xs font-bold text-slate-900 dark:text-slate-100">
                              {item.price}
                            </div>
                            <div className={`mt-0.5 font-mono text-[11px] font-semibold ${item.best ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>
                              ¥{formatCny(item.cny, 0)}
                            </div>
                            {diff && (
                              <div className="mt-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                省 ¥{formatCny(diff, 0)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="data-scrollbar hidden max-h-[72vh] overflow-auto sm:block">
              <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
                <thead className="sticky top-0 z-30 bg-slate-100/95 backdrop-blur-xl dark:bg-[#0d1627]/95">
                  <tr>
                    <th className="sticky left-0 z-40 min-w-56 border-b border-slate-200/80 bg-slate-100 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:border-white/[0.08] dark:bg-[#0d1627] dark:text-slate-400">
                      地区与货币
                    </th>
                    {visibleIphoneStorages.map((storage) => (
                      <th
                        key={storage}
                        className="min-w-44 border-b border-slate-200/80 px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-600 dark:border-white/[0.08] dark:text-slate-400"
                      >
                        {activeModel} · {storage}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-white/[0.05]">
                  {visibleIphoneData.map((row, index) => {
                    const chinaRow = chinaIphoneRow;

                    return (
                      <tr key={row.country} className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                        <td className="sticky left-0 z-20 border-b border-slate-200/60 bg-white/95 px-6 py-3.5 backdrop-blur-md group-hover:bg-slate-50 dark:border-white/[0.05] dark:bg-[#0d1627] dark:group-hover:bg-[#131e34]">
                          <div className="flex items-center gap-3">
                            <RankBadge rank={index + 1} />
                            <span className="font-bold text-slate-900 dark:text-slate-200">{row.country}</span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-500 dark:bg-white/[0.08] dark:text-slate-400">
                              {row.currency}
                            </span>
                          </div>
                        </td>
                        {visibleIphoneStorages.map((storage) => {
                          const item = row.models[modelKey]?.[storage];
                          const chinaPrice = chinaRow?.models?.[modelKey]?.[storage]?.cny;
                          const diff = chinaPrice && item?.cny && item.cny < chinaPrice ? chinaPrice - item.cny : null;

                          return (
                            <td key={storage} className="border-b border-slate-200/60 px-5 py-3 text-right dark:border-white/[0.05]">
                              {item ? (
                                <div
                                  className={`ml-auto w-fit min-w-[8.25rem] rounded-xl px-3 py-2 transition-all duration-200 ${
                                    item.best
                                      ? 'border border-emerald-500/30 bg-emerald-50/90 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-400/[0.08]'
                                      : 'bg-transparent'
                                  }`}
                                >
                                  <div className="whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {item.price}
                                  </div>
                                  <div className={`mt-0.5 font-mono text-xs font-semibold ${item.best ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>
                                    ¥{formatCny(item.cny, 0)}
                                  </div>
                                  {item.best && (
                                    <div className="mt-1">
                                      <LowestBadge />
                                    </div>
                                  )}
                                  {!item.best && diff && (
                                    <div className="mt-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                      省 ¥{formatCny(diff, 0)}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400 dark:text-slate-600">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <EmptyState query={query} onReset={() => setQuery('')} />
        )
      ) : sortedData.length ? (
        <>
          {/* Mobile Cards View for iCloud */}
          <div className="space-y-3 p-4 sm:hidden">
            {sortedData.map((row, index) => {
              const planData = row.plans[activePlan];
              const isMin = planData.cny === minPriceByPlan[activePlan];
              const chinaPrice = chinaIcloudRow?.plans[activePlan]?.cny;
              const diff = chinaPrice && planData.cny < chinaPrice ? (chinaPrice - planData.cny).toFixed(2) : null;

              return (
                <article
                  key={row.country}
                  className={`flex items-center justify-between gap-4 rounded-2xl border p-4 shadow-sm backdrop-blur-md transition ${
                    isMin
                      ? 'border-emerald-500/35 bg-emerald-50/90 dark:border-emerald-400/25 dark:bg-emerald-400/[0.07]'
                      : 'border-slate-200/80 bg-white/80 dark:border-white/[0.07] dark:bg-white/[0.025]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <RankBadge rank={index + 1} />
                      <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">{row.country}</h3>
                    </div>
                    <div className="ml-7 mt-1 flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] font-bold text-slate-500 dark:bg-white/[0.08] dark:text-slate-400">
                        {row.currency}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{activePlan} / 月</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="whitespace-nowrap text-sm font-bold text-slate-900 dark:text-slate-100">{planData.price}</div>
                    <div className={`mt-0.5 font-mono text-xs font-semibold ${isMin ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>
                      ¥{formatCny(planData.cny)}
                    </div>
                    {isMin && <div className="mt-1"><LowestBadge /></div>}
                    {!isMin && diff && (
                      <div className="mt-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        省 ¥{diff}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Desktop Table View for iCloud */}
          <div className="data-scrollbar hidden max-h-[72vh] overflow-auto sm:block">
            <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left">
              <thead className="sticky top-0 z-30 bg-slate-100/95 backdrop-blur-xl dark:bg-[#0d1627]/95">
                <tr>
                  <th className="sticky left-0 z-40 min-w-56 border-b border-slate-200/80 bg-slate-100 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:border-white/[0.08] dark:bg-[#0d1627] dark:text-slate-400">
                    地区与货币
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan}
                      className={`min-w-44 border-b border-slate-200/80 px-5 py-4 text-right text-xs font-bold uppercase tracking-wider ${
                        activePlan === plan
                          ? 'bg-sky-50 text-sky-800 dark:bg-sky-400/[0.06] dark:text-sky-200'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {plan} / 月
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-white/[0.05]">
                {sortedData.map((row, index) => (
                  <tr key={row.country} className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                    <td className="sticky left-0 z-20 border-b border-slate-200/60 bg-white/95 px-6 py-3.5 backdrop-blur-md group-hover:bg-slate-50 dark:border-white/[0.05] dark:bg-[#0d1627] dark:group-hover:bg-[#131e34]">
                      <div className="flex items-center gap-3">
                        <RankBadge rank={index + 1} />
                        <span className="font-bold text-slate-900 dark:text-slate-200">{row.country}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-500 dark:bg-white/[0.08] dark:text-slate-400">
                          {row.currency}
                        </span>
                      </div>
                    </td>
                    {plans.map((plan) => {
                      const planData = row.plans[plan];
                      const chinaPrice = chinaIcloudRow?.plans[plan]?.cny;

                      return (
                        <td
                          key={plan}
                          className={`border-b border-slate-200/60 px-5 py-3 text-right dark:border-white/[0.05] ${
                            activePlan === plan ? 'bg-sky-50/50 dark:bg-sky-400/[0.025]' : ''
                          }`}
                        >
                          <CellContent
                            planData={planData}
                            isMin={planData?.cny === minPriceByPlan[plan]}
                            isActive={activePlan === plan}
                            chinaPrice={chinaPrice}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <EmptyState query={query} onReset={() => setQuery('')} />
      )}

      {/* iCloud Bottom Price Sorting Bar */}
      {!isIphone && (
        <div className="border-t border-slate-200/60 bg-slate-50/60 p-4 dark:border-white/[0.08] dark:bg-black/15 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                当前容量价格排序：
              </span>
              {[
                { id: 'ascending', label: '从低到高' },
                { id: 'descending', label: '从高到低' },
              ].map((option) => {
                const isActive = sortDirection === option.id;
                return (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setSortDirection(option.id)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400/50 ${
                      isActive
                        ? 'border-sky-500/40 bg-sky-50 text-sky-800 shadow-sm dark:border-sky-400/30 dark:bg-sky-400/15 dark:text-sky-100'
                        : 'border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.07] dark:bg-white/[0.03] dark:text-slate-400 dark:hover:border-white/15 dark:hover:text-slate-200'
                    }`}
                  >
                    {option.label}
                    <SortIcon active={isActive} direction={option.id} />
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              当前按 <span className="font-semibold text-slate-700 dark:text-slate-300">{activePlan}</span> 订阅价格排序
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default PricingTable;
