import React, { useState } from 'react';
import Header from './components/Header';
import PricingTable from './components/PricingTable';
import Footer from './components/Footer';

function App() {
  // 默认展示 iCloud+ 价格页，用户可切换到 iPhone 17 价格
  const [showIphone17, setShowIphone17] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="container mx-auto px-4 py-8">
        <Header showIphone17={showIphone17} />
        <PricingTable showIphone17={showIphone17} setShowIphone17={setShowIphone17} />
        <Footer />
      </main>
    </div>
  );
}

export default App;
