import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, X, MapPin, User, Briefcase, Tag, ChevronDown } from 'lucide-react';
import { Asset, AssetStatus } from '../types';

const MOCK_ASSETS: Asset[] = [
  { id: '1', code: 'FIXED-2024-001', name: 'Sony A7S3 (A机)', category: 'Camera', status: AssetStatus.Borrowed, location: '借出中', borrower: '张三', project: '比亚迪宣传片', serialNumber: 'SN-3928492', image: 'https://picsum.photos/100/100?random=1' },
  { id: '2', code: 'FIXED-2024-002', name: 'Sony A7M4', category: 'Camera', status: AssetStatus.Available, location: 'A03 防潮柜', serialNumber: 'SN-112233', image: 'https://picsum.photos/100/100?random=2' },
  { id: '3', code: 'FIXED-2024-003', name: 'Sony 24-70mm GM II', category: 'Lens', status: AssetStatus.Available, location: 'A03 防潮柜', serialNumber: 'SN-998877', image: 'https://picsum.photos/100/100?random=3' },
  { id: '4', code: 'FIXED-2024-004', name: 'DJI Mavic 3 Pro', category: 'Drone', status: AssetStatus.Maintenance, location: '大疆售后', serialNumber: 'SN-DJI-999', image: 'https://picsum.photos/100/100?random=4' },
  { id: '5', code: 'FIXED-2024-005', name: 'MacBook Pro 16"', category: 'Computer', status: AssetStatus.Borrowed, location: '借出中', borrower: '李四', project: '后期剪辑', serialNumber: 'SN-APPLE-M1', image: 'https://picsum.photos/100/100?random=5' },
];

export const HardwareList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const filteredAssets = MOCK_ASSETS.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative h-full flex flex-col pb-4">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-white tracking-tight">硬件资产库</h1>
           <p className="text-slate-400 text-sm mt-1">管理公司所有的 {MOCK_ASSETS.length} 件固定资产</p>
        </div>
        
        <button className="bg-brand-500 hover:bg-brand-400 text-slate-900 px-6 py-3 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all transform hover:scale-105 active:scale-95 flex items-center">
          + 新增设备
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-2 rounded-2xl mb-6 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="搜索设备名称、编号或序列号..." 
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent text-white placeholder-slate-500 focus:bg-white/5 outline-none transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="h-8 w-px bg-white/10 mx-2"></div>

        <div className="relative">
            <select className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 outline-none cursor-pointer transition-colors border border-transparent focus:border-brand-500/30">
            <option value="">所有分类</option>
            <option value="Camera">摄影机</option>
            <option value="Lens">镜头</option>
            <option value="Drone">无人机</option>
            <option value="Computer">电脑/工作站</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
        </div>

        <div className="relative">
            <select className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 outline-none cursor-pointer transition-colors border border-transparent focus:border-brand-500/30">
            <option value="">所有状态</option>
            <option value="Available">🟢 在库</option>
            <option value="Borrowed">🔴 借出</option>
            <option value="Maintenance">🟡 维修中</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Table - Floating Cards Style */}
      <div className="flex-1 overflow-hidden">
        <div className="w-full text-left border-collapse">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
             <div className="col-span-4">设备信息</div>
             <div className="col-span-2">资产编号</div>
             <div className="col-span-2">分类</div>
             <div className="col-span-3">状态/位置</div>
             <div className="col-span-1 text-right">操作</div>
          </div>

          <div className="space-y-3 overflow-y-auto h-[calc(100vh-320px)] pr-2 pb-20">
            {filteredAssets.map(asset => (
                <div 
                    key={asset.id} 
                    className="grid grid-cols-12 gap-4 items-center px-6 py-4 glass-card rounded-2xl hover:bg-white/5 transition-all cursor-pointer group border border-white/5 hover:border-brand-500/30"
                    onClick={() => setSelectedAsset(asset)}
                >
                  <div className="col-span-4 flex items-center">
                    <img src={asset.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                    <div className="ml-4">
                        <div className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">{asset.name}</div>
                        <div className="text-xs text-slate-500 mt-1 font-mono">SN: {asset.serialNumber}</div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="inline-block px-3 py-1 rounded-lg text-xs font-mono font-medium bg-slate-900/50 text-slate-400 border border-white/5">
                        {asset.code}
                    </span>
                  </div>
                  <div className="col-span-2">
                     <span className="text-sm text-slate-300">{asset.category}</span>
                  </div>
                  <div className="col-span-3">
                     <StatusBadge status={asset.status} text={asset.location} />
                     {asset.borrower && (
                        <div className="text-xs text-slate-500 mt-1.5 flex items-center">
                            <User size={10} className="mr-1"/> 
                            {asset.borrower}
                        </div>
                     )}
                  </div>
                  <div className="col-span-1 text-right">
                     <button className="text-slate-500 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                        <MoreHorizontal size={20} />
                     </button>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drawer Overlay */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedAsset(null)}
          ></div>
          
          {/* Drawer Content */}
          <div className="relative w-full max-w-md bg-[#0f172a]/95 backdrop-blur-xl h-full shadow-2xl p-8 overflow-y-auto border-l border-white/10 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-2xl font-bold text-white">设备详情</h2>
              <button onClick={() => setSelectedAsset(null)} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="relative group rounded-2xl overflow-hidden mb-8 border border-white/10">
                <img src={selectedAsset.image} alt={selectedAsset.name} className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                    <div className="inline-flex items-center px-2 py-1 rounded bg-black/40 backdrop-blur-md text-xs text-white border border-white/10 mb-2">
                        <Tag size={12} className="mr-1 text-brand-400"/> {selectedAsset.category}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{selectedAsset.name}</h3>
                <p className="text-slate-500 font-mono text-sm flex items-center">
                   {selectedAsset.serialNumber}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">当前状态</div>
                  <StatusBadge status={selectedAsset.status} text={selectedAsset.status === AssetStatus.Available ? '在库' : '已借出'} />
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">存放/当前位置</div>
                  <div className="text-sm font-bold text-slate-200 flex items-center">
                    <MapPin size={16} className="mr-2 text-brand-400"/>
                    {selectedAsset.location}
                  </div>
                </div>
              </div>

              {selectedAsset.borrower && (
                <div className="bg-brand-500/10 p-5 rounded-2xl border border-brand-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Briefcase size={60} className="text-brand-400"/>
                  </div>
                  <h4 className="text-sm font-bold text-brand-400 mb-4 uppercase tracking-wider">当前借用信息</h4>
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center text-sm text-slate-200">
                      <User size={16} className="mr-3 text-brand-400"/>
                      <span className="font-medium">{selectedAsset.borrower}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-200">
                      <Briefcase size={16} className="mr-3 text-brand-400"/>
                      {selectedAsset.project}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-slate-600 rounded-full"></span>
                    历史记录
                </h4>
                <div className="border-l-2 border-white/10 ml-2 space-y-8 py-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="relative pl-6 group">
                      <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-600 group-hover:border-brand-400 transition-colors"></div>
                      <p className="text-sm text-slate-300">
                        <span className="font-bold text-white">李四</span> 归还了设备
                      </p>
                      <p className="text-xs text-slate-500 mt-1 font-mono">2024-03-{10 + i} 14:30</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-white/10 flex gap-4">
                <button className="flex-1 bg-white/5 border border-white/10 text-slate-300 py-3 rounded-xl hover:bg-white/10 transition-colors font-medium">报修</button>
                <button className="flex-1 bg-brand-500 text-slate-900 py-3 rounded-xl hover:bg-brand-400 transition-colors font-bold shadow-lg shadow-brand-500/20">编辑信息</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status, text }: { status: AssetStatus, text: string }) => {
  const styles = {
    [AssetStatus.Available]: 'bg-green-500/10 text-green-400 border-green-500/20',
    [AssetStatus.Borrowed]: 'bg-red-500/10 text-red-400 border-red-500/20',
    [AssetStatus.Maintenance]: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    [AssetStatus.Lost]: 'bg-slate-700 text-slate-300 border-slate-600',
  };

  const dotStyles = {
    [AssetStatus.Available]: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]',
    [AssetStatus.Borrowed]: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
    [AssetStatus.Maintenance]: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]',
    [AssetStatus.Lost]: 'bg-slate-400',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${dotStyles[status]}`}></span>
      {text}
    </span>
  );
};