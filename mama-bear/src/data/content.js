export const COLORS = {
  blush: '#FADADD',
  coral: '#FF6F61',
  lavender: '#C7B8EA',
  indigo: '#3F4E76',
  gold: '#EBC73E',
  white: '#FFFFFF',
  softGray: '#F5F5F5',
  textDark: '#2D2D2D',
  textMid: '#5C5C5C',
  textLight: '#9B9B9B',
  cardShadow: 'rgba(63, 78, 118, 0.12)',
};

export const CATEGORIES = {
  faith: { label: 'Faith', color: '#C7B8EA', emoji: '✨' },
  motherhood: { label: 'Motherhood', color: '#FADADD', emoji: '🐻' },
  strength: { label: 'Strength', color: '#FF6F61', emoji: '💪' },
  rest: { label: 'Rest', color: '#A8D8EA', emoji: '🌙' },
};

export const MOODS = [
  { id: 'calm', label: 'Calm', emoji: '😌', color: '#A8D8EA' },
  { id: 'okay', label: 'Okay', emoji: '🙂', color: '#C7B8EA' },
  { id: 'overwhelmed', label: 'Overwhelmed', emoji: '😰', color: '#FADADD' },
  { id: 'exhausted', label: 'Exhausted', emoji: '😴', color: '#EBC73E' },
];

export const ENCOURAGEMENTS = [
  {
    id: '1',
    category: 'motherhood',
    text: "You're carrying more than most people realize — and you're still showing up. That matters.",
    scripture: 'She is clothed with strength and dignity; she can laugh at the days to come. — Proverbs 31:25',
    forMoods: ['overwhelmed', 'exhausted'],
  },
  {
    id: '2',
    category: 'strength',
    text: "The fact that you worry about being a good mom means you already are one. Keep going.",
    scripture: 'I can do all things through Christ who strengthens me. — Philippians 4:13',
    forMoods: ['overwhelmed', 'okay'],
  },
  {
    id: '3',
    category: 'rest',
    text: "Rest is not a reward for finishing everything. Rest is part of taking care of everything — including yourself.",
    scripture: 'Come to me, all you who are weary and burdened, and I will give you rest. — Matthew 11:28',
    forMoods: ['exhausted', 'overwhelmed'],
  },
  {
    id: '4',
    category: 'faith',
    text: "You were chosen for this child, in this season, with exactly the love you have. You are enough.",
    scripture: 'Before I formed you in the womb I knew you. — Jeremiah 1:5',
    forMoods: ['calm', 'okay'],
  },
  {
    id: '5',
    category: 'motherhood',
    text: "The small moments — the bedtime kisses, the quiet giggles — those are the ones that last forever.",
    scripture: null,
    forMoods: ['calm', 'okay'],
  },
  {
    id: '6',
    category: 'strength',
    text: "You don't have to be perfect to be a wonderful mother. Love is more than enough.",
    scripture: 'Love is patient, love is kind. — 1 Corinthians 13:4',
    forMoods: ['overwhelmed', 'exhausted'],
  },
  {
    id: '7',
    category: 'rest',
    text: "It's okay to let some things go undone today. Your presence is more valuable than your productivity.",
    scripture: null,
    forMoods: ['exhausted', 'overwhelmed'],
  },
  {
    id: '8',
    category: 'faith',
    text: "Even on the days when you feel invisible — your love is shaping a whole life. That is sacred work.",
    scripture: 'And whatever you do, do it heartily, as to the Lord. — Colossians 3:23',
    forMoods: ['overwhelmed', 'exhausted'],
  },
  {
    id: '9',
    category: 'motherhood',
    text: "You are raising a human being to know love, kindness, and courage. There is no greater calling.",
    scripture: null,
    forMoods: ['calm', 'okay'],
  },
  {
    id: '10',
    category: 'strength',
    text: "Hard days don't last. But the love you pour into your family today — that stays forever.",
    scripture: 'And let us not grow weary of doing good. — Galatians 6:9',
    forMoods: ['exhausted', 'overwhelmed'],
  },
  {
    id: '11',
    category: 'rest',
    text: "You deserve gentleness — especially from yourself. Be as kind to you as you are to your little ones.",
    scripture: null,
    forMoods: ['exhausted', 'overwhelmed'],
  },
  {
    id: '12',
    category: 'faith',
    text: "You are held. Even when it feels like you're holding everything alone, you are held.",
    scripture: 'Cast all your anxiety on him because he cares for you. — 1 Peter 5:7',
    forMoods: ['overwhelmed', 'exhausted'],
  },
  {
    id: '13',
    category: 'motherhood',
    text: "Today doesn't have to be perfect. Just present. Your children need you, not a performance.",
    scripture: null,
    forMoods: ['overwhelmed', 'okay'],
  },
  {
    id: '14',
    category: 'strength',
    text: "You have survived every hard day so far. Your track record is 100%. Trust yourself.",
    scripture: null,
    forMoods: ['overwhelmed', 'exhausted'],
  },
  {
    id: '15',
    category: 'rest',
    text: "Slow down, mama. The world will wait. Your soul needs tending too.",
    scripture: 'He makes me lie down in green pastures; He leads me beside still waters. — Psalm 23:2',
    forMoods: ['exhausted', 'calm'],
  },
];

export const AFFIRMATIONS = [
  "I am present. I am patient. I am doing my best, and that is enough.",
  "I am a good mother. My love is steady, even when I feel unsure.",
  "I give myself grace today. I don't have to earn rest — I deserve it.",
  "I am exactly the mother my child needs. My love is unique and irreplaceable.",
  "Today I choose peace. I release what I cannot control.",
  "I am stronger than I feel right now. I have everything I need for this moment.",
  "My children see my love in the little things I do every day.",
  "I am allowed to have hard days. They don't define me or my worth.",
  "I am building something beautiful — a home full of love.",
  "I am not alone in this journey. Help is available, and asking is brave.",
  "I honor my feelings without letting them lead me. I am steady.",
  "Every act of love I offer today matters more than I know.",
  "I take care of myself so I can take care of the ones I love.",
  "I am growing alongside my children. We are learning together.",
  "My best today is enough. Tomorrow I get to try again.",
];

export const getMoodEncouragement = (moodId) => {
  const matching = ENCOURAGEMENTS.filter(e => e.forMoods.includes(moodId));
  if (matching.length === 0) return ENCOURAGEMENTS[0];
  return matching[Math.floor(Math.random() * matching.length)];
};

export const getDailyEncouragement = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 86400000
  );
  return ENCOURAGEMENTS[dayOfYear % ENCOURAGEMENTS.length];
};

export const getDailyAffirmation = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 86400000
  );
  return AFFIRMATIONS[dayOfYear % AFFIRMATIONS.length];
};
