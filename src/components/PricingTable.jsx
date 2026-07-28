import React, { useMemo, useState } from 'react';
import { pricingData, iphone17PricingData } from '../data/pricingData';

const plans = ['50GB', '200GB', '2TB', '6TB', '12TB'];
const iphoneStorages = ['256G', '512G', '1TB', '2TB'];
const iphoneModelChips = ['17', '17 Air', '17 Pro', '17 Pro Max'];
const displayToKey = {
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

const SortIcon = ({ direction, active }) => (
  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className={`h-3.5 w-3.5 ${active ? 'text-white' : 'text-slate-500'}`}>
    <path d="m5 6 3-3 3 3M11 10l-3 3-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={active ? 1 : 0.7} />
    {active && direction === 'ascending' && <path d="M8 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
    {active && direction === 'descending' && <path d="M8 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
  </svg>
);

const LowestBadge = () => (
  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
    <span aria-hidden="true">✦</span>
    最低价
  </span>
);

const EmptyState = ({ query }) => (
  <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
    <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-500">
      <SearchIcon />
    </div>
    <p className="font-semibold text-slate-200">没有找到匹配地区</p>
    <p className="mt-1 text-xs text-slate-500">请尝试搜索其他国家、地区或货币代码{query ? `：“${query}”` : ''}</p>
  </div>
);

const PricingTable = ({ showIphone17, setShowIphone17 }) => {
  const [activePlan, setActivePlan] = useState('50GB');
  const [activeModel, setActiveModel] = useState('17');
  const [sortDirection, setSortDirection] = useState('ascending');
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const modelKey = displayToKey[activeModel];

  const minPriceByPlan = useMemo(() => (
    Object.fromEntries(
      plans.map((plan) => [
        plan,
        Math.min(...pricingData.map((row) => row.plans[plan]?.cny ?? Infinity)),
      ])
    )
  ), []);

  const sortedData = useMemo(() => {
    const rows = pricingData.filter((row) =>
      `${row.country} ${row.currency}`.toLocaleLowerCase().includes(normalizedQuery)
    );

    return rows.sort((a, b) => {
      const difference = (a.plans[activePlan]?.cny ?? Infinity) - (b.plans[activePlan]?.cny ?? Infinity);
      return sortDirection === 'ascending' ? difference : -difference;
    });
  }, [activePlan, normalizedQuery, sortDirection]);

  const visibleIphoneData = useMemo(() => {
    const rows = iphone17PricingData.filter((row) =>
      `${row.country} ${row.currency}`.toLocaleLowerCase().includes(normalizedQuery)
    );

    return rows.sort((a, b) => {
      const cheapest = (row) => Math.min(...Object.values(row.models[modelKey] ?? {}).map((item) => item.cny));
      return cheapest(a) - cheapest(b);
    });
  }, [modelKey, normalizedQuery]);

  const visibleIphoneStorages = iphoneStorages.filter((storage) =>
    visibleIphoneData.some((row) => row.models[modelKey]?.[storage])
  );

  const requestSort = (plan) => {
    if (plan === activePlan) {
      setSortDirection((current) => current === 'ascending' ? 'descending' : 'ascending');
      return;
    }

    setActivePlan(plan);
    setSortDirection('ascending');
  };

  const switchProduct = (iphoneMode) => {
    setShowIphone17(iphoneMode);
    setQuery('');
  };

  const CellContent = ({ planData, isMin, isActive }) => {
    if (!planData) return <span className="text-xs text-slate-600">—</span>;

    return (
      <div className={`ml-auto flex w-fit min-w-[7.25rem] flex-col items-end rounded-xl px-3 py-2 transition ${
        isMin
          ? 'border border-emerald-400/20 bg-emerald-400/[0.08] shadow-[0_0_24px_rgba(52,211,153,0.06)]'
          : isActive ? 'bg-sky-400/[0.05]' : ''
      }`}>
        <span className="whitespace-nowrap text-sm font-semibold text-slate-100">{planData.price}</span>
        <span className={`mt-1 font-mono text-xs ${isMin ? 'text-emerald-300' : 'text-slate-500'}`}>
          ¥{formatCny(planData.cny)}
        </span>
        {isMin && <span className="mt-1.5"><LowestBadge /></span>}
      </div>
    );
  };

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/55 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
      <div className="border-b border-white/[0.07] p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-2 rounded-xl border border-white/10 bg-black/20 p-1 sm:w-fit">
            <button
              type="button"
              onClick={() => switchProduct(false)}
              aria-pressed={!showIphone17}
              className={`rounded-lg px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
                !showIphone17
                  ? 'bg-white text-slate-950 shadow-lg shadow-black/20'
                  : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              iCloud+
            </button>
            <button
              type="button"
              onClick={() => switchProduct(true)}
              aria-pressed={showIphone17}
              className={`rounded-lg px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
                showIphone17
                  ? 'bg-white text-slate-950 shadow-lg shadow-black/20'
                  : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              iPhone 17
            </button>
          </div>

          <label className="group relative block w-full lg:max-w-xs">
            <span className="sr-only">搜索地区或货币</span>
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-500 transition group-focus-within:text-sky-300">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索地区或货币…"
              className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/10"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
              {showIphone17 ? '选择机型' : '选择容量并排序'}
            </p>
            <div className="no-scrollbar overflow-x-auto">
              <div className="flex min-w-max gap-2 pb-1">
                {(showIphone17 ? iphoneModelChips : plans).map((item) => {
                  const isActive = showIphone17 ? activeModel === item : activePlan === item;
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => showIphone17 ? setActiveModel(item) : requestSort(item)}
                      aria-pressed={isActive}
                      className={`inline-flex min-w-[4.5rem] items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-400/50 ${
                        isActive
                          ? 'border-sky-300/30 bg-sky-400/15 text-sky-100 shadow-[0_0_20px_rgba(56,189,248,0.08)]'
                          : 'border-white/[0.07] bg-white/[0.03] text-slate-500 hover:border-white/15 hover:text-slate-200'
                      }`}
                    >
                      {item}
                      {!showIphone17 && <SortIcon active={isActive} direction={sortDirection} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="shrink-0 text-xs text-slate-600">
            显示 <span className="font-semibold text-slate-400">{showIphone17 ? visibleIphoneData.length : sortedData.length}</span> 个地区
          </p>
        </div>
      </div>

      {showIphone17 ? (
        visibleIphoneData.length ? (
          <>
            <div className="space-y-3 p-3 sm:hidden">
              {visibleIphoneData.map((row, index) => {
                const storageOptions = iphoneStorages.filter((storage) => row.models[modelKey]?.[storage]);
                return (
                  <article key={row.country} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-white">{row.country}</h3>
                      <span className="text-[10px] font-semibold text-slate-600">#{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {storageOptions.map((storage) => {
                        const item = row.models[modelKey][storage];
                        return (
                          <div key={storage} className={`rounded-xl border p-3 ${item.best ? 'border-emerald-400/20 bg-emerald-400/[0.07]' : 'border-white/[0.06] bg-black/15'}`}>
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{storage}</span>
                              {item.best && <span className="text-emerald-300">✦</span>}
                            </div>
                            <div className="mt-2 whitespace-nowrap text-xs font-semibold text-slate-100">{item.price}</div>
                            <div className={`mt-1 font-mono text-[11px] ${item.best ? 'text-emerald-300' : 'text-slate-500'}`}>¥{formatCny(item.cny, 0)}</div>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="data-scrollbar hidden max-h-[70vh] overflow-auto sm:block">
              <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
                <thead className="sticky top-0 z-30 bg-[#101827]/95 backdrop-blur-xl">
                  <tr>
                    <th className="sticky left-0 z-40 min-w-52 border-b border-white/[0.07] bg-[#101827] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">地区</th>
                    {visibleIphoneStorages.map((storage) => (
                      <th key={storage} className="min-w-40 border-b border-white/[0.07] px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                        {activeModel} · {storage}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleIphoneData.map((row, index) => (
                    <tr key={row.country} className="group">
                      <td className="sticky left-0 z-20 border-b border-white/[0.055] bg-[#101827] px-6 py-4 group-hover:bg-[#152034]">
                        <div className="flex items-center gap-3">
                          <span className="w-5 font-mono text-[10px] text-slate-700">{String(index + 1).padStart(2, '0')}</span>
                          <span className="font-semibold text-slate-200">{row.country}</span>
                        </div>
                      </td>
                      {visibleIphoneStorages.map((storage) => {
                        const item = row.models[modelKey]?.[storage];
                        return (
                          <td key={storage} className="border-b border-white/[0.055] px-5 py-3 text-right transition group-hover:bg-white/[0.018]">
                            {item ? (
                              <div className={`ml-auto w-fit min-w-32 rounded-xl px-3 py-2 ${item.best ? 'border border-emerald-400/20 bg-emerald-400/[0.07]' : ''}`}>
                                <div className="whitespace-nowrap text-sm font-semibold text-slate-100">{item.price}</div>
                                <div className={`mt-1 font-mono text-xs ${item.best ? 'text-emerald-300' : 'text-slate-500'}`}>¥{formatCny(item.cny, 0)}</div>
                                {item.best && <div className="mt-1.5"><LowestBadge /></div>}
                              </div>
                            ) : <span className="text-slate-700">—</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : <EmptyState query={query} />
      ) : (
        sortedData.length ? (
          <>
            <div className="space-y-2.5 p-3 sm:hidden">
              {sortedData.map((row, index) => {
                const planData = row.plans[activePlan];
                const isMin = planData.cny === minPriceByPlan[activePlan];
                return (
                  <article key={row.country} className={`flex items-center justify-between gap-4 rounded-2xl border p-4 ${
                    isMin ? 'border-emerald-400/25 bg-emerald-400/[0.07]' : 'border-white/[0.07] bg-white/[0.025]'
                  }`}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-700">{String(index + 1).padStart(2, '0')}</span>
                        <h3 className="truncate text-sm font-semibold text-white">{row.country}</h3>
                      </div>
                      <p className="ml-6 mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600">{activePlan} / 月</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="whitespace-nowrap text-sm font-bold text-slate-100">{planData.price}</div>
                      <div className={`mt-1 font-mono text-xs ${isMin ? 'text-emerald-300' : 'text-slate-500'}`}>¥{formatCny(planData.cny)}</div>
                      {isMin && <div className="mt-1.5"><LowestBadge /></div>}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="data-scrollbar hidden max-h-[70vh] overflow-auto sm:block">
              <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left">
                <thead className="sticky top-0 z-30 bg-[#101827]/95 backdrop-blur-xl">
                  <tr>
                    <th className="sticky left-0 z-40 min-w-56 border-b border-white/[0.07] bg-[#101827] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">地区</th>
                    {plans.map((plan) => (
                      <th key={plan} className={`min-w-40 border-b border-white/[0.07] px-5 py-4 text-right text-xs font-bold uppercase tracking-wider ${
                        activePlan === plan ? 'bg-sky-400/[0.05] text-sky-200' : 'text-slate-500'
                      }`}>
                        {plan}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row, index) => (
                    <tr key={row.country} className="group">
                      <td className="sticky left-0 z-20 border-b border-white/[0.055] bg-[#101827] px-6 py-4 group-hover:bg-[#152034]">
                        <div className="flex items-center gap-3">
                          <span className="w-5 font-mono text-[10px] text-slate-700">{String(index + 1).padStart(2, '0')}</span>
                          <span className="font-semibold text-slate-200">{row.country}</span>
                        </div>
                      </td>
                      {plans.map((plan) => {
                        const planData = row.plans[plan];
                        return (
                          <td key={plan} className={`border-b border-white/[0.055] px-5 py-2.5 text-right transition group-hover:bg-white/[0.018] ${
                            activePlan === plan ? 'bg-sky-400/[0.025]' : ''
                          }`}>
                            <CellContent
                              planData={planData}
                              isMin={planData?.cny === minPriceByPlan[plan]}
                              isActive={activePlan === plan}
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
        ) : <EmptyState query={query} />
      )}
    </section>
  );
};

export default PricingTable;
