import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PricingTable from './components/PricingTable';
import Footer from './components/Footer';
import { useTheme } from './hooks/useTheme';

const getProductFromUrl = () => {
  if (typeof window === 'undefined') return 'iphone18';
  const params = new URLSearchParams(window.location.search);
  const p = (params.get('product') || params.get('p') || '').toLowerCase();
  if (p === 'iphone18' || p === '18' || p === '18pro' || p === 'pro') return 'iphone18';
  if (p === 'iphoneduo' || p === 'duo' || p === 'fold') return 'iphoneduo';
  if (p === 'iphone17' || p === '17') return 'iphone17';
  if (p === 'icloud') return 'icloud';
  return 'iphone18';
};

function App() {
  const [currentProduct, setCurrentProductState] = useState(getProductFromUrl);
  const { theme, setTheme, isDark } = useTheme();

  const setCurrentProduct = (newProduct) => {
    setCurrentProductState(newProduct);
    try {
      const url = new URL(window.location.href);
      if (newProduct === 'icloud') {
        url.searchParams.delete('product');
        url.searchParams.delete('p');
      } else {
        url.searchParams.set('product', newProduct);
        url.searchParams.delete('p');
      }
      window.history.replaceState({ product: newProduct }, '', url.pathname + url.search + url.hash);
    } catch (e) {
      // ignore URL replace errors in unsupported env
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentProductState(getProductFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic SEO Meta tags for each product
  useEffect(() => {
    const seoMetaMap = {
      iphone18: {
        description: '全面对比 iPhone 18 Pro 与 iPhone 18 Pro Max 在中国大陆、中国香港、中国台湾、日本、美国等全球各地区的官方售价与实时汇率折算，提供国行差价对比与最低价排行。',
        ogTitle: 'iPhone 18 Pro 全球官方售价与汇率比价地图 - Neutemu',
        ogUrl: 'https://icloud.neutemu.com/?product=iphone18',
      },
      iphoneduo: {
        description: '全面对比苹果首款折叠屏手机 iPhone Duo 在中国大陆、中国香港、中国台湾、日本、美国等全球各地区的官方售价与实时汇率折算，提供国行差价对比与最低价排行。',
        ogTitle: 'iPhone Duo 折叠屏手机全球官方售价与汇率比价地图 - Neutemu',
        ogUrl: 'https://icloud.neutemu.com/?product=iphoneduo',
      },
      iphone17: {
        description: '全面对比 iPhone 17、iPhone 17 Air、17 Pro 及 17 Pro Max 在全球各国家/地区的官方售价，支持实时汇率与税费换算，快速锁定最划算的购买方案。',
        ogTitle: 'iPhone 17 全球官方售价与汇率比价地图 - Neutemu',
        ogUrl: 'https://icloud.neutemu.com/?product=iphone17',
      },
      icloud: {
        description: '全面对比 iCloud+ 在全球不同国家与地区的官方订阅月费，支持 50GB 至 12TB 容量梯度与实时汇率折算，快速找到全球最高性价比的订阅方案。',
        ogTitle: 'iCloud+ 全球订阅价格对比地图 - Neutemu',
        ogUrl: 'https://icloud.neutemu.com/',
      },
    };

    const currentSeo = seoMetaMap[currentProduct] || seoMetaMap.icloud;

    // Update meta description
    try {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = currentSeo.description;

      const setMetaProp = (property, content) => {
        let el = document.querySelector(`meta[property="${property}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('property', property);
          document.head.appendChild(el);
        }
        el.content = content;
      };

      setMetaProp('og:title', currentSeo.ogTitle);
      setMetaProp('og:description', currentSeo.description);
      setMetaProp('og:url', currentSeo.ogUrl);
    } catch (e) {
      // ignore
    }
  }, [currentProduct]);

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
