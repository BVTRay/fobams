import React, { useState, useRef, useEffect } from 'react';
import { Scan, Trash2, ChevronRight, Package, User, Calendar, Briefcase } from 'lucide-react';
import { Asset } from '../types';

// Mock DB for scanning
const ASSET_DB: Record<string, Partial<Asset>> = {
  '12345': { id: '1', name: 'Sony A7S3', code: 'FIXED-001' },
  '67890': { id: '2', name: 'Canon 24-70mm', code: 'FIXED-002' },
  '11223': { id: '3', name: 'Sennheiser Mic', code: 'FIXED-003' },
};

export const CheckInOut: React.FC = () => {
  const [mode, setMode] = useState<'checkout' | 'checkin'>('checkout');
  const [scanInput, setScanInput] = useState('');
  const [scannedItems, setScannedItems] = useState<Partial<Asset>[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus for scanner
  useEffect(() => {
    inputRef.current?.focus();
  }, [scannedItems]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput) return;

    // Simulate looking up item
    const item = ASSET_DB[scanInput] || { 
      id: Math.random().toString(), 
      name: `Unknown Device (${scanInput})`, 
      code: scanInput 
    };

    setScannedItems(prev => [item, ...prev]);
    setScanInput('');
  };

  const removeItem = (id: string) => {
    setScannedItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="h-full flex gap-8">
      {/* Left Column: Scanner & List */}
      <div className="flex-1 flex flex-col min-w-0 glass-card rounded-3xl overflow-hidden border border-white/5">
        {/* Scanner Input */}
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
          <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
            扫码或输入资产编号
          </label>
          <form onSubmit={handleScan} className="relative group">
            <Scan className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-500" />
            <input
              ref={inputRef}
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              placeholder="请扫描设备标签..."
              className="w-full pl-14 pr-6 py-5 rounded-2xl border border-white/10 bg-black/20 text-xl text-white shadow-inner outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all"
              autoFocus
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none"></div>
          </form>
          <p className="mt-3 text-xs text-slate-500 flex items-center">
             <span className="w-1.5 h-1.5 bg-brand-500 rounded-full mr-2 animate-pulse"></span>
             系统就绪，请使用扫码枪或手动输入
          </p>
        </div>

        {/* Scanned List */}
        <div className="flex-1 overflow-y-auto p-6 bg-black/10">
          {scannedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
              <div className="p-6 rounded-full bg-white/5 mb-4">
                 <Package size={48} className="opacity-50" />
              </div>
              <p>暂无扫描设备</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {scannedItems.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2 hover:bg-white/10 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-xl flex items-center justify-center font-bold font-mono mr-4">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{item.code}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id!)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="p-5 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
            <span className="text-slate-400">已扫描 <b className="text-white text-lg mx-1">{scannedItems.length}</b> 件</span>
            <button 
                onClick={() => setScannedItems([])} 
                className="text-sm text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
            >
                清空列表
            </button>
        </div>
      </div>

      {/* Right Column: Form Action */}
      <div className="w-96 flex-shrink-0 flex flex-col gap-6">
        <div className="glass-card rounded-3xl p-8 border border-white/5">
          <h2 className="text-xl font-bold text-white mb-6">业务操作</h2>
          
          <div className="flex bg-black/20 p-1.5 rounded-xl mb-8 border border-white/5">
            <button 
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'checkout' ? 'bg-brand-500 text-slate-900 shadow-lg shadow-brand-500/20' : 'text-slate-400 hover:text-slate-200'}`}
              onClick={() => setMode('checkout')}
            >
              领用出库
            </button>
            <button 
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'checkin' ? 'bg-brand-500 text-slate-900 shadow-lg shadow-brand-500/20' : 'text-slate-400 hover:text-slate-200'}`}
              onClick={() => setMode('checkin')}
            >
              归还入库
            </button>
          </div>

          <div className="space-y-6">
            <div className="group">
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                {mode === 'checkout' ? '借用人' : '归还人'}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18}/>
                <select className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-slate-200 outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 appearance-none transition-all cursor-pointer">
                  <option>请选择员工...</option>
                  <option>张三 (摄影组)</option>
                  <option>李四 (后期组)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-500"></div>
              </div>
            </div>

            {mode === 'checkout' && (
              <>
                <div className="group">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    关联项目 (必填)
                    </label>
                    <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18}/>
                    <select className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-slate-200 outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 appearance-none transition-all cursor-pointer">
                        <option>请选择项目...</option>
                        <option>2024 年度宣传片</option>
                        <option>某某品牌 TVC</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-500"></div>
                    </div>
                </div>

                <div className="group">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    预计归还时间
                    </label>
                    <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18}/>
                    <input 
                        type="date" 
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-slate-200 outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all [color-scheme:dark]"
                    />
                    </div>
                </div>
              </>
            )}
          </div>
        </div>

        <button 
          className={`w-full py-4 rounded-2xl text-slate-900 font-bold text-lg shadow-xl flex items-center justify-center transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
            mode === 'checkout' 
              ? 'bg-gradient-to-r from-brand-400 to-brand-500 shadow-brand-500/20' 
              : 'bg-gradient-to-r from-green-400 to-green-500 shadow-green-500/20'
          }`}
          disabled={scannedItems.length === 0}
        >
          {mode === 'checkout' ? '确认领用' : '确认归还'}
          <ChevronRight className="ml-2" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};