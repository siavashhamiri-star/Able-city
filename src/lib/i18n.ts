export type SupportedLanguage = 'fa' | 'en' | 'ar' | 'es' | 'hi' | 'zh' | 'ru';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  dir: 'rtl' | 'ltr';
  flag: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', dir: 'rtl', flag: '🇮🇷' },
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇸🇦' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', flag: '🇪🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr', flag: '🇷🇺' },
];

export interface TranslationDictionary {
  appBadge: string;
  appTitle: string;
  appSubtitle: string;
  tabMissions: string;
  tabTrends: string;
  tabChairs: string;
  tabLeague: string;
  tabChat: string;
  tabAdhd: string;
  tabAndroid: string;
  tabA11y: string;

  // Soul HUD
  roleLabel: string;
  levelLabel: string;
  xpLabel: string;
  repLabel: string;
  nextLevel: string;
  defaultBio: string;
  editProfile: string;
  saveChanges: string;
  cancel: string;

  // Missions
  missionsHeader: string;
  missionsDesc: string;
  defineMission: string;
  completeMission: string;
  completed: string;
  missionProgress: string;

  // Trends
  submitWorkHeader: string;
  submitWorkDesc: string;
  workInputPlaceholder: string;
  submitWorkBtn: string;
  filterAll: string;
  filterSupported: string;
  filterTrending: string;
  filterRising: string;
  supportWorkBtn: string;
  supportedBadge: string;

  // Chairs
  chairsHeader: string;
  chairsDesc: string;
  nominateBtn: string;
  voteBtn: string;
  votedBadge: string;
  chairCriteria: string;

  // League
  leagueHeader: string;
  leagueDesc: string;
  sortByXp: string;
  sortByRep: string;
  rankBadge: string;

  // Chat
  chatHeader: string;
  chatBanner: string;
  chatInputPlaceholder: string;
  chatSubmitBtn: string;
  chatLikeBtn: string;
  chatFeedTitle: string;

  // Auth
  authTitle: string;
  authDesc: string;
  authIranTab: string;
  authGlobalTab: string;
  gmailLabel: string;
  mobileLabel: string;
  mobilePlaceholder: string;
  otpLabel: string;
  sendOtpBtn: string;
  verifyAndRegisterBtn: string;
  googleSignInBtn: string;
  verifiedCitizen: string;

  // Accessibility & ADHD
  a11yTitle: string;
  highContrast: string;
  textSize: string;
  reducedMotion: string;
  dyslexiaFont: string;
  adhdTitle: string;
  adhdDesc: string;
  focusModeToggle: string;
  focusRulerToggle: string;
  calmSoundToggle: string;
  pomodoroStart: string;
  pomodoroPause: string;
  pomodoroReset: string;
  breakdownAiTitle: string;
  breakdownAiDesc: string;
  breakdownAiBtn: string;

  // Android Hub
  androidHubTitle: string;
  androidHubDesc: string;
  gradleRootTitle: string;
  gradleAppTitle: string;
  githubActionTitle: string;
  copyCode: string;
  copied: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  fa: {
    appBadge: 'ABLE City — مأوای روحی رفیقان و ارزش‌آفرینان جهان',
    appTitle: 'ABLE City (شهر توانا)',
    appSubtitle: 'مأوای ارزش‌آفرینان، پناهگاه روحی و گیمیفیکیشن توسعه و خلاقیت',
    tabMissions: '🛠️ مأموریت‌ها',
    tabTrends: '🔥 آثار و ترند',
    tabChairs: '🏛️ صندلی بزرگان',
    tabLeague: '🏆 لیگ ارزش',
    tabChat: '💬 اتاق همدلی',
    tabAdhd: '🧠 تمرکز ADHD',
    tabAndroid: '📱 ساخت APK/AAB',
    tabA11y: '♿ دسترس‌پذیری',

    roleLabel: 'مقام:',
    levelLabel: 'سطح',
    xpLabel: 'XP',
    repLabel: 'اعتبار',
    nextLevel: 'مسیر تا سطح بعدی',
    defaultBio: 'اینجا خانه سوختگانی است که از خاکستر رنج، ارزش و جهان می‌آفرینند.',
    editProfile: 'ویرایش مشخصات روحی',
    saveChanges: 'ذخیره تغییرات',
    cancel: 'انصراف',

    missionsHeader: '💻 مأموریت‌های ساخت پلتفرم (گیمیفیکیشن توسعه)',
    missionsDesc: 'کدزدن و معماری در ABLE City خودش یک افتخار و مسابقه شیرین است:',
    defineMission: 'تعریف مأموریت جدید',
    completeMission: 'تکمیل مأموریت ⚡',
    completed: 'تکمیل شده ✅',
    missionProgress: 'پیشرفت کل مأموریت‌ها:',

    submitWorkHeader: '🚀 ثبت اثر، گیم یا پروژه در چرخه شهر',
    submitWorkDesc: 'اثر خود را وارد چرخه بررسی، اعتبار و حمایت رسمی کنید:',
    workInputPlaceholder: 'نام اثر، گیم، ابزار یا استریم...',
    submitWorkBtn: 'ثبت اثر و ورود به چرخه شهر 🌟',
    filterAll: 'همه',
    filterSupported: '🌟 تحت حمایت',
    filterTrending: '🔥 ترند',
    filterRising: '🌱 در حال رشد',
    supportWorkBtn: 'حمایت از اثر',
    supportedBadge: 'حمایت شده ❤️',

    chairsHeader: '👑 تالار صندلی بزرگان (دموکراسی شایسته‌سالار)',
    chairsDesc: 'صندلی‌های ۳۰ روزه بر اساس ترکیب XP، اعتبار (Reputation) و رأی رفیقان چرخشی هستند.',
    nominateBtn: 'نامزدی برای این صندلی',
    voteBtn: 'حمایت و رأی اعتماد',
    votedBadge: 'رأی شما ثبت شده',
    chairCriteria: 'شرط احراز:',

    leagueHeader: '🏆 لیگ برتر ارزش‌آفرینان شهر',
    leagueDesc: 'جایگاه رفیقان بر پایه ثبات در مأموریت‌ها، کیفیت آثار و همدلی با دیگران سنجیده می‌شود.',
    sortByXp: 'بر اساس تجربه (XP)',
    sortByRep: 'بر اساس اعتبار (Rep)',
    rankBadge: 'رتبه',

    chatHeader: '💬 ارسال پیام به رفیقان',
    chatBanner: '💙 این فضا برای گفتگوی زنده، اشتراک حرف دل و گرفتن انرژی از رفیقان هم‌مسیر است. حامی یکدیگر باشیم.',
    chatInputPlaceholder: 'حرف دلت، ایده یا تجربه‌ات رو بنویس...',
    chatSubmitBtn: 'به اشتراک‌گذاری با رفیقان ❤️',
    chatLikeBtn: 'حمایت رفاقتی',
    chatFeedTitle: '🕊️ زمزمه‌های هم‌مسیران',

    authTitle: 'عضویت و احراز هویت در شهر توانا',
    authDesc: 'ثبت‌نام رسمی شهروندان: ویژه ایران با جیمیل + موبایل؛ سایر کشورها با جیمیل',
    authIranTab: '🇮🇷 ایران (جیمیل + موبایل)',
    authGlobalTab: '🌐 سایر کشورها (جیمیل)',
    gmailLabel: 'آدرس جیمیل (Google Email):',
    mobileLabel: 'شماره موبایل ایران (با سرشماره ۰۹):',
    mobilePlaceholder: '۰۹۱۲۳۴۵۶۷۸۹',
    otpLabel: 'کد ۶ رقمی تأیید پیامک:',
    sendOtpBtn: 'دریافت کد تایید پیامکی',
    verifyAndRegisterBtn: 'تأیید نهایی و ورود به شهر توانا ✨',
    googleSignInBtn: 'ورود سریع با حساب Google / Gmail',
    verifiedCitizen: 'شهروند تایید‌شده و معتبر',

    a11yTitle: 'تنظیمات دسترسی‌پذیری معلولان (Accessibility)',
    highContrast: 'کنتراست فوق‌العاده بالا (High Contrast)',
    textSize: 'اندازه قلم و متون',
    reducedMotion: 'کاهش پویانمایی و نورها (Reduced Motion)',
    dyslexiaFont: 'خوانش روان و فاصله خطوط بهینه',
    adhdTitle: 'سوییت ویژه تمرکز و آرامش ذهن (ADHD Flow)',
    adhdDesc: 'ابزارهای کاهش حواس‌پرتی، شکستن وظایف به قدم‌های ریز ۲ دقیقه‌ای و آرامش حسی',
    focusModeToggle: 'فعال‌سازی حالت تمرکز محض (حذف تمام اضافات)',
    focusRulerToggle: 'خط‌کش راهنمای مطالعه متحرک (Focus Ruler)',
    calmSoundToggle: 'صدای ممتد آرامش‌بخش فرکانس ذن (Brown Noise)',
    pomodoroStart: 'شروع ۲۵ دقیقه تمرکز',
    pomodoroPause: 'توقف موقت',
    pomodoroReset: 'بازنشانی زمان',
    breakdownAiTitle: 'تجزیه‌کننده هوشمند وظایف (بدون نیاز به کلید API)',
    breakdownAiDesc: 'اگر یک کار برایت سنگین به نظر می‌رسد، هوش مصنوعی آن را به ۳ قدم بسیار ساده تبدیل می‌کند:',
    breakdownAiBtn: 'تجزیه هوشمند به قدم‌های کوچک ۲ دقیقه‌ای ⚡',

    androidHubTitle: '📱 مرکز استقرار موبایل و ساخت APK / AAB',
    androidHubDesc: 'مقدمات کامل فایل گرادول و پایپ‌لاین گیت‌هاب اکشن برای بیلد خودکار پکیج‌های اندروید',
    gradleRootTitle: 'فایل تنظیمات ریشه (root build.gradle)',
    gradleAppTitle: 'فایل ساخت اپلیکیشن (app/build.gradle)',
    githubActionTitle: 'گردش کار خودکار GitHub Actions (build-apk-aab.yml)',
    copyCode: 'کپی کد',
    copied: 'کپی شد!',
  },

  en: {
    appBadge: 'ABLE City — Soul Sanctuary for Value Creators & Dreamers',
    appTitle: 'ABLE City',
    appSubtitle: 'Sanctuary for creators, mental revival, and gamified development',
    tabMissions: '🛠️ Missions',
    tabTrends: '🔥 Works & Trends',
    tabChairs: '🏛️ Grand Chairs',
    tabLeague: '🏆 Value League',
    tabChat: '💬 Empathy Room',
    tabAdhd: '🧠 ADHD Focus',
    tabAndroid: '📱 APK / AAB Hub',
    tabA11y: '♿ Accessibility',

    roleLabel: 'Role:',
    levelLabel: 'Level',
    xpLabel: 'XP',
    repLabel: 'Rep',
    nextLevel: 'Progress to next level',
    defaultBio: 'Home to the resilient who forge value and worlds out of the ashes of hardship.',
    editProfile: 'Edit Soul Profile',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',

    missionsHeader: '💻 Platform Build Missions (Dev Gamification)',
    missionsDesc: 'Architecting and coding in ABLE City is an honor and a joyful quest:',
    defineMission: 'New Mission',
    completeMission: 'Complete ⚡',
    completed: 'Completed ✅',
    missionProgress: 'Total Mission Progress:',

    submitWorkHeader: '🚀 Submit Work, Game, or Project to City Cycle',
    submitWorkDesc: 'Submit your creation for verification, credibility, and official city support:',
    workInputPlaceholder: 'Title of game, tool, podcast, or stream...',
    submitWorkBtn: 'Submit Work to City Cycle 🌟',
    filterAll: 'All',
    filterSupported: '🌟 Supported',
    filterTrending: '🔥 Trending',
    filterRising: '🌱 Rising',
    supportWorkBtn: 'Support Work',
    supportedBadge: 'Supported ❤️',

    chairsHeader: '👑 Hall of Grand Chairs (Meritocratic Council)',
    chairsDesc: '30-day rotating seats earned through XP, Reputation, and comrade votes.',
    nominateBtn: 'Nominate for this Chair',
    voteBtn: 'Vote & Support',
    votedBadge: 'Vote Cast',
    chairCriteria: 'Prerequisite:',

    leagueHeader: '🏆 Premier League of City Value Creators',
    leagueDesc: 'Ranked by consistency in missions, quality of works, and peer empathy.',
    sortByXp: 'By Experience (XP)',
    sortByRep: 'By Reputation (Rep)',
    rankBadge: 'Rank',

    chatHeader: '💬 Send Message to Comrades',
    chatBanner: '💙 This space is for honest conversation and mutual strength. Stand with one another.',
    chatInputPlaceholder: 'Write your thoughts, ideas, or experiences...',
    chatSubmitBtn: 'Share with Comrades ❤️',
    chatLikeBtn: 'Comrade Support',
    chatFeedTitle: '🕊️ Whispers of Comrades',

    authTitle: 'Citizenship & Authentication in ABLE City',
    authDesc: 'Official registration: For Iran via Gmail + Mobile; For other countries via Gmail',
    authIranTab: '🇮🇷 Iran (Gmail + Mobile)',
    authGlobalTab: '🌐 Global (Gmail)',
    gmailLabel: 'Gmail Address:',
    mobileLabel: 'Iran Mobile Number (09...):',
    mobilePlaceholder: '09123456789',
    otpLabel: '6-digit SMS Verification Code:',
    sendOtpBtn: 'Send SMS OTP Code',
    verifyAndRegisterBtn: 'Verify & Enter ABLE City ✨',
    googleSignInBtn: 'Quick Sign In with Google / Gmail',
    verifiedCitizen: 'Verified Citizen',

    a11yTitle: 'Accessibility Suite (Disabilities & Screen Readers)',
    highContrast: 'Ultra High Contrast Mode',
    textSize: 'Text Size Scaling',
    reducedMotion: 'Reduced Motion & Glows',
    dyslexiaFont: 'Optimal Line Spacing & Font Clarity',
    adhdTitle: 'ADHD Flow & Cognitive Calm Suite',
    adhdDesc: 'Clutter-free flow, 2-minute micro-step breakdown, and sensory-calming soundscapes',
    focusModeToggle: 'Pure Focus Mode (Hide Visual Clutter)',
    focusRulerToggle: 'Dynamic Focus Reading Ruler',
    calmSoundToggle: 'Zen Frequency Ambient Sound (Brown Noise)',
    pomodoroStart: 'Start 25m Focus Block',
    pomodoroPause: 'Pause',
    pomodoroReset: 'Reset Timer',
    breakdownAiTitle: 'Smart Task Decomposer (Zero API Key Setup Required)',
    breakdownAiDesc: 'Overwhelmed by a large task? Automated AI breaks it down into 3 micro-steps:',
    breakdownAiBtn: 'Break down into 2-minute micro-steps ⚡',

    androidHubTitle: '📱 Android APK / AAB & Gradle Build Hub',
    androidHubDesc: 'Complete Gradle configuration and automated GitHub Actions workflow for building Android APK/AAB',
    gradleRootTitle: 'Root Gradle Configuration (build.gradle)',
    gradleAppTitle: 'App Module Gradle (app/build.gradle)',
    githubActionTitle: 'Automated GitHub Actions CI/CD (build-apk-aab.yml)',
    copyCode: 'Copy Code',
    copied: 'Copied!',
  },

  ar: {
    appBadge: 'ABLE City — ملاذ أرواح المبدعين وصناع القيمة في العالم',
    appTitle: 'ABLE City (مدينة توانا)',
    appSubtitle: 'ملاذ صناع القيمة، إحياء الأرواح والتحفيز البرمجي',
    tabMissions: '🛠️ المهمات',
    tabTrends: '🔥 الأعمال والترند',
    tabChairs: '🏛️ مقاعد الكبار',
    tabLeague: '🏆 دوري القيمة',
    tabChat: '💬 غرفة التعاطف',
    tabAdhd: '🧠 تركيز ADHD',
    tabAndroid: '📱 حزمة APK/AAB',
    tabA11y: '♿ إمكانية الوصول',

    roleLabel: 'الرتبة:',
    levelLabel: 'المستوى',
    xpLabel: 'XP',
    repLabel: 'السمعة',
    nextLevel: 'التقدم نحو المستوى التالي',
    defaultBio: 'هنا موطن الصامدين الذين يخلقون من رماد المعاناة قيمة وعوالم جديدة.',
    editProfile: 'تعديل الملف الروحي',
    saveChanges: 'حفظ التعديلات',
    cancel: 'إلغاء',

    missionsHeader: '💻 مهمات بناء المنصة (تحفيز التطوير)',
    missionsDesc: 'البرمجة والهندسة في ABLE City فخر وتنافس ممتع:',
    defineMission: 'مهمة جديدة',
    completeMission: 'إنجاز المهمة ⚡',
    completed: 'مكتمل ✅',
    missionProgress: 'تقدم المهمات الإجمالي:',

    submitWorkHeader: '🚀 تسجيل عمل أو لعبة أو مشروع في دورة المدينة',
    submitWorkDesc: 'سجل عملك للمراجعة والاعتماد والحصول على الدعم الرسمي:',
    workInputPlaceholder: 'اسم العمل، اللعبة، الأداة أو البث...',
    submitWorkBtn: 'تسجيل العمل في المدينة 🌟',
    filterAll: 'الكل',
    filterSupported: '🌟 مدعوم',
    filterTrending: '🔥 ترند',
    filterRising: '🌱 صاعد',
    supportWorkBtn: 'دعم العمل',
    supportedBadge: 'تم الدعم ❤️',

    chairsHeader: '👑 مجلس مقاعد الكبار (ديمقراطية الكفاءة)',
    chairsDesc: 'مقاعد دورية لمدة ۳۰ يوماً تُكتسب بناءً على نقاط XP والسمعة وتصويت الرفاق.',
    nominateBtn: 'الترشح لهذا المقعد',
    voteBtn: 'تصويت ومنح الثقة',
    votedBadge: 'تم تصويتك',
    chairCriteria: 'الشرط:',

    leagueHeader: '🏆 الدوري الممتاز لصناع القيمة',
    leagueDesc: 'ترتيب الرفاق بناءً على الاستمرارية في المهمات وجودة الأعمال.',
    sortByXp: 'حسب الخبرة (XP)',
    sortByRep: 'حسب السمعة (Rep)',
    rankBadge: 'الترتيب',

    chatHeader: '💬 إرسال رسالة للرفاق',
    chatBanner: '💙 هذه المساحة للحوار الصادق والدعم المتبادل. لنكن سنداً لبعضنا.',
    chatInputPlaceholder: 'اكتب مشاعرك، أفكارك أو تجاربك...',
    chatSubmitBtn: 'مشاركة مع الرفاق ❤️',
    chatLikeBtn: 'دعم رفاقي',
    chatFeedTitle: '🕊️ همسات الرفاق',

    authTitle: 'المواطنة والتسجيل في ABLE City',
    authDesc: 'التسجيل الرسمي: لإيران عبر جيميل + الهاتف؛ ولبقية الدول عبر جيميل',
    authIranTab: '🇮🇷 إيران (جيميل + هاتف)',
    authGlobalTab: '🌐 بقية الدول (جيميل)',
    gmailLabel: 'بريد Gmail:',
    mobileLabel: 'رقم هاتف إيران (۰۹...):',
    mobilePlaceholder: '۰۹۱۲۳۴۵۶۷۸۹',
    otpLabel: 'رمز التحقق عبر SMS (۶ أرقام):',
    sendOtpBtn: 'إرسال رمز SMS',
    verifyAndRegisterBtn: 'تأكيد ودخول المدينة ✨',
    googleSignInBtn: 'دخول سريع عبر Google / Gmail',
    verifiedCitizen: 'مواطن موثق ومعتمد',

    a11yTitle: 'إمكانية الوصول لذوي الاحتياجات الخاصة (Accessibility)',
    highContrast: 'تباين فائق (High Contrast)',
    textSize: 'حجم الخطوط والنصوص',
    reducedMotion: 'تقليل الحركات والإضاءات (Reduced Motion)',
    dyslexiaFont: 'وضوح الخطوط للقراءة السلسة',
    adhdTitle: 'بيئة التركيز والهدوء الذهني (ADHD Flow)',
    adhdDesc: 'أدوات تقليل التشتت وتفكيك المهام لخطوات دقيقتين وأصوات هادئة',
    focusModeToggle: 'تفعيل وضع التركيز الخالص',
    focusRulerToggle: 'مسطرة القراءة والتركيز التفاعلية',
    calmSoundToggle: 'صوت التردد الهادئ (Brown Noise)',
    pomodoroStart: 'بدء ۲۵ دقيقة تركيز',
    pomodoroPause: 'إيقاف مؤقت',
    pomodoroReset: 'إعادة ضبط',
    breakdownAiTitle: 'مفكك المهام الذكي (يعمل تلقائياً بدون مفتاح API)',
    breakdownAiDesc: 'إذا شعرت بأن المهمة صعبة، الذكاء الاصطناعي يقسمها لـ ۳ خطوات بسيطة:',
    breakdownAiBtn: 'تقسيم ذكي إلى خطوات من دقيقتين ⚡',

    androidHubTitle: '📱 إعدادات Gradle وبناء APK / AAB',
    androidHubDesc: 'ملفات Gradle الكاملة وسير عمل GitHub Actions لإنشاء حزم أندرويد تلقائياً',
    gradleRootTitle: 'ملف الجذر (build.gradle)',
    gradleAppTitle: 'ملف التطبيق (app/build.gradle)',
    githubActionTitle: 'سير عمل GitHub Actions (build-apk-aab.yml)',
    copyCode: 'نسخ الكود',
    copied: 'تم النسخ!',
  },

  es: {
    appBadge: 'ABLE City — Santuario del alma para creadores de valor',
    appTitle: 'ABLE City',
    appSubtitle: 'Refugio para creadores, recuperación anímica y gamificación del desarrollo',
    tabMissions: '🛠️ Misiones',
    tabTrends: '🔥 Obras y Tendencias',
    tabChairs: '🏛️ Grandes Asientos',
    tabLeague: '🏆 Liga de Valor',
    tabChat: '💬 Sala de Empatía',
    tabAdhd: '🧠 Enfoque TDAH',
    tabAndroid: '📱 APK / AAB Hub',
    tabA11y: '♿ Accesibilidad',

    roleLabel: 'Rol:',
    levelLabel: 'Nivel',
    xpLabel: 'XP',
    repLabel: 'Rep',
    nextLevel: 'Progreso al siguiente nivel',
    defaultBio: 'Hogar de los resilientes que forjan valor y mundos desde las cenizas de la adversidad.',
    editProfile: 'Editar Perfil del Alma',
    saveChanges: 'Guardar Cambios',
    cancel: 'Cancelar',

    missionsHeader: '💻 Misiones de Construcción de Plataforma (Gamificación Dev)',
    missionsDesc: 'Desarrollar y diseñar en ABLE City es un honor y una aventura estimulante:',
    defineMission: 'Nueva Misión',
    completeMission: 'Completar ⚡',
    completed: 'Completado ✅',
    missionProgress: 'Progreso Total de Misiones:',

    submitWorkHeader: '🚀 Registrar Obra, Juego o Proyecto en el Ciclo Urbano',
    submitWorkDesc: 'Presenta tu creación para verificación, reputación y apoyo oficial:',
    workInputPlaceholder: 'Título de la obra, juego, herramienta o podcast...',
    submitWorkBtn: 'Registrar Obra en la Ciudad 🌟',
    filterAll: 'Todo',
    filterSupported: '🌟 Con Apoyo',
    filterTrending: '🔥 Tendencia',
    filterRising: '🌱 Creciente',
    supportWorkBtn: 'Apoyar Obra',
    supportedBadge: 'Apoyado ❤️',

    chairsHeader: '👑 Salón de los Grandes Asientos (Consejo Meritocrático)',
    chairsDesc: 'Puestos rotativos de 30 días obtenidos por XP, Reputación y votos comunitarios.',
    nominateBtn: 'Postularse a este Asiento',
    voteBtn: 'Votar Confianza',
    votedBadge: 'Voto Registrado',
    chairCriteria: 'Requisito:',

    leagueHeader: '🏆 Liga de Honor de Creadores de Valor',
    leagueDesc: 'Clasificación basada en constancia en misiones, calidad de obras y empatía.',
    sortByXp: 'Por Experiencia (XP)',
    sortByRep: 'Por Reputación (Rep)',
    rankBadge: 'Rango',

    chatHeader: '💬 Enviar Mensaje a los Compañeros',
    chatBanner: '💙 Este espacio es para diálogo sincero y aliento mutuo. Seamos apoyo recíproco.',
    chatInputPlaceholder: 'Escribe tus pensamientos, ideas o experiencias...',
    chatSubmitBtn: 'Compartir con Compañeros ❤️',
    chatLikeBtn: 'Apoyo Fraterno',
    chatFeedTitle: '🕊️ Susurros de los Compañeros',

    authTitle: 'Ciudadanía y Registro en ABLE City',
    authDesc: 'Registro oficial: Para Irán vía Gmail + Móvil; Para otros países vía Gmail',
    authIranTab: '🇮🇷 Irán (Gmail + Móvil)',
    authGlobalTab: '🌐 Internacional (Gmail)',
    gmailLabel: 'Correo Gmail:',
    mobileLabel: 'Teléfono Móvil de Irán (09...):',
    mobilePlaceholder: '09123456789',
    otpLabel: 'Código SMS de 6 dígitos:',
    sendOtpBtn: 'Enviar Código SMS',
    verifyAndRegisterBtn: 'Verificar y Entrar a ABLE City ✨',
    googleSignInBtn: 'Acceso Rápido con Google / Gmail',
    verifiedCitizen: 'Ciudadano Verificado',

    a11yTitle: 'Suite de Accesibilidad (Discapacidades y Lectores de Pantalla)',
    highContrast: 'Modo de Alto Contraste',
    textSize: 'Escala de Tamaño de Texto',
    reducedMotion: 'Reducción de Movimiento y Destellos',
    dyslexiaFont: 'Interlineado Óptimo y Legibilidad',
    adhdTitle: 'Suite de Enfoque y Calma Cognitiva (TDAH)',
    adhdDesc: 'Entorno sin distracciones, descomposición en micro-pasos de 2 minutos y ruido blanco zen',
    focusModeToggle: 'Modo Enfoque Puro (Ocultar Distracciones)',
    focusRulerToggle: 'Regla Guía de Lectura Dinámica',
    calmSoundToggle: 'Sonido Ambiental Relajante (Brown Noise)',
    pomodoroStart: 'Iniciar Bloque de 25m',
    pomodoroPause: 'Pausa',
    pomodoroReset: 'Reiniciar Temporizador',
    breakdownAiTitle: 'Descompositor Inteligente de Tareas (Sin claves de API)',
    breakdownAiDesc: '¿Una tarea parece abrumadora? La IA automática la divide en 3 micro-pasos sencillos:',
    breakdownAiBtn: 'Descomponer en micro-pasos de 2 minutos ⚡',

    androidHubTitle: '📱 Centro de Compilación Android APK / AAB & Gradle',
    androidHubDesc: 'Configuración Gradle completa y workflow de GitHub Actions para compilar APK y AAB automáticamente',
    gradleRootTitle: 'Configuración Raíz (build.gradle)',
    gradleAppTitle: 'Módulo de Aplicación (app/build.gradle)',
    githubActionTitle: 'Flujo Automatizado de GitHub Actions (build-apk-aab.yml)',
    copyCode: 'Copiar Código',
    copied: '¡Copiado!',
  },

  hi: {
    appBadge: 'ABLE City — रचनाकारों और आत्माओं के लिए पावन आश्रय',
    appTitle: 'ABLE City (सक्षम नगर)',
    appSubtitle: 'मूल्य रचनाकारों का आश्रय, आत्मिक नवीनीकरण और गेमीफाइड विकास',
    tabMissions: '🛠️ मिशन',
    tabTrends: '🔥 कृतियाँ व ट्रेंड',
    tabChairs: '🏛️ प्रमुख आसन',
    tabLeague: '🏆 मूल्य लीग',
    tabChat: '💬 सहानुभूति कक्ष',
    tabAdhd: '🧠 ADHD फोकस',
    tabAndroid: '📱 APK / AAB हब',
    tabA11y: '♿ सुगमता (A11y)',

    roleLabel: 'पद:',
    levelLabel: 'स्तर',
    xpLabel: 'XP',
    repLabel: 'प्रतिष्ठा',
    nextLevel: 'अगले स्तर की प्रगति',
    defaultBio: 'कठिनाइयों की राख से नया मूल्य और नई दुनिया रचने वालों का घर।',
    editProfile: 'प्रोफ़ाइल संपादित करें',
    saveChanges: 'परिवर्तन सहेजें',
    cancel: 'रद्द करें',

    missionsHeader: '💻 प्लेटफ़ॉर्म निर्माण मिशन (डेव गेमीफिकेशन)',
    missionsDesc: 'ABLE City में कोडिंग और वास्तुकला एक गौरवशाली खोज है:',
    defineMission: 'नया मिशन',
    completeMission: 'मिशन पूर्ण करें ⚡',
    completed: 'पूर्ण ✅',
    missionProgress: 'कुल मिशन प्रगति:',

    submitWorkHeader: '🚀 शहर चक्र में कृति, गेम या प्रोजेक्ट पंजीकृत करें',
    submitWorkDesc: 'समीक्षा, प्रमाणिकता और आधिकारिक समर्थन के लिए अपनी रचना दर्ज करें:',
    workInputPlaceholder: 'कृति, गेम, टूल या पॉडकास्ट का नाम...',
    submitWorkBtn: 'शहर में कृति दर्ज करें 🌟',
    filterAll: 'सभी',
    filterSupported: '🌟 समर्थित',
    filterTrending: '🔥 ट्रेंडिंग',
    filterRising: '🌱 अग्रसर',
    supportWorkBtn: 'समर्थन दें',
    supportedBadge: 'समर्थित ❤️',

    chairsHeader: '👑 प्रमुख आसन कक्ष (योग्यता आधारित परिषद)',
    chairsDesc: 'XP, प्रतिष्ठा और साथियों के मतों द्वारा अर्जित ३०-दिवसीय घूर्णन आसन।',
    nominateBtn: 'इस आसन के लिए नामांकन करें',
    voteBtn: 'मत दें व समर्थन करें',
    votedBadge: 'मत दर्ज हुआ',
    chairCriteria: 'पात्रता शर्त:',

    leagueHeader: '🏆 मूल्य रचनाकारों की प्रीमियर लीग',
    leagueDesc: 'मिशनों में निरंतरता और साथियों के प्रति सहानुभूति पर आधारित रैंकिंग।',
    sortByXp: 'अनुभव (XP) अनुसार',
    sortByRep: 'प्रतिष्ठा (Rep) अनुसार',
    rankBadge: 'रैंक',

    chatHeader: '💬 साथियों को संदेश भेजें',
    chatBanner: '💙 यह स्थान सच्चे संवाद और परस्पर संबल के लिए है। एक-दूसरे का सहारा बनें।',
    chatInputPlaceholder: 'अपने दिल की बात, विचार या अनुभव लिखें...',
    chatSubmitBtn: 'साथियों से साझा करें ❤️',
    chatLikeBtn: 'मित्रवत समर्थन',
    chatFeedTitle: '🕊️ साथियों की आवाज़',

    authTitle: 'ABLE City में नागरिकता व पंजीकरण',
    authDesc: 'आधिकारिक पंजीकरण: ईरान हेतु Gmail + मोबाइल; अन्य देशों हेतु Gmail',
    authIranTab: '🇮🇷 ईरान (Gmail + मोबाइल)',
    authGlobalTab: '🌐 अंतर्राष्ट्रीय (Gmail)',
    gmailLabel: 'Gmail पता:',
    mobileLabel: 'ईरान मोबाइल नंबर (09...):',
    mobilePlaceholder: '09123456789',
    otpLabel: '६-अंकीय SMS सत्यापन कोड:',
    sendOtpBtn: 'SMS OTP भेजें',
    verifyAndRegisterBtn: 'सत्यापित करें और नगर में प्रवेश करें ✨',
    googleSignInBtn: 'Google / Gmail से त्वरित लॉगिन',
    verifiedCitizen: 'प्रमाणित नागरिक',

    a11yTitle: 'सुगमता एवं दिव्यांग सहायता (Accessibility)',
    highContrast: 'अति उच्च कंट्रास्ट मोड',
    textSize: 'पाठ्य आकार पैमाना',
    reducedMotion: 'मोशन व चमक में कमी (Reduced Motion)',
    dyslexiaFont: 'स्पष्ट पठनीयता और अंतरण',
    adhdTitle: 'ADHD ध्यान व शांति केंद्र',
    adhdDesc: 'विक्षेप-मुक्त कार्य, २ मिनट के सूक्ष्म-कदमों में विभाजन और शांत ध्वनियाँ',
    focusModeToggle: 'शुद्ध फोकस मोड (अनावश्यक तत्वों को छिपाएँ)',
    focusRulerToggle: 'डायनामिक पठन रूलर (Focus Ruler)',
    calmSoundToggle: 'ज़ेन आवृत्ति परिवेशी ध्वनि (Brown Noise)',
    pomodoroStart: '२५ मिनट का फोकस सत्र शुरू करें',
    pomodoroPause: 'रोकें',
    pomodoroReset: 'रीसेट करें',
    breakdownAiTitle: 'स्मार्ट कार्य विश्लेषक (स्वचालित - किसी API कुंजी की आवश्यकता नहीं)',
    breakdownAiDesc: 'क्या कोई कार्य कठिन लग रहा है? स्वचालित AI इसे ३ सरल कदमों में बाँटता है:',
    breakdownAiBtn: '२ मिनट के सूक्ष्म चरणों में विभाजित करें ⚡',

    androidHubTitle: '📱 Android APK / AAB व Gradle बिल्ड हब',
    androidHubDesc: 'Android APK/AAB स्वचालित निर्माण हेतु पूर्ण Gradle कॉन्फ़िगरेशन व GitHub Actions वर्कफ़्लो',
    gradleRootTitle: 'रूट ग्रेडल फ़ाइल (build.gradle)',
    gradleAppTitle: 'ऐप मॉड्यूल ग्रेडल (app/build.gradle)',
    githubActionTitle: 'स्वचालित GitHub Actions वर्कफ़्लो (build-apk-aab.yml)',
    copyCode: 'कोड कॉपी करें',
    copied: 'कॉपी हो गया!',
  },

  zh: {
    appBadge: 'ABLE City — 全球价值创造者与心灵觉醒者的庇护所',
    appTitle: 'ABLE City (有为之城)',
    appSubtitle: '价值创造者庇护所、心灵复苏与研发游戏化平台',
    tabMissions: '🛠️ 使命任务',
    tabTrends: '🔥 作品与趋势',
    tabChairs: '🏛️ 贤达席位',
    tabLeague: '🏆 价值联赛',
    tabChat: '💬 共情空间',
    tabAdhd: '🧠 ADHD专注',
    tabAndroid: '📱 APK/AAB打包',
    tabA11y: '♿ 无障碍辅助',

    roleLabel: '头衔：',
    levelLabel: '等级',
    xpLabel: '经验',
    repLabel: '信誉',
    nextLevel: '下一级升级进度',
    defaultBio: '这里是坚韧者的精神家园，我们在苦难的灰烬中创造价值与崭新世界。',
    editProfile: '编辑个人宣言',
    saveChanges: '保存更改',
    cancel: '取消',

    missionsHeader: '💻 平台开发使命（研发游戏化）',
    missionsDesc: '在 ABLE City 编写代码与架构系统是一场充满荣耀与激情的探索：',
    defineMission: '定义新使命',
    completeMission: '完成使命 ⚡',
    completed: '已完成 ✅',
    missionProgress: '总体使命进度：',

    submitWorkHeader: '🚀 向城市运转周期提交作品、游戏或项目',
    submitWorkDesc: '提交您的心血之作以获取验证、声誉及官方鼎力支持：',
    workInputPlaceholder: '作品名称、游戏、工具或播客...',
    submitWorkBtn: '提交作品并进入城市周期 🌟',
    filterAll: '全部',
    filterSupported: '🌟 官方支持',
    filterTrending: '🔥 热门趋势',
    filterRising: '🌱 新生萌芽',
    supportWorkBtn: '支持作品',
    supportedBadge: '已支持 ❤️',

    chairsHeader: '👑 贤达席位殿堂（唯才是举议事会）',
    chairsDesc: '基于经验值(XP)、声誉(Rep)与同道投票产生的30天轮换席位。',
    nominateBtn: '竞逐此席位',
    voteBtn: '投票信任',
    votedBadge: '已投票',
    chairCriteria: '任职要求：',

    leagueHeader: '🏆 价值创造者超级联赛',
    leagueDesc: '根据使命坚持度、作品质量和共情支持实时排名。',
    sortByXp: '按经验值(XP)',
    sortByRep: '按信誉分(Rep)',
    rankBadge: '名次',

    chatHeader: '💬 向同道挚友倾诉与交流',
    chatBanner: '💙 这是一个真诚对话与彼此赋能的空间。我们风雨同舟，携手前行。',
    chatInputPlaceholder: '写下你的心声、灵感或人生感悟...',
    chatSubmitBtn: '与同道分享 ❤️',
    chatLikeBtn: '情谊支持',
    chatFeedTitle: '🕊️ 同道之音',

    authTitle: 'ABLE City 公民身份与注册认证',
    authDesc: '官方注册流程：伊朗用户通过 Gmail + 手机号；其他国家用户通过 Gmail',
    authIranTab: '🇮🇷 伊朗（Gmail + 手机）',
    authGlobalTab: '🌐 国际（Gmail）',
    gmailLabel: 'Gmail 邮箱地址：',
    mobileLabel: '伊朗手机号码 (09...)：',
    mobilePlaceholder: '09123456789',
    otpLabel: '6位短信验证码：',
    sendOtpBtn: '发送短信验证码',
    verifyAndRegisterBtn: '验证并步入有为之城 ✨',
    googleSignInBtn: '使用 Google / Gmail 一键登录',
    verifiedCitizen: '认证公民',

    a11yTitle: '无障碍辅助套件 (Accessibility)',
    highContrast: '超高对比度模式',
    textSize: '字体大小缩放',
    reducedMotion: '减少动效与高光 (Reduced Motion)',
    dyslexiaFont: '易读性行距与字形优化',
    adhdTitle: 'ADHD专注力与心流套件',
    adhdDesc: '无杂念清爽界面、2分钟微步拆解以及禅宗白噪音舒缓环境',
    focusModeToggle: '纯粹专注模式（隐藏一切视觉干扰）',
    focusRulerToggle: '跟随视线的阅读聚焦尺 (Focus Ruler)',
    calmSoundToggle: '禅意舒缓背景音 (Brown Noise)',
    pomodoroStart: '启动25分钟番茄专注',
    pomodoroPause: '暂停',
    pomodoroReset: '重置计时',
    breakdownAiTitle: '智能任务微步拆解器（无需手动配置API Key）',
    breakdownAiDesc: '觉得某个任务太庞大拖延？AI自动将其拆解为3个两分钟微步骤：',
    breakdownAiBtn: '智能拆解为2分钟微步 ⚡',

    androidHubTitle: '📱 Android APK / AAB 打包与 Gradle 构建中心',
    androidHubDesc: '完备的 Gradle 构建配置与 GitHub Actions 自动编译出包流水线',
    gradleRootTitle: '根目录 Gradle (build.gradle)',
    gradleAppTitle: '应用模块 Gradle (app/build.gradle)',
    githubActionTitle: 'GitHub Actions 自动打包流水线 (build-apk-aab.yml)',
    copyCode: '复制代码',
    copied: '已复制！',
  },

  ru: {
    appBadge: 'ABLE City — Духовное пристанище созидателей ценностей',
    appTitle: 'ABLE City',
    appSubtitle: 'Обитель творцов, душевное возрождение и геймификация разработки',
    tabMissions: '🛠️ Миссии',
    tabTrends: '🔥 Работы и Тренды',
    tabChairs: '🏛️ Совет Старейшин',
    tabLeague: '🏆 Лига Ценности',
    tabChat: '💬 Зал Эмпатии',
    tabAdhd: '🧠 СДВГ Фокус',
    tabAndroid: '📱 Сборка APK / AAB',
    tabA11y: '♿ Доступность',

    roleLabel: 'Звание:',
    levelLabel: 'Уровень',
    xpLabel: 'XP',
    repLabel: 'Репутация',
    nextLevel: 'Прогресс до след. уровня',
    defaultBio: 'Здесь дом стойких, создающих миры и ценности из пепла невзгод.',
    editProfile: 'Редактировать профиль духа',
    saveChanges: 'Сохранить изменения',
    cancel: 'Отмена',

    missionsHeader: '💻 Миссии строительства платформы (Геймификация Dev)',
    missionsDesc: 'Программирование и архитектура в ABLE City — это честь и увлекательный путь:',
    defineMission: 'Новая миссия',
    completeMission: 'Завершить ⚡',
    completed: 'Завершено ✅',
    missionProgress: 'Общий прогресс миссий:',

    submitWorkHeader: '🚀 Регистрация проекта или игры в городском цикле',
    submitWorkDesc: 'Отправьте проект на проверку, подтверждение репутации и поддержку:',
    workInputPlaceholder: 'Название игры, утилиты, подкаста или проекта...',
    submitWorkBtn: 'Зарегистрировать работу в Городе 🌟',
    filterAll: 'Все',
    filterSupported: '🌟 С поддержкой',
    filterTrending: '🔥 В тренде',
    filterRising: '🌱 Растущие',
    supportWorkBtn: 'Поддержать работу',
    supportedBadge: 'Поддержано ❤️',

    chairsHeader: '👑 Зал Почётных Мест (Меритократический Совет)',
    chairsDesc: '30-дневные сменяемые места, основанные на XP, репутации и голосах соратников.',
    nominateBtn: 'Выдвинуть кандидатуру',
    voteBtn: 'Голосовать и поддержать',
    votedBadge: 'Голос учтён',
    chairCriteria: 'Требование:',

    leagueHeader: '🏆 Премьер-лига созидателей ценностей',
    leagueDesc: 'Рейтинг на основе постоянства в миссиях, качества работ и поддержки коллег.',
    sortByXp: 'По опыту (XP)',
    sortByRep: 'По репутации (Rep)',
    rankBadge: 'Ранг',

    chatHeader: '💬 Послание собратьям',
    chatBanner: '💙 Это пространство для честного диалога и поддержки. Будем опорой друг другу.',
    chatInputPlaceholder: 'Напишите мысли, идеи или пережитый опыт...',
    chatSubmitBtn: 'Поделиться с собратьями ❤️',
    chatLikeBtn: 'Братская поддержка',
    chatFeedTitle: '🕊️ Голоса соратников',

    authTitle: 'Гражданство и регистрация в ABLE City',
    authDesc: 'Официальная регистрация: Для Ирана через Gmail + Телефон; для других стран через Gmail',
    authIranTab: '🇮🇷 Иран (Gmail + Телефон)',
    authGlobalTab: '🌐 Международный (Gmail)',
    gmailLabel: 'Электронная почта Gmail:',
    mobileLabel: 'Номер телефона в Иране (09...):',
    mobilePlaceholder: '09123456789',
    otpLabel: '6-значный SMS-код подтверждения:',
    sendOtpBtn: 'Отправить SMS-код',
    verifyAndRegisterBtn: 'Подтвердить и войти в Город ✨',
    googleSignInBtn: 'Быстрый вход через Google / Gmail',
    verifiedCitizen: 'Подтверждённый гражданин',

    a11yTitle: 'Набор доступности (Accessibility & Экранные дикторы)',
    highContrast: 'Режим сверхвысокой контрастности',
    textSize: 'Масштаб шрифта и текста',
    reducedMotion: 'Уменьшение анимаций и мерцания (Reduced Motion)',
    dyslexiaFont: 'Четкий интервал и облегчённое чтение',
    adhdTitle: 'Комплекс концентрации и спокойствия (ADHD Flow)',
    adhdDesc: 'Интерфейс без отвлекающих факторов, декомпозиция на 2-минутные шаги и белый шум',
    focusModeToggle: 'Режим чистой концентрации (скрыть лишнее)',
    focusRulerToggle: 'Динамическая направляющая линейка (Focus Ruler)',
    calmSoundToggle: 'Фоновый успокаивающий звук (Brown Noise)',
    pomodoroStart: 'Старт 25-минутного блока',
    pomodoroPause: 'Пауза',
    pomodoroReset: 'Сброс таймера',
    breakdownAiTitle: 'Умная декомпозиция задач (без ручной настройки API Key)',
    breakdownAiDesc: 'Задача кажется непосильной? Автоматический ИИ разобьёт её на 3 простых микро-шага:',
    breakdownAiBtn: 'Разбить на 2-минутные микро-шаги ⚡',

    androidHubTitle: '📱 Центр сборки Android APK / AAB & Gradle',
    androidHubDesc: 'Полная конфигурация Gradle и конвейер GitHub Actions для автоматической сборки пакетов',
    gradleRootTitle: 'Корневой Gradle (build.gradle)',
    gradleAppTitle: 'Модуль приложения (app/build.gradle)',
    githubActionTitle: 'Автоматический пайплайн GitHub Actions (build-apk-aab.yml)',
    copyCode: 'Скопировать код',
    copied: 'Скопировано!',
  },
};
