import React, { useState, useCallback, useEffect } from 'react';
import { INITIAL_DATA } from './data/initial';
import { calcTotals, fmt, save, load } from './utils/calc';
import Dashboard from './components/Dashboard';
import AssetsTab from './components/AssetsTab';
import Debt1Tab from './components/Debt1Tab';
import Debt2Tab from './components/Debt2Tab';
import CFTab from './components/CFTab';
import './styles/global.css';

const TABS = [
  { id: 'dashboard', label: 'ホーム', icon: '⊕' },
  { id: 'assets', label: '資産/収支', icon: '◆' },
  { id: 'debt1', label: '借金①', icon: '▽' },
  { id: 'debt2', label: '借金②7月', icon: '◉' },
  { id: 'unpaid', label: '未払い', icon: '△' },
  { id: 'cf', label: 'CF', icon: '≋' },
];

export default function App() {
  const [data, setData] = useState(() => load() || INITIAL_DATA);
  const [tab, setTab] = useState('dashboard');
  const [saved, setSaved] = useState(false);

  const totals = calcTotals(data);

  const updateData = useCallback((updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      save(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      return next;
    });
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-star">✦</span>
            <span className="logo-text">STELLA FINANCE</span>
          </div>
          <div className="header-right">
            {saved && <span className="save-badge">保存済 ✓</span>}
            <div className="net-worth-mini">
              <span className="nw-label">純資産</span>
              <span className={`nw-value ${totals.netWorth >= 0 ? 'pos' : 'neg'}`}>{fmt(totals.netWorth)}</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="tab-nav">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            <span className="tab-icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      <main className="app-main">
        {tab === 'dashboard' && <Dashboard data={data} totals={totals} />}
        {tab === 'assets' && <AssetsTab data={data} updateData={updateData} totals={totals} />}
        {tab === 'debt1' && <Debt1Tab data={data} updateData={updateData} totals={totals} />}
        {tab === 'debt2' && <Debt2Tab data={data} updateData={updateData} totals={totals} mode="debt2" />}
        {tab === 'unpaid' && <Debt2Tab data={data} updateData={updateData} totals={totals} mode="unpaid" />}
        {tab === 'cf' && <CFTab data={data} totals={totals} />}
      </main>
    </div>
  );
}
