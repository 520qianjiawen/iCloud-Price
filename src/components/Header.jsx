import React from 'react';

const Header = ({ showIphone17 = false }) => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
        {showIphone17 ? 'iPhone 17 全球定价比较' : 'iCloud+ 全球定价比较'}
      </h1>
      <p className="text-sm sm:text-base text-gray-400 mb-4">
        {showIphone17 ? '找到全球最好的iPhone 17价格' : '找到全球最好的iCloud+ 价格'}
      </p>
      <div className="text-xs sm:text-sm text-gray-500">
        <span>来自</span>
        <a href="https://support.apple.com/en-us/108047" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          苹果
        </a>
        <span>的每日更新数据 • 由</span>
        <a href="https://neutemu.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          Neutemu
        </a>
        <span>开发</span>
      </div>
    </header>
  );
};

export default Header;
