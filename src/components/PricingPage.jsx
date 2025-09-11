import React, { useState, useMemo } from 'react';
import { pricingData, iphone17PricingData } from '../data/pricingData';

const plans = ["50GB", "200GB", "2TB", "6TB", "12TB"];
const iphoneModels = ["17", "Air", "17 Pro", "17 Pro Max"];
const iphoneStorages = ["256G", "512G", "1TB", "2TB"];

const PricingPage = () => {
  const [activePlan, setActivePlan] = useState('50GB');
  const [showIphone17, setShowIphone17] = useState(false);
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
  }, [sortConfig]);

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
          {showIphone17 ? 'iPhone 17 全球定价比较' : 'iCloud+ 全球定价比较'}
        </h1>
        <p className="text-lg text-gray-400 mb-4">
          {showIphone17 ? '找到全球最好的iPhone 17价格' : '找到全球最好的iCloud+ 价格'}
        </p>
        <div className="text-sm text-gray-500">
          来自<a href="https://support.apple.com/en-us/108047" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">苹果</a>的每日更新数据 • 由<a href="https://neutemu.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Neutemu</a>开发
        </div>
      </header>

      <div className="flex justify-center items-center gap-3 md:gap-4 mb-8">
        <button
          onClick={() => setShowIphone17(v => !v)}
          className="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 inline-flex items-center gap-2 whitespace-nowrap border border-gray-600/50 bg-transparent text-gray-200 hover:bg-gray-700/40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M15.75 2.25a.75.75 0 01.75.75v2.25h2.25a.75.75 0 010 1.5H16.5v2.25a.75.75 0 01-1.5 0V6.75h-2.25a.75.75 0 010-1.5h2.25V3a.75.75 0 01.75-.75z"/><path fillRule="evenodd" d="M3 6.75A2.25 2.25 0 015.25 4.5h5.878c.597 0 1.17.237 1.591.659l4.122 4.122c.422.421.659.994.659 1.591v6.878A2.25 2.25 0 0115.25 20.25H5.25A2.25 2.25 0 013 18V6.75zm3 2.25a.75.75 0 000 1.5h6a.75.75 0 000-1.5H6z" clipRule="evenodd"/></svg>
          {showIphone17 ? '返回 iCloud+ 价格' : 'iPhone 17 全球价格'}
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

      {showIphone17 ? (
        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-max">
              <thead className="bg-gray-700 text-gray-300 uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold text-xs sm:text-sm sticky left-0 z-10 bg-gray-700">地区</th>
                  <th className="px-2 py-3 font-semibold text-xs sm:text-sm hidden sm:table-cell">货币</th>
                  {iphoneModels.map((model) => (
                    iphoneStorages.map((stg) => (
                      <th key={`${model}-${stg}`} className="px-2 py-3 font-semibold text-xs sm:text-sm text-center min-w-[80px] sm:min-w-[100px]">
                        <div className="flex flex-col">
                          <span className="text-[10px] sm:text-xs">{model}</span>
                          <span className="text-[10px] sm:text-xs font-mono">{stg}</span>
                        </div>
                      </th>
                    ))
                  ))}
                </tr>
              </thead>
            <tbody className="divide-y divide-gray-700">
              {iphone17PricingData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-700/50 transition-colors duration-200 group">
                  <td className="px-4 py-3 font-medium text-white text-xs sm:text-sm sticky left-0 z-5 bg-gray-800 group-hover:bg-gray-700 whitespace-nowrap">
                    {row.country}
                  </td>
                  <td className="px-2 py-3 text-gray-400 text-xs hidden sm:table-cell">{row.currency}</td>
                  {iphoneModels.map((model) => (
                    iphoneStorages.map((stg) => {
                      const item = row.models?.[model]?.[stg];
                      if (!item) {
                        return (
                          <td key={`${row.country}-${model}-${stg}`} className="px-2 py-3 text-gray-500 text-center">
                            <span className="text-[10px]">—</span>
                          </td>
                        );
                      }
                      return (
                        <td key={`${row.country}-${model}-${stg}`} className="px-2 py-3 text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <span className="font-mono font-medium text-white text-xs sm:text-sm leading-tight">
                              {item.price}
                            </span>
                            <span className="text-[10px] text-green-400 font-mono bg-green-900/20 px-1 py-0.5 rounded">
                              ¥{item.cny.toFixed(2)}
                            </span>
                            {item.best && (
                              <span className="text-[10px] font-bold text-white bg-green-600 px-1.5 py-0.5 rounded-full">
                                最佳
                              </span>
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
      </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-max">
              <thead className="bg-gray-700 text-gray-300 uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold text-xs sm:text-sm sticky left-0 z-10 bg-gray-700">地区</th>
                  <th className="px-2 py-3 font-semibold text-xs sm:text-sm hidden sm:table-cell">货币</th>
                  {plans.map((plan) => (
                    <th 
                      key={plan} 
                      className="px-2 py-3 font-semibold text-xs sm:text-sm text-center cursor-pointer min-w-[70px] sm:min-w-[90px]" 
                      onClick={() => requestSort(plan)}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] sm:text-xs">{plan}</span>
                        <span className="text-[10px] mt-1">{getSortIndicator(plan)}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
            <tbody className="divide-y divide-gray-700">
              {sortedData.map((countryData, index) => (
                <tr key={index} className="hover:bg-gray-700/50 transition-colors duration-200 group">
                  <td className="px-4 py-3 font-medium text-white text-xs sm:text-sm sticky left-0 z-5 bg-gray-800 group-hover:bg-gray-700 whitespace-nowrap">
                    {countryData.country}
                  </td>
                  <td className="px-2 py-3 text-gray-400 text-xs hidden sm:table-cell">{countryData.currency}</td>
                  {countryData.plans.map((plan) => (
                    <td key={plan.plan} className={`px-2 py-3 text-center ${activePlan === plan.plan ? 'bg-blue-900/20' : ''}`}>
                      <div className="flex flex-col items-center space-y-1">
                        <span className="font-mono font-medium text-white text-xs sm:text-sm leading-tight">
                          {plan.price}
                        </span>
                        <span className="text-[10px] text-green-400 font-mono bg-green-900/20 px-1 py-0.5 rounded">
                          ¥{plan.cny.toFixed(2)}
                        </span>
                        {plan.isBest && (
                          <span className="text-[10px] font-bold text-white bg-green-600 px-1.5 py-0.5 rounded-full">
                            最佳
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
      )}
    </div>
  );
};

export default PricingPage;
