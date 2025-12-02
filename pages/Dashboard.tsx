import React from 'react';
import { ArrowUpRight, ArrowDownRight, HardDrive, Camera, AlertCircle, Calendar, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '1月', assets: 40 },
  { name: '2月', assets: 30 },
  { name: '3月', assets: 20 },
  { name: '4月', assets: 27 },
  { name: '5月', assets: 18 },
  { name: '6月', assets: 23 },
  { name: '7月', assets: 34 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">工作台</h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            系统运行正常
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-medium text-slate-200">
             {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-sm text-brand-400/80 font-medium">
            {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="设备总数" 
          value="1,284" 
          icon={<Camera size={24} />} 
          trend="+12%" 
          trendUp={true} 
          color="blue"
        />
        <StatCard 
          title="当前借出" 
          value="142" 
          icon={<Activity size={24} />} 
          trend="+5"
          trendUp={true}
          subText="涉及 8 个项目组"
          color="brand"
        />
        <StatCard 
          title="硬盘剩余空间" 
          value="12.4 TB" 
          icon={<HardDrive size={24} />} 
          subText="总容量 120TB"
          trend="-2.1 TB"
          trendUp={false}
          color="purple"
        />
        <StatCard 
          title="本月新增" 
          value="24" 
          icon={<Calendar size={24} />} 
          subText="其中镜头 8 只"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
             <Activity size={100} className="text-brand-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-brand-400 rounded-full"></span>
            资产借用趋势
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <defs>
                  <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FACC15" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '12px', 
                    color: '#fff',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                  }}
                  itemStyle={{ color: '#FACC15' }}
                />
                <Bar dataKey="assets" fill="url(#colorAssets)" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Alerts & Todo */}
        <div className="space-y-8">
          {/* Alerts */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <AlertCircle size={20} className="text-red-500 mr-2 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              急需关注
            </h3>
            <div className="space-y-3">
              <AlertItem text="marketing.com 域名还有 3 天过期" type="danger" />
              <AlertItem text="硬盘 DISK-04 剩余空间不足 5%" type="warning" />
              <AlertItem text="Sony A7S3 (02) 报修已超过 15 天" type="warning" />
            </div>
          </div>

          {/* Todo */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
               我的待办
            </h3>
            <div className="space-y-3">
              <TodoItem text="审批：张三的无人机借用申请" time="10:00" />
              <TodoItem text="归还：Sony 24-70 GM 镜头" time="明天" />
              <TodoItem text="采购：新 SD 卡入库登记" time="待定" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, trendUp, subText, color = 'brand' }: any) => {
  const colorStyles: any = {
    brand: 'text-brand-400 from-brand-400/20 to-brand-400/5',
    blue: 'text-blue-400 from-blue-400/20 to-blue-400/5',
    purple: 'text-purple-400 from-purple-400/20 to-purple-400/5',
    green: 'text-green-400 from-green-400/20 to-green-400/5',
  };

  return (
    <div className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${colorStyles[color]} rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`}></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${colorStyles[color].split(' ')[0]}`}>
            {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center ${trendUp ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {trendUp ? <ArrowUpRight size={12} className="mr-1"/> : <ArrowDownRight size={12} className="mr-1"/>}
            {trend}
          </span>
        )}
      </div>
      
      <div className="relative z-10">
        <div className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</div>
        <div className="text-sm text-slate-400 font-medium">{title}</div>
        {subText && <div className="text-xs text-slate-500 mt-3 pt-3 border-t border-white/5">{subText}</div>}
      </div>
    </div>
  );
};

const AlertItem = ({ text, type }: { text: string; type: 'danger' | 'warning' }) => (
  <div className={`p-3 rounded-xl text-sm font-medium flex items-start border backdrop-blur-sm ${
      type === 'danger' 
      ? 'bg-red-500/10 border-red-500/10 text-red-300' 
      : 'bg-orange-500/10 border-orange-500/10 text-orange-300'
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 mr-2.5 flex-shrink-0 ${type === 'danger' ? 'bg-red-500' : 'bg-orange-500'}`}></span>
    {text}
  </div>
);

const TodoItem = ({ text, time }: { text: string; time: string }) => (
  <div className="flex items-center justify-between p-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors group cursor-pointer">
    <div className="flex items-center">
      <div className="w-5 h-5 rounded border border-slate-500 flex items-center justify-center group-hover:border-brand-400 transition-colors">
         {/* Checkbox simulated */}
      </div>
      <span className="ml-3 text-sm text-slate-300 group-hover:text-white transition-colors">{text}</span>
    </div>
    <span className="text-xs text-slate-500 font-mono">{time}</span>
  </div>
);