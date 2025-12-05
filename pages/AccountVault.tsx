import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Shield, Copy, Eye, EyeOff, Lock, Smartphone, Plus, 
  Server, Video, Box, CreditCard, History, X, 
  Key, ExternalLink, Search, Globe, Users, FileText, Check, Settings,
  ShieldAlert, User, Trash2, Save, Unlock, AlertTriangle, RefreshCw, MessageCircle, PhoneCall
} from 'lucide-react';
import { AccountItem, AccountCategory, AccountAuditLog } from '../types';
import { MOCK_SIMS, MOCK_DEVICES } from './MobileManager';

// Domain Mapping for logo lookup when URL is missing
const PLATFORM_DOMAINS: Record<string, string> = {
    '微信': 'weixin.qq.com',
    'WeChat': 'weixin.qq.com',
    '百度': 'baidu.com',
    'QQ': 'qq.com',
    '微博': 'weibo.com',
    '抖音': 'douyin.com',
    '小红书': 'xiaohongshu.com',
    '新片场': 'xinpianchang.com',
    '优酷': 'youku.com',
    '知乎': 'zhihu.com',
    '制片帮': 'zhipianbang.com',
    '数英': 'digitaling.com',
    'B站': 'bilibili.com',
    '哔哩': 'bilibili.com',
    'Github': 'github.com',
    '腾讯': 'tencent.com',
    '阿里': 'aliyun.com',
    '淘宝': 'taobao.com',
    '火山': 'volcengine.com',
    '支付宝': 'alipay.com',
    '58': '58.com',
    '智联': 'zhaopin.com',
    '海投': 'haitou.cc',
    '刺猬': 'ciwei.net',
    '携程': 'ctrip.com',
    'Paypal': 'paypal.com',
    '京东': 'jd.com',
    '工信部': 'miit.gov.cn',
    '版权': 'ccopyright.com.cn',
    '法院': 'court.gov.cn',
    '税务': 'chinatax.gov.cn',
    '商标': 'cnipa.gov.cn',
    'Cursor': 'cursor.com',
    '魔狼': 'molang.lol',
    '白月光': 'okjc.org',
    'NAS': 'synology.com',
    '内网': 'tp-link.com.cn', // Generic router icon
};

// Mock Data Generator
const generateLogs = (count: number): AccountAuditLog[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `log-${i}`,
    action: i === 0 ? '查看了密码' : '更新了信息',
    user: i === 0 ? 'Admin' : 'System',
    timestamp: `2024-12-${30 - i} 10:${30 + i}`,
    type: i === 0 ? 'security' : 'info'
  }));
};

// VIRTUAL MOCK DATA (Replaced Real Data)
const INITIAL_ACCOUNTS: AccountItem[] = [
  // --- General (综合平台) ---
  { id: 'g2', category: 'General', platform: '百度网盘', name: '公共资源库', username: 'company_public', password: 'CloudDisk@2024', linkedPhone: '13800138000', linkedEmail: 'admin@company.com', loginMethod: '手机号, 账密', contactPerson: 'IT部', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  
  // --- Content (内容平台) ---
  { id: 'c1', category: 'Content', platform: '微信公众号', name: '公司订阅号', username: 'company_media', password: 'WeChat@Admin', linkedPhone: '13800138000', linkedEmail: 'media@company.com', loginMethod: '扫码', url: 'https://mp.weixin.qq.com', contactPerson: '新媒体运营', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(5) },
  { id: 'c3', category: 'Content', platform: '抖音', name: '品牌大号 (200w粉)', username: 'brand_douyin', password: 'Douyin#Mega', linkedPhone: '13800138001', linkedEmail: '', loginMethod: '手机号', url: 'https://www.douyin.com', contactPerson: '短视频组长', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(8) },
  
  // --- IT (IT设施) ---
  { id: 'i2', category: 'IT', platform: '阿里云', name: '生产环境服务器', username: 'aliyun_prod_admin', password: 'AliCloud@Prod!', linkedPhone: '13800138003', linkedEmail: 'ops@company.com', loginMethod: 'MFA', url: 'https://account.aliyun.com', contactPerson: '运维总监', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(15) },
  { id: 'i1', category: 'IT', platform: 'Github', name: '开发团队代码库', username: 'dev_team', password: 'GitSecureToken!', linkedPhone: '', linkedEmail: 'dev@company.com', loginMethod: 'Token', url: 'https://github.com', contactPerson: 'CTO', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(10) },

  // --- Admin (人事行政) ---
  { id: 'a1', category: 'Admin', platform: '智联招聘', name: '企业招聘账号', username: 'hr_recruiting', password: 'HR_Zhaopin2024', linkedPhone: '13800138004', linkedEmail: 'hr@company.com', loginMethod: '手机号', url: 'https://passport.zhaopin.com', contactPerson: 'HRBP', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(4) },

  // --- Finance (财务法务) ---
  { id: 'f1', category: 'Finance', platform: '企业支付宝', name: '公司账户', username: 'finance@company.com', password: 'AliPay@Finance!', linkedPhone: '13800138005', linkedEmail: 'finance@company.com', loginMethod: '手机号', url: 'https://b.alipay.com', contactPerson: '财务总监', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(20) },
];

export const AccountVault: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountItem[]>(INITIAL_ACCOUNTS);
  const [activeTab, setActiveTab] = useState<AccountCategory | 'All'>('All');
  const [selectedAccount, setSelectedAccount] = useState<AccountItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editTarget, setEditTarget] = useState<Partial<AccountItem> | null>(null);

  // CRUD Handlers
  const handleCreate = () => {
    setEditTarget({}); // Empty object for new account
    setIsEditing(true);
  };

  const handleEdit = (account: AccountItem) => {
    setEditTarget(account);
    setIsEditing(true);
    // Close detail view if open, or keep it open and refresh after save
    // For simplicity, we can close the detail drawer when editing starts
    setSelectedAccount(null); 
  };

  const handleSave = (accountData: Partial<AccountItem>) => {
    if (accountData.id) {
      // Update existing
      setAccounts(prev => prev.map(acc => acc.id === accountData.id ? { ...acc, ...accountData } as AccountItem : acc));
    } else {
      // Create new
      const newAccount = {
        ...accountData,
        id: `new-${Date.now()}`,
        status: 'Normal',
        auditLogs: [],
      } as AccountItem;
      setAccounts(prev => [newAccount, ...prev]);
    }
    setIsEditing(false);
    setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要彻底删除该账号吗？此操作不可恢复。')) {
      setAccounts(prev => prev.filter(acc => acc.id !== id));
      setIsEditing(false);
      setEditTarget(null);
      setSelectedAccount(null);
    }
  };

  // KPIs
  const total = accounts.length;
  const highRisk = accounts.filter(a => a.riskLevel === 'High').length;
  const normal = accounts.filter(a => a.status === 'Normal').length;
  const healthScore = total > 0 ? Math.round((normal / total) * 100) : 100;

  const filteredAccounts = accounts.filter(acc => {
    const matchesTab = activeTab === 'All' || acc.category === activeTab;
    const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          acc.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          acc.username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-full mx-auto pb-10 px-4">
      {/* Header & KPIs */}
      <div className="flex flex-col gap-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">账号保险箱</h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
              <Shield size={14} className="text-green-400" />
              当前托管 {total} 个企业账号 · 审计日志开启
            </p>
          </div>
          <button 
            onClick={handleCreate}
            className="bg-brand-500 hover:bg-brand-400 text-slate-900 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center hover:scale-105 active:scale-95"
          >
            <Plus size={18} className="mr-2" strokeWidth={3} /> 托管新账号
          </button>
        </div>

        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <KPICard 
             label="系统健康度" 
             value={healthScore} 
             unit="分" 
             icon={<Shield size={20}/>} 
             color={healthScore > 90 ? 'green' : 'orange'} 
           />
           <KPICard 
             label="高危核心账号" 
             value={highRisk} 
             unit="个" 
             icon={<ShieldAlert size={20}/>} 
             color={highRisk > 0 ? 'red' : 'slate'} 
           />
           <KPICard 
             label="服务器/IT设施" 
             value={accounts.filter(a => a.category === 'IT').length} 
             unit="个" 
             icon={<Server size={20}/>} 
             color="blue" 
           />
           <KPICard 
             label="财务与法务" 
             value={accounts.filter(a => a.category === 'Finance').length} 
             unit="个" 
             icon={<CreditCard size={20}/>} 
             color="purple" 
           />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Tabs */}
        <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto no-scrollbar">
          {[
            { id: 'All', label: '全部', icon: Box },
            { id: 'General', label: '综合', icon: Box },
            { id: 'Content', label: '内容', icon: Video },
            { id: 'IT', label: 'IT', icon: Server },
            { id: 'Admin', label: '行政', icon: Users },
            { id: 'Finance', label: '财务', icon: FileText },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-white/10 text-white border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                  : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <tab.icon size={12} className="mr-1.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative group w-full md:w-56">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={14} />
           <input 
             type="text" 
             placeholder="搜索账号..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:border-brand-500/50 focus:outline-none transition-all"
           />
        </div>
      </div>

      {/* Cards Grid - Tall Mode */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredAccounts.map(account => (
          <div 
            key={account.id} 
            onClick={() => setSelectedAccount(account)}
            className="glass-card rounded-2xl p-4 flex flex-col h-56 cursor-pointer hover:border-brand-500/50 hover:-translate-y-1 transition-all group relative overflow-hidden"
          >
            {/* Header: Logo & Status */}
            <div className="flex justify-between items-start mb-3">
                 <BrandLogo platform={account.platform} url={account.url} size="md" />
                 <div className={`w-2 h-2 rounded-full ${
                    account.riskLevel === 'High' ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 
                    account.riskLevel === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
                 }`}></div>
            </div>

            {/* Title Info */}
            <div className="mb-4">
                <div className="font-bold text-white text-lg leading-tight truncate" title={account.platform}>{account.platform}</div>
                <div className="text-xs text-slate-500 mt-1 truncate" title={account.name}>{account.name}</div>
            </div>

            {/* Creds Preview Box (Bottom) */}
            <div className="mt-auto bg-black/30 rounded-lg p-2.5 border border-white/5 space-y-2 group-hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2">
                    <User size={10} className="text-slate-600 flex-shrink-0" />
                    <div className="text-[10px] text-slate-300 font-mono truncate">{account.username}</div>
                </div>
                <div className="flex items-center gap-2">
                    <Key size={10} className="text-slate-600 flex-shrink-0" />
                    <div className="text-[10px] text-slate-500 font-mono tracking-widest">••••••</div>
                </div>
            </div>
            
            {/* Hover Hint */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/10">点击查看详情</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Drawer */}
      {selectedAccount && createPortal(
          <DetailDrawer 
            account={selectedAccount} 
            onClose={() => setSelectedAccount(null)} 
            onEdit={() => handleEdit(selectedAccount)} 
          />,
          document.body
      )}

      {/* Create/Edit Modal */}
      {isEditing && createPortal(
          <AccountFormModal 
            initialData={editTarget} 
            onSave={handleSave} 
            onDelete={handleDelete}
            onClose={() => {
                setIsEditing(false); 
                setEditTarget(null);
            }} 
          />,
          document.body
      )}
    </div>
  );
};

// --- Sub-Components ---

const KPICard = ({ label, value, unit, icon, color }: any) => {
    const colors: any = {
        green: 'text-green-400 bg-green-500/10 border-green-500/20',
        red: 'text-red-400 bg-red-500/10 border-red-500/20',
        orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        brand: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
        slate: 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    };
    
    return (
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${colors[color] || colors.slate}`}>
            <div>
                <p className="text-xs font-bold opacity-80 uppercase tracking-wider">{label}</p>
                <div className="text-2xl font-bold mt-1">
                    {value} <span className="text-sm opacity-60 font-medium">{unit}</span>
                </div>
            </div>
            <div className={`p-3 rounded-xl bg-white/5`}>{icon}</div>
        </div>
    );
};

// Updated BrandLogo to accept URL and use Favicons
const BrandLogo = ({ platform, url, size = 'md' }: { platform: string, url?: string, size?: 'sm' | 'md' }) => {
    const [imgError, setImgError] = useState(false);

    // 1. Try to find domain from URL
    let domain = '';
    if (url) {
        try {
            // Handle incomplete URLs like "github.com" by prepending http
            const safeUrl = url.startsWith('http') ? url : `http://${url}`;
            domain = new URL(safeUrl).hostname;
        } catch (e) {
            // Ignore invalid URLs
        }
    }

    // 2. Fallback to platform mapping if no domain yet
    if (!domain) {
        for (const key in PLATFORM_DOMAINS) {
            if (platform.includes(key) || key.toLowerCase().includes(platform.toLowerCase())) {
                domain = PLATFORM_DOMAINS[key];
                break;
            }
        }
    }

    // Google Favicon Service
    const logoUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null;

    const sizeClasses = size === 'sm' ? 'w-8 h-8 text-xs rounded-lg' : 'w-10 h-10 text-base rounded-xl';

    // 3. Render Image if possible
    if (logoUrl && !imgError) {
        return (
             <div className={`${sizeClasses} flex-shrink-0 bg-white/5 border border-white/10 overflow-hidden`}>
                <img 
                    src={logoUrl} 
                    alt={platform} 
                    className="w-full h-full object-contain p-1" 
                    onError={() => setImgError(true)} 
                />
             </div>
        );
    }

    // 4. Fallback: Initials with Color (Original Logic)
    const getColor = (str: string) => {
        if (str.includes('微信')) return 'bg-green-600';
        if (str.includes('支付宝') || str.includes('蓝')) return 'bg-blue-500';
        if (str.includes('阿里') || str.includes('淘宝')) return 'bg-orange-500';
        if (str.includes('抖音') || str.includes('头条')) return 'bg-slate-800';
        if (str.includes('B站') || str.includes('哔哩')) return 'bg-pink-500';
        if (str.includes('红书') || str.includes('京东')) return 'bg-red-500';
        if (str.includes('腾讯') || str.includes('QQ')) return 'bg-blue-600';
        if (str.includes('政务') || str.includes('局') || str.includes('公')) return 'bg-slate-700';
        return 'bg-brand-600';
    };

    const color = getColor(platform || '');
    const initial = (platform || '?').replace(/[^a-zA-Z\u4e00-\u9fa5]/g, '').charAt(0).toUpperCase() || '?';

    return (
        <div className={`${sizeClasses} flex-shrink-0 flex items-center justify-center font-bold text-white shadow-inner border border-white/10 ${color}`}>
            {initial}
        </div>
    );
};

// --- Account Form Modal (NEW) ---
const AccountFormModal = ({ 
    initialData, 
    onSave, 
    onDelete, 
    onClose 
}: { 
    initialData: Partial<AccountItem> | null, 
    onSave: (data: Partial<AccountItem>) => void,
    onDelete: (id: string) => void,
    onClose: () => void 
}) => {
    const isEdit = !!initialData?.id;
    const [formData, setFormData] = useState<Partial<AccountItem>>({
        category: 'General',
        riskLevel: 'Low',
        status: 'Normal',
        platform: '',
        name: '',
        username: '',
        password: '',
        url: '',
        linkedPhone: '',
        linkedEmail: '',
        contactPerson: '',
        loginMethod: '',
        ...initialData
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (field: keyof AccountItem, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-[#1e293b] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0f172a] rounded-t-2xl">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        {isEdit ? <Save size={20} className="text-brand-400"/> : <Plus size={20} className="text-brand-400"/>}
                        {isEdit ? '编辑账号信息' : '托管新账号'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-white/5 pb-2">基础信息</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">平台名称 *</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500/50 outline-none"
                                    placeholder="如: 抖音, 阿里云"
                                    value={formData.platform}
                                    onChange={e => handleChange('platform', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">业务备注 *</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500/50 outline-none"
                                    placeholder="如: 公司大号, 财务专员"
                                    value={formData.name}
                                    onChange={e => handleChange('name', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">分类</label>
                                <select 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500/50 outline-none appearance-none cursor-pointer"
                                    value={formData.category}
                                    onChange={e => handleChange('category', e.target.value)}
                                >
                                    <option value="General">综合平台</option>
                                    <option value="Content">内容平台</option>
                                    <option value="IT">IT设施</option>
                                    <option value="Admin">人事行政</option>
                                    <option value="Finance">财务法务</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">登录网址 (URL)</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500/50 outline-none"
                                    placeholder="https://..."
                                    value={formData.url}
                                    onChange={e => handleChange('url', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Credentials */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-white/5 pb-2">登录凭证</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">账号 / Username *</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500/50 outline-none font-mono"
                                    value={formData.username}
                                    onChange={e => handleChange('username', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">密码 / Password</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500/50 outline-none font-mono"
                                        placeholder="留空则不修改"
                                        value={formData.password}
                                        onChange={e => handleChange('password', e.target.value)}
                                    />
                                    <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security & Linking */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-white/5 pb-2">安全与关联</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">关联手机号 (接收验证码)</label>
                                <select 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500/50 outline-none appearance-none cursor-pointer"
                                    value={formData.linkedPhone || ''}
                                    onChange={e => handleChange('linkedPhone', e.target.value)}
                                >
                                    <option value="">-- 选择 SIM 卡 --</option>
                                    {MOCK_SIMS.map(sim => (
                                        <option key={sim.id} value={sim.phoneNumber}>
                                            {sim.phoneNumber} - {sim.owner}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">关联邮箱</label>
                                <input 
                                    type="email" 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500/50 outline-none"
                                    value={formData.linkedEmail}
                                    onChange={e => handleChange('linkedEmail', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">责任人/管理员</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500/50 outline-none"
                                    value={formData.contactPerson}
                                    onChange={e => handleChange('contactPerson', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">风险等级</label>
                                <select 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500/50 outline-none appearance-none cursor-pointer"
                                    value={formData.riskLevel}
                                    onChange={e => handleChange('riskLevel', e.target.value)}
                                >
                                    <option value="Low">Low - 普通账号</option>
                                    <option value="Medium">Medium - 重要</option>
                                    <option value="High">High - 核心高危</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-white/5 flex justify-between items-center bg-[#0f172a] rounded-b-2xl">
                    {isEdit ? (
                        <button 
                            type="button" 
                            onClick={() => onDelete(formData.id!)}
                            className="flex items-center text-red-400 hover:text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2 size={18} className="mr-2"/> 删除账号
                        </button>
                    ) : <div></div>}
                    
                    <div className="flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-medium transition-colors"
                        >
                            取消
                        </button>
                        <button 
                            onClick={handleSubmit}
                            className="px-8 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-900 font-bold shadow-lg shadow-brand-500/20 transition-all transform active:scale-95"
                        >
                            保存
                        </button>
                    </div>
                </div>
             </div>
        </div>
    );
};

// --- Detail Drawer ---
const DetailDrawer = ({ account, onClose, onEdit }: { account: AccountItem, onClose: () => void, onEdit: () => void }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const handleViewPassword = () => {
        if (showPassword) return;
        if (window.confirm("安全提示：查看密码的操作将被系统记录在案。\n\n是否继续？")) {
            setShowPassword(true);
            setCountdown(15);
        }
    };

    useEffect(() => {
        let timer: any;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
        } else if (countdown === 0 && showPassword) {
            setShowPassword(false);
        }
        return () => clearTimeout(timer);
    }, [countdown, showPassword]);

    // Find linked device
    const linkedDevice = account.linkedPhone 
        ? MOCK_DEVICES.find(d => {
            const sim = MOCK_SIMS.find(s => s.phoneNumber === account.linkedPhone);
            return sim && d.simCardId === sim.id;
        }) 
        : null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            <div className="relative w-full max-w-lg bg-[#0f172a] h-full shadow-2xl flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-start">
                     <div className="flex gap-4">
                        <BrandLogo platform={account.platform} url={account.url} size="md" />
                        <div>
                            <h2 className="text-xl font-bold text-white leading-tight">{account.platform}</h2>
                            <p className="text-slate-400 text-sm mt-1">{account.name}</p>
                        </div>
                     </div>
                     <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                     </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                     {/* 1. Quick Info */}
                     <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                             <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">责任人</div>
                             <div className="flex items-center text-sm font-bold text-white">
                                <User size={16} className="text-brand-400 mr-2"/>
                                {account.contactPerson || '未指定'}
                             </div>
                         </div>
                         <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                             <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">风险等级</div>
                             <div className={`flex items-center text-sm font-bold ${
                                 account.riskLevel === 'High' ? 'text-red-400' : 'text-green-400'
                             }`}>
                                <ShieldAlert size={16} className="mr-2"/>
                                {account.riskLevel}
                             </div>
                         </div>
                     </div>

                     {/* 2. Login Credentials */}
                     <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                         <h3 className="text-sm font-bold text-white mb-6 flex items-center">
                            <Key size={16} className="text-brand-400 mr-2"/> 登录凭证
                         </h3>
                         
                         <div className="space-y-6">
                             {/* Username */}
                             <div className="group relative">
                                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">账号 / Username</label>
                                 <div className="flex items-center justify-between text-slate-200 font-mono text-sm bg-white/5 p-3 rounded-xl">
                                     {account.username}
                                     <button className="text-slate-500 hover:text-white transition-colors"><Copy size={14}/></button>
                                 </div>
                             </div>

                             {/* Password */}
                             <div className="group relative">
                                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">密码 / Password</label>
                                 <div className={`flex items-center justify-between font-mono text-sm bg-white/5 p-3 rounded-xl transition-all ${showPassword ? 'text-brand-400 bg-brand-500/5 border border-brand-500/20' : 'text-slate-400'}`}>
                                     <span>{showPassword ? account.password : '••••••••••••••••'}</span>
                                     <div className="flex items-center gap-3">
                                         {showPassword && <span className="text-xs font-bold text-brand-500 animate-pulse">{countdown}s</span>}
                                         <button onClick={handleViewPassword} className="text-slate-500 hover:text-white transition-colors">
                                            {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                                         </button>
                                     </div>
                                 </div>
                             </div>

                             {/* Login Link */}
                             {account.url && (
                                <a 
                                    href={account.url.startsWith('http') ? account.url : `https://${account.url}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center justify-center w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-slate-300 transition-colors"
                                >
                                    <ExternalLink size={14} className="mr-2"/>
                                    前往登录页面
                                </a>
                             )}
                         </div>
                     </div>

                     {/* 3. 2FA Guide (The Core Value) */}
                     <div>
                         <h3 className="text-sm font-bold text-white mb-4 flex items-center">
                            <Smartphone size={16} className="text-brand-400 mr-2"/> 安全验证指引
                         </h3>
                         
                         {account.linkedPhone ? (
                             <div className="bg-brand-500/10 rounded-2xl p-6 border border-brand-500/20 relative overflow-hidden">
                                 <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                     <Smartphone size={80} className="text-brand-400"/>
                                 </div>
                                 <div className="relative z-10">
                                     <div className="text-xs font-bold text-brand-400 mb-4 uppercase tracking-wider">验证码发送至</div>
                                     <div className="text-xl font-mono font-bold text-white mb-2">
                                        {account.linkedPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')}
                                     </div>
                                     
                                     {linkedDevice ? (
                                         <div className="mt-4 pt-4 border-t border-brand-500/20">
                                             <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-black/20 rounded-lg">
                                                    <Smartphone size={16} className="text-brand-400"/>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-slate-400">关联物理设备</div>
                                                    <div className="text-sm font-bold text-slate-200">{linkedDevice.name}</div>
                                                </div>
                                             </div>
                                             <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-black/20 rounded-lg">
                                                    <User size={16} className="text-brand-400"/>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-slate-400">当前保管人</div>
                                                    <div className="text-sm font-bold text-slate-200">{linkedDevice.keeper}</div>
                                                </div>
                                             </div>
                                             <div className="flex gap-2">
                                                 <button className="flex-1 py-2 bg-brand-500 text-slate-900 rounded-lg text-xs font-bold hover:bg-brand-400 transition-colors flex items-center justify-center">
                                                     <PhoneCall size={14} className="mr-2"/> 呼叫保管人
                                                 </button>
                                                 <button className="flex-1 py-2 bg-white/10 text-white rounded-lg text-xs font-bold hover:bg-white/20 transition-colors flex items-center justify-center">
                                                     <MessageCircle size={14} className="mr-2"/> 微信提醒
                                                 </button>
                                             </div>
                                         </div>
                                     ) : (
                                         <div className="mt-4 text-xs text-slate-500">
                                             未找到关联的物理设备资产信息
                                         </div>
                                     )}
                                 </div>
                             </div>
                         ) : (
                             <div className="p-6 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center text-slate-500 text-sm">
                                 该账号未配置双重验证手机号
                             </div>
                         )}
                     </div>

                     {/* 4. Audit Logs */}
                     <div>
                         <h3 className="text-sm font-bold text-white mb-4 flex items-center">
                            <History size={16} className="text-brand-400 mr-2"/> 审计日志
                         </h3>
                         <div className="border-l-2 border-white/10 ml-2 space-y-6 pl-6 py-2">
                             {account.auditLogs.map(log => (
                                 <div key={log.id} className="relative group">
                                     <div className={`absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 border-[#0f172a] transition-colors ${
                                         log.type === 'security' ? 'bg-red-500' : 'bg-slate-600'
                                     }`}></div>
                                     <div className="text-sm text-slate-300">
                                         <span className="font-bold text-white">{log.user}</span> {log.action}
                                     </div>
                                     <div className="text-xs text-slate-500 font-mono mt-1">
                                         {log.timestamp}
                                     </div>
                                 </div>
                             ))}
                             <div className="relative">
                                 <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0f172a]"></div>
                                 <div className="text-sm text-slate-300">账号已创建</div>
                                 <div className="text-xs text-slate-500 font-mono mt-1">2024-01-01 00:00</div>
                             </div>
                         </div>
                     </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/5 bg-[#0f172a]">
                    <button 
                        onClick={onEdit}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 font-bold transition-colors flex items-center justify-center"
                    >
                        <Settings size={16} className="mr-2"/> 编辑账号信息
                    </button>
                </div>
            </div>
        </div>
    );
};