import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center mt-12 py-4">
      <p className="text-sm text-gray-500">
        This is a recreation of the original icloud.owo.nz website for educational purposes.
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Developed by{' '}
        <a href="https://github.com/missuo" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          Vincent
        </a>. Recreated using React & Tailwind CSS.
      </p>
    </footer>
  );
};

export default Footer;