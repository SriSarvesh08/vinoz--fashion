import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, ExternalLink, ChevronDown, ChevronUp, Laptop } from 'lucide-react';

interface SiteSwitcherDockProps {
  currentPortal: 'store' | 'admin';
  onNavigate: (portal: 'store' | 'admin') => void;
}

export const SiteSwitcherDock: React.FC<SiteSwitcherDockProps> = ({
  currentPortal,
  onNavigate,
}) => {
  const [minimized, setMinimized] = useState(false);

  const openInNewTab = (path: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${path}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (minimized) {
    return (
      <aside
        aria-label="Website Switcher"
        className="fixed bottom-3 right-3 z-50 bg-[#1C1917]/90 text-stone-200 backdrop-blur-md border border-stone-700/80 rounded-full px-3 py-1.5 shadow-2xl flex items-center gap-2 text-xs hover:border-[#D49BA0] transition-all cursor-pointer"
        onClick={() => setMinimized(false)}
      >
        <Laptop className="w-3.5 h-3.5 text-[#D49BA0]" />
        <span className="text-[11px] font-medium tracking-wide">
          Site:{' '}
          <strong className="text-white">
            {currentPortal === 'admin' ? 'Admin Portal (/admin)' : 'Customer Store (/)'}
          </strong>
        </span>
        <ChevronUp className="w-3 h-3 text-stone-400" />
      </aside>
    );
  }

  return (
    <aside
      aria-label="Website Switcher"
      className="fixed bottom-3 right-3 z-50 bg-[#1C1917]/95 text-stone-200 backdrop-blur-md border border-stone-700/90 rounded-2xl shadow-2xl p-3 max-w-xs sm:max-w-sm transition-all"
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
        <div className="flex items-center gap-1.5">
          <Laptop className="w-3.5 h-3.5 text-[#D49BA0]" />
          <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-300">
            Separate Websites Switcher
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMinimized(true)}
          className="text-stone-400 hover:text-white p-1 rounded hover:bg-stone-800"
          title="Minimize switcher"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[10px] text-stone-400 mb-2 leading-relaxed">
        The customer boutique and the admin management portal are two distinct websites on separate routes.
      </p>

      <div className="grid grid-cols-2 gap-1.5">
        {/* Customer Store Website Button */}
        <button
          type="button"
          onClick={() => onNavigate('store')}
          className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between ${
            currentPortal === 'store'
              ? 'bg-[#68242A] border-[#933941] text-white shadow-xs ring-1 ring-white/20'
              : 'bg-stone-900/90 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1">
            <ShoppingBag className="w-4 h-4 text-[#D49BA0]" />
            <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-black/40 text-stone-300">
              /
            </span>
          </div>
          <div>
            <div className="text-xs font-semibold leading-tight">Customer Store</div>
            <div className="text-[10px] opacity-80 mt-0.5 leading-tight">
              Guest browsing & checkout (No Admin Login)
            </div>
          </div>
        </button>

        {/* Admin Portal Website Button */}
        <button
          type="button"
          onClick={() => onNavigate('admin')}
          className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between ${
            currentPortal === 'admin'
              ? 'bg-[#68242A] border-[#933941] text-white shadow-xs ring-1 ring-white/20'
              : 'bg-stone-900/90 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-800/80'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1">
            <ShieldCheck className="w-4 h-4 text-[#D49BA0]" />
            <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-black/40 text-stone-300">
              /admin
            </span>
          </div>
          <div>
            <div className="text-xs font-semibold leading-tight">Admin Portal</div>
            <div className="text-[10px] opacity-80 mt-0.5 leading-tight">
              Secure portal with ID & Password login
            </div>
          </div>
        </button>
      </div>

      <div className="mt-2.5 pt-2 border-t border-stone-800 flex items-center justify-between text-[10px] text-stone-400">
        <span>Open simultaneously:</span>
        <button
          type="button"
          onClick={() => openInNewTab(currentPortal === 'admin' ? '/' : '/admin')}
          className="text-[#D49BA0] hover:text-white flex items-center gap-1 font-medium transition-colors"
        >
          <span>{currentPortal === 'admin' ? 'Open Store' : 'Open Admin'} in New Tab</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </button>
      </div>
    </aside>
  );
};
