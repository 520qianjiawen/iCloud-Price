import React from 'react';

const Header = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
        iCloud+ Global Pricing Comparison
      </h1>
      <p className="text-lg text-gray-400 mb-4">
        Find the best iCloud+ deal worldwide
      </p>
      <div className="text-sm text-gray-500">
        <span>Data updated daily from </span>
        <a href="https://support.apple.com/en-us/108047" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          Apple
        </a>
        <span> • Developed by </span>
        <a href="https://github.com/missuo" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          Vincent
        </a>
      </div>
    </header>
  );
};

export default Header;