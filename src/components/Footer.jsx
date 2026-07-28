
const Footer = () => {
  return (
    <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] px-2 py-6 text-xs text-slate-600 sm:flex-row">
      <p>价格仅供参考，结算金额以当地 Apple Store 为准。</p>
      <p>
        Built by{' '}
        <a href="https://neutemu.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-400 transition hover:text-sky-300">
          Neutemu ↗
        </a>
      </p>
    </footer>
  );
};

export default Footer;
