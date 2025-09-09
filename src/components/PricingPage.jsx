import React, { useState, useMemo } from 'react';
import { pricingData } from '../data/pricingData';

const plans = ["50GB", "200GB", "2TB", "6TB", "12TB"];

const PricingPage = () => {
  const [activePlan, setActivePlan] = useState('50GB');
  const [sortConfig, setSortConfig] = useState({ key: '50GB', direction: 'ascending' });

  const sortedData = useMemo(() => {
    let sortableItems = [...pricingData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const planA = a.plans.find(p => p.plan === sortConfig.key);
        const planB = b.plans.find(p => p.plan === sortConfig.key);

        if (parseFloat(planA.cny) < parseFloat(planB.cny)) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (parseFloat(planA.cny) > parseFloat(planB.cny)) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [pricingData, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setActivePlan(key);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return "↕️";
    }
    return sortConfig.direction === 'ascending' ? '🔼' : '🔽';
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 animate-fade-in-up">
          iCloud+ 全球定价比较
        </h1>
        <p className="text-lg text-gray-400 mb-4">找到全球最好的iCloud+ 价格</p>
        <div className="text-sm text-gray-500">
          来自<a href="https://support.apple.com/en-us/108047" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">苹果</a>的每日更新数据 • 由<a href="https://neutemu.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Neutemu</a>开发
        </div>
      </header>

      <div className="flex justify-center items-center space-x-2 md:space-x-4 mb-8">
        <button className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
          Share as Image
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-500 transition-colors">
          Sponsor
        </button>
      </div>

      <div className="bg-gray-800 p-2 rounded-lg shadow-lg mb-8">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <span className="text-gray-400 font-semibold text-sm mr-2 hidden sm:block">Sort Pricing By Plan:</span>
          {plans.map((plan) => (
            <button
              key={plan}
              onClick={() => requestSort(plan)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                activePlan === plan
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span>{plan}</span>
              <span className="ml-2 inline-block align-middle">
                {getSortIndicator(plan)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-2xl">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-700 text-gray-300 uppercase text-sm">
            <tr>
              <th className="px-6 py-4 font-semibold">Country</th>
              <th className="px-6 py-4 font-semibold">Currency</th>
              {plans.map((plan) => (
                <th key={plan} className="px-6 py-4 font-semibold cursor-pointer" onClick={() => requestSort(plan)}>
                  {plan} {getSortIndicator(plan)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedData.map((countryData, index) => (
              <tr key={index} className="hover:bg-gray-700/50 transition-colors duration-200">
                <td className="px-6 py-4 font-medium text-white">{countryData.country}</td>
                <td className="px-6 py-4 text-gray-400">{countryData.currency}</td>
                {countryData.plans.map((plan) => (
                  <td key={plan.plan} className={`px-6 py-4 ${activePlan === plan.plan ? 'bg-blue-900/20' : ''}`}>
                    <div className="flex flex-col">
                      <span className="font-mono font-medium text-white">
                        {plan.price} {countryData.currency}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">¥{plan.cny}</span>
                      {plan.isBest && (
                        <span className="mt-1 text-xs font-bold text-green-400 bg-green-900/50 px-2 py-0.5 rounded-full w-min">
                          Best
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingPage;
