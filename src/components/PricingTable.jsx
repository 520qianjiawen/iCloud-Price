import React, { useState, useMemo, useRef, useEffect } from 'react';
import { pricingData, iphone17PricingData } from '../data/pricingData';

const plans = ['50GB', '200GB', '2TB', '6TB', '12TB'];
const iphoneModels = ['17', 'Air', '17 Pro', '17 Pro Max'];
const iphoneStorages = ['256G', '512G', '1TB', '2TB'];
const iphoneModelChips = ['17', '17 Air', '17 Pro', '17 Pro Max'];
const displayToKey = { '17': '17', '17 Air': 'Air', '17 Pro': '17 Pro', '17 Pro Max': '17 Pro Max' };

const PricingTable = () => {
  const [activePlan, setActivePlan] = useState('50GB');
  const [showIphone17, setShowIphone17] = useState(false);
  const [activeModel, setActiveModel] = useState('17');
  const [sortDirection, setSortDirection] = useState('ascending'); // 'ascending' | 'descending'
  const scrollContainerRef = useRef(null);
  const headerRefs = useRef({}); // map of plan -> th element

  // Precompute each列(plan)的最低价格(cny)
  const minPriceByPlan = useMemo(() => {
    const map = {};
    plans.forEach((p) => {
      let min = Infinity;
      pricingData.forEach((row) => {
        const v = row.plans[p]?.cny;
        if (typeof v === 'number' && v < min) min = v;
      });
      map[p] = min;
    });
    return map;
  }, []);

  const sortedData = useMemo(() => {
    return [...pricingData].sort((a, b) => {
      const priceA = a.plans[activePlan]?.cny ?? Infinity;
      const priceB = b.plans[activePlan]?.cny ?? Infinity;
      const diff = Number(priceA) - Number(priceB);
      return sortDirection === 'ascending' ? diff : -diff;
    });
  }, [activePlan, sortDirection]);

  const requestSort = (plan) => {
    if (plan === activePlan) {
      setSortDirection((prev) => (prev === 'ascending' ? 'descending' : 'ascending'));
    } else {
      setActivePlan(plan);
      setSortDirection('ascending');
    }
  };

  const getSortIndicator = (plan) => {
    if (plan !== activePlan) return '↕️';
    return sortDirection === 'ascending' ? '🔼' : '🔽';
  };

  // Auto-scroll the table horizontally to keep active column visible/centered
  useEffect(() => {
    const container = scrollContainerRef.current;
    const th = headerRefs.current[activePlan];
    if (!container || !th) return;
    const containerRect = container.getBoundingClientRect();
    const thRect = th.getBoundingClientRect();
    const current = container.scrollLeft;
    // Calculate target so that the active column is centered in view
    const delta = (thRect.left - containerRect.left) - (container.clientWidth / 2 - thRect.width / 2);
    const target = current + delta;
    container.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [activePlan]);

  const CellContent = ({ planData, isMin }) => {
    if (!planData) return <span className="text-gray-500">-</span>;
    return (
      <div className={`flex flex-col ${
        isMin
          ? 'bg-green-600/25 ring-2 ring-green-400/50 rounded-md px-2 py-1'
          : ''
      }` }>
        <span className="font-medium text-white">{planData.price}</span>
        {planData.best && (
          <span className="text-xs bg-green-500 text-white rounded-full px-2 py-0.5 mt-1 self-start">
            Best
          </span>
        )}
        <span className="text-xs text-gray-400 mt-1">¥{planData.cny.toFixed(2)}</span>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
           <button
            onClick={() => setShowIphone17(v => !v)}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 inline-flex items-center gap-2 whitespace-nowrap border border-gray-600/50 bg-transparent text-gray-200 hover:bg-gray-700/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M15.75 2.25a.75.75 0 01.75.75v2.25h2.25a.75.75 0 010 1.5H16.5v2.25a.75.75 0 01-1.5 0V6.75h-2.25a.75.75 0 010-1.5h2.25V3a.75.75 0 01.75-.75z"/><path fillRule="evenodd" d="M3 6.75A2.25 2.25 0 015.25 4.5h5.878c.597 0 1.17.237 1.591.659l4.122 4.122c.422.421.659.994.659 1.591v6.878A2.25 2.25 0 0115.25 20.25H5.25A2.25 2.25 0 013 18V6.75zm3 2.25a.75.75 0 000 1.5h6a.75.75 0 000-1.5H6z" clipRule="evenodd"/></svg>
            {showIphone17 ? '返回 iCloud+ 价格' : 'iPhone 17 全球价格比较'}
          </button>
          <button className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md text-sm transition-colors duration-200 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
            Sponsor
          </button>
        </div>
        <div className="flex flex-col items-stretch sm:items-end w-full">
          {showIphone17 ? (
    <>
      <h6 className="text-sm font-semibold text-gray-400 mb-2 text-center sm:text-right">选择机型：</h6>
      <div className="bg-gray-800/80 p-1 rounded-xl overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex gap-2 min-w-max">
          {iphoneModelChips.map((label) => (
            <button
              key={label}
              onClick={() => setActiveModel(label)}
              aria-pressed={activeModel === label}
              className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 inline-flex items-center gap-2 min-w-[88px] justify-center ${
                activeModel === label
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  ) : (
    <>
      <h6 className="text-sm font-semibold text-gray-400 mb-2 text-center sm:text-right">Sort Pricing By Plan:</h6>
      <div className="bg-gray-800/80 p-1 rounded-xl overflow-x-auto no-scrollbar whitespace-nowrap snap-x snap-mandatory">
        <div className="flex gap-2 min-w-max">
          {plans.map((plan) => (
            <button
              key={plan}
              onClick={() => requestSort(plan)}
              aria-pressed={activePlan === plan}
              className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 inline-flex items-center gap-2 snap-center min-w-[84px] sm:min-w-[96px] justify-center ${
                activePlan === plan
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span>{plan}</span>
              <span className="leading-none">{getSortIndicator(plan)}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )}
        </div>
      </div>

      {showIphone17 ? (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
          <table className="w-full min-w-[700px] sm:min-w-[900px] text-sm text-left">
            <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 sticky left-0 z-30 bg-gray-800 w-48">Country/Region</th>
                {([displayToKey[activeModel]]).map((m) => (
                  iphoneStorages.filter(s => iphone17PricingData.some(row => row.models?.[m]?.[s])).map((s) => (
                    <th key={`${m}-${s}`} className="px-3 py-3 text-right text-xs sm:text-sm">{m} {s}</th>
                  ))
                ))}
              </tr>
            </thead>
            <tbody>
              {iphone17PricingData.map((row, idx) => (
                <tr key={idx} className="group border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-150">
                  <td className="px-6 py-4 font-medium text-white sticky left-0 z-20 bg-gray-800 group-hover:bg-gray-700 border-r border-gray-700 w-32 sm:w-48">
                    <div className="flex items-center gap-2 truncate text-sm">{row.country}</div>
                  </td>
                  {([displayToKey[activeModel]]).map((m) => (
                    iphoneStorages.filter(s => row.models?.[m]?.[s]).map((s) => {
                      const item = row.models[m][s];
                      return (
                        <td key={`${row.country}-${m}-${s}`} className="px-3 py-4 text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-medium text-white font-mono text-sm">{item.price}</span>
                            {item.best && (
                              <span className="text-[10px] bg-green-500 text-white rounded-full px-2 py-0.5 mt-1">Best</span>
                            )}
                          </div>
                        </td>
                      );
                    })
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div ref={scrollContainerRef} className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
          <table className="w-full min-w-[680px] sm:min-w-[900px] md:min-w-[1000px] text-sm text-left">
            <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 sticky left-0 z-30 bg-gray-800 w-40 sm:w-56">Country</th>
                <th scope="col" className="px-6 py-3 w-24 sm:w-28">Currency</th>
                {plans.map(plan => (
                  <th
                    key={plan}
                    ref={(el) => { if (el) headerRefs.current[plan] = el; }}
                    scope="col"
                    className="px-6 py-3 text-right"
                  >
                    {plan}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((data, index) => (
                <tr key={index} className="group border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-150">
                  <td className="px-6 py-4 font-medium text-white sticky left-0 z-20 bg-gray-800 group-hover:bg-gray-700 border-r border-gray-700 w-40 sm:w-56 max-w-[10rem] sm:max-w-[14rem]">
                    <div className="flex items-center gap-2 truncate">{data.country}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 w-24 sm:w-28">{data.currency}</td>
                  {plans.map(plan => {
                    const planData = data.plans[plan];
                    const isMin = planData && Number(planData.cny) === minPriceByPlan[plan];
                    return (
                      <td
                        key={plan}
                        className={`px-6 py-4 text-right ${activePlan === plan ? 'bg-blue-900/20' : ''}`}
                      >
                        <CellContent planData={planData} isMin={isMin} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PricingTable;
