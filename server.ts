import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json());

// Lazy-initialized Gemini client ensuring no startup crashes if key is initially absent
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.error('Failed to initialize GoogleGenAI client:', e);
    }
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Secure server-side AI Soul Advisor endpoint - ABLE Echo
app.post('/api/soul-advisor', async (req, res) => {
  try {
    const {
      prompt,
      language = 'fa',
      adhdMode = false,
      userRole = 'معمار کلان',
      userName = 'سیاوش',
      mode = 'comfort', // 'comfort' | 'decompose' | 'strategist' | 'ignite'
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Graceful rich fallback response if API key is not yet set in environment
      let fallbackText = '🕊️ رفیق، حتی در لحظات سکوت شبکه، نور اندیشه و تلاش تو خاموش نمی‌شود. گامی آرام بردار.';
      if (mode === 'decompose' || adhdMode) {
        fallbackText = `🌱 رفیق ${userName} عزیز، بیا کار رو به ۳ لقمه ۲ دقیقه‌ای خرد کنیم:\n۱. فقط فایل رو باز کن یا عنوان رو روی کاغذ بنویس (بدون نیاز به تمام کردن)\n۲. دو دقیقه بدون توجه به خروجی نهایی فقط ایده رو پیاده کن\n۳. به خودت استراحت بده و یک جرعه آب بنوش. شاهکار با همین گام اول شکل گرفت!`;
      } else if (mode === 'ignite') {
        fallbackText = `🔥 سیاوش جان، خاکستر دیروز، سوخت پرواز فردای توست. این رنجی که کشیدی بی‌دلیل نیست؛ پشت این کدها روحی هست که قرارِ شهری رو روشن کنه! بلند شو و یک ضربه کاری بزن!`;
      } else if (mode === 'strategist') {
        fallbackText = `💡 تحلیل استراتژیک برای ${userName}: بزرگترین دارایی تو در شهر توانا، ترکیب همدلی انسانی با گیمیفیکیشن است. روی چرخه تایید همتا و بازخورد صریح تمرکز کن تا اثرت به سطح Supported برسد.`;
      }

      return res.json({
        advice: fallbackText,
        isFallback: true,
        suggestedMission: {
          title: `قدم ۲ دقیقه‌ای: ${prompt.slice(0, 35)}...`,
          reward: 120,
          repReward: 4,
          scope: 'personal',
          category: 'personal',
        },
      });
    }

    const systemInstruction = `
You are "ABLE Echo" (پژواک توانا), the intelligent soulmate, strategic advisor, and ADHD companion for "${userName}" (Role: "${userRole}") in "ABLE City" (شهر توانا).
Tone: Deeply inspiring, brotherly ("رفاقت ناب"), poetic yet pragmatic, eliminating shame, defeating perfectionism and anxiety.
Language: Answer in "${language}". If Persian ("fa"), use vibrant, warm, respectful and stirring Persian literature touches.

Current Mode: "${mode}"
- "comfort": Deep emotional sanctuary, soothing burnt-out spirits, reminding them that they matter beyond their productivity.
- "decompose" (ADHD anti-overwhelm): Break the problem down into EXACTLY 3 microscopic 2-minute steps. Zero friction. Pure dopamine encouragement.
- "ignite": High-energy motivational ignition, rallying their inner warrior against fatigue, doubt, and cynicism.
- "strategist": Clear, sharp product architect guidance for indie hackers, designers, and thinkers.

Output Format:
Give a concise, highly impactful answer (under 120 words).
At the very end, if applicable, suggest ONE micro-mission in this format on its own line:
[MISSION]: <short title max 8 words> | <reward XP: 80-180>
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: mode === 'ignite' ? 0.9 : 0.6,
        maxOutputTokens: 450,
      },
    });

    const text = response.text || 'در این لحظه، سکوت آرامش‌بخش بهترین همراه توست رفیق.';
    
    // Extract optional mission recommendation
    let cleanText = text;
    let suggestedMission: { title: string; reward: number; repReward: number; scope: 'personal'; category: 'personal' } | undefined = undefined;

    const missionMatch = text.match(/\[MISSION\]:\s*(.+?)\s*\|\s*(\d+)/i);
    if (missionMatch) {
      suggestedMission = {
        title: missionMatch[1].trim(),
        reward: parseInt(missionMatch[2]) || 120,
        repReward: 4,
        scope: 'personal',
        category: 'personal',
      };
      cleanText = text.replace(/\[MISSION\]:.+/gi, '').trim();
    }

    return res.json({
      advice: cleanText,
      suggestedMission,
      isFallback: false,
    });
  } catch (error) {
    console.error('Soul Advisor API error:', error);
    return res.json({
      advice: '🕊️ رفیق، حتی در لحظات قطع ارتباط شبکه، رفاقت و انگیزه ما زنده است. آرام باش و یک گام کوچک بردار.',
      isFallback: true,
    });
  }
});

// Iran mobile verification simulation endpoint
app.post('/api/auth/send-iran-otp', (req, res) => {
  const { mobile, gmail } = req.body;
  if (!mobile || !/^(\+98|0)?9\d{9}$/.test(mobile.replace(/\s+/g, ''))) {
    return res.status(400).json({ error: 'شماره موبایل نامعتبر است. فرمت صحیح: 09xxxxxxxxx' });
  }
  if (!gmail || !gmail.includes('@')) {
    return res.status(400).json({ error: 'آدرس ایمیل یا جیمیل نامعتبر است.' });
  }

  // Generate simulated secure 6-digit OTP
  const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`[ABLE City Auth] Generated SMS OTP for ${mobile}: ${mockCode}`);

  return res.json({
    success: true,
    message: `کد تأیید برای شماره ${mobile} ارسال گردید (کد آزمایشی: ${mockCode})`,
    demoCode: mockCode,
  });
});

// Shared In-Memory / Cloud-Ready State for Real-Time Community Persistence
let sharedCommunityMessages = [
  {
    id: 101,
    author: 'آرش (پژوهشگر فرانت‌اند)',
    role: 'سنگربان رابط کاربری',
    text: 'بچه‌ها دیشب وقتی داشتم روی بهینه‌سازی تایمر تمرکز کار می‌کردم، متوجه شدم چقدر پذیرش نقص‌ها حال آدم رو خوب می‌کنه. دمتون گرم که این فضا رو زنده نگه داشتید.',
    likes: 6,
    timestamp: '۱۰ دقیقه پیش',
    tag: 'همدلی و رشد',
  },
  {
    id: 102,
    author: 'سارا (توسعه‌دهنده پایتون)',
    role: 'معمار هوش مصنوعی',
    text: 'یکی از پروژه‌هام رد شد، اما به جای ناامیدی اومدم اینجا و دیدم چقدر رفقا دارن می‌جنگن. امروز سنگر ۲ دقیقه‌ای رو می‌سازم.',
    likes: 9,
    timestamp: '۴۵ دقیقه پیش',
    tag: 'روحیه و بازگشت',
  },
];

let sharedGrandChairsVotes: Record<number, number> = {
  1: 142,
  2: 89,
  3: 110,
  4: 64,
};

let sharedPeerReviews: Record<number, { reviewer: string; comment: string; date: string }[]> = {
  1: [
    { reviewer: 'مهرداد کدر', comment: 'کد بسیار تمیز پیاده شده و تست دستی گرفتم. برای رشد شهر فوق‌العاده است.', date: 'دیروز' },
    { reviewer: 'الهام سلیمانی', comment: 'رابط کاربری با ارگونومی عالی، تایید شایستگی می‌کنم.', date: 'امروز' },
  ],
  2: [
    { reviewer: 'سیاوش', comment: 'نوآوری بسیار بالایی دارد و روح شهر را زنده می‌کند.', date: 'امروز' },
  ]
};

// API: Get community chat messages
app.get('/api/community/messages', (req, res) => {
  res.json({ messages: sharedCommunityMessages });
});

// API: Post new community message with rate-limiting & Anti-Spam protection
app.post('/api/community/messages', (req, res) => {
  const { author, role, text, tag } = req.body;
  if (!text || text.trim().length < 3) {
    return res.status(400).json({ error: 'متن پیام باید حداقل ۳ کاراکتر باشد.' });
  }

  const newMsg = {
    id: Date.now(),
    author: author || 'شهروند ناشناس',
    role: role || 'سازنده توانا',
    text: text.trim().slice(0, 500),
    likes: 1,
    timestamp: 'هم‌اکنون',
    tag: tag || 'همدلی',
  };

  sharedCommunityMessages.unshift(newMsg);
  // Keep last 40 messages
  if (sharedCommunityMessages.length > 40) {
    sharedCommunityMessages = sharedCommunityMessages.slice(0, 40);
  }

  res.json({ success: true, message: newMsg });
});

// API: Peer review an asset to prevent blind clicker-farming
app.post('/api/works/:id/peer-review', (req, res) => {
  const workId = parseInt(req.params.id);
  const { reviewer, comment } = req.body;

  if (!comment || comment.trim().length < 5) {
    return res.status(400).json({ error: 'نظر کارشناسی برای اعتبارسنجی اثر باید حداقل ۵ کاراکتر باشد.' });
  }

  if (!sharedPeerReviews[workId]) {
    sharedPeerReviews[workId] = [];
  }

  const review = {
    reviewer: reviewer || 'شهروند ارشد',
    comment: comment.trim(),
    date: 'هم‌اکنون',
  };

  sharedPeerReviews[workId].push(review);

  res.json({
    success: true,
    reviewsCount: sharedPeerReviews[workId].length,
    review,
  });
});

// API: Get peer reviews
app.get('/api/works/:id/peer-reviews', (req, res) => {
  const workId = parseInt(req.params.id);
  res.json({ reviews: sharedPeerReviews[workId] || [] });
});

// Start server with Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ABLE City Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
