
import React, { useState } from 'react';
import { Search, HardDrive, FolderOpen, Hash, Cloud, MapPin, X, Copy, ArrowRight, Film } from 'lucide-react';
import { MediaItem } from '../types';

const MOCK_MEDIA: MediaItem[] = [
  { id: '1', title: '2024某某科技公司宣传片-第一天素材', projectRef: '2024 Tech Promo', tags: ['Raw', 'A7S3', 'Interview'], diskName: 'DISK-05', diskStatus: 'InLibrary', physicalLocation: '器材室 B02 柜子', path: '/2024Projects/Promo/Footage/Day1/', type: 'Raw', format: 'XAVC-S 4K' },
  { id: '2', title: '2023年会-现场多机位素材', projectRef: '2023 Annual Party', tags: ['Raw', 'Multi-Cam'], diskName: 'RAID-01', diskStatus: 'Borrowed', borrower: '剪辑-小王', physicalLocation: '后期机房 A区', path: '/Events/2023Annual/Footage/Raw/', type: 'Raw', format: 'ProRes 422' },
  { id: '3', title: '城市风光空镜-上海篇', projectRef: 'Stock Footage', tags: ['Stock', 'Timelapse', 'Drone'], diskName: 'NAS-02', diskStatus: 'InLibrary', physicalLocation: '云存储 (内网)', path: '/Stock/City/Shanghai/', type: 'Project', format: 'H.265' },
];

export const MediaIndex: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const filteredMedia = MOCK_MEDIA.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="relative h-full flex flex-col">
      {/* Search Header */}
      <div className="flex-shrink-0 mb-8 max-w-4xl mx-auto w-full text-center">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">媒资物理索引</h1>
        <p className="text-slate-400 text-sm mb-6">输入关键词，快速定位 {MOCK_MEDIA.length} 个素材包的物理存储位置</p>
        
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand-400 transition-colors" />
            </div>
            <input
            type="text"
            className="block w-full pl-14 pr-6 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-lg placeholder-slate-500 text-white focus:border-brand-500/50 focus:bg-slate-900/80 focus:ring-4 focus:ring-brand-500/10 shadow-2xl transition-all outline-none"
            placeholder="搜索项目名、标签 (如: 年会, 4K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            />
        </div>
      </div>

      {/* Result Stream */}
      <div className="flex-1 overflow-y-auto max-w-5xl mx-auto w-full pb-20 space-y-4">
        {filteredMedia.map(item => (
          <div 
            key={item.id} 
            className="glass-card p-6 rounded-2xl border border-white/5 hover:border-brand-500/30 transition-all cursor-pointer group relative overflow-hidden"
            onClick={() => setSelectedItem(item)}
          >
             {/* Left accent strip */}
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-brand-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

             <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                
                {/* Info Block */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-100 group-hover:text-brand-400 transition-colors truncate">
                            {item.title}
                        </h3>
                        <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            item.type === 'Raw' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}>
                            {item.type}
                        </span>
                    </div>
                    
                    <div className="flex items-center text-xs text-slate-500 mb-4 space-x-3">
                        <span className="flex items-center"><Film size={12} className="mr-1"/> {item.projectRef}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                        <span className="font-mono">{item.format}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                        <div className="flex gap-1">
                            {item.tags.map(tag => <span key={tag} className="text-slate-400">#{tag}</span>)}
                        </div>
                    </div>

                    {/* Visual Path (The Core Feature) */}
                    <div className="flex items-center flex-wrap gap-2 text-sm font-mono p-3 bg-black/30 rounded-lg border border-white/5 w-full md:w-fit">
                        <div className="flex items-center text-slate-400">
                             <MapPin size={14} className="mr-2 text-brand-500" />
                             {item.physicalLocation}
                        </div>
                        <ArrowRight size={12} className="text-slate-600" />
                        <div className="flex items-center text-slate-300">
                             <HardDrive size={14} className="mr-2 text-brand-400" />
                             <span className={item.diskStatus === 'Borrowed' ? 'text-red-400' : ''}>{item.diskName}</span>
                             {item.diskStatus === 'Borrowed' && (
                                <span className="ml-2 text-[10px] px-1.5 rounded bg-red-500/20 text-red-400 border border-red-500/20">
                                    借出
                                </span>
                             )}
                        </div>
                        <ArrowRight size={12} className="text-slate-600" />
                        <div className="flex items-center text-slate-500 truncate max-w-[200px]">
                             <FolderOpen size={14} className="mr-2" />
                             {item.path}
                        </div>
                    </div>
                </div>

                {/* Quick Action */}
                <button className="hidden md:flex flex-shrink-0 p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5">
                    <Copy size={18} />
                </button>
             </div>
          </div>
        ))}
      </div>

      {/* Detail Drawer */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedItem(null)}></div>
            
            <div className="relative w-full max-w-lg bg-[#0f172a]/95 backdrop-blur-xl h-full shadow-2xl p-8 overflow-y-auto border-l border-white/10 animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-start mb-8">
                    <h2 className="text-xl font-bold text-white">素材详情</h2>
                    <button onClick={() => setSelectedItem(null)} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"><X size={24}/></button>
                </div>

                {/* Disk Status - Crucial for "Findability" */}
                <div className={`p-4 rounded-xl border mb-8 ${
                    selectedItem.diskStatus === 'InLibrary' 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : 'bg-red-500/10 border-red-500/20'
                }`}>
                    <div className="flex items-center mb-2">
                        <HardDrive className={selectedItem.diskStatus === 'InLibrary' ? 'text-green-400' : 'text-red-400'} size={20} />
                        <span className={`ml-2 font-bold ${selectedItem.diskStatus === 'InLibrary' ? 'text-green-400' : 'text-red-400'}`}>
                            {selectedItem.diskName}
                        </span>
                        <span className="ml-auto text-xs font-bold uppercase opacity-80">
                            {selectedItem.diskStatus === 'InLibrary' ? '在库可用' : '已借出'}
                        </span>
                    </div>
                    {selectedItem.diskStatus === 'Borrowed' && (
                        <div className="text-sm text-red-300 pl-7">
                            当前借用人: <span className="font-bold">{selectedItem.borrower}</span> (联系他归还)
                        </div>
                    )}
                    {selectedItem.diskStatus === 'InLibrary' && (
                        <div className="text-sm text-green-300 pl-7">
                            存放位置: {selectedItem.physicalLocation}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">内容描述</h3>
                        <p className="text-slate-200 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                            {selectedItem.title}。包含A/B机位原始素材，ProRes 422 格式。音频已同步。无需代理剪辑。
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">文件结构预览</h3>
                        <div className="font-mono text-xs text-slate-400 bg-black/30 p-4 rounded-xl border border-white/5 overflow-x-auto">
                            <div className="mb-1 text-brand-400">{selectedItem.path}</div>
                            <div className="pl-4">├── Cam_A/ (52 clips)</div>
                            <div className="pl-4">├── Cam_B/ (38 clips)</div>
                            <div className="pl-4">├── Audio/ (WAV)</div>
                            <div className="pl-4">└── Proxies/</div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                    <button className="py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold transition-colors flex items-center justify-center">
                        <Copy size={16} className="mr-2"/> 复制路径
                    </button>
                    <button className="py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-900 font-bold transition-colors shadow-lg shadow-brand-500/20">
                        申请借用硬盘
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
