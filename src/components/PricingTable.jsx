import React, { useState, useMemo, useRef, useEffect } from 'react';
import { pricingData } from '../data/pricingData';

const plans = ['50GB', '200GB', '2TB', '6TB', '12TB'];

const PricingTable = () => {
  const [activePlan, setActivePlan] = useState('50GB');
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
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
           <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm transition-colors duration-200">
            Share as Image
          </button>
          <button className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md text-sm transition-colors duration-200 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
            Sponsor
          </button>
        </div>
        <div className="flex flex-col items-stretch sm:items-end w-full">
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
        </div>
      </div>

      <div ref={scrollContainerRef} className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
        <table className="w-full min-w-[680px] sm:min-w-[900px] md:min-w-[1000px] text-sm text-left">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 sticky left-0 z-20 bg-gray-800 w-40 sm:w-56">Country</th>
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
                <td className="px-6 py-4 font-medium text-white sticky left-0 z-10 bg-gray-800 group-hover:bg-gray-700/50 border-r border-gray-700 w-40 sm:w-56 max-w-[10rem] sm:max-w-[14rem]">
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
    </div>
  );
};

export default PricingTable;
