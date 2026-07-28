import React, { useState } from 'react';
import Header from './components/Header';
import PricingTable from './components/PricingTable';
import Footer from './components/Footer';

function App() {
  const [showIphone17, setShowIphone17] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050b16] text-slate-200">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.13),transparent_35%),radial-gradient(circle_at_80%_5%,rgba(99,102,241,0.12),transparent_32%)]" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
      <main className="relative mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <Header showIphone17={showIphone17} />
        <PricingTable showIphone17={showIphone17} setShowIphone17={setShowIphone17} />
        <Footer />
      </main>
    </div>
  );
}

export default App;
