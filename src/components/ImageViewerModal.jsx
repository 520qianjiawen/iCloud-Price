import React, { useState, useEffect, useRef, useCallback } from 'react';

const VERSION_DATA = {
  iphone18: {
    key: 'iphone18',
    label: 'iPhone 18 Pro',
    title: 'iPhone 18 Pro 各地区版本与频段区别',
    src: encodeURI(import.meta.env.BASE_URL + 'iPhone 18 Pro 各地区版本区别.webp'),
  },
  iphone17: {
    key: 'iphone17',
    label: 'iPhone 17 系列',
    title: 'iPhone 17 Pro 各地区版本与频段区别',
    src: encodeURI(import.meta.env.BASE_URL + 'iPhone 17 Pro 各地区版本区别.webp'),
  },
};

const ImageViewerModal = ({ isOpen, activeModel = 'iphone18', src, title, onClose }) => {
  const [currentKey, setCurrentKey] = useState(activeModel || 'iphone18');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const containerRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const posStartRef = useRef({ x: 0, y: 0 });
  const touchDistanceRef = useRef(null);

  // Sync currentKey when activeModel or isOpen changes
  useEffect(() => {
    if (activeModel && VERSION_DATA[activeModel]) {
      setCurrentKey(activeModel);
    }
  }, [activeModel, isOpen]);

  const activeItem = VERSION_DATA[currentKey] || {
    src: src || VERSION_DATA.iphone18.src,
    title: title || VERSION_DATA.iphone18.title,
  };

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Reset transform when a new image or version is opened
  useEffect(() => {
    if (isOpen) {
      resetZoom();
      setHasInteracted(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, currentKey, resetZoom]);

  // Handle ESC key to close & shortcut keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        zoomIn();
      } else if (e.key === '-' || e.key === '_') {
        zoomOut();
      } else if (e.key === '0') {
        resetZoom();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, resetZoom]);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.35, 4));
    setHasInteracted(true);
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => {
      const next = Math.max(prev - 0.35, 0.6);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
    setHasInteracted(true);
  }, []);

  const toggleZoom = useCallback(() => {
    if (scale > 1.2) {
      resetZoom();
    } else {
      setScale(2);
      setHasInteracted(true);
    }
  }, [scale, resetZoom]);

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    setHasInteracted(true);
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setScale((prev) => {
      const next = Math.min(Math.max(prev + delta, 0.6), 4);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return Number(next.toFixed(2));
    });
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setHasInteracted(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { ...position };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPosition({
      x: posStartRef.current.x + dx,
      y: posStartRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile pan & pinch-to-zoom
  const handleTouchStart = (e) => {
    setHasInteracted(true);
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      posStartRef.current = { ...position };
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      setPosition({
        x: posStartRef.current.x + dx,
        y: posStartRef.current.y + dy,
      });
    } else if (e.touches.length === 2 && touchDistanceRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = (dist - touchDistanceRef.current) * 0.008;
      setScale((prev) => Math.min(Math.max(prev + delta, 0.6), 4));
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchDistanceRef.current = null;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-2xl transition-opacity duration-200 select-none"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Top Navbar Header */}
      <header className="relative z-30 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-900/85 px-4 py-3 backdrop-blur-md sm:px-6">
        {/* Title & Version Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
            </span>
            <h3 className="truncate text-sm font-bold text-white sm:text-base">
              {activeItem.title}
            </h3>
          </div>

          {/* Model Switcher Segmented Tabs: 18 Pro / 17 系列 */}
          <div className="flex items-center rounded-xl bg-white/10 p-0.5 border border-white/15 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setCurrentKey('iphone18');
                resetZoom();
              }}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                currentKey === 'iphone18'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              iPhone 18 Pro
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentKey('iphone17');
                resetZoom();
              }}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                currentKey === 'iphone17'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              iPhone 17 系列
            </button>
          </div>
        </div>

        {/* Top Right Action: Prominent Return/Close Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="group inline-flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-500/20 px-4 py-1.5 text-xs font-semibold text-sky-200 shadow-lg shadow-sky-500/10 backdrop-blur-md transition-all hover:border-sky-400 hover:bg-sky-500/30 hover:text-white sm:text-sm active:scale-95"
            aria-label="返回页面"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 transition-transform group-hover:-translate-x-0.5">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            <span>返回列表</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Stage Area */}
      <div
        ref={containerRef}
        className={`relative flex-1 overflow-hidden flex items-center justify-center ${
          isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-default'
        }`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={toggleZoom}
      >
        {/* Ambient Subtle Grid Background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06),transparent_70%)]" />

        {/* Gesture Hint (Fades out after user interaction) */}
        {!hasInteracted && (
          <div className="pointer-events-none absolute top-4 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-1.5 text-xs text-slate-300 shadow-xl backdrop-blur-md animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-sky-400">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
            <span>提示：顶部可一键切换 18 Pro / 17 系列；支持双指/滚轮自由缩放与拖拽</span>
          </div>
        )}

        {/* Scalable & Draggable Image Layer */}
        <div
          className="relative transition-transform duration-75 ease-out select-none will-change-transform"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Card Frame around the table */}
          <div className="relative rounded-2xl bg-white p-2 sm:p-4 shadow-2xl ring-1 ring-white/20 select-none">
            <img
              src={activeItem.src}
              alt={activeItem.title}
              draggable={false}
              className="protected-image max-h-[78vh] w-auto max-w-[90vw] object-contain rounded-lg"
              style={{
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
            {/* Transparent touch and click shield to block long press & right-click save */}
            <div
              className="protected-overlay absolute inset-0 z-10 cursor-inherit"
              style={{
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating Bottom Toolbar: Zoom, Reset, and Quick Return */}
      <footer className="relative z-30 flex items-center justify-center p-3 pb-5 sm:p-4">
        <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/15 bg-slate-900/85 p-1.5 shadow-2xl backdrop-blur-xl">
          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={zoomOut}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95 disabled:opacity-30"
            disabled={scale <= 0.6}
            aria-label="缩小"
            title="缩小 (-)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Current Scale Display */}
          <button
            type="button"
            onClick={resetZoom}
            className="min-w-[4.2rem] px-2 text-center text-xs font-bold text-sky-300 hover:text-white transition"
            title="点击还原 100%"
          >
            {Math.round(scale * 100)}%
          </button>

          {/* Zoom In Button */}
          <button
            type="button"
            onClick={zoomIn}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95 disabled:opacity-30"
            disabled={scale >= 4}
            aria-label="放大"
            title="放大 (+)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M10.75 4.75a.75.75 0 00-1.06 1.06v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          </button>

          <div className="mx-1 h-4 w-px bg-white/20" />

          {/* Reset / 1:1 Button */}
          <button
            type="button"
            onClick={resetZoom}
            className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/20 hover:text-white active:scale-95"
            title="还原至屏幕大小 (快捷键 0)"
          >
            还原
          </button>

          {/* Return / Close Button in Bottom Toolbar */}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-sky-500/30 transition hover:bg-sky-400 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
            <span>返回</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ImageViewerModal;
