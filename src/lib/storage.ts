import { AppState, AbleUser, Mission, WorkItem, GrandChair, LeagueMember, ChatMessage } from '../types';

export const STORAGE_KEY = 'able_city_master_v3';

export const INITIAL_USER: AbleUser = {
  name: 'سیاوش',
  xp: 850,
  level: 3,
  rep: 94,
  role: 'معمار کلان و بنیانگذار',
  bio: 'اینجا خانه سوختگانی است که از خاکستر رنج، ارزش و جهان می‌آفرینند.',
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyXpEarned: 180,
  dailyXpCap: 600,
  dailyRepEarned: 5,
  dailyRepCap: 20
};

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 1,
    title: 'پیاده‌سازی معماری امن ابری و تفکیک XP از Reputation',
    description: 'جداسازی امتیاز تجربه (تلاش و زحمت ساخت) از شاخص اعتبار (صداقت، پایداری و اخلاق رفاقتی)',
    reward: 180,
    repReward: 5,
    category: 'infra',
    scope: 'city',
    completed: false
  },
  {
    id: 2,
    title: 'طراحی موتور چندمرحله‌ای ترند آثار (Rising / Trending / Supported)',
    description: 'چرخه بررسی شفاف و عادلانه برای هدایت آثار مستعد رفقا به سمت حمایت رسمی شهری',
    reward: 150,
    repReward: 5,
    category: 'trend',
    scope: 'city',
    completed: false
  },
  {
    id: 3,
    title: 'راه‌اندازی اتاق همدلی و پناهگاه روحی رفیقان',
    description: 'فضایی امن برای شنیدن صدای همسنگران، تسکین رنج‌ها و تجدید نیروی روحی برای خلق اثر',
    reward: 200,
    repReward: 8,
    category: 'community',
    scope: 'city',
    completed: true
  },
  {
    id: 4,
    title: 'تأسیس سازوکار رأی‌گیری و تالار صندلی بزرگان (Meritocracy)',
    description: 'پایه‌ریزی ساختار چرخشی ۳۰ روزه با تکیه بر ترکیب تخصص، سابقه و اعتماد جامعه',
    reward: 190,
    repReward: 7,
    category: 'core',
    scope: 'city',
    completed: false
  },
  {
    id: 5,
    title: 'نوشتن مانیفست روزانه و پاک‌سازی میز کار (قدم ۲ دقیقه‌ای سنگر)',
    description: 'تمرکز روی یک کار خرد بدون استرس، صرفاً برای آغاز چرخه دوپامین تمیز صبحگاهی',
    reward: 120,
    repReward: 4,
    category: 'personal',
    scope: 'personal',
    completed: false
  },
  {
    id: 6,
    title: 'ارسال پیام دلگرمی و رفاقت به یکی از سازندگان تازه در اتاق همدلی',
    description: 'احیای روح یک رفیق ارزش‌آفرین که در میانه راه خسته شده است',
    reward: 140,
    repReward: 6,
    category: 'bounty',
    scope: 'personal',
    completed: false
  }
];

export const INITIAL_WORKS: WorkItem[] = [
  {
    id: 1,
    title: 'گیم ABLE City (نسخه رفیقان)',
    author: 'سیاوش',
    status: '🌟 تحت حمایت رسمی شهر',
    statusClass: 'status-supported',
    views: '3,200 بازدید',
    viewsCount: 3200,
    likesCount: 240,
    likedByMe: true,
    category: 'بازی و جهان مجازی',
    description: 'دنیای پیکسلی تعاملی برای اتصال رفقا، هم‌نوایی پروژه‌ها و تجربه زنده زیست در شهر توانا',
    date: '۲ روز پیش'
  },
  {
    id: 2,
    title: 'پروژه پناهگاه معنوی رفیقان',
    author: 'سهراب',
    status: '🔥 در حال ترند شدن',
    statusClass: 'status-trending',
    views: '1,450 بازدید',
    viewsCount: 1450,
    likesCount: 118,
    likedByMe: false,
    category: 'روانشناسی و احیای روح',
    description: 'نشست‌های هفتگی رفاقت‌درمانی برای بازیافتن معنا پس از شکست‌ها و فرسودگی‌ها',
    date: '۴ روز پیش'
  },
  {
    id: 3,
    title: 'موتور اعتبارسنجی غیرمتمرکز (OpenRep Protocol)',
    author: 'آریا',
    status: '🌱 در حال رشد (چرخه بررسی)',
    statusClass: 'status-rising',
    views: '680 بازدید',
    viewsCount: 680,
    likesCount: 45,
    likedByMe: false,
    category: 'ابزار فنی و زیرساخت',
    description: 'پروتکل کدباز برای ثبت شفاف فعالیت‌های ارزشمند بدون وابستگی به سرور مرکزی',
    date: 'دیروز'
  },
  {
    id: 4,
    title: 'مستند صوتی رنج و شاهکار',
    author: 'پروانه',
    status: '🌟 تحت حمایت رسمی شهر',
    statusClass: 'status-supported',
    views: '2,890 بازدید',
    viewsCount: 2890,
    likesCount: 195,
    likedByMe: false,
    category: 'محتوا و استریم',
    description: 'کاوش عمیق در تجربیات بنیان‌گذارانی که از سیاه‌ترین شب‌های زندگی‌شان نور آفریدند',
    date: '۱ هفته پیش'
  }
];

export const INITIAL_GRAND_CHAIRS: GrandChair[] = [
  {
    id: 1,
    seat: 'صندلی اول: معمار کلان',
    holder: 'سیاوش',
    term: 'دوره فعال (۲۴ روز باقیمانده)',
    desc: 'خالق هسته مرکزی و رنج‌دیده راه آفرینش؛ هدایت اصول زیربنایی شهر',
    isVacant: false,
    votes: 142,
    votedByMe: true,
    requiredRep: 90,
    requiredLevel: 3
  },
  {
    id: 2,
    seat: 'صندلی دوم: دیده‌بان و حامی رفیقان',
    holder: 'خالی (در انتظار شایسته‌ترین)',
    term: 'آماده برای انتصاب دوره‌ای ۳۰ روزه',
    desc: 'پاسداری از سلامت روحی و امنیت روانی جامعه، رسیدگی به درخواست‌های رفقا',
    isVacant: true,
    votes: 38,
    votedByMe: false,
    requiredRep: 80,
    requiredLevel: 2
  },
  {
    id: 3,
    seat: 'صندلی سوم: پیشکسوت کد و اثر',
    holder: 'خالی (در انتظار شایسته‌ترین)',
    term: 'آماده برای انتصاب دوره‌ای ۳۰ روزه',
    desc: 'ارزیابی فنی پروژه‌ها و تأیید انتقال آثار از فاز ترند به حمایت رسمی شهری',
    isVacant: true,
    votes: 29,
    votedByMe: false,
    requiredRep: 85,
    requiredLevel: 2
  }
];

export const INITIAL_LEAGUE: LeagueMember[] = [
  { rank: 1, name: 'سیاوش', xp: 850, rep: 94, badge: 'معمار کلان', isCurrent: true, growth: '+120 XP این هفته' },
  { rank: 2, name: 'آریا', xp: 620, rep: 81, badge: 'ارزش‌آفرین ارشد', growth: '+95 XP این هفته' },
  { rank: 3, name: 'سهراب', xp: 480, rep: 75, badge: 'یار همسنگر', growth: '+60 XP این هفته' },
  { rank: 4, name: 'پروانه', xp: 410, rep: 68, badge: 'پیشگام فرهنگ', growth: '+85 XP این هفته' },
  { rank: 5, name: 'کاوه', xp: 350, rep: 59, badge: 'پژوهشگر جوان', growth: '+40 XP این هفته' },
  { rank: 6, name: 'رویا', xp: 290, rep: 52, badge: 'همراه پرتلاش', growth: '+30 XP این هفته' }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 1,
    author: 'سیاوش',
    role: 'معمار کلان',
    text: 'سلام به همه رفیقان در ABLE City. اینجا هیچکس غریبه نیست؛ ما با رنج‌هایمان جهان خود را می‌سازیم و بار خستگی یکدیگر را به دوش می‌کشیم.',
    likes: 14,
    likedByMe: false,
    timestamp: '۱۰ دقیقه پیش',
    tag: 'عهد رفاقت'
  },
  {
    id: 2,
    author: 'آریا',
    role: 'ارزش‌آفرین ارشد',
    text: 'امروز خطوط کد این پناهگاه برکت گرفت. ممنون از انرژی پاک این محیط؛ اینجا حس ساختن دوباره در دل آدم زنده می‌شود.',
    likes: 9,
    likedByMe: false,
    timestamp: '۳۵ دقیقه پیش',
    tag: 'شوق ساختن'
  },
  {
    id: 3,
    author: 'سهراب',
    role: 'یار همسنگر',
    text: 'اگر امروز احساس خستگی یا ناامیدی کردی، بدون که تنها نیستی. خاکسترِ امروز، حاصلخیزترین بستر فردای توئه.',
    likes: 22,
    likedByMe: true,
    timestamp: '۱ ساعت پیش',
    tag: 'همدلی'
  }
];

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        user: { ...INITIAL_USER, ...(parsed.user || {}) },
        missions: Array.isArray(parsed.missions) && parsed.missions.length ? parsed.missions : INITIAL_MISSIONS,
        works: Array.isArray(parsed.works) && parsed.works.length ? parsed.works : INITIAL_WORKS,
        grandChairs: Array.isArray(parsed.grandChairs) && parsed.grandChairs.length ? parsed.grandChairs : INITIAL_GRAND_CHAIRS,
        league: Array.isArray(parsed.league) && parsed.league.length ? parsed.league : INITIAL_LEAGUE,
        chatMessages: Array.isArray(parsed.chatMessages) && parsed.chatMessages.length ? parsed.chatMessages : INITIAL_CHAT,
      };
    }
  } catch (e) {
    console.error('Error reading localStorage', e);
  }

  return {
    user: INITIAL_USER,
    missions: INITIAL_MISSIONS,
    works: INITIAL_WORKS,
    grandChairs: INITIAL_GRAND_CHAIRS,
    league: INITIAL_LEAGUE,
    chatMessages: INITIAL_CHAT,
  };
}

export function saveAppState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving localStorage', e);
  }
}
