import React, { useState, useMemo } from 'react';
import { pricingData } from '../data/pricingData';

const plans = ['50GB', '200GB', '2TB', '6TB', '12TB'];

const PricingTable = () => {
  const [activePlan, setActivePlan] = useState('50GB');

  const sortedData = useMemo(() => {
    return [...pricingData].sort((a, b) => {
      const priceA = a.plans[activePlan]?.cny ?? Infinity;
      const priceB = b.plans[activePlan]?.cny ?? Infinity;
      return priceA - priceB;
    });
  }, [activePlan]);

  const CellContent = ({ planData }) => {
    if (!planData) return <span className="text-gray-500">-</span>;
    return (
      <div className="flex flex-col">
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
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm transition-colors duration-200">
            Share as Image
          </button>
          <a href="https://github.com/sponsors/missuo?o=esb" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md text-sm transition-colors duration-200 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
            Sponsor
          </a>
        </div>
        <div className="flex flex-col items-center sm:items-end">
          <h6 className="text-sm font-semibold text-gray-400 mb-2">Sort Pricing By Plan:</h6>
          <div className="flex flex-wrap justify-center sm:justify-end gap-2 bg-gray-800 p-1 rounded-lg">
            {plans.map((plan) => (
              <button
                key={plan}
                onClick={() => setActivePlan(plan)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 \${
                  activePlan === plan
                    ? 'bg-blue-600 text-white'
                    : 'bg-transparent text-gray-300 hover:bg-gray-700'
                }`}
              >
                {plan}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
        <table className="w-full min-w-[1000px] text-sm text-left">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3">Country</th>
              <th scope="col" className="px-6 py-3">Currency</th>
              {plans.map(plan => (
                <th key={plan} scope="col" className="px-6 py-3 text-right">{plan}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((data, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-150">
                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{data.country}</td>
                <td className="px-6 py-4 text-gray-400">{data.currency}</td>
                {plans.map(plan => (
                  <td key={plan} className="px-6 py-4 text-right">
                    <CellContent planData={data.plans[plan]} />
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

export default PricingTable;