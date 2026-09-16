export interface AbleUser {
  name: string;
  xp: number;
  level: number;
  rep: number;
  role: string;
  bio?: string;
  email?: string;
  phone?: string;
  country?: string;
  isVerified?: boolean;
  streakDays?: number;
  lastActiveDate?: string;
  dailyXpEarned?: number;
  dailyXpCap?: number;
  dailyRepEarned?: number;
  dailyRepCap?: number;
}

export interface Mission {
  id: number;
  title: string;
  description?: string;
  reward: number;
  repReward: number;
  category: 'core' | 'trend' | 'community' | 'infra' | 'personal' | 'bounty';
  scope?: 'city' | 'personal';
  completed: boolean;
  proofRequired?: boolean;
  proofNote?: string;
  completedAt?: string;
}

export type WorkStatusType = 'status-rising' | 'status-trending' | 'status-supported';

export interface WorkItem {
  id: number;
  title: string;
  author: string;
  status: string;
  statusClass: WorkStatusType;
  views: string;
  viewsCount: number;
  likesCount: number;
  likedByMe: boolean;
  category?: string;
  description?: string;
  link?: string;
  date?: string;
  peerReviewsCount?: number;
  reviewedByMe?: boolean;
  peerReviewNotes?: { reviewer: string; comment: string; date: string }[];
}

export interface GrandChair {
  id: number;
  seat: string;
  holder: string;
  term: string;
  desc: string;
  isVacant: boolean;
  votes: number;
  votedByMe: boolean;
  requiredRep: number;
  requiredLevel: number;
}

export interface LeagueMember {
  rank: number;
  name: string;
  xp: number;
  rep: number;
  badge: string;
  isCurrent?: boolean;
  growth: string;
}

export interface ChatMessage {
  id: number;
  author: string;
  role?: string;
  text: string;
  likes: number;
  likedByMe: boolean;
  timestamp: string;
  tag?: string;
}

export interface AppState {
  user: AbleUser;
  missions: Mission[];
  works: WorkItem[];
  grandChairs: GrandChair[];
  league: LeagueMember[];
  chatMessages: ChatMessage[];
}
