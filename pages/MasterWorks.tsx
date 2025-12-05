import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Play, CheckCircle, Download, X, 
  Link as LinkIcon, 
  ChevronRight, ChevronDown,
  Menu, Folder, Grid, Search,
  Eye, FolderPlus, Globe, Plus, LayoutGrid,
  List, Trash2, FileVideo, Users, HardDrive, Settings, LogOut, ArrowUpDown, Calendar, Briefcase, Truck, Archive,
  Check, SlidersHorizontal, ArrowUp, ArrowDown, MessageSquare, Copy, Maximize, Volume2, Upload, Loader2, Send
} from 'lucide-react';
import { MasterWork, MediaFolder, ShareLinkRecord, MediaSpace, SpaceType, Comment } from '../types';
import { LayoutContext } from '../components/Layout';

// --- MOCK DATA ---

const MOCK_SPACES: MediaSpace[] = [
    {
        id: 'space1',
        name: '市场部交付中心',
        description: 'Brand Marketing & PR Delivery',
        memberCount: 12,
        storageUsed: '1.2 TB',
        totalStorage: '5.0 TB',
        themeColor: 'from-blue-500 to-cyan-500',
        type: 'Delivery',
        status: 'Active',
        createdAt: '2024-01-15',
    },
    {
        id: 'space2',
        name: '纪录片工作室',
        description: 'Documentary Production Hub',
        memberCount: 5,
        storageUsed: '3.8 TB',
        totalStorage: '10.0 TB',
        themeColor: 'from-orange-500 to-amber-500',
        type: 'Project',
        status: 'Active',
        createdAt: '2024-03-01',
    },
    {
        id: 'space3',
        name: '2024 归档库',
        description: 'Archived Projects 2024',
        memberCount: 3,
        storageUsed: '8.5 TB',
        totalStorage: '20.0 TB',
        themeColor: 'from-slate-600 to-slate-500',
        type: 'Department',
        status: 'Archived',
        createdAt: '2024-12-30',
    }
];

const MOCK_FOLDERS: MediaFolder[] = [
  { id: 'f1', spaceId: 'space1', name: '2025 Projects', parentId: null, createdAt: '2025-01-01' },
  { id: 'f2', spaceId: 'space1', name: '某某科技 (Client A)', parentId: 'f1', createdAt: '2025-01-15' },
];

const MOCK_COMMENTS: Comment[] = [
    { id: 'c1', userId: 'u1', userName: 'Director Zhang', content: 'Color grading looks a bit too saturated here.', timestamp: '10:00 AM', timecode: '00:00:05' },
    { id: 'c2', userId: 'u2', userName: 'Client', content: 'Can we change the logo animation speed?', timestamp: '11:30 AM', timecode: '00:00:22' },
];

const MOCK_WORKS: MasterWork[] = [
  {
    id: 'demo-1',
    spaceId: 'space1',
    folderId: 'f2',
    title: '元渔舟片头-L.m4v',
    coverImage: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?q=80&w=1000&auto=format&fit=crop',
    duration: '00:30',
    producer: '伟',
    status: 'Revision',
    year: 2025,
    category: 'TVC',
    tags: ['Cyberpunk', '3D', 'Promo'],
    versions: [
        { 
            id: 'v3', 
            versionTag: 'V3', 
            date: '2025-02-10 14:00', 
            uploader: 'Admin', 
            changeLog: 'Adjusted neon glow intensity', 
            isCurrent: true,
            comments: MOCK_COMMENTS,
            variants: [
                { id: 'var1', type: 'Master', label: 'Master 4K (16:9)', resolution: '3840x2160', bitrate: '45 Mbps', codec: 'ProRes 422', size: '1.2 GB' },
                { id: 'var2', type: 'Social', label: 'Social HD (16:9)', resolution: '1920x1080', bitrate: '12 Mbps', codec: 'H.264', size: '120 MB' },
            ]
        },
        { 
            id: 'v2', 
            versionTag: 'V2', 
            date: '2025-02-08 09:30', 
            uploader: 'Editor', 
            changeLog: 'Fixed audio sync issues', 
            isCurrent: false,
            comments: [],
            variants: [
                { id: 'var3', type: 'Master', label: 'Master 4K (16:9)', resolution: '3840x2160', bitrate: '45 Mbps', codec: 'ProRes 422', size: '1.2 GB' },
            ]
        },
        { 
            id: 'v1', 
            versionTag: 'V1', 
            date: '2025-02-05 16:20', 
            uploader: 'Editor', 
            changeLog: 'First Cut', 
            isCurrent: false,
            comments: [],
            variants: []
        },
    ]
  },
  {
    id: '1',
    spaceId: 'space1',
    folderId: 'f2',
    title: 'A轮融资发布视频_Final.mp4',
    coverImage: 'https://picsum.photos/id/10/800/450',
    duration: '03:15',
    producer: '导演-老张',
    status: 'Delivered',
    year: 2025,
    category: 'Promo',
    tags: ['Finance', '4K'],
    versions: [
        { 
            id: 'v_final', 
            versionTag: 'Final', 
            date: '2025-02-12', 
            uploader: '剪辑-老张', 
            changeLog: '交付版', 
            isCurrent: true,
            variants: [],
            comments: []
        },
    ]
  },
  {
    id: '2',
    spaceId: 'space2',
    folderId: null, 
    title: '城市呼吸 - 纪录片 EP01',
    coverImage: 'https://picsum.photos/id/28/800/450',
    duration: '12:15',
    producer: '导演-李四',
    status: 'Delivered',
    year: 2024,
    category: 'Documentary',
    tags: ['City', 'Humanity'],
    versions: []
  },
];

const MOCK_SHARES: ShareLinkRecord[] = [
    {
        id: 's1',
        spaceId: 'space1',
        workId: 'demo-1',
        workTitle: '元渔舟片头-L',
        workCover: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?q=80&w=1000&auto=format&fit=crop',
        versionTag: 'V3',
        url: 'https://f.io/psbfuENE',
        views: 24,
        downloads: 5,
        status: 'Active',
        createdAt: '2025-02-12',
        expiresAt: '2025-02-19',
        creator: 'Admin'
    },
];

// --- VIEW TYPES ---

type ViewLayout = 'grid' | 'list';
type CardSize = 'S' | 'M' | 'L';
type AspectRatio = '16:9' | '1:1' | '9:16';
type ImageScale = 'Fit' | 'Fill';
type SortKey = 'name' | 'date' | 'status' | 'size' | 'duration';
type SortDirection = 'asc' | 'desc';

interface ViewSettings {
    layout: ViewLayout;
    cardSize: CardSize;
    aspectRatio: AspectRatio;
    scale: ImageScale;
    showInfo: boolean;
    titleLines: number;
}

interface SortConfig {
    key: SortKey;
    direction: SortDirection;
    label: string;
}

const AVAILABLE_FIELDS = [
    { key: 'status', label: '状态' },
    { key: 'duration', label: '时长' },
    { key: 'resolution', label: '分辨率' },
    { key: 'size', label: '文件大小' },
    { key: 'producer', label: '制作人' },
    { key: 'date', label: '上传日期' },
    { key: 'category', label: '分类' }
];

// --- TOAST COMPONENT ---
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'info' | 'loading', onClose: () => void }) => {
    useEffect(() => {
        if (type !== 'loading') {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [type, onClose]);

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 px-6 py-3 rounded-full bg-[#1e293b] border border-white/10 shadow-2xl animate-in slide-in-from-bottom-5 fade-in">
            {type === 'loading' && <Loader2 size={18} className="animate-spin text-brand-400"/>}
            {type === 'success' && <CheckCircle size={18} className="text-green-400"/>}
            {type === 'info' && <Check size={18} className="text-blue-400"/>}
            <span className="text-sm font-bold text-white">{message}</span>
        </div>
    );
};

// --- HELPER COMPONENTS ---

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
    badge?: string;
    badgeColor?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, badge, badgeColor = 'brand' }) => (
    <div 
        onClick={onClick}
        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all group select-none ${
            active ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
        }`}
    >
        <div className="flex items-center gap-3 min-w-0">
            <span className={`flex-shrink-0 transition-colors ${active ? 'text-brand-400' : 'group-hover:text-white'}`}>{icon}</span>
            <span className={`text-sm font-medium truncate ${active ? 'font-bold' : ''}`}>{label}</span>
        </div>
        {badge && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                badgeColor === 'red' ? 'bg-red-500 text-white' : 
                badgeColor === 'green' ? 'bg-green-500 text-white' : 
                'bg-white/10 text-slate-300'
            }`}>
                {badge}
            </span>
        )}
    </div>
);

interface FolderCardProps {
    folder: MediaFolder;
    settings: ViewSettings;
    onDoubleClick: () => void;
}

const FolderCard: React.FC<FolderCardProps> = ({ folder, settings, onDoubleClick }) => (
    <div 
        onDoubleClick={onDoubleClick}
        className={`bg-[#1e293b] border border-white/5 rounded-xl hover:border-brand-500/30 transition-all cursor-pointer group flex flex-col relative overflow-hidden ${
            settings.cardSize === 'S' ? 'p-3' : 'p-4'
        }`}
    >
        <div className="flex items-center gap-3">
             <div className={`flex-shrink-0 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center ${settings.cardSize === 'S' ? 'w-8 h-8' : 'w-10 h-10'}`}>
                 <Folder size={settings.cardSize === 'S' ? 16 : 20} fill="currentColor" className="fill-blue-400/20"/>
             </div>
             <div className="min-w-0">
                 <div className={`font-bold text-slate-200 truncate group-hover:text-brand-400 transition-colors ${settings.cardSize === 'S' ? 'text-xs' : 'text-sm'}`}>{folder.name}</div>
                 {settings.showInfo && <div className="text-[10px] text-slate-500 mt-0.5">{folder.createdAt}</div>}
             </div>
        </div>
    </div>
);

interface FileCardProps {
    work: MasterWork;
    settings: ViewSettings;
    onDoubleClick: (e: React.MouseEvent) => void;
    onShare: () => void;
}

const FileCard: React.FC<FileCardProps> = ({ work, settings, onDoubleClick, onShare }) => {
    let aspectClass = 'aspect-video';
    if (settings.aspectRatio === '1:1') aspectClass = 'aspect-square';
    if (settings.aspectRatio === '9:16') aspectClass = 'aspect-[9/16]';

    const currentVersion = work.versions.find(v => v.isCurrent) || work.versions[0];

    return (
        <div 
            onDoubleClick={onDoubleClick}
            className="group relative bg-[#1e293b] rounded-xl overflow-hidden border border-white/5 hover:border-brand-500/50 hover:shadow-lg transition-all cursor-pointer flex flex-col"
        >
            <div className={`w-full relative bg-black ${aspectClass}`}>
                {work.coverImage ? (
                    <img 
                        src={work.coverImage} 
                        alt={work.title} 
                        className={`w-full h-full ${settings.scale === 'Fit' ? 'object-contain p-2' : 'object-cover'} transition-transform duration-500 group-hover:scale-105`} 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <FileVideo size={32} className="text-slate-600"/>
                    </div>
                )}
                
                <div className="absolute top-2 right-2 flex gap-1">
                     <span className="bg-black/60 backdrop-blur text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/10">
                        {work.duration}
                     </span>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px]">
                     <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center pl-1 shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                         <Play size={20} className="text-black fill-black"/>
                     </div>
                </div>
            </div>

            <div className="p-3 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className={`font-bold text-slate-200 text-sm leading-tight group-hover:text-brand-400 transition-colors ${
                        settings.titleLines === 1 ? 'truncate' : settings.titleLines === 2 ? 'line-clamp-2' : ''
                    }`}>
                        {work.title}
                    </h3>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onShare(); }}
                        className="text-slate-500 hover:text-white p-1 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Share"
                    >
                        <LinkIcon size={14} />
                    </button>
                </div>
                
                {settings.showInfo && (
                    <div className="mt-auto pt-2 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                             <span className={`px-1.5 py-0.5 rounded border ${
                                 work.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                 work.status === 'Revision' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                                 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                             }`}>
                                 {work.status}
                             </span>
                             {currentVersion && <span className="font-mono bg-white/5 px-1 rounded text-slate-500">{currentVersion.versionTag}</span>}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span>{currentVersion?.date.split(' ')[0]}</span>
                            <span>{work.category}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ShareLinksView = ({ shares }: { shares: ShareLinkRecord[] }) => (
    <div className="bg-[#1e293b] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-[#0f172a] text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-white/5">
                <tr>
                    <th className="px-6 py-4">分享内容</th>
                    <th className="px-6 py-4">版本</th>
                    <th className="px-6 py-4">链接 / URL</th>
                    <th className="px-6 py-4">数据统计</th>
                    <th className="px-6 py-4">有效期</th>
                    <th className="px-6 py-4">创建人</th>
                    <th className="px-6 py-4 text-right">状态</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {shares.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                            <Globe size={48} className="mx-auto mb-4 opacity-20"/>
                            <p className="text-sm">暂无分享链接</p>
                        </td>
                    </tr>
                ) : shares.map(share => (
                    <tr key={share.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <img src={share.workCover} className="w-10 h-6 object-cover rounded bg-black" alt=""/>
                                <div className="font-bold text-slate-200 text-sm">{share.workTitle}</div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-xs font-mono text-slate-300">
                                {share.versionTag}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2 max-w-[200px]">
                                <span className="text-xs text-brand-400 underline truncate cursor-pointer">{share.url}</span>
                                <button className="text-slate-500 hover:text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Copy size={12}/>
                                </button>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                                <span title="Views" className="flex items-center gap-1"><Eye size={12}/> {share.views}</span>
                                <span title="Downloads" className="flex items-center gap-1"><Download size={12}/> {share.downloads}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                            {share.expiresAt || '永久有效'}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                            {share.creator}
                        </td>
                        <td className="px-6 py-4 text-right">
                             <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                                 share.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                             }`}>
                                 {share.status}
                             </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const ShareModal = ({ work, onClose, onCreate }: { work: MasterWork, onClose: () => void, onCreate: (link: string) => void }) => {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1e293b] w-full max-w-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0f172a]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <LinkIcon size={18} className="text-brand-400"/>
                        创建分享链接
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                        <img src={work.coverImage} className="w-24 h-14 object-cover rounded-lg bg-black" alt="" />
                        <div>
                            <div className="font-bold text-white">{work.title}</div>
                            <div className="text-xs text-slate-400 mt-1">Duration: {work.duration} • Latest: {work.versions[0]?.versionTag || 'V1'}</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">链接有效期</label>
                            <div className="grid grid-cols-4 gap-2">
                                {['7天', '30天', '永久', '自定义'].map(opt => (
                                    <button key={opt} className={`py-2 rounded-lg text-sm font-bold border transition-colors ${opt === '7天' ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' : 'bg-[#0f172a] text-slate-400 border-white/10 hover:border-white/20'}`}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">访问权限</label>
                            <div className="space-y-2">
                                <label className="flex items-center p-3 rounded-lg bg-[#0f172a] border border-white/10 cursor-pointer">
                                    <input type="checkbox" className="form-checkbox text-brand-500 rounded bg-white/10 border-white/20" defaultChecked />
                                    <span className="ml-3 text-sm text-slate-200">允许下载原始文件</span>
                                </label>
                                <label className="flex items-center p-3 rounded-lg bg-[#0f172a] border border-white/10 cursor-pointer">
                                    <input type="checkbox" className="form-checkbox text-brand-500 rounded bg-white/10 border-white/20" defaultChecked />
                                    <span className="ml-3 text-sm text-slate-200">需要密码访问</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-[#0f172a] flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white font-medium text-sm transition-colors">取消</button>
                    <button 
                        onClick={() => onCreate(`https://f.io/${Math.random().toString(36).substr(2, 6)}`)}
                        className="px-6 py-2 bg-brand-500 hover:bg-brand-400 text-slate-900 rounded-lg text-sm font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center"
                    >
                        <LinkIcon size={16} className="mr-2"/> 生成链接
                    </button>
                </div>
            </div>
        </div>
    );
};

const MetaItem = ({ label, value }: { label: string, value: string }) => (
    <div>
        <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">{label}</div>
        <div className="text-sm text-slate-200 font-medium truncate">{value}</div>
    </div>
);

// --- WORKBENCH (VIDEO PLAYER + REVIEW) ---

const Workbench = ({ work, onClose, onAddComment }: { work: MasterWork, onClose: () => void, onAddComment: (verId: string, text: string, time: string) => void }) => {
    const initialVersion = work.versions.find(v => v.isCurrent) || work.versions[0];
    const [selectedVersionId, setSelectedVersionId] = useState<string>(initialVersion?.id);
    const [activeTab, setActiveTab] = useState<'comments' | 'info'>('comments');
    const [isPlaying, setIsPlaying] = useState(false);
    const [commentText, setCommentText] = useState('');
    
    const selectedVersion = work.versions.find(v => v.id === selectedVersionId);
    const currentComments = selectedVersion?.comments || [];

    const handleSendComment = () => {
        if (!commentText.trim()) return;
        onAddComment(selectedVersionId, commentText, "00:00:15");
        setCommentText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendComment();
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-[#020617] flex flex-col animate-in slide-in-from-bottom-2 duration-300">
            <header className="h-16 flex-shrink-0 border-b border-white/5 flex items-center justify-between px-6 bg-[#0f172a] z-20">
                <div className="flex items-center gap-6">
                    <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                    
                    <div className="flex flex-col">
                        <h2 className="text-sm font-bold text-white flex items-center gap-2">
                            {work.title}
                            <span className={`px-1.5 py-0.5 rounded text-[10px] border ${
                                work.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                work.status === 'Revision' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                                'bg-slate-500/10 text-slate-400 border-slate-500/20'
                            }`}>{work.status}</span>
                        </h2>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                             Uploaded {selectedVersion?.date} by {selectedVersion?.uploader}
                        </div>
                    </div>

                    <div className="relative group ml-4">
                        <div className="flex items-center gap-2 bg-black/30 border border-white/10 px-3 py-1.5 rounded-lg text-sm font-bold text-white cursor-pointer hover:bg-white/5 transition-colors">
                            <span className={selectedVersion?.isCurrent ? "text-green-400" : "text-slate-400"}>
                                {selectedVersion?.versionTag}
                            </span>
                            {selectedVersion?.isCurrent && <span className="text-[10px] bg-green-500/20 text-green-400 px-1 rounded uppercase">Current</span>}
                            <ChevronDown size={14} className="text-slate-500"/>
                        </div>
                        <div className="absolute top-full left-0 mt-2 w-64 bg-[#1e293b] border border-white/10 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-50">
                             <div className="p-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Version History</div>
                             {work.versions.map(v => (
                                 <div 
                                    key={v.id} 
                                    onClick={() => setSelectedVersionId(v.id)}
                                    className={`px-4 py-3 hover:bg-white/5 cursor-pointer flex justify-between items-center ${v.id === selectedVersionId ? 'bg-white/5' : ''}`}
                                 >
                                     <div>
                                         <div className="flex items-center gap-2">
                                             <span className={`font-bold ${v.isCurrent ? 'text-green-400' : 'text-slate-300'}`}>{v.versionTag}</span>
                                             {v.isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                                         </div>
                                         <div className="text-xs text-slate-500 mt-0.5">{v.date}</div>
                                     </div>
                                     <div className="text-right">
                                         <div className="text-[10px] text-slate-400 bg-black/30 px-1.5 py-0.5 rounded border border-white/5">{v.variants.length} Files</div>
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-brand-500/20 transition-all">
                        Approve
                    </button>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm font-bold transition-colors">
                        Download
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 bg-black relative flex flex-col group select-none">
                    <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full relative">
                            <img src={work.coverImage} className="w-full h-full object-contain opacity-90" alt="" />
                            {!isPlaying && (
                                <div 
                                    onClick={() => setIsPlaying(true)}
                                    className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/10 transition-colors"
                                >
                                    <div className="w-20 h-20 rounded-full bg-brand-500/90 flex items-center justify-center pl-2 shadow-[0_0_30px_rgba(234,179,8,0.4)] transform hover:scale-110 transition-transform">
                                        <Play size={40} className="text-black fill-black" />
                                    </div>
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer relative group/scrubber">
                                    <div className="absolute top-0 left-0 h-full w-[30%] bg-brand-500 rounded-full relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/scrubber:opacity-100 transform scale-0 group-hover/scrubber:scale-100 transition-all"></div>
                                    </div>
                                    <div className="absolute top-0 left-0 h-full w-[45%] bg-white/10 rounded-full"></div> 
                                </div>
                                
                                <div className="flex items-center justify-between text-white">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-brand-400">
                                            {isPlaying ? <span className="font-bold text-xs">PAUSE</span> : <Play size={20} fill="currentColor"/>}
                                        </button>
                                        <div className="flex items-center gap-2 text-xs font-mono">
                                            <span>00:00:15:12</span>
                                            <span className="text-slate-500">/</span>
                                            <span className="text-slate-400">{work.duration}:00</span>
                                        </div>
                                        <button className="hover:text-white text-slate-400"><Volume2 size={18}/></button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded border border-white/5 cursor-pointer hover:bg-white/20">
                                            {selectedVersion?.variants[0]?.resolution || '4K'}
                                        </span>
                                        <Maximize size={18} className="cursor-pointer hover:text-brand-400"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-[380px] bg-[#0f172a] border-l border-white/5 flex flex-col flex-shrink-0">
                    <div className="flex border-b border-white/5">
                        <button 
                            onClick={() => setActiveTab('comments')}
                            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'comments' ? 'border-brand-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                        >
                            Review ({currentComments.length})
                        </button>
                        <button 
                            onClick={() => setActiveTab('info')}
                            className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-brand-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                        >
                            Info & Deliverables
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-[#0f172a]">
                        {activeTab === 'comments' ? (
                            <div className="flex flex-col min-h-full">
                                {currentComments.length > 0 ? (
                                    <div className="flex-1 p-6 space-y-6">
                                        {currentComments.map(comment => (
                                            <div key={comment.id} className="group flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                                    {comment.userName.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-bold text-white">{comment.userName}</span>
                                                        <span className="text-xs font-mono text-brand-400 cursor-pointer hover:underline">{comment.timecode}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-300 leading-relaxed">{comment.content}</p>
                                                    <div className="mt-2 text-[10px] text-slate-500 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="hover:text-white">Reply</button>
                                                        <button className="hover:text-white">Resolve</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                                        <MessageSquare size={32} className="opacity-20 mb-4"/>
                                        <p className="text-sm">No comments yet.</p>
                                        <p className="text-xs opacity-50 mt-1">Be the first to leave feedback on this version.</p>
                                    </div>
                                )}
                                
                                <div className="p-4 border-t border-white/5 bg-[#1e293b]">
                                    <div className="relative">
                                        <textarea 
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Leave a comment at 00:00:15..."
                                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 pr-10 text-sm text-white placeholder-slate-500 focus:border-brand-500/50 outline-none resize-none h-20"
                                        />
                                        <button 
                                            onClick={handleSendComment}
                                            className={`absolute bottom-3 right-3 p-1.5 rounded-lg transition-colors ${commentText.trim() ? 'bg-brand-500 text-black hover:bg-brand-400' : 'bg-white/10 text-slate-500 cursor-not-allowed'}`}
                                            disabled={!commentText.trim()}
                                        >
                                            <Send size={14} strokeWidth={3}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                                        <FileVideo size={14} className="mr-2"/> Deliverables
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedVersion?.variants && selectedVersion.variants.length > 0 ? selectedVersion.variants.map(variant => (
                                            <div key={variant.id} className="bg-[#1e293b] rounded-xl p-3 border border-white/5 hover:border-brand-500/30 transition-colors group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="text-sm font-bold text-white flex items-center gap-2">
                                                            {variant.label}
                                                        </div>
                                                        <div className="text-xs text-slate-500 mt-0.5 font-mono">
                                                            {variant.resolution} • {variant.codec}
                                                        </div>
                                                    </div>
                                                    <div className="text-xs font-bold text-slate-400 bg-black/30 px-1.5 py-0.5 rounded border border-white/5">
                                                        {variant.size}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-3">
                                                    <button className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs font-bold text-white transition-colors flex items-center justify-center">
                                                        <Download size={12} className="mr-1.5"/> Download
                                                    </button>
                                                    <button className="flex-1 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 rounded text-xs font-bold text-brand-400 transition-colors flex items-center justify-center">
                                                        <Play size={12} className="mr-1.5"/> Preview
                                                    </button>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-sm text-slate-500 italic p-4 border border-dashed border-white/10 rounded-xl text-center">
                                                No specific deliverables rendered for this version yet.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                                        <Settings size={14} className="mr-2"/> Metadata
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <MetaItem label="Duration" value={work.duration} />
                                        <MetaItem label="Frame Rate" value="25.00 fps" />
                                        <MetaItem label="Color Space" value="Rec.709" />
                                        <MetaItem label="Audio" value="Stereo, 48kHz" />
                                        <MetaItem label="Upload Date" value={selectedVersion?.date.split(' ')[0] || '-'} />
                                        <MetaItem label="Uploader" value={selectedVersion?.uploader || '-'} />
                                    </div>
                                    <div className="mt-4">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase">Change Log</label>
                                        <p className="text-sm text-slate-300 mt-1 bg-black/20 p-3 rounded-lg border border-white/5">
                                            {selectedVersion?.changeLog || 'No notes provided.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SUB-VIEWS ---

const SpaceSelector = ({ onSelect }: { onSelect: (s: MediaSpace) => void }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filterType, setFilterType] = useState<SpaceType | 'All'>('All');
    const [sortOption, setSortOption] = useState<'name' | 'date' | 'status'>('date');

    const processedSpaces = useMemo(() => {
        return MOCK_SPACES
            .filter(space => {
                const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    space.description.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesFilter = filterType === 'All' || space.type === filterType;
                return matchesSearch && matchesFilter;
            })
            .sort((a, b) => {
                if (sortOption === 'name') return a.name.localeCompare(b.name);
                if (sortOption === 'status') return a.status === b.status ? 0 : a.status === 'Active' ? -1 : 1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
    }, [searchQuery, filterType, sortOption]);

    return (
        <div className="h-full flex flex-col p-8 md:p-12 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-2">我的空间</h1>
                    <p className="text-slate-400">选择一个工作空间以管理成片资产与交付</p>
                </div>
                <button className="bg-brand-500 hover:bg-brand-400 text-slate-900 px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center shadow-lg shadow-brand-500/20">
                    <Plus size={18} className="mr-2" strokeWidth={3}/> 创建新空间
                </button>
            </div>

            <div className="flex flex-col xl:flex-row justify-between items-center gap-4 mb-8 bg-[#1e293b] p-2 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 w-full xl:w-auto overflow-x-auto no-scrollbar pb-2 xl:pb-0">
                    <div className="relative group w-64 flex-shrink-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="搜索空间名称..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-brand-500/50 outline-none transition-all"
                        />
                    </div>
                    <div className="h-8 w-px bg-white/10 mx-1 flex-shrink-0"></div>
                    <div className="flex p-1 bg-[#0f172a] rounded-xl border border-white/5 flex-shrink-0">
                        {(['All', 'Project', 'Department', 'Delivery'] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type as any)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    filterType === type 
                                    ? 'bg-white/10 text-white shadow-sm' 
                                    : 'text-slate-500 hover:text-white'
                                }`}
                            >
                                {type === 'All' ? '全部' : type === 'Project' ? '项目' : type === 'Department' ? '部门' : '交付'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
                    <div className="relative group flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:block">排序</label>
                        <div className="relative">
                            <select 
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value as any)}
                                className="appearance-none bg-[#0f172a] border border-white/10 text-slate-300 text-sm font-bold pl-3 pr-8 py-2 rounded-xl focus:outline-none focus:border-brand-500/50 cursor-pointer hover:bg-[#1e293b] transition-colors"
                            >
                                <option value="date">创建时间</option>
                                <option value="name">空间名称</option>
                                <option value="status">空间状态</option>
                            </select>
                            <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        </div>
                    </div>
                    <div className="h-8 w-px bg-white/10 mx-1"></div>
                    <div className="flex bg-[#0f172a] rounded-xl p-1 border border-white/5">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-brand-400' : 'text-slate-500 hover:text-white'}`}><Grid size={16}/></button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-brand-400' : 'text-slate-500 hover:text-white'}`}><List size={16}/></button>
                    </div>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {processedSpaces.map(space => (
                        <div 
                            key={space.id}
                            onClick={() => onSelect(space)}
                            className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-brand-500/50 transition-all hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] bg-[#0f172a] flex flex-col"
                        >
                            <div className={`h-24 w-full bg-gradient-to-r ${space.themeColor} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                            <div className={`absolute top-12 left-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${space.themeColor} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                                <LayoutGrid size={32} />
                            </div>
                            <div className="absolute top-4 right-4">
                                {space.status === 'Archived' && (
                                    <span className="px-2 py-1 rounded bg-black/40 backdrop-blur text-[10px] font-bold text-slate-300 border border-white/10 flex items-center">
                                        <Archive size={10} className="mr-1"/> Archived
                                    </span>
                                )}
                            </div>
                            <div className="pt-8 px-6 pb-6 flex-1 flex flex-col justify-end">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors truncate">{space.name}</h3>
                                    </div>
                                    <p className="text-sm text-slate-400 mb-6 line-clamp-1">{space.description}</p>
                                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center">
                                                {space.type === 'Project' ? <Briefcase size={12} className="mr-1"/> : space.type === 'Delivery' ? <Truck size={12} className="mr-1"/> : <Users size={12} className="mr-1"/>}
                                                {space.type}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                            <span className="flex items-center">
                                                <Calendar size={12} className="mr-1"/>
                                                {space.createdAt.substring(5)}
                                            </span>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-black transition-all">
                                            <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="h-64 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 hover:text-white hover:border-brand-500/30 hover:bg-white/5 transition-all cursor-pointer group">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                            <Plus size={32} />
                        </div>
                        <span className="font-bold">创建新空间</span>
                    </div>
                </div>
            ) : (
                <div className="bg-[#1e293b] rounded-2xl border border-white/5 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#0f172a] text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 w-12">#</th>
                                <th className="px-6 py-4">空间名称 / 描述</th>
                                <th className="px-6 py-4">类型</th>
                                <th className="px-6 py-4">存储用量</th>
                                <th className="px-6 py-4">成员</th>
                                <th className="px-6 py-4">创建时间</th>
                                <th className="px-6 py-4 text-right">状态</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {processedSpaces.map((space, index) => (
                                <tr 
                                    key={space.id} 
                                    onClick={() => onSelect(space)}
                                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${space.themeColor} flex items-center justify-center text-white shadow-sm`}>
                                                <LayoutGrid size={18} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white group-hover:text-brand-400 transition-colors">{space.name}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">{space.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                                            space.type === 'Project' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                            space.type === 'Delivery' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                        }`}>
                                            {space.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-slate-300">
                                            <HardDrive size={14} className="mr-2 text-slate-500"/>
                                            {space.storageUsed}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-slate-300">
                                            <Users size={14} className="mr-2 text-slate-500"/>
                                            {space.memberCount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-slate-400 font-mono">{space.createdAt}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-block w-2 h-2 rounded-full ${space.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-600'}`}></span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const WorkspaceView = ({ space, onExit }: { space: MediaSpace, onExit: () => void }) => {
    const [folders, setFolders] = useState<MediaFolder[]>(MOCK_FOLDERS);
    const [works, setWorks] = useState<MasterWork[]>(MOCK_WORKS);
    const [shares, setShares] = useState<ShareLinkRecord[]>(MOCK_SHARES);
    const [customCollections, setCustomCollections] = useState<{id: string, name: string}[]>([]);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'Assets' | 'ShareLinks' | 'Collection'>('Assets');
    const [selectedWork, setSelectedWork] = useState<MasterWork | null>(null);
    const [sharingWork, setSharingWork] = useState<MasterWork | null>(null);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [viewSettings, setViewSettings] = useState<ViewSettings>({
        layout: 'grid', cardSize: 'M', aspectRatio: '16:9', scale: 'Fill', showInfo: true, titleLines: 1
    });
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'date', direction: 'desc', label: '创建时间 (新到旧)'
    });
    const [visibleFields, setVisibleFields] = useState<string[]>(['status', 'duration', 'size']);
    const [openMenu, setOpenMenu] = useState<'appearance' | 'fields' | 'sort' | null>(null);
    const [sidebarSections, setSidebarSections] = useState({
        assets: { title: '成片资产', height: 320, expanded: true },
        collections: { title: '智能选集', height: 200, expanded: true },
        distribution: { title: '分享记录', height: 180, expanded: true }
    });
    const [toast, setToast] = useState<{message: string, type: 'success' | 'info' | 'loading'} | null>(null);
    const uploadInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = () => setOpenMenu(null);
        if (openMenu) document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [openMenu]);

    const handleResizeStart = (e: React.MouseEvent, sectionKey: keyof typeof sidebarSections) => {
        e.preventDefault(); e.stopPropagation();
        const startY = e.clientY; const startHeight = sidebarSections[sectionKey].height;
        const handleMouseMove = (moveEvent: MouseEvent) => {
            const delta = moveEvent.clientY - startY;
            setSidebarSections(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], height: Math.max(100, startHeight + delta) } }));
        };
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'row-resize';
    };

    const toggleSection = (sectionKey: keyof typeof sidebarSections) => {
        setSidebarSections(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], expanded: !prev[sectionKey].expanded } }));
    };

    const handleCreateFolder = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFolders(prev => [...prev, { id: `new_f_${Date.now()}`, spaceId: space.id, name: '新建文件夹', parentId: currentFolderId, createdAt: new Date().toISOString().split('T')[0] }]);
        if (!sidebarSections.assets.expanded) toggleSection('assets');
    };
    const handleCreateCollection = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCustomCollections(prev => [...prev, { id: `c_${Date.now()}`, name: '新建选集' }]);
        if (!sidebarSections.collections.expanded) toggleSection('collections');
    };
    const handleCreateShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newShare: ShareLinkRecord = { id: `s_${Date.now()}`, spaceId: space.id, workId: 'demo-1', workTitle: '新创建的分享', workCover: 'https://picsum.photos/800/450', versionTag: 'V1', url: `https://f.io/${Math.random().toString(36).substring(7)}`, views: 0, downloads: 0, status: 'Active', createdAt: new Date().toISOString().split('T')[0], expiresAt: null, creator: 'Me' };
        setShares(prev => [newShare, ...prev]);
        setActiveView('ShareLinks');
        if (!sidebarSections.distribution.expanded) toggleSection('distribution');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setToast({ message: `Uploading ${file.name}...`, type: 'loading' });
            
            // Simulate Upload
            setTimeout(() => {
                const newWork: MasterWork = {
                    id: `w_${Date.now()}`,
                    spaceId: space.id,
                    folderId: currentFolderId,
                    title: file.name,
                    coverImage: '', // No thumbnail for mock upload
                    duration: '00:00',
                    producer: 'Admin',
                    status: 'Internal',
                    year: new Date().getFullYear(),
                    category: 'Short',
                    tags: [],
                    versions: [{
                        id: `v_${Date.now()}`,
                        versionTag: 'V1',
                        date: new Date().toLocaleString(),
                        uploader: 'Admin',
                        changeLog: 'Initial Upload',
                        isCurrent: true,
                        variants: [],
                        comments: []
                    }]
                };
                setWorks(prev => [newWork, ...prev]);
                setToast({ message: 'Upload Complete', type: 'success' });
            }, 1500);
        }
    };

    const handleShareCreate = (url: string) => {
        if (!sharingWork) return;
        const newShare: ShareLinkRecord = { 
            id: `s_${Date.now()}`, 
            spaceId: space.id, 
            workId: sharingWork.id, 
            workTitle: sharingWork.title, 
            workCover: sharingWork.coverImage || 'https://picsum.photos/800/450', 
            versionTag: sharingWork.versions.find(v => v.isCurrent)?.versionTag || 'V1', 
            url: url, 
            views: 0, 
            downloads: 0, 
            status: 'Active', 
            createdAt: new Date().toISOString().split('T')[0], 
            expiresAt: null, 
            creator: 'Admin' 
        };
        setShares(prev => [newShare, ...prev]);
        setSharingWork(null);
        setToast({ message: 'Link copied to clipboard', type: 'success' });
    };

    const handleAddComment = (versionId: string, text: string, time: string) => {
        if (!selectedWork) return;
        
        const newComment: Comment = {
            id: `c_${Date.now()}`,
            userId: 'me',
            userName: 'Admin User',
            content: text,
            timestamp: 'Just now',
            timecode: time
        };

        // Update works state deeply
        const updatedWorks = works.map(w => {
            if (w.id === selectedWork.id) {
                const updatedVersions = w.versions.map(v => {
                    if (v.id === versionId) {
                        return {
                            ...v,
                            comments: [newComment, ...(v.comments || [])]
                        };
                    }
                    return v;
                });
                // Update selectedWork state as well to reflect immediately in Workbench
                const updatedWork = { ...w, versions: updatedVersions };
                setSelectedWork(updatedWork);
                return updatedWork;
            }
            return w;
        });

        setWorks(updatedWorks);
        setToast({ message: 'Comment added', type: 'info' });
    };

    const spaceFolders = folders.filter(f => f.spaceId === space.id);
    const spaceWorks = works.filter(w => w.spaceId === space.id);
    const spaceShares = shares.filter(s => s.spaceId === space.id);
    const currentFolders = spaceFolders.filter(f => f.parentId === currentFolderId);
    const currentFiles = spaceWorks.filter(w => w.folderId === currentFolderId);

    const sortedItems = useMemo(() => {
        const fList = [...currentFolders].sort((a, b) => a.name.localeCompare(b.name));
        const files = [...currentFiles].sort((a, b) => {
            let res = 0;
            switch(sortConfig.key) {
                case 'name': res = a.title.localeCompare(b.title); break;
                case 'date': 
                    const da = a.versions[0]?.date || '0';
                    const db = b.versions[0]?.date || '0';
                    res = da.localeCompare(db);
                    break;
                case 'status': res = a.status.localeCompare(b.status); break;
                case 'duration': res = a.duration.localeCompare(b.duration); break;
                default: res = 0;
            }
            return sortConfig.direction === 'asc' ? res : -res;
        });
        return [...fList.map(f => ({ type: 'folder' as const, data: f })), ...files.map(f => ({ type: 'file' as const, data: f }))];
    }, [currentFolders, currentFiles, sortConfig]);

    const getBreadcrumbs = () => {
        const path: { id: string | null; name: string }[] = [{ id: null, name: 'Root' }];
        if (!currentFolderId) return path;
        const buildPath = (id: string) => {
            const folder = spaceFolders.find(f => f.id === id);
            if (folder) {
                if (folder.parentId) buildPath(folder.parentId);
                path.push({ id: folder.id, name: folder.name });
            }
        };
        buildPath(currentFolderId);
        return path;
    };
    const rootFolders = spaceFolders.filter(f => f.parentId === null);
    const getGridColsClass = () => {
        switch(viewSettings.cardSize) {
            case 'S': return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8';
            case 'L': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
            case 'M': default: return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6';
        }
    };
    const handleShare = (work: MasterWork) => setSharingWork(work);

    return (
        <div className="flex h-full overflow-hidden bg-[#020617] animate-in fade-in zoom-in-95 duration-300 relative">
            {toast && createPortal(<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />, document.body)}
            
            <aside className={`flex-shrink-0 bg-[#0f172a]/50 border-r border-white/5 flex flex-col transition-all duration-300 ${sidebarExpanded ? 'w-64' : 'w-0 opacity-0 overflow-hidden'}`}>
                <div className="p-4 flex items-center gap-2 border-b border-white/5 flex-shrink-0">
                    <button onClick={onExit} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="返回空间列表"><LogOut size={16} className="rotate-180" /></button>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-bold text-white truncate">{space.name}</h2>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center"><span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${space.themeColor} mr-1.5`}></span>{space.storageUsed} Used</div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
                    <div className="border-b border-white/5 flex flex-col flex-shrink-0">
                        <div className="px-3 py-2 flex justify-between items-center text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer select-none group transition-colors" onClick={() => toggleSection('assets')}>
                            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">{sidebarSections.assets.expanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}{sidebarSections.assets.title}</span>
                            <button onClick={handleCreateFolder} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-brand-400 transition-all opacity-0 group-hover:opacity-100"><Plus size={14} /></button>
                        </div>
                        {sidebarSections.assets.expanded && (
                            <div className="relative" style={{ height: sidebarSections.assets.height }}>
                                <div className="absolute inset-0 overflow-y-auto no-scrollbar p-2 space-y-0.5">
                                    <SidebarItem icon={<FileVideo size={16} className="text-brand-400"/>} label="All Projects" active={activeView === 'Assets' && currentFolderId === null} onClick={() => { setActiveView('Assets'); setCurrentFolderId(null); }}/>
                                    <div className="ml-0 space-y-0.5 border-l border-white/5 pl-2 my-1">
                                        {rootFolders.map(folder => (<SidebarItem key={folder.id} icon={<Folder size={16} className={currentFolderId === folder.id ? "text-brand-400 fill-brand-400/20" : "text-slate-500 fill-slate-500/20"}/>} label={folder.name} active={currentFolderId === folder.id} onClick={() => { setActiveView('Assets'); setCurrentFolderId(folder.id); }}/>))}
                                    </div>
                                    <SidebarItem icon={<Trash2 size={16}/>} label="Recently Deleted" active={false}/>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1.5 hover:bg-brand-500/50 cursor-row-resize z-10 transition-colors" onMouseDown={(e) => handleResizeStart(e, 'assets')}></div>
                            </div>
                        )}
                    </div>
                    <div className="border-b border-white/5 flex flex-col flex-shrink-0">
                        <div className="px-3 py-2 flex justify-between items-center text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer select-none group transition-colors" onClick={() => toggleSection('collections')}>
                            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">{sidebarSections.collections.expanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}{sidebarSections.collections.title}</span>
                            <button onClick={handleCreateCollection} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-brand-400 transition-all opacity-0 group-hover:opacity-100"><Plus size={14} /></button>
                        </div>
                        {sidebarSections.collections.expanded && (
                            <div className="relative" style={{ height: sidebarSections.collections.height }}>
                                <div className="absolute inset-0 overflow-y-auto no-scrollbar p-2 space-y-0.5">
                                    <SidebarItem icon={<List size={16}/>} label="All Collections" />
                                    <SidebarItem icon={<Eye size={16}/>} label="Needs Review" badge="3" badgeColor="red" />
                                    <SidebarItem icon={<CheckCircle size={16}/>} label="Approved" badge="12" badgeColor="green" />
                                    {customCollections.length > 0 && (<div className="pt-2 mt-2 border-t border-white/5">{customCollections.map(col => (<SidebarItem key={col.id} icon={<LayoutGrid size={16}/>} label={col.name} />))}</div>)}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1.5 hover:bg-brand-500/50 cursor-row-resize z-10 transition-colors" onMouseDown={(e) => handleResizeStart(e, 'collections')}></div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col flex-shrink-0">
                        <div className="px-3 py-2 flex justify-between items-center text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer select-none group transition-colors" onClick={() => toggleSection('distribution')}>
                            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">{sidebarSections.distribution.expanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}{sidebarSections.distribution.title}</span>
                            <button onClick={handleCreateShare} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-brand-400 transition-all opacity-0 group-hover:opacity-100"><Plus size={14} /></button>
                        </div>
                        {sidebarSections.distribution.expanded && (
                            <div className="relative" style={{ height: sidebarSections.distribution.height }}>
                                <div className="absolute inset-0 overflow-y-auto no-scrollbar p-2 space-y-0.5">
                                    <SidebarItem icon={<Globe size={16}/>} label="Share Links" active={activeView === 'ShareLinks'} onClick={() => setActiveView('ShareLinks')} badge={spaceShares.length.toString()}/>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1.5 hover:bg-brand-500/50 cursor-row-resize z-10 transition-colors" onMouseDown={(e) => handleResizeStart(e, 'distribution')}></div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 bg-[#020617] relative">
                <button onClick={() => setSidebarExpanded(!sidebarExpanded)} className={`absolute top-4 z-20 p-1.5 rounded-lg bg-[#1e293b] border border-white/10 text-slate-400 hover:text-white transition-all ${sidebarExpanded ? '-left-3' : 'left-4'}`} title={sidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}>{sidebarExpanded ? <ChevronRight size={14} className="rotate-180"/> : <Menu size={16}/>}</button>
                <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 flex-shrink-0 bg-[#020617]">
                    <div className={`flex items-center min-w-0 flex-1 mr-4 transition-all duration-300 ${sidebarExpanded ? 'pl-2' : 'pl-10'}`}>
                        {activeView === 'ShareLinks' ? (<h2 className="text-lg font-bold text-white flex items-center gap-2"><Globe size={18} className="text-brand-400"/> Share Links</h2>) : (
                            <nav className="flex items-center text-sm font-medium text-slate-400">
                                {getBreadcrumbs().map((crumb, idx, arr) => (<React.Fragment key={crumb.id || 'root'}><button onClick={() => setCurrentFolderId(crumb.id)} className={`hover:text-white transition-colors flex items-center ${idx === arr.length - 1 ? 'text-white' : ''}`}>{idx === 0 && <span className="mr-2 opacity-50">{space.name}:</span>}{crumb.name}{idx === arr.length - 1 && <ChevronDown size={14} className="ml-1 opacity-50"/>}</button>{idx < arr.length - 1 && <span className="mx-2 opacity-30">/</span>}</React.Fragment>))}
                            </nav>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative group mr-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white" size={14} />
                            <input type="text" placeholder="Search" className="bg-white/5 border border-white/10 rounded-full pl-9 pr-3 py-1.5 text-xs text-white focus:border-white/20 outline-none w-32 transition-all focus:w-48 placeholder-slate-600 hover:bg-white/10"/>
                        </div>
                        
                        <input 
                            type="file" 
                            ref={uploadInputRef} 
                            className="hidden" 
                            onChange={handleFileUpload}
                        />
                        <button 
                            onClick={() => uploadInputRef.current?.click()}
                            className="bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-white/10 flex items-center"
                        >
                            <Upload size={14} className="mr-2"/> New Asset
                        </button>

                        <button onClick={() => { if (currentFiles.length > 0) handleShare(currentFiles[0]); }} className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-brand-500/20 flex items-center ml-2"><LinkIcon size={14} className="mr-2"/> Share</button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-6" onClick={() => setSelectedWork(null)}>
                    {activeView === 'Assets' ? (
                        <>
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1 sticky top-0 bg-[#020617] z-30 pb-2">
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'appearance' ? null : 'appearance'); }} className={`hover:text-white cursor-pointer flex items-center px-2 py-1 rounded transition-colors ${openMenu === 'appearance' ? 'bg-white/10 text-brand-400' : ''}`}><LayoutGrid size={14} className="mr-1.5"/> 视图设置</button>
                                        {openMenu === 'appearance' && (
                                            <div className="absolute top-full left-0 mt-2 w-64 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-400">布局</span><div className="flex bg-[#0f172a] rounded-lg p-0.5"><button onClick={() => setViewSettings(s => ({...s, layout: 'grid'}))} className={`p-1.5 rounded ${viewSettings.layout === 'grid' ? 'bg-white/10 text-brand-400' : 'text-slate-500'}`}><Grid size={14}/></button><button onClick={() => setViewSettings(s => ({...s, layout: 'list'}))} className={`p-1.5 rounded ${viewSettings.layout === 'list' ? 'bg-white/10 text-brand-400' : 'text-slate-500'}`}><List size={14}/></button></div></div>
                                                    <div className="space-y-2"><span className="text-xs font-bold text-slate-400">卡片大小</span><div className="flex bg-[#0f172a] rounded-lg p-0.5">{(['S', 'M', 'L'] as const).map(size => (<button key={size} onClick={() => setViewSettings(s => ({...s, cardSize: size}))} className={`flex-1 py-1 text-[10px] font-bold rounded ${viewSettings.cardSize === size ? 'bg-white/10 text-brand-400' : 'text-slate-500'}`}>{size}</button>))}</div></div>
                                                    <div className="space-y-2"><span className="text-xs font-bold text-slate-400">封面比例</span><div className="flex bg-[#0f172a] rounded-lg p-0.5"><button onClick={() => setViewSettings(s => ({...s, aspectRatio: '16:9'}))} className={`flex-1 py-1 text-[10px] font-bold rounded ${viewSettings.aspectRatio === '16:9' ? 'bg-white/10 text-brand-400' : 'text-slate-500'}`}>16:9</button><button onClick={() => setViewSettings(s => ({...s, aspectRatio: '1:1'}))} className={`flex-1 py-1 text-[10px] font-bold rounded ${viewSettings.aspectRatio === '1:1' ? 'bg-white/10 text-brand-400' : 'text-slate-500'}`}>1:1</button><button onClick={() => setViewSettings(s => ({...s, aspectRatio: '9:16'}))} className={`flex-1 py-1 text-[10px] font-bold rounded ${viewSettings.aspectRatio === '9:16' ? 'bg-white/10 text-brand-400' : 'text-slate-500'}`}>9:16</button></div></div>
                                                    <div className="space-y-2"><span className="text-xs font-bold text-slate-400">缩放模式</span><div className="flex bg-[#0f172a] rounded-lg p-0.5"><button onClick={() => setViewSettings(s => ({...s, scale: 'Fit'}))} className={`flex-1 py-1 text-[10px] font-bold rounded ${viewSettings.scale === 'Fit' ? 'bg-white/10 text-brand-400' : 'text-slate-500'}`}>适应 (Fit)</button><button onClick={() => setViewSettings(s => ({...s, scale: 'Fill'}))} className={`flex-1 py-1 text-[10px] font-bold rounded ${viewSettings.scale === 'Fill' ? 'bg-white/10 text-brand-400' : 'text-slate-500'}`}>填充 (Fill)</button></div></div>
                                                    <div className="flex items-center justify-between pt-2 border-t border-white/5"><span className="text-xs font-bold text-slate-400">显示卡片信息</span><button onClick={() => setViewSettings(s => ({...s, showInfo: !s.showInfo}))} className={`w-9 h-5 rounded-full p-1 transition-colors ${viewSettings.showInfo ? 'bg-brand-500' : 'bg-slate-700'}`}><div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${viewSettings.showInfo ? 'translate-x-4' : ''}`}></div></button></div>
                                                    <div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-400">标题行数</span><select className="bg-[#0f172a] text-white text-[10px] rounded px-2 py-1 outline-none border border-white/10" value={viewSettings.titleLines} onChange={(e) => setViewSettings(s => ({...s, titleLines: parseInt(e.target.value)}))}><option value={1}>1 行</option><option value={2}>2 行</option><option value={100}>全部显示</option></select></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'fields' ? null : 'fields'); }} className={`hover:text-white cursor-pointer flex items-center px-2 py-1 rounded transition-colors ${openMenu === 'fields' ? 'bg-white/10 text-brand-400' : ''}`}><SlidersHorizontal size={14} className="mr-1.5"/> 字段显示</button>
                                        {openMenu === 'fields' && (
                                            <div className="absolute top-full left-0 mt-2 w-56 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
                                                <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">{AVAILABLE_FIELDS.map(field => (<div key={field.key} className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer" onClick={() => setVisibleFields(prev => prev.includes(field.key) ? prev.filter(k => k !== field.key) : [...prev, field.key])}><div className="flex items-center text-xs text-slate-300"><div className={`w-3 h-3 rounded-sm border mr-2 flex items-center justify-center ${visibleFields.includes(field.key) ? 'bg-brand-500 border-brand-500' : 'border-slate-500'}`}>{visibleFields.includes(field.key) && <Check size={10} className="text-black"/>}</div>{field.label}</div></div>))}</div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'sort' ? null : 'sort'); }} className={`hover:text-white cursor-pointer flex items-center px-2 py-1 rounded transition-colors ${openMenu === 'sort' ? 'bg-white/10 text-brand-400' : ''}`}><ArrowUpDown size={14} className="mr-1.5"/> 排序方式: {sortConfig.label}</button>
                                        {openMenu === 'sort' && (
                                            <div className="absolute top-full left-0 mt-2 w-56 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
                                                <div className="p-2 text-xs font-bold text-slate-500 uppercase tracking-wider">排序依据</div>
                                                {[{ key: 'name', label: '名称' }, { key: 'date', label: '创建时间' }, { key: 'size', label: '大小' }, { key: 'status', label: '状态' }, { key: 'duration', label: '时长' }].map((opt) => (<button key={opt.key} onClick={() => { setSortConfig(prev => ({ key: opt.key as any, direction: prev.key === opt.key && prev.direction === 'desc' ? 'asc' : 'desc', label: opt.label })); }} className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-lg flex items-center justify-between group"><span>{opt.label}</span>{sortConfig.key === opt.key && (sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-brand-400"/> : <ArrowDown size={12} className="text-brand-400"/>)}</button>))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2"><Plus size={14} className="hover:text-white cursor-pointer"/></div>
                            </div>
                            {viewSettings.layout === 'grid' ? (
                                <div className={`grid gap-4 ${getGridColsClass()}`}>
                                    {sortedItems.map((item: any) => {
                                        if (item.type === 'folder') {
                                            return <FolderCard key={item.data.id} folder={item.data} settings={viewSettings} onDoubleClick={() => setCurrentFolderId(item.data.id)}/>;
                                        } else {
                                            return <FileCard key={item.data.id} work={item.data} settings={viewSettings} onDoubleClick={(e) => { e.stopPropagation(); setSelectedWork(item.data); }} onShare={() => handleShare(item.data)}/>;
                                        }
                                    })}
                                    {sortedItems.length === 0 && (<div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-white/5 rounded-2xl"><FolderPlus size={48} className="opacity-20 mb-4"/><p className="text-sm font-bold">空空如也</p><p className="text-xs mt-1 opacity-50">该文件夹下暂无文件，拖拽文件至此上传</p></div>)}
                                </div>
                            ) : (
                                <div className="bg-[#1e293b] border border-white/5 rounded-xl overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-[#0f172a] text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-white/5">
                                            <tr><th className="px-4 py-3 w-10">Icon</th><th className="px-4 py-3">名称</th>{visibleFields.includes('status') && <th className="px-4 py-3">状态</th>}{visibleFields.includes('date') && <th className="px-4 py-3">日期</th>}{visibleFields.includes('duration') && <th className="px-4 py-3">时长</th>}{visibleFields.includes('size') && <th className="px-4 py-3">大小</th>}{visibleFields.includes('producer') && <th className="px-4 py-3">制作人</th>}<th className="px-4 py-3 w-10"></th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {sortedItems.map((item: any) => {
                                                const isFolder = item.type === 'folder';
                                                const data = item.data;
                                                return (
                                                    <tr key={data.id} className="hover:bg-white/5 transition-colors cursor-pointer group" onDoubleClick={() => isFolder ? setCurrentFolderId(data.id) : setSelectedWork(data)}>
                                                        <td className="px-4 py-3 text-slate-400">{isFolder ? <Folder size={18} className="text-blue-400 fill-blue-400/20"/> : <FileVideo size={18} className="text-brand-400"/>}</td>
                                                        <td className="px-4 py-3 font-medium text-slate-200">{isFolder ? data.name : data.title}</td>
                                                        {visibleFields.includes('status') && (<td className="px-4 py-3">{!isFolder && (<span className={`px-2 py-0.5 rounded text-[10px] border ${data.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' : data.status === 'Revision' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>{data.status}</span>)}</td>)}
                                                        {visibleFields.includes('date') && <td className="px-4 py-3 text-xs text-slate-500 font-mono">{isFolder ? data.createdAt : data.versions[0]?.date.split(' ')[0]}</td>}
                                                        {visibleFields.includes('duration') && <td className="px-4 py-3 text-xs text-slate-500 font-mono">{!isFolder ? data.duration : '-'}</td>}
                                                        {visibleFields.includes('size') && <td className="px-4 py-3 text-xs text-slate-500 font-mono">{!isFolder ? data.versions[0]?.variants[0]?.size : '-'}</td>}
                                                        {visibleFields.includes('producer') && <td className="px-4 py-3 text-xs text-slate-500">{!isFolder ? data.producer : '-'}</td>}
                                                        <td className="px-4 py-3 text-center relative"><button onClick={(e) => { e.stopPropagation(); handleShare(data); }} className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded"><LinkIcon size={16}/></button></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    ) : (
                        <ShareLinksView shares={spaceShares} />
                    )}
                </div>
            </main>

            {selectedWork && createPortal(
                <Workbench work={selectedWork} onClose={() => setSelectedWork(null)} onAddComment={handleAddComment} />,
                document.body
            )}
            
            {sharingWork && createPortal(
                <ShareModal work={sharingWork} onClose={() => setSharingWork(null)} onCreate={handleShareCreate} />,
                document.body
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---

export const MasterWorks: React.FC = () => {
    const [currentSpace, setCurrentSpace] = useState<MediaSpace | null>(null);
    const { setCollapsed } = useContext(LayoutContext);

    useEffect(() => {
        setCollapsed(!!currentSpace);
    }, [currentSpace, setCollapsed]);

    if (!currentSpace) {
        return <SpaceSelector onSelect={setCurrentSpace} />;
    }

    return (
        <WorkspaceView 
            space={currentSpace} 
            onExit={() => setCurrentSpace(null)} 
        />
    );
};