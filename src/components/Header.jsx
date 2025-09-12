import React from 'react';

const Header = ({ showIphone17 = false }) => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
        {showIphone17 ? 'iPhone 17 全球定价比较' : 'iCloud+ 全球定价比较'}
      </h1>
      <p className="text-sm sm:text-base text-gray-400 mb-2">
        {showIphone17 ? '找到全球最好的iPhone 17价格' : '找到全球最好的iCloud+ 价格'}
      </p>
      {showIphone17 && (
        <div className="text-xs sm:text-sm text-gray-400 max-w-4xl mx-auto leading-relaxed mb-4 px-4 sm:px-0">
          <p>
            iPhone 17 Air：所有国家和地区均仅支持 eSIM。iPhone 17、iPhone 17 Pro 和 iPhone 17 Pro Max：美国、日本和加拿大仅支持 eSIM。香港、韩国、澳大利亚、新加坡、泰国和台湾使用一个实体 SIM 卡槽加 eSIM。中国大陆使用两个实体 SIM 卡槽，不支持 eSIM。
          </p>
        </div>
      )}
      {showIphone17 ? (
        <div className="text-xs sm:text-sm text-gray-400 max-w-4xl mx-auto leading-relaxed flex flex-col items-center gap-2">
          <div>
            型号差异：请参考下图了解各地区型号差异。
          </div>
          <a
            href="/iPhone%2017%20Pro%20各地区版本区别.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors text-xs sm:text-sm"
          >
            查看图片
          </a>
        </div>
      ) : (
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
      )}
    </header>
  );
};

export default Header;
