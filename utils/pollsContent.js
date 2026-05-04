// Rich Polls & Questions Content Pool
// Beautiful, technically rich polls for automatic posting

const techQuizPolls = [
    {
        question: '🧠 Tech Quiz: What does "CPU" stand for?',
        options: ['Central Processing Unit', 'Computer Power Utility', 'Core Processor Unit', 'Central Program Uplink'],
        type: 'quiz',
        correct_option_id: 0,
        explanation: '🧠 CPU = Central Processing Unit — the "brain" of every computer. It executes instructions from programs and manages all operations. Modern CPUs have multiple cores to run tasks simultaneously!',
    },
    {
        question: '⚡ Tech Quiz: Which data unit is the LARGEST?',
        options: ['Gigabyte (GB)', 'Terabyte (TB)', 'Petabyte (PB)', 'Megabyte (MB)'],
        type: 'quiz',
        correct_option_id: 2,
        explanation: '🚀 Petabyte (PB) is the largest here! Order: MB → GB → TB → PB. 1 Petabyte = 1,000 Terabytes = 1,000,000 Gigabytes. The entire internet creates ~2.5 exabytes of data daily!',
    },
    {
        question: '🔐 Tech Quiz: What does "VPN" stand for?',
        options: ['Virtual Public Network', 'Verified Private Network', 'Virtual Private Network', 'Visible Protected Node'],
        type: 'quiz',
        correct_option_id: 2,
        explanation: '🔒 VPN = Virtual Private Network. It encrypts your internet traffic and masks your IP address, making your online activity more private and secure — especially on public Wi-Fi!',
    },
    {
        question: '🌐 Tech Quiz: Which protocol is used to send emails?',
        options: ['HTTP', 'FTP', 'SMTP', 'SSH'],
        type: 'quiz',
        correct_option_id: 2,
        explanation: '📧 SMTP = Simple Mail Transfer Protocol. It\'s the standard protocol for sending emails between servers. IMAP/POP3 are used to receive emails. HTTP is for web browsing, FTP for file transfers!',
    },
    {
        question: '📱 Tech Quiz: Who invented the World Wide Web (WWW)?',
        options: ['Bill Gates', 'Steve Jobs', 'Tim Berners-Lee', 'Elon Musk'],
        type: 'quiz',
        correct_option_id: 2,
        explanation: '🌐 Tim Berners-Lee invented the World Wide Web in 1989 while working at CERN! He also created the first web browser and web server. He gave his invention to the world for free — no patent!',
    },
    {
        question: '💾 Tech Quiz: What is the speed of light in fiber optic cables?',
        options: ['100% of light speed', '99.7% of light speed', 'About 66% of light speed', '50% of light speed'],
        type: 'quiz',
        correct_option_id: 2,
        explanation: '💡 Light travels at about 66% of its vacuum speed inside fiber optic cables! This is due to the glass/plastic medium slowing it down. Still insanely fast — that\'s why fiber internet is so quick!',
    },
    {
        question: '🔢 Tech Quiz: In binary, what does "1010" equal in decimal?',
        options: ['8', '10', '12', '15'],
        type: 'quiz',
        correct_option_id: 1,
        explanation: '🔢 1010 in binary = 10 in decimal! Binary math: (1×8) + (0×4) + (1×2) + (0×1) = 8+0+2+0 = 10. All computers run entirely on this 0s and 1s system at the hardware level!',
    },
    {
        question: '🔒 Tech Quiz: What is "two-factor authentication" (2FA)?',
        options: ['Two passwords required', 'Password + second verification method', 'Biometric login only', 'Two-device login system'],
        type: 'quiz',
        correct_option_id: 1,
        explanation: '🛡️ 2FA = something you KNOW (password) + something you HAVE (phone/code) or something you ARE (fingerprint). Even if your password is stolen, hackers still can\'t get in without the second factor!',
    },
    {
        question: '🤖 Tech Quiz: What language is most used for AI/Machine Learning?',
        options: ['Java', 'C++', 'Python', 'JavaScript'],
        type: 'quiz',
        correct_option_id: 2,
        explanation: '🐍 Python dominates AI/ML with libraries like TensorFlow, PyTorch, scikit-learn, and NumPy. Its simple syntax, vast ecosystem, and strong community make it the #1 choice for data scientists worldwide!',
    },
    {
        question: '☁️ Tech Quiz: Which company operates AWS (Amazon Web Services)?',
        options: ['Microsoft', 'Google', 'Amazon', 'Apple'],
        type: 'quiz',
        correct_option_id: 2,
        explanation: '☁️ Amazon runs AWS — the world\'s largest cloud platform with 33%+ market share! AWS powers Netflix, Airbnb, NASA, and millions of websites. Microsoft Azure is #2, Google Cloud is #3.',
    },
];

const techOpinionPolls = [
    {
        question: '💻 Which laptop brand do you trust most?',
        options: ['🍎 MacBook (Apple)', '🖥️ Dell / XPS', '💻 HP / Spectre', '🎮 Lenovo / ThinkPad'],
        type: 'regular',
    },
    {
        question: '🔋 How long does your phone battery last daily?',
        options: ['🚀 Full day + leftover', '✅ Just makes it through', '⚡ Need midday charge', '🔌 Always near a charger'],
        type: 'regular',
    },
    {
        question: '🎮 What do you mostly use your phone for?',
        options: ['📱 Social media', '🎮 Gaming', '💼 Work & productivity', '🎵 Music & entertainment'],
        type: 'regular',
    },
    {
        question: '🤖 Do you think AI will replace human jobs?',
        options: ['✅ Yes, massively', '🟡 Some jobs, not all', '🔄 Create new jobs instead', '❌ No significant impact'],
        type: 'regular',
    },
    {
        question: '🌐 Which social media do you use most in 2025?',
        options: ['📸 Instagram', '❌ Twitter/X', '🎵 TikTok', '📲 Telegram'],
        type: 'regular',
    },
    {
        question: '🔐 Do you use a password manager?',
        options: ['✅ Yes, always', '🔄 Sometimes', '🧠 I memorize passwords', '❌ Never heard of it'],
        type: 'regular',
    },
    {
        question: '☁️ Where do you store your important files?',
        options: ['☁️ Cloud (Google/iCloud)', '💽 External hard drive', '📁 Only on my device', '📸 I just don\'t back up'],
        type: 'regular',
    },
    {
        question: '🛡️ How secure do you think your phone is?',
        options: ['🔒 Very secure (2FA + biometrics)', '🟡 Somewhat secure', '⚠️ Basic protection only', '😅 Honestly, not sure'],
        type: 'regular',
    },
];

const funCommunityPolls = [
    {
        question: '🌅 Are you a morning person or night owl?',
        options: ['☀️ Early bird — up at dawn', '🌙 Night owl — thrive at midnight', '🎯 Depends on the day', '😴 I\'m always tired, honestly'],
        type: 'regular',
    },
    {
        question: '☕ What gets you going in the morning?',
        options: ['☕ Coffee (no negotiation)', '🍵 Tea, always tea', '🧃 Fresh juice / smoothie', '😴 Nothing, I\'m a zombie until noon'],
        type: 'regular',
    },
    {
        question: '📚 How do you prefer to learn new things?',
        options: ['🎥 YouTube / video tutorials', '📖 Reading articles & books', '🛠️ Hands-on by doing', '🤖 Asking AI (ChatGPT etc.)'],
        type: 'regular',
    },
    {
        question: '🎯 What\'s your biggest distraction when working?',
        options: ['📱 Social media', '💬 Chats & notifications', '🎵 Music (or urge to change it)', '😴 Just... sleepiness'],
        type: 'regular',
    },
    {
        question: '🌍 Would you work 100% remote if given the choice?',
        options: ['✅ Absolutely, no commute!', '🏢 Prefer office (social energy)', '🔄 Hybrid — best of both', '🤷 Depends on the job'],
        type: 'regular',
    },
    {
        question: '📺 Movie night — what are you watching?',
        options: ['🎬 Action / Thriller', '😂 Comedy', '🔮 Sci-Fi / Fantasy', '💕 Romance / Drama'],
        type: 'regular',
    },
    {
        question: '🏃 How often do you exercise per week?',
        options: ['💪 5+ times (fitness addict)', '🏃 2-4 times', '🤸 Once or twice', '😅 My thumb scrolling counts, right?'],
        type: 'regular',
    },
    {
        question: '💬 How do you prefer to communicate?',
        options: ['📱 Text / Telegram', '📞 Voice call', '📧 Email', '🤝 Face to face always'],
        type: 'regular',
    },
];

const dailyQuestions = [
    {
        question: '💡 If you could master ONE tech skill instantly, what would it be?',
        options: ['🤖 AI / Machine Learning', '🔐 Cybersecurity & Hacking', '📱 Mobile App Development', '☁️ Cloud & DevOps'],
        type: 'regular',
    },
    {
        question: '🚀 Which tech company do you admire most?',
        options: ['🍎 Apple', '🔍 Google', '💼 Microsoft', '⚡ Tesla / SpaceX'],
        type: 'regular',
    },
    {
        question: '🔮 What technology excites you most for the future?',
        options: ['🤖 Artificial Intelligence', '🚀 Space colonization', '🧬 Biotech & longevity', '🥽 AR/VR Metaverse'],
        type: 'regular',
    },
    {
        question: '💸 Would you invest in crypto right now?',
        options: ['✅ Yes, all in!', '🤏 Small amount, for fun', '👀 Watching but not yet', '❌ No, too risky'],
        type: 'regular',
    },
    {
        question: '🌐 Which matters more to you online?',
        options: ['🔒 Privacy & security', '⚡ Speed & convenience', '💸 Free access (no cost)', '🎨 Good design & UX'],
        type: 'regular',
    },
    {
        question: '📲 If you had to delete ONE app forever, which?',
        options: ['📸 Instagram', '❌ Twitter/X', '🎵 TikTok', '📘 Facebook'],
        type: 'regular',
    },
    {
        question: '🤔 Do you think we\'re living in a simulation?',
        options: ['🌀 Yes, definitely', '🔮 Possibly...', '❌ No way', '🤷 I\'ve thought about it too much'],
        type: 'regular',
    },
    {
        question: '🎓 Where do you learn tech skills?',
        options: ['🆓 Free YouTube/blogs', '💳 Paid courses (Udemy etc.)', '🏫 Formal school/university', '🤖 Just AI + trial & error'],
        type: 'regular',
    },
];

// Flattened all-polls array for random selection
const allPolls = [
    ...techQuizPolls,
    ...techOpinionPolls,
    ...funCommunityPolls,
    ...dailyQuestions,
];

module.exports = {
    techQuizPolls,
    techOpinionPolls,
    funCommunityPolls,
    dailyQuestions,
    allPolls,
    getByIndex: (arr, index) => arr[index % arr.length],
    getRandom: (arr) => arr[Math.floor(Math.random() * arr.length)],
};
