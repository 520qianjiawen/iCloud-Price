import React, { useState } from 'react';
import Header from './components/Header';
import PricingTable from './components/PricingTable';
import Footer from './components/Footer';
import { useTheme } from './hooks/useTheme';

function App() {
  const [currentProduct, setCurrentProduct] = useState('iphone18');
  const { theme, setTheme, isDark } = useTheme();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100/70 text-slate-800 transition-colors duration-300 dark:bg-[#070d19] dark:text-slate-200">
      {/* Background ambient radial gradients */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_20%_8%,rgba(56,189,248,0.18),transparent_42%),radial-gradient(circle_at_80%_6%,rgba(99,102,241,0.14),transparent_38%)] dark:bg-[radial-gradient(circle_at_20%_8%,rgba(56,189,248,0.14),transparent_42%),radial-gradient(circle_at_80%_6%,rgba(99,102,241,0.12),transparent_38%)]" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl dark:bg-blue-500/10" />

      <main className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
        <Header
          currentProduct={currentProduct}
          theme={theme}
          setTheme={setTheme}
        />
        <PricingTable
          currentProduct={currentProduct}
          setCurrentProduct={setCurrentProduct}
        />
        <Footer />
      </main>
    </div>
  );
}

export default App;
