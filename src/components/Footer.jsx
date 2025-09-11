import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center mt-8 sm:mt-12 py-4 px-4">
      <p className="text-xs sm:text-sm text-gray-500">
        This is website for educational purposes.
      </p>
      <p className="text-xs sm:text-sm text-gray-500 mt-1">
        Developed by{' '}
        <a href="https://neutemu.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          Neutemu
        </a>
      </p>
    </footer>
  );
};

export default Footer;
