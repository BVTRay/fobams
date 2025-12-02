
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Shield, Copy, Eye, EyeOff, Lock, Smartphone, Plus, 
  Server, Video, Box, CreditCard, History, X, 
  Key, ExternalLink, Search, Globe, Users, FileText, Check, Settings,
  ShieldAlert, User, Trash2, Save, Unlock
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

// Real Data Injection (Used as Initial State)
const INITIAL_ACCOUNTS: AccountItem[] = [
  // --- General (综合平台) ---
  { id: 'g1', category: 'General', platform: '微信号', name: 'bevot918', username: 'bevot918', password: 'Bugong@918', linkedPhone: '13269136258', linkedEmail: 'bvtcc@qq.com', loginMethod: '手机号, 账密', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'g2', category: 'General', platform: '百度网盘', name: '不恭文化', username: '不恭文化', password: 'Bugong@918', linkedPhone: '13269136258', linkedEmail: 'bvtcc@qq.com', loginMethod: '手机号, 账密', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'g3', category: 'General', platform: 'QQ号', name: '1529598583', username: '1529598583', password: 'Bugong@918', linkedPhone: '13269136258', linkedEmail: '', loginMethod: '手机号, 账密', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'g4', category: 'General', platform: 'QQ邮箱', name: 'bvtcc', username: 'bvtcc', password: '', linkedPhone: '13269136258', linkedEmail: 'bvtcc@qq.com', loginMethod: '官微', url: 'https://wx.mail.qq.com', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  
  // --- Content (内容平台) ---
  { id: 'c1', category: 'Content', platform: '微信公众号', name: '不恭文化', username: 'bvt@bvtcc.com', password: 'wanshibugong918', linkedPhone: '', linkedEmail: 'bvt@bvtcc.com', loginMethod: '官微', url: 'https://mp.weixin.qq.com', contactPerson: '管理员', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(2) },
  { id: 'c2', category: 'Content', platform: '微博', name: '不恭文化哒哒哒', username: '不恭文化', password: 'wanshibugong918', linkedPhone: '13269136258', linkedEmail: '', loginMethod: '手机号', url: 'https://weibo.com/', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'c3', category: 'Content', platform: '抖音', name: '原创钢铁直男伟哥', username: '不恭文化', password: 'wanshibugong918', linkedPhone: '13269136258', linkedEmail: '', loginMethod: '手机号, 官微', url: 'https://www.douyin.com', contactPerson: '', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(3) },
  { id: 'c4', category: 'Content', platform: '小红书', name: '不恭文化传媒', username: '不恭文化传媒', password: 'wanshibugong918', linkedPhone: '13269136258', linkedEmail: '', loginMethod: '手机号, 官微', url: 'https://www.xiaohongshu.com', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'c5', category: 'Content', platform: '新片场', name: '绑定微信', username: '不恭文化', password: 'wanshibugong918', linkedPhone: '13269136258', linkedEmail: 'bvt@bvtcc.com', loginMethod: '手机号, 官微', url: 'https://passport.xinpianchang.com', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'c6', category: 'Content', platform: '优酷', name: '绑定微信/支付宝', username: '不恭文化', password: 'wanshibugong918', linkedPhone: '13269136258', linkedEmail: 'bvt@bvtcc.com', loginMethod: '手机号, 官微', url: 'https://www.youku.com', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'c7', category: 'Content', platform: '知乎', name: '不恭文化', username: '不恭文化', password: 'wanshibugong918', linkedPhone: '13269136258', linkedEmail: 'bvt@bvtcc.com', loginMethod: '手机号, 官微', url: 'https://www.zhihu.com', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'c8', category: 'Content', platform: '制片帮', name: '13269136258', username: '13269136258', password: 'wanshibugong918', linkedPhone: '13269136258', linkedEmail: '', loginMethod: '手机号, 账密', url: 'https://www.zhipianbang.com', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'c9', category: 'Content', platform: '数英', name: 'bugong_bj', username: 'bugong_bj', password: 'Bugong@918', linkedPhone: '', linkedEmail: '', loginMethod: '', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'c10', category: 'Content', platform: 'B站', name: '不恭文化', username: '不恭文化', password: 'wanshibugong918', linkedPhone: '13269136258', linkedEmail: 'bvtcc@qq.com', loginMethod: '手机号, 官微', url: 'https://www.bilibili.com', contactPerson: '', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'c11', category: 'Content', platform: '微信号', name: '然哥助理', username: 'rangexiaozhuli', password: 'Bugong@918', linkedPhone: '18610614572', linkedEmail: '', loginMethod: '账密, 手机号', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'c12', category: 'Content', platform: '抖音', name: '然哥摄影课堂', username: 'yurandesheying', password: 'Bugong@918', linkedPhone: '18610614572', linkedEmail: '', loginMethod: '手机号', contactPerson: '毛思宁', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  
  // --- IT (IT设施) ---
  { id: 'i1', category: 'IT', platform: 'Github', name: 'bugu@bvtcc.com', username: 'bugu@bvtcc.com', password: 'Bugu@2024', linkedPhone: '', linkedEmail: '', loginMethod: '', url: 'https://github.com', contactPerson: '', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'i2', category: 'IT', platform: '公安备案', name: '公安机关互联网站安全服务平台', username: '91110105MA018G0W...', password: 'Wanshibugong918.', linkedPhone: '18810250389', linkedEmail: '', loginMethod: '', url: 'http://www.beian.gov.cn/portal/index.do', contactPerson: '任伟', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'i3', category: 'IT', platform: '腾讯云', name: '腾讯云服务器宝塔面板', username: 'zssrg6xr', password: '7a735e8', linkedPhone: '17637505813', linkedEmail: '', loginMethod: '', url: 'https://101.42.42.203:22500/tencentcloud', contactPerson: '任伟', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(5) },
  { id: 'i4', category: 'IT', platform: '阿里云', name: '阿里云宝塔面板-BVTCC', username: 'bvtray', password: '@Bugong918', linkedPhone: '18810250389', linkedEmail: '', loginMethod: '', url: 'http://47.236.16.124:8888/tencentcloud', contactPerson: '任伟', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(5) },
  { id: 'i5', category: 'IT', platform: 'SSH', name: '腾讯云服务器SSH', username: 'root@101.42.42.203', password: 'Wanshibugong918', linkedPhone: '', linkedEmail: '', loginMethod: '', url: 'ssh root@101.42.42.203', contactPerson: '任伟', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(5) },
  { id: 'i6', category: 'IT', platform: 'SSH', name: '阿里云服务器SSH', username: 'root@47.236.16.124', password: '@Bugong918', linkedPhone: '', linkedEmail: '', loginMethod: '', url: 'ssh root@47.236.16.124', contactPerson: '任伟', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(5) },
  { id: 'i7', category: 'IT', platform: '腾讯云', name: '腾讯云子账号-部分功能权限', username: '主账号 ID 100018034446', password: 'VP^gNL[e', linkedPhone: '', linkedEmail: '', loginMethod: '', url: 'https://cloud.tencent.com/login', contactPerson: '刘晓刚', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'i8', category: 'IT', platform: '腾讯云', name: 'Ray微信扫码登录', username: 'bvt@bvtcc.com', password: '@Bugong918', linkedPhone: '18810250389', linkedEmail: 'bvt@bvtcc.com', loginMethod: '', url: 'https://cloud.tencent.com/login', contactPerson: '任伟', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(3) },
  { id: 'i9', category: 'IT', platform: '阿里云', name: '企业支付宝登录-25.10.22', username: 'bevot', password: '@Bugong918', linkedPhone: '18810250389', linkedEmail: 'bvt@bvtcc.com', loginMethod: '', url: 'https://account.aliyun.com/', contactPerson: '任伟', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(3) },
  { id: 'i10', category: 'IT', platform: '火山引擎', name: '火山引擎', username: 'bevot', password: '@Bugong918', linkedPhone: '18810250389', linkedEmail: 'bvt@bvtcc.com', loginMethod: '', url: 'https://console.volcengine.com/auth/login', contactPerson: '任伟', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(2) },
  { id: 'i11', category: 'IT', platform: '内网', name: '内网监控', username: 'admin', password: 'Netns.cn', linkedPhone: '', linkedEmail: '', loginMethod: '', url: '192.168.110.63', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(0) },
  { id: 'i12', category: 'IT', platform: '内网', name: '内网总路由器', username: '无', password: 'Netns.cn', linkedPhone: '', linkedEmail: '', loginMethod: '', url: '192.168.110.1', contactPerson: '', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(1) },
  { id: 'i13', category: 'IT', platform: 'NAS', name: '公司NAS-Bevot-公共', username: 'free', password: '无', linkedPhone: '', linkedEmail: '', loginMethod: '', url: '192.168.110.4', contactPerson: '任伟', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(0) },
  { id: 'i14', category: 'IT', platform: 'NAS', name: '公司NAS-Bevot-管理', username: 'ray', password: 'Wanshibugong', linkedPhone: '', linkedEmail: '', loginMethod: '', url: '192.168.110.4', contactPerson: '任伟', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(3) },
  { id: 'i15', category: 'IT', platform: 'NAS', name: '后期Nas-BVTPP', username: 'bockoo', password: 'Buguzhizuo1101', linkedPhone: '', linkedEmail: '', loginMethod: '', url: '192.168.110.7', contactPerson: '', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'i16', category: 'IT', platform: '魔狼', name: 'BVT', username: 'BVT', password: '@Bugong918', linkedPhone: '', linkedEmail: 'bvt@bvtcc.com', loginMethod: '', url: 'https://molang.lol/user/login', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'i17', category: 'IT', platform: '白月光', name: 'bvtcc@qq.com', username: 'bvtcc@qq.com', password: 'Bugong@918', linkedPhone: '', linkedEmail: 'bvtcc@qq.com', loginMethod: '', url: 'https://www.okjc.org/#/login', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'i18', category: 'IT', platform: 'Cursor', name: '专门写代码用的AI', username: 'bugu@bvtcc.com', password: 'Buguzhizuo@2024', linkedPhone: '', linkedEmail: 'bugu@bvtcc.com', loginMethod: '账密', url: 'https://www.cursor.com', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },

  // --- Admin (人事行政) ---
  { id: 'a1', category: 'Admin', platform: '58同城', name: '58同城', username: 'wanshibugong918', password: 'wanshibugong918', linkedPhone: '13269136258', linkedEmail: 'bvt@bvtcc.com', loginMethod: '账密, 手机号, 官微', url: 'https://passport.58.com/login/', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'a2', category: 'Admin', platform: '智联招聘', name: '智联招聘', username: 'bjbgwhcm486265', password: 'wanshibugong918', linkedPhone: '13269136258', linkedEmail: 'hr@bvtcc.com', loginMethod: '手机号', url: 'https://passport.zhaopin.com/login', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'a3', category: 'Admin', platform: '就业指导中心', name: '深圳大学生就业指导中心', username: '深圳不恭文化传媒有限公司', password: 'wanshibugong918', linkedPhone: '18955928370', linkedEmail: 'hr@bvtcc.com', loginMethod: '账密', url: 'https://jobszu.jysd.com/school/login', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'a4', category: 'Admin', platform: '就业指导中心', name: '传统大学就业创业指导中心', username: 'hr@bvtcc.com', password: 'Wanshibugong918.', linkedPhone: '18810476678', linkedEmail: 'hr@bvtcc.com', loginMethod: '账密', url: 'https://jy.cuc.edu.cn/', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'a5', category: 'Admin', platform: '海投网', name: '海投网', username: 'bugong2017918', password: 'wanshibugong918', linkedPhone: '', linkedEmail: 'hr@bvtcc.com', loginMethod: '账密', url: 'https://www.haitou.cc/', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'a6', category: 'Admin', platform: '刺猬实习', name: '刺猬实习', username: '13269136258', password: 'wanshibugong918', linkedPhone: '13269136258', linkedEmail: '', loginMethod: '账密', url: 'https://www.ciwei.net/', contactPerson: '', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },
  { id: 'a7', category: 'Admin', platform: '政务系统', name: '北京市小客车摇号', username: '15040186598', password: 'Wanshibugong918.', linkedPhone: '15040186598', linkedEmail: '', loginMethod: '账密', url: 'https://xkczb.jtw.beijing.gov.cn/', contactPerson: '顾恒慈', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'a8', category: 'Admin', platform: '政务系统', name: '北京工作居住证', username: '北京不恭文化', password: 'Wsbg0918.', linkedPhone: '15040186598', linkedEmail: '', loginMethod: '账密', url: '朝阳区人力社保局人力资源管理系统', contactPerson: '', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'a9', category: 'Admin', platform: '政务系统', name: '海南省小客车摇号', username: '91460000MAD83L490X', password: 'Wanshibugong918.', linkedPhone: '15040186598', linkedEmail: '', loginMethod: '', url: 'https://www.hnjdctk.gov.cn/', contactPerson: '', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'a10', category: 'Admin', platform: '政务系统', name: '北京民营企业百强申报', username: '91110105MA018G0W', password: 'BJbg@2025', linkedPhone: '', linkedEmail: 'xz@bvtcc.com', loginMethod: '', url: 'https://wsgsl.bjgsl.org.cn/login', contactPerson: '武昕', status: 'Normal', riskLevel: 'Low', auditLogs: generateLogs(1) },

  // --- Finance (财务法务) ---
  { id: 'f1', category: 'Finance', platform: '支付宝', name: '企业支付宝', username: 'bvt@bvtcc.com', password: 'Wanshibugong918.', linkedPhone: '18810250389', linkedEmail: '', loginMethod: '', url: 'https://b.alipay.com/page/portal.htm', contactPerson: '任伟', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(3) },
  { id: 'f2', category: 'Finance', platform: '版权保护中心', name: '北京不恭-软件著作权登记', username: 'bvt0918', password: 'Wanshibugong918.', linkedPhone: '15040186598', linkedEmail: '', loginMethod: '', url: '中国版权保护中心 (ccopyright.com.cn)', contactPerson: '顾恒慈', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'f3', category: 'Finance', platform: '版权业务', name: '沈阳不恭-版权中心', username: '91210113MAD6TG2353', password: 'SYBGwh66666.', linkedPhone: '', linkedEmail: '', loginMethod: '', url: '专利业务办理系统 (cnipa.gov.cn)', contactPerson: '', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'f4', category: 'Finance', platform: '首创担保', name: '首创担保', username: '北京不恭文化传媒有限公司', password: 'Wanshibugong918.', linkedPhone: '15040186598', linkedEmail: '', loginMethod: '', url: 'https://online.scdb.com.cn/login', contactPerson: '顾恒慈', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(1) },
  { id: 'f5', category: 'Finance', platform: '政务系统', name: '工信部政务服务平台', username: 'bugong', password: 'Wanshibugong918.', linkedPhone: '15040186598', linkedEmail: '', loginMethod: '', url: 'http://zjtx.miit.gov.cn/', contactPerson: '顾恒慈', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'f6', category: 'Finance', platform: '政务系统', name: '科技部政务服务平台', username: '91110105MA018G0W', password: 'Wanshibugong918', linkedPhone: '', linkedEmail: '', loginMethod: '', url: '科学技术部政务服务平台 (most.gov.cn)', contactPerson: '顾恒慈', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'f7', category: 'Finance', platform: '信易贷', name: '信易贷平台', username: 'bugong0918', password: 'Wanshibugong918.', linkedPhone: '15040186598', linkedEmail: '', loginMethod: '', url: '北京小微企业金融综合服务平台 (sme-service.com)', contactPerson: '顾恒慈', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(1) },
  { id: 'f8', category: 'Finance', platform: '京东', name: '京灵劳务平台', username: '不恭文化', password: 'Wanshibugong918.', linkedPhone: '15040186598', linkedEmail: '', loginMethod: '', url: 'https://jlpt.jd.com/', contactPerson: '顾恒慈', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'f9', category: 'Finance', platform: '政务系统', name: '广东政务服务网-一网通办', username: 'f373033a', password: 'Wsbg1028', linkedPhone: '', linkedEmail: '', loginMethod: '', url: '智慧工信服务平台 (shenzhen.gov.cn)', contactPerson: '', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'f10', category: 'Finance', platform: 'Paypal', name: 'Paypal', username: 'ray@bvtcc.com', password: 'Wanshibugong918', linkedPhone: '', linkedEmail: '', loginMethod: '', url: '登录您的PayPal账户', contactPerson: '', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(2) },
  { id: 'f11', category: 'Finance', platform: '携程', name: '携程商旅', username: '2131981100', password: 'Wanshibugong918.', linkedPhone: '13263271017', linkedEmail: '', loginMethod: '', url: 'wjx@bvtcc.com', contactPerson: '', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'f12', category: 'Finance', platform: '法院系统', name: '北京法院电子诉讼平台', username: 'Wanshibugong918.', password: '18810250389', linkedPhone: '18810250389', linkedEmail: '', loginMethod: '', url: '北京法院电子诉讼平台 (bjcourt.gov.cn)', contactPerson: '', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'f13', category: 'Finance', platform: '税务系统', name: '不恭合伙企业税务申报', username: 'Wanshibugong918', password: '15040186598', linkedPhone: '15040186598', linkedEmail: '', loginMethod: '', url: '', contactPerson: '顾恒慈', status: 'Normal', riskLevel: 'High', auditLogs: generateLogs(1) },
  { id: 'f14', category: 'Finance', platform: '不恭结算', name: '不恭结算管家微信', username: 'bugongjiesuan', password: 'Wanshibugong918', linkedPhone: '18516825856', linkedEmail: '', loginMethod: '账密', url: '微信APP', contactPerson: '顾恒慈', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'f15', category: 'Finance', platform: '政务系统', name: '北京市中小企业公共服务平台', username: 'bugong0918', password: 'Wanshibugong918.', linkedPhone: '15040186598', linkedEmail: '', loginMethod: '手机号, 账密', url: 'https://www.smebj.cn/', contactPerson: '顾恒慈', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
  { id: 'f16', category: 'Finance', platform: '商标局', name: '中国商标网', username: '91110105MA018G0W', password: 'Wanshibugong918.', linkedPhone: '15040186598', linkedEmail: '', loginMethod: '', url: '国家知识产权局商标局中国商标网 (cnipa.gov.cn)', contactPerson: '顾恒慈', status: 'Normal', riskLevel: 'Medium', auditLogs: generateLogs(1) },
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
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">关联手机号 (通讯库)</label>
                                <div className="relative">
                                    <Smartphone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                                    <select 
                                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:border-brand-500/50 outline-none appearance-none cursor-pointer font-mono"
                                        value={formData.linkedPhone}
                                        onChange={e => handleChange('linkedPhone', e.target.value)}
                                    >
                                        <option value="">未关联</option>
                                        {MOCK_SIMS.map(sim => (
                                            <option key={sim.id} value={sim.phoneNumber}>
                                                {sim.phoneNumber} ({sim.owner} - {sim.carrier})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">关联邮箱</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500/50 outline-none font-mono"
                                    value={formData.linkedEmail}
                                    onChange={e => handleChange('linkedEmail', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">关联负责人</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500/50 outline-none"
                                    value={formData.contactPerson}
                                    onChange={e => handleChange('contactPerson', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">登录方式</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500/50 outline-none"
                                    placeholder="如: 手机号, 扫码"
                                    value={formData.loginMethod}
                                    onChange={e => handleChange('loginMethod', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">风险等级</label>
                                <select 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500/50 outline-none appearance-none cursor-pointer"
                                    value={formData.riskLevel}
                                    onChange={e => handleChange('riskLevel', e.target.value)}
                                >
                                    <option value="Low">低风险 (普通)</option>
                                    <option value="Medium">中风险 (需注意)</option>
                                    <option value="High">高风险 (核心资产)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-white/10 bg-[#0f172a] rounded-b-2xl flex justify-between items-center">
                    {isEdit ? (
                         <button 
                            type="button"
                            onClick={() => onDelete(formData.id!)}
                            className="text-red-400 hover:text-red-300 text-sm font-bold flex items-center px-4 py-2 hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                            <Trash2 size={16} className="mr-2"/> 删除账号
                        </button>
                    ) : (
                        <div></div>
                    )}
                    <div className="flex gap-4">
                        <button 
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                        >
                            取消
                        </button>
                        <button 
                            onClick={handleSubmit}
                            className="bg-brand-500 hover:bg-brand-400 text-slate-900 px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center"
                        >
                            <Check size={18} className="mr-2"/> 保存
                        </button>
                    </div>
                </div>
             </div>
        </div>
    );
};

// --- The Deep Dive Drawer (Updated) ---
const DetailDrawer = ({ account, onClose, onEdit }: { account: AccountItem, onClose: () => void, onEdit: () => void }) => {
    const [revealPassword, setRevealPassword] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Find linked SIM and Device
    const linkedSim = MOCK_SIMS.find(s => s.phoneNumber === account.linkedPhone);
    const linkedDevice = linkedSim ? MOCK_DEVICES.find(d => d.simCardId === linkedSim.id) : null;

    useEffect(() => {
        let interval: number;
        if (revealPassword && countdown > 0) {
            interval = window.setInterval(() => setCountdown(c => c - 1), 1000);
        } else if (countdown === 0) {
            setRevealPassword(false);
        }
        return () => clearInterval(interval);
    }, [revealPassword, countdown]);

    const handleReveal = () => {
        if (confirm("安全警告：\n您的查看操作将被记录在案 (Audit Log)。\n是否继续？")) {
            setRevealPassword(true);
            setCountdown(30);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative w-full max-w-md bg-[#0f172a] h-full shadow-2xl border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-start bg-[#1e293b]">
                    <div className="flex items-center gap-4">
                        <BrandLogo platform={account.platform} url={account.url} />
                        <div>
                            <h2 className="text-lg font-bold text-white">{account.platform}</h2>
                            <p className="text-xs text-slate-500 font-mono mt-1">{account.category}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* 0. Basic Info Card (New) */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                            <FileText size={12} className="mr-2"/> 账号信息
                        </h3>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                            <div className="mb-4">
                                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">备注说明</label>
                                <div className="text-white font-bold">{account.name}</div>
                            </div>
                            {account.url && (
                                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5 group hover:border-brand-500/30 transition-colors">
                                    <div className="flex items-center overflow-hidden">
                                        <Globe size={14} className="text-slate-500 mr-2 flex-shrink-0"/>
                                        <a href={account.url.startsWith('http') ? account.url : `http://${account.url}`} target="_blank" rel="noreferrer" className="text-sm text-brand-400 truncate hover:underline">
                                            {account.url}
                                        </a>
                                    </div>
                                    <ExternalLink size={12} className="text-slate-600 ml-2"/>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 1. Credentials */}
                    <div className="space-y-3">
                         <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                            <Key size={12} className="mr-2"/> 登录凭证
                        </h3>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-4">
                            <div>
                                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">账号 / Username</label>
                                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5 hover:border-white/10 cursor-pointer group">
                                    <span className="font-mono text-sm text-slate-200 break-all">{account.username}</span>
                                    <Copy size={14} className="text-slate-600 group-hover:text-white transition-colors flex-shrink-0 ml-2"/>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1 flex justify-between">
                                    <span>密码 / Password</span>
                                    {revealPassword && <span className="text-brand-400">{countdown}s 后隐藏</span>}
                                </label>
                                <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5 hover:border-brand-500/30 transition-colors relative overflow-hidden">
                                    <span className={`font-mono text-sm break-all mr-2 ${revealPassword ? 'text-brand-400 font-bold' : 'text-slate-500 tracking-widest'}`}>
                                        {revealPassword ? account.password : '••••••••••••'}
                                    </span>
                                    <button onClick={handleReveal} className="text-slate-500 hover:text-white transition-colors relative z-10 flex-shrink-0">
                                        {revealPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                                    </button>
                                    
                                    {revealPassword && (
                                        <div 
                                            className="absolute bottom-0 left-0 h-0.5 bg-brand-500 transition-all ease-linear"
                                            style={{ width: `${(countdown / 30) * 100}%` }}
                                        ></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Linked Info (The Pain Point Solver) */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                            <Shield size={12} className="mr-2"/> 安全验证与关联
                        </h3>
                        <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="p-2 bg-brand-500/20 text-brand-400 rounded-lg">
                                    <Smartphone size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-brand-400">
                                        登录方式：{account.loginMethod || '未知'}
                                    </div>
                                    <div className="text-xs text-brand-300/70 mt-1 leading-relaxed">
                                        如需验证码，请联系下方关联人或查看关联设备。
                                    </div>
                                </div>
                            </div>
                            
                            {/* Linked Contact Card */}
                            <div className="space-y-2">
                                {account.linkedPhone && (
                                    <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-xs text-slate-400">关联手机</div>
                                            <div className="text-sm font-bold text-slate-200 font-mono">{account.linkedPhone}</div>
                                        </div>
                                        
                                        {/* SMART LINKING FEATURE */}
                                        {linkedDevice && (
                                            <div className="mt-2 pt-2 border-t border-white/10">
                                                <div className="flex justify-between items-center text-xs mb-1">
                                                    <span className="text-slate-400">所在设备</span>
                                                    <span className="text-white font-bold">{linkedDevice.name}</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-brand-900/40 rounded px-2 py-1 mt-1">
                                                     <span className="text-[10px] text-brand-400 flex items-center">
                                                         <Unlock size={10} className="mr-1"/> 锁屏密码
                                                     </span>
                                                     <span className="text-xs font-mono font-bold text-white tracking-widest">{linkedDevice.screenLockPasscode}</span>
                                                </div>
                                                <div className="text-[10px] text-slate-500 mt-1 text-right">
                                                    保管人: {linkedDevice.keeper}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {account.linkedEmail && (
                                    <div className="bg-black/20 rounded-lg p-3 flex items-center justify-between border border-white/5">
                                        <div className="text-xs text-slate-400">关联邮箱</div>
                                        <div className="text-sm font-bold text-slate-200 font-mono">{account.linkedEmail}</div>
                                    </div>
                                )}
                                {account.contactPerson && (
                                    <div className="bg-black/20 rounded-lg p-3 flex items-center justify-between border border-white/5">
                                        <div className="text-xs text-slate-400">关联人</div>
                                        <div className="text-sm font-bold text-white flex items-center">
                                            <User size={12} className="mr-1"/> {account.contactPerson}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3. Audit Log */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                            <History size={12} className="mr-2"/> 安全审计日志
                        </h3>
                        <div className="border-l-2 border-white/10 ml-2 space-y-6 py-2">
                            {account.auditLogs.map((log) => (
                                <div key={log.id} className="relative pl-6">
                                    <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${
                                        log.type === 'security' 
                                        ? 'bg-brand-500 border-brand-500/30' 
                                        : 'bg-slate-700 border-slate-600'
                                    }`}></div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-300">
                                            <span className="font-bold text-white">{log.user}</span> {log.action}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">{log.timestamp}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-[#1e293b]">
                     <button 
                        onClick={onEdit}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center"
                     >
                        <Settings size={16} className="mr-2"/> 编辑账号信息
                     </button>
                </div>
            </div>
        </div>
    );
}
