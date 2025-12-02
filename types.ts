
export enum AssetStatus {
  Available = 'Available',
  Borrowed = 'Borrowed',
  Maintenance = 'Maintenance',
  Lost = 'Lost',
}

export interface Asset {
  id: string;
  code: string; // Asset Tag e.g., FIXED-2025-001
  name: string;
  category: 'Camera' | 'Lens' | 'Light' | 'Audio' | 'Computer' | 'Drone';
  status: AssetStatus;
  location: string;
  borrower?: string;
  project?: string;
  serialNumber: string;
  image: string;
}

export interface MediaItem {
  id: string;
  title: string;
  projectRef: string; // e.g., "Project: 2024 Promo"
  tags: string[];
  diskName: string; // e.g., DISK-05
  diskStatus: 'InLibrary' | 'Borrowed';
  borrower?: string;
  physicalLocation: string; // e.g., Cabinet A02
  path: string;
  type: 'Raw' | 'Final' | 'Project';
  format: string; // e.g., "4K ProRes 422"
}

// Updated Categories based on user data
export type AccountCategory = 'General' | 'Content' | 'IT' | 'Admin' | 'Finance';

export interface AccountAuditLog {
  id: string;
  action: string; // "Viewed Password", "Updated Info"
  user: string;
  timestamp: string;
  type: 'security' | 'info';
}

export interface SubscriptionInfo {
  cycle: 'Monthly' | 'Yearly' | 'Permanent' | 'Free';
  lastPaymentDate?: string;
  expiryDate?: string;
  price?: string;
  autoRenew: boolean;
}

export interface AccountItem {
  id: string;
  category: AccountCategory;
  platform: string; // e.g., Douyin, WeChat
  name: string; // e.g., "Company Official Account"
  username: string;
  password: string;
  url?: string; // Login URL
  
  // Security & Risk
  status: 'Normal' | 'VerifyNeeded' | 'Expiring' | 'Locked';
  riskLevel: 'High' | 'Medium' | 'Low';
  
  // 2FA / Hardware Link
  loginMethod: string; // Changed from enum to string to support "Phone + Pwd", "Scan" etc.
  linkedAssetId?: string; // Links to Asset ID (e.g. iPhone 13)
  linkedDeviceName?: string; // Display name for the device
  contactPerson?: string; // Who holds the device/info
  contactPhone?: string; // Contact person's phone
  
  // New Fields for User Data
  linkedPhone?: string; // The phone number bound to the account
  linkedEmail?: string; // The email bound to the account

  // Lifecycle
  subscription?: SubscriptionInfo;
  
  // History
  auditLogs: AccountAuditLog[];
}

// --- Mobile Manager Types ---

export interface SimCard {
  id: string;
  phoneNumber: string;
  carrier: string; // 中国移动/联通/电信
  status: 'Active' | 'Inactive';
  owner: string; // current holder
  iccid: string;
}

export interface MobileDevice {
  id: string;
  name: string; // iPhone 13
  model: string;
  os: string;
  color: string;
  screenLockPasscode: string; // The sensitive info
  keeper: string; // Who has it
  status: 'InUse' | 'Idle';
  simCardId?: string; // Linked SIM
}

// --- Master Works Types ---

export type VideoVariantType = 'Master' | 'Vertical' | 'Clean' | 'Social';

export interface VideoVariant {
  id: string;
  type: VideoVariantType; // Main, 9:16, No Subtitle
  label: string; // "主文件 (16:9)", "抖音版 (9:16)"
  resolution: string; // "3840x2160", "1080x1920"
  size: string; // "450 MB"
  downloadUrl?: string;
}

export interface WorkVersion {
  id: string;
  versionTag: string; // V1, V2, Final
  date: string;
  uploader: string;
  changeLog: string; // "Adjusted color grading"
  isCurrent: boolean;
  variants: VideoVariant[]; // Files associated with this version
}

export interface MasterWork {
  id: string;
  title: string;
  coverImage: string;
  duration: string;
  producer: string;
  status: 'Delivered' | 'Revision' | 'Internal' | 'Archived';
  year: number;
  tags: string[];
  category: 'TVC' | 'Promo' | 'Documentary' | 'Short';
  versions: WorkVersion[]; // History
}

export interface DashboardStat {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
}
