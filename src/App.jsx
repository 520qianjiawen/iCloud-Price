import React, { useState } from 'react';
import Header from './components/Header';
import PricingTable from './components/PricingTable';
import Footer from './components/Footer';

function App() {
  const [showIphone17, setShowIphone17] = useState(true);

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
