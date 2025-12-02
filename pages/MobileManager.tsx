
import React, { useState } from 'react';
import { Smartphone, CreditCard as SimIcon, User, Signal, Wifi, Lock, Copy, Plus, Filter, Search } from 'lucide-react';
import { SimCard, MobileDevice } from '../types';

export const MOCK_SIMS: SimCard[] = [
    { id: 'sim1', phoneNumber: '13269136258', carrier: '中国联通', status: 'Active', owner: '行政部-公用', iccid: '8986012028819203' },
    { id: 'sim2', phoneNumber: '18810250389', carrier: '中国移动', status: 'Active', owner: '任伟', iccid: '8986001239912344' },
    { id: 'sim3', phoneNumber: '15040186598', carrier: '中国电信', status: 'Active', owner: '顾恒慈', iccid: '8986034561122334' },
    { id: 'sim4', phoneNumber: '18610614572', carrier: '中国联通', status: 'Active', owner: '毛思宁', iccid: '8986017895566778' },
    { id: 'sim5', phoneNumber: '13910008888', carrier: '中国移动', status: 'Inactive', owner: '备用库', iccid: '8986005556667778' },
    { id: 'sim6', phoneNumber: '13122223333', carrier: '中国联通', status: 'Active', owner: '直播组', iccid: '8986019998887776' },
];

export const MOCK_DEVICES: MobileDevice[] = [
    { id: 'dev1', name: '行政备用机 (黑)', model: 'iPhone 13', os: 'iOS 17.2', color: 'Midnight', screenLockPasscode: '091800', keeper: '前台-小刘', status: 'InUse', simCardId: 'sim1' },
    { id: 'dev2', name: '测试机 (白)', model: 'iPhone 12', os: 'iOS 16.5', color: 'Starlight', screenLockPasscode: '123456', keeper: '测试组', status: 'Idle' },
    { id: 'dev3', name: '财务专用机', model: 'Redmi K40', os: 'Android 13', color: 'Black', screenLockPasscode: '888888', keeper: '顾恒慈', status: 'InUse', simCardId: 'sim3' },
    { id: 'dev4', name: '直播推流机', model: 'iPhone 14 Pro', os: 'iOS 17.0', color: 'Purple', screenLockPasscode: '000000', keeper: '直播组', status: 'InUse', simCardId: 'sim6' },
    { id: 'dev5', name: '老旧测试机', model: 'Pixel 4', os: 'Android 12', color: 'Orange', screenLockPasscode: '1122', keeper: 'IT部', status: 'Idle' },
];

export const MobileManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'SIM' | 'DEVICE'>('SIM');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSims = MOCK_SIMS.filter(s => s.phoneNumber.includes(searchTerm) || s.owner.includes(searchTerm));
    const filteredDevices = MOCK_DEVICES.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.model.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)]">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 flex-shrink-0 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">通讯设备管理</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        集中管理公司的 {MOCK_SIMS.length} 张 SIM 卡与 {MOCK_DEVICES.length} 台移动终端
                    </p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* View Toggles */}
                    <div className="bg-white/5 p-1 rounded-xl border border-white/5 flex w-full md:w-auto">
                        <button 
                            onClick={() => setActiveTab('SIM')}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'SIM' 
                                ? 'bg-brand-500 text-slate-900 shadow-lg' 
                                : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <SimIcon size={16} /> SIM 卡库
                        </button>
                        <button 
                             onClick={() => setActiveTab('DEVICE')}
                             className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'DEVICE' 
                                ? 'bg-brand-500 text-slate-900 shadow-lg' 
                                : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Smartphone size={16} /> 移动设备
                        </button>
                    </div>

                    <button className="hidden md:flex bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl border border-white/10 transition-colors">
                        <Filter size={18} />
                    </button>
                    
                    <button className="hidden md:flex bg-brand-500 hover:bg-brand-400 text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20 transition-all items-center whitespace-nowrap">
                        <Plus size={18} className="mr-2" /> 
                        {activeTab === 'SIM' ? '新增 SIM 卡' : '入库新设备'}
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative flex-shrink-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                    type="text" 
                    placeholder={activeTab === 'SIM' ? "搜索手机号、持有人..." : "搜索设备名称、型号..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-slate-200 focus:border-brand-500/50 outline-none transition-all"
                />
            </div>

            {/* Content Area - Full Width Grid */}
            <div className="flex-1 overflow-y-auto pb-10">
                {activeTab === 'SIM' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {filteredSims.map(sim => (
                            <div key={sim.id} className="relative group perspective-1000">
                                <div className="absolute inset-0 bg-brand-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative h-full bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 rounded-3xl border border-white/5 group-hover:border-brand-500/40 transition-all shadow-lg overflow-hidden flex flex-col justify-between">
                                    
                                    {/* Decoration */}
                                    <div className="absolute -right-8 -top-8 text-white/[0.03] rotate-12 group-hover:text-white/[0.07] transition-colors pointer-events-none">
                                        <SimIcon size={160} />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-10 h-8 rounded-md bg-gradient-to-br shadow-inner border border-opacity-20 ${
                                                    sim.carrier.includes('联通') ? 'from-purple-600 to-purple-400 border-purple-300' :
                                                    sim.carrier.includes('移动') ? 'from-blue-600 to-blue-400 border-blue-300' :
                                                    'from-orange-600 to-orange-400 border-orange-300'
                                                }`}></div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-300">{sim.carrier}</span>
                                                    <span className="text-[10px] text-slate-500">Postpaid</span>
                                                </div>
                                            </div>
                                            <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full border ${
                                                sim.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                            }`}>
                                                {sim.status === 'Active' ? <Signal size={12} className="mr-1"/> : <Lock size={12} className="mr-1"/>}
                                                {sim.status === 'Active' ? '正常' : '停机'}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Mobile Number</div>
                                            <div className="text-2xl font-mono font-bold text-white tracking-wider flex items-center gap-2 group-hover:text-brand-400 transition-colors">
                                                {sim.phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')}
                                                <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-all">
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-500">ICCID</span>
                                                <span className="text-xs text-slate-400 font-mono tracking-tighter">{sim.iccid.slice(0,8)}...</span>
                                            </div>
                                            <div className="flex items-center text-xs font-bold text-brand-400 bg-brand-900/20 px-3 py-1.5 rounded-xl border border-brand-500/10">
                                                <User size={12} className="mr-1.5"/>
                                                {sim.owner}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Add New Card Placeholder */}
                        <div className="border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-slate-500 hover:text-brand-400 hover:border-brand-500/30 hover:bg-white/5 transition-all cursor-pointer min-h-[240px]">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                <Plus size={24} />
                            </div>
                            <span className="font-bold text-sm">登记新 SIM 卡</span>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                         {filteredDevices.map(dev => {
                            const linkedSim = MOCK_SIMS.find(s => s.id === dev.simCardId);
                            return (
                                <div key={dev.id} className="glass-card rounded-3xl p-6 border border-white/5 hover:border-brand-500/30 transition-all flex flex-col h-full group hover:-translate-y-1">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-16 rounded-xl bg-black border border-slate-700 shadow-xl flex items-center justify-center relative overflow-hidden flex-shrink-0">
                                                <div className="absolute inset-x-3 top-0 h-3 bg-[#1e293b] rounded-b-lg"></div>
                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-white text-lg truncate group-hover:text-brand-400 transition-colors">{dev.name}</div>
                                                <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                                                    <span className="bg-white/10 px-1.5 py-0.5 rounded">{dev.model}</span>
                                                    <span>{dev.color}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`flex-shrink-0 px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                                            dev.status === 'InUse' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                        }`}>
                                            {dev.status === 'InUse' ? '使用中' : '闲置'}
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6 flex-1">
                                            <div className="bg-black/30 rounded-xl p-3 flex items-center justify-between border border-white/5">
                                            <div className="flex items-center text-xs text-slate-500">
                                                <Lock size={14} className="mr-2"/> 锁屏密码
                                            </div>
                                            <div className="text-sm font-mono font-bold text-white tracking-widest">{dev.screenLockPasscode}</div>
                                            </div>
                                            <div className="bg-black/30 rounded-xl p-3 flex items-center justify-between border border-white/5">
                                            <div className="flex items-center text-xs text-slate-500">
                                                <Wifi size={14} className="mr-2"/> 网络状态
                                            </div>
                                            <div className="text-xs font-bold text-slate-300 truncate text-right">
                                                {linkedSim ? linkedSim.carrier : '仅 Wi-Fi'}
                                            </div>
                                            </div>
                                    </div>
                                    
                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between text-xs pb-4 border-b border-white/5 mb-4">
                                            <div className="flex items-center text-slate-400">
                                                <User size={12} className="mr-1.5"/>
                                                保管人
                                            </div>
                                            <div className="text-white font-medium">{dev.keeper}</div>
                                        </div>

                                        {linkedSim ? (
                                            <div className="bg-brand-500/10 rounded-xl p-3 border border-brand-500/10 flex items-center justify-between">
                                                <div className="flex items-center text-xs text-brand-400/80">
                                                    <SimIcon size={14} className="mr-2"/> 本机号码
                                                </div>
                                                <div className="text-sm font-mono font-bold text-brand-400">
                                                    {linkedSim.phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')}
                                                </div>
                                            </div>
                                        ) : (
                                             <div className="bg-white/5 rounded-xl p-3 border border-dashed border-white/10 flex items-center justify-center text-xs text-slate-500">
                                                未插卡
                                             </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {/* Add New Device Placeholder */}
                        <div className="border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-slate-500 hover:text-brand-400 hover:border-brand-500/30 hover:bg-white/5 transition-all cursor-pointer min-h-[300px]">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                <Plus size={24} />
                            </div>
                            <span className="font-bold text-sm">入库新设备</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
