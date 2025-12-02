
import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { 
  Play, Clock, CheckCircle, Download, Share2, X, 
  Settings, Link as LinkIcon, Smartphone, Monitor, Type, 
  ShieldAlert, Check, ChevronRight, FileVideo, Calendar, User
} from 'lucide-react';
import { MasterWork, WorkVersion } from '../types';
import { LayoutContext } from '../components/Layout';

// Mock Data
const MOCK_WORKS: MasterWork[] = [
  {
    id: '1',
    title: '2025 某某科技_A轮融资发布视频',
    coverImage: 'https://picsum.photos/800/450?random=20',
    duration: '03:45',
    producer: '导演-老张',
    status: 'Revision',
    year: 2025,
    category: 'Promo',
    tags: ['Tech', 'Finance', '4K'],
    versions: [
        { 
            id: 'v3', 
            versionTag: 'V3 (Final)', 
            date: '2025-02-10 14:00', 
            uploader: '剪辑-老张', 
            changeLog: '调色完毕，混音修正，客户确认版', 
            isCurrent: true,
            variants: [
                { id: 'f1', type: 'Master', label: '主文件 (16:9)', resolution: '3840x2160', size: '1.2 GB' },
                { id: 'f2', type: 'Vertical', label: '抖音/朋友圈版 (9:16)', resolution: '1080x1920', size: '350 MB' },
                { id: 'f3', type: 'Clean', label: '去字幕纯净版', resolution: '3840x2160', size: '1.1 GB' }
            ]
        },
        { 
            id: 'v2', 
            versionTag: 'V2', 
            date: '2025-02-08 09:30', 
            uploader: '剪辑-老张', 
            changeLog: '根据反馈修改了Logo大小，调整了BGM音量', 
            isCurrent: false,
            variants: [
                { id: 'f4', type: 'Master', label: '主文件 (16:9)', resolution: '1920x1080', size: '450 MB' }
            ]
        },
        { 
            id: 'v1', 
            versionTag: 'V1', 
            date: '2025-02-01 11:00', 
            uploader: '剪辑-小赵', 
            changeLog: '初剪版本，暂未调色', 
            isCurrent: false,
            variants: [
                { id: 'f5', type: 'Master', label: '主文件 (16:9)', resolution: '1920x1080', size: '420 MB' }
            ]
        }
    ]
  },
  {
    id: '2',
    title: '城市呼吸 - 纪录片 EP01',
    coverImage: 'https://picsum.photos/800/450?random=21',
    duration: '12:15',
    producer: '导演-李四',
    status: 'Delivered',
    year: 2024,
    category: 'Documentary',
    tags: ['City', 'Humanity'],
    versions: [
        { 
            id: 'v_final', 
            versionTag: 'Final', 
            date: '2024-12-20', 
            uploader: '剪辑-王五', 
            changeLog: '最终交付', 
            isCurrent: true,
            variants: [
                 { id: 'd1', type: 'Master', label: '成片 Master', resolution: '4K', size: '4.5 GB' }
            ]
        }
    ]
  }
];

export const MasterWorks: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'Grid' | 'List'>('Grid');
  const [selectedWork, setSelectedWork] = useState<MasterWork | null>(null);
  
  // Use Context to control sidebar
  const { setCollapsed } = useContext(LayoutContext);

  // When selectedWork changes, toggle sidebar
  useEffect(() => {
    if (selectedWork) {
        setCollapsed(true);
    } else {
        setCollapsed(false);
    }
  }, [selectedWork, setCollapsed]);

  // Cleanup on unmount to restore sidebar if user navigates away directly
  useEffect(() => {
    return () => setCollapsed(false);
  }, [setCollapsed]);

  // Filter logic
  const filteredWorks = activeFilter === 'All' 
    ? MOCK_WORKS 
    : MOCK_WORKS.filter(w => w.category === activeFilter);

  return (
    <div className="relative h-full flex flex-col">
       
        <div className="flex flex-col h-full animate-in fade-in duration-300">
             {/* Header */}
            <div className="flex justify-between items-end mb-8 flex-shrink-0">
                <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">成片资产库</h1>
                <p className="text-slate-400 text-sm mt-1">
                    管理 {MOCK_WORKS.length} 个项目资产包 · 交付与归档中心
                </p>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className="bg-white/5 p-1 rounded-lg border border-white/5 flex">
                        <button 
                            onClick={() => setViewMode('Grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'Grid' ? 'bg-brand-500 text-slate-900 shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                                <div className="bg-current rounded-[1px]"></div>
                                <div className="bg-current rounded-[1px]"></div>
                                <div className="bg-current rounded-[1px]"></div>
                                <div className="bg-current rounded-[1px]"></div>
                            </div>
                        </button>
                        <button 
                             onClick={() => setViewMode('List')}
                             className={`p-2 rounded-md transition-all ${viewMode === 'List' ? 'bg-brand-500 text-slate-900 shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            <div className="flex flex-col gap-0.5 w-4 h-4 justify-center">
                                <div className="h-[2px] w-full bg-current rounded-full"></div>
                                <div className="h-[2px] w-full bg-current rounded-full"></div>
                                <div className="h-[2px] w-full bg-current rounded-full"></div>
                            </div>
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                        {['All', 'Promo', 'TVC', 'Documentary'].map(filter => (
                            <button 
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                    activeFilter === filter 
                                    ? 'bg-brand-500 text-slate-900 shadow-md' 
                                    : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {filter === 'All' ? '全部' : filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pb-20">
                {viewMode === 'Grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredWorks.map(work => (
                            <GalleryCard key={work.id} work={work} onClick={() => setSelectedWork(work)} />
                        ))}
                    </div>
                ) : (
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-white/5 text-slate-200 uppercase text-xs font-bold">
                                <tr>
                                    <th className="p-4 pl-6">项目名称</th>
                                    <th className="p-4">分类</th>
                                    <th className="p-4">当前版本</th>
                                    <th className="p-4">状态</th>
                                    <th className="p-4 text-right pr-6">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredWorks.map(work => (
                                    <tr key={work.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedWork(work)}>
                                        <td className="p-4 pl-6 font-medium text-white flex items-center gap-3">
                                            <img src={work.coverImage} className="w-10 h-6 object-cover rounded" alt={work.title} />
                                            {work.title}
                                        </td>
                                        <td className="p-4">{work.category}</td>
                                        <td className="p-4 font-mono">{work.versions[0]?.versionTag}</td>
                                        <td className="p-4"><StatusBadge status={work.status} /></td>
                                        <td className="p-4 text-right pr-6">
                                            <button className="text-brand-400 hover:text-brand-300 font-bold text-xs">管理</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>

      {selectedWork && createPortal(
        <Workbench work={selectedWork} onClose={() => setSelectedWork(null)} />,
        document.body
      )}
    </div>
  );
};

// --- Sub-Components ---

// 1. Gallery Card
const GalleryCard = ({ work, onClick }: { work: MasterWork, onClick: () => void }) => {
    return (
        <div 
            onClick={onClick}
            className="group relative bg-[#0f172a] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-brand-500/50 hover:shadow-[0_0_30px_rgba(250,204,21,0.1)] transition-all duration-300 flex flex-col"
        >
            {/* Thumbnail */}
            <div className="aspect-video relative overflow-hidden bg-slate-900">
                <img src={work.coverImage} alt={work.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <StatusBadge status={work.status} />
                </div>
                
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-mono text-white flex items-center border border-white/10 shadow-lg">
                    <Clock size={10} className="mr-1"/> {work.duration}
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[1px]">
                    <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center text-white transition-colors" title="快速分享">
                            <Share2 size={18} />
                        </button>
                        <button className="w-12 h-12 rounded-full bg-brand-500 hover:bg-brand-400 text-slate-900 flex items-center justify-center shadow-lg shadow-brand-500/30 transition-colors">
                            <Play fill="currentColor" size={20} className="ml-1"/>
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center text-white transition-colors" title="下载主文件">
                            <Download size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-5 flex-1 flex flex-col bg-gradient-to-b from-[#0f172a] to-[#020617]">
                <h3 className="font-bold text-slate-100 text-sm leading-snug line-clamp-2 group-hover:text-brand-400 transition-colors mb-2">
                    {work.title}
                </h3>
                <div className="mt-auto flex justify-between items-center pt-3 border-t border-white/5">
                    <div className="flex items-center text-xs text-slate-500">
                        <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white mr-2">
                            {work.producer.charAt(0)}
                        </div>
                        {work.producer}
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono">
                        {work.versions[0]?.versionTag}
                    </span>
                </div>
            </div>
        </div>
    )
}

// 2. Workbench (The Detail Overlay)
const Workbench = ({ work, onClose }: { work: MasterWork, onClose: () => void }) => {
    const [activeVersionId, setActiveVersionId] = useState<string>(work.versions[0].id);
    const [rightPanelTab, setRightPanelTab] = useState<'History' | 'Variants'>('History');
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isShareOpen, setIsShareOpen] = useState(false);

    // Get current active version object
    const currentVersion = work.versions.find(v => v.id === activeVersionId) || work.versions[0];
    const isLatest = activeVersionId === work.versions[0].id;

    return (
        <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            {/* Top Bar */}
            <header className="h-16 flex-shrink-0 border-b border-white/5 flex items-center justify-between px-6 bg-[#0f172a] z-20">
                <div className="flex items-center gap-4 min-w-0">
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                    <div className="h-8 w-px bg-white/10 mx-1"></div>
                    <div className="min-w-0">
                        <h2 className="text-lg font-bold text-white truncate flex items-center gap-2">
                            {work.title}
                            {!isLatest && <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/20">历史版本: {currentVersion.versionTag}</span>}
                        </h2>
                        <div className="flex items-center text-xs text-slate-500 gap-3">
                            <span>{currentVersion.variants[0]?.resolution}</span>
                            <span>•</span>
                            <span>{currentVersion.variants[0]?.size}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsShareOpen(true)}
                        className="flex items-center px-4 py-2 bg-brand-500 hover:bg-brand-400 text-slate-900 rounded-lg text-sm font-bold shadow-lg shadow-brand-500/20 transition-all hover:scale-105"
                    >
                        <Share2 size={16} className="mr-2"/> 分享交付
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left: Player */}
                <div className="flex-1 bg-black relative flex flex-col items-center justify-center p-8 group/player">
                    <div className="w-full h-full max-h-[80vh] aspect-video bg-slate-900 rounded-lg relative overflow-hidden shadow-2xl border border-white/10">
                        {/* Mock Video Content */}
                        <img src={work.coverImage} className="w-full h-full object-cover opacity-60" alt="Video Preview" />
                        
                        {/* Watermark Overlay (Simulation) */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                            <div className="text-white/5 text-4xl font-bold -rotate-12 select-none whitespace-nowrap">
                                INTERNAL REVIEW • DO NOT DISTRIBUTE • INTERNAL REVIEW • DO NOT DISTRIBUTE
                            </div>
                        </div>

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-110 hover:bg-brand-500 hover:text-slate-900 hover:border-brand-500 transition-all duration-300 group-hover/player:flex">
                                <Play size={32} fill="currentColor" className="ml-1"/>
                            </button>
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/90 to-transparent flex items-end pb-4 px-6 opacity-0 group-hover/player:opacity-100 transition-opacity">
                            <div className="w-full space-y-2">
                                {/* Progress */}
                                <div className="h-1 bg-white/20 rounded-full cursor-pointer relative group/progress">
                                    <div className="absolute top-0 left-0 h-full w-1/3 bg-brand-500 rounded-full relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform"></div>
                                    </div>
                                </div>
                                {/* Buttons */}
                                <div className="flex justify-between items-center text-white">
                                    <div className="flex items-center gap-4">
                                        <Play size={20} fill="currentColor" className="cursor-pointer"/>
                                        <div className="text-xs font-mono">01:15 / {work.duration}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1)}
                                            className="text-xs font-bold w-12 text-center py-1 rounded hover:bg-white/10 transition-colors"
                                        >
                                            {playbackSpeed}x
                                        </button>
                                        <Settings size={20} className="cursor-pointer hover:rotate-45 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Control Panel */}
                <div className="w-96 bg-[#0f172a] border-l border-white/5 flex flex-col flex-shrink-0 z-10 shadow-2xl">
                    {/* Tabs */}
                    <div className="flex border-b border-white/5">
                        <button 
                            onClick={() => setRightPanelTab('History')}
                            className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 ${
                                rightPanelTab === 'History' 
                                ? 'text-brand-400 border-brand-400 bg-white/[0.02]' 
                                : 'text-slate-500 border-transparent hover:text-slate-300'
                            }`}
                        >
                            版本历史
                        </button>
                        <button 
                             onClick={() => setRightPanelTab('Variants')}
                             className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 ${
                                rightPanelTab === 'Variants' 
                                ? 'text-brand-400 border-brand-400 bg-white/[0.02]' 
                                : 'text-slate-500 border-transparent hover:text-slate-300'
                            }`}
                        >
                            交付变体
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {rightPanelTab === 'History' ? (
                            <div className="space-y-8 relative">
                                {/* Timeline Line */}
                                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-white/10"></div>

                                {work.versions.map((version) => {
                                    const isActive = activeVersionId === version.id;
                                    return (
                                        <div 
                                            key={version.id} 
                                            onClick={() => setActiveVersionId(version.id)}
                                            className={`relative pl-10 cursor-pointer group transition-all ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                        >
                                            {/* Node Dot */}
                                            <div className={`absolute left-0 top-0.5 w-10 h-10 flex items-center justify-center rounded-full border-4 border-[#0f172a] transition-colors z-10 ${
                                                isActive 
                                                ? 'bg-brand-500 text-slate-900 shadow-[0_0_15px_rgba(250,204,21,0.5)]' 
                                                : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'
                                            }`}>
                                                {isActive ? <Check size={16} strokeWidth={4}/> : <Clock size={16} />}
                                            </div>

                                            {/* Content */}
                                            <div className={`p-4 rounded-xl border transition-all ${
                                                isActive 
                                                ? 'bg-brand-500/5 border-brand-500/30' 
                                                : 'bg-white/5 border-white/5 hover:border-white/10'
                                            }`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`font-bold ${isActive ? 'text-brand-400' : 'text-white'}`}>
                                                        {version.versionTag}
                                                    </span>
                                                    {version.isCurrent && (
                                                        <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold uppercase">
                                                            Current
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                                                    {version.changeLog}
                                                </p>
                                                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono pt-3 border-t border-white/5">
                                                    <div className="flex items-center">
                                                        <User size={10} className="mr-1"/> {version.uploader}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Calendar size={10} className="mr-1"/> {version.date}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    {currentVersion.versionTag} 包含的格式
                                </div>
                                {currentVersion.variants.map((variant) => (
                                    <div key={variant.id} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors group">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${
                                                    variant.type === 'Master' ? 'bg-blue-500/20 text-blue-400' :
                                                    variant.type === 'Vertical' ? 'bg-purple-500/20 text-purple-400' :
                                                    'bg-slate-500/20 text-slate-400'
                                                }`}>
                                                    {variant.type === 'Vertical' ? <Smartphone size={18}/> : <Monitor size={18}/>}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-200 text-sm">{variant.label}</div>
                                                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                                                        {variant.resolution} • {variant.size}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <button className="flex-1 py-1.5 rounded-lg bg-white/5 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center">
                                                <Play size={12} className="mr-1.5"/> 预览
                                            </button>
                                            <button className="flex-1 py-1.5 rounded-lg bg-brand-500/10 text-brand-400 text-xs hover:bg-brand-500/20 transition-colors flex items-center justify-center font-medium">
                                                <Download size={12} className="mr-1.5"/> 下载
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Share Modal Dialog */}
            {isShareOpen && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">生成交付链接</h3>
                            <button onClick={() => setIsShareOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Version Select */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">选择交付版本</label>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm text-white flex justify-between items-center">
                                    <span className="font-bold text-brand-400">{currentVersion.versionTag} (当前选中)</span>
                                    <span className="text-slate-500">包含 {currentVersion.variants.length} 个文件</span>
                                </div>
                            </div>

                            {/* Permissions */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">访问权限</label>
                                <div className="space-y-2">
                                    <label className="flex items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-white/10">
                                        <input type="checkbox" className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-brand-500 focus:ring-brand-500" defaultChecked />
                                        <span className="ml-3 text-sm text-slate-200">允许客户下载原始文件</span>
                                    </label>
                                    <label className="flex items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-white/10">
                                        <input type="checkbox" className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-brand-500 focus:ring-brand-500" />
                                        <span className="ml-3 text-sm text-slate-200">需要 4 位访问密码</span>
                                    </label>
                                </div>
                            </div>

                            {/* Link Preview */}
                            <div className="bg-black/40 rounded-xl p-4 border border-brand-500/20 flex items-center justify-between">
                                <div className="flex items-center text-brand-400 text-sm font-mono truncate mr-4">
                                    <LinkIcon size={14} className="mr-2 flex-shrink-0"/>
                                    bird.erp/s/xy7z9
                                </div>
                                <button className="text-xs bg-brand-500 text-slate-900 px-3 py-1.5 rounded-lg font-bold hover:bg-brand-400 transition-colors">
                                    复制
                                </button>
                            </div>
                        </div>
                        <div className="p-4 bg-black/20 text-center">
                            <button onClick={() => setIsShareOpen(false)} className="text-slate-500 hover:text-white text-sm">关闭窗口</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ status }: { status: MasterWork['status'] }) => {
    const styles = {
        Delivered: 'bg-green-500/20 text-green-400 border-green-500/20',
        Revision: 'bg-brand-500/20 text-brand-400 border-brand-500/20',
        Internal: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
        Archived: 'bg-slate-500/20 text-slate-400 border-slate-500/20'
    };
    
    const labels = {
        Delivered: '已交付',
        Revision: '修改中',
        Internal: '内部',
        Archived: '归档'
    };

    return (
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${styles[status]}`}>
            {labels[status]}
        </span>
    );
};
