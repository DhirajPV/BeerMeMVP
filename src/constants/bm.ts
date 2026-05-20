import { Platform } from 'react-native';

// ─── Color Palette ────────────────────────────────────────────────────────────
// Converted from the oklch design tokens in tokens.css
export const BM = {
  amber:      '#E8A020',  // oklch(0.78 0.16 75)  — primary
  amberDeep:  '#8B5200',  // oklch(0.55 0.18 55)  — pressed/shadow
  amberSoft:  '#F5D085',  // oklch(0.88 0.10 80)  — soft bg
  foam:       '#FAFAF8',  // oklch(0.985 0.008 90) — surface
  cream:      '#F5F0E6',  // oklch(0.955 0.024 85) — page bg
  cream2:     '#EDE5D5',  // oklch(0.92 0.03 80)  — secondary surface
  malt:       '#2A1C08',  // oklch(0.22 0.04 55)  — text
  malt2:      '#4A2C10',  // oklch(0.34 0.05 55)  — secondary text
  malt3:      '#7A6040',  // oklch(0.55 0.04 60)  — tertiary text
  hop:        '#5CB830',  // oklch(0.72 0.14 145) — success/redeem
  stout:      '#1A1008',  // oklch(0.16 0.025 55) — dark bg
  border:     '#D8CBBA',  // oklch(0.86 0.02 75)  — dividers

  // Semantic aliases
  bg:           '#F5F0E6',
  surface:      '#FAFAF8',
  text:         '#2A1C08',
  text2:        '#4A2C10',
  text3:        '#7A6040',
  primary:      '#E8A020',
  primaryDeep:  '#8B5200',
  accent:       '#5CB830',

  // Status tag colors
  receivedBg:  '#C8E8A8',
  receivedFg:  '#184010',

  // Fonts
  mono: Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' }) as string,
} as const;

// ─── Avatar hue → color pairs ─────────────────────────────────────────────────
const AVATAR_MAP: Record<number, { bg: string; fg: string }> = {
  5:   { bg: '#E87878', fg: '#4A0C0C' },
  32:  { bg: '#E8A878', fg: '#5A1A08' },
  50:  { bg: '#E8C060', fg: '#462800' },
  60:  { bg: '#DCBE60', fg: '#3A2800' },
  95:  { bg: '#A0D060', fg: '#1C3008' },
  145: { bg: '#80C870', fg: '#103010' },
  175: { bg: '#60D8C8', fg: '#083020' },
  200: { bg: '#70B8E0', fg: '#0A2840' },
  270: { bg: '#A870E8', fg: '#200850' },
  320: { bg: '#E070C8', fg: '#3A0830' },
};

export function avatarColors(hue: number) {
  return AVATAR_MAP[hue] ?? { bg: '#D8C8B0', fg: '#302010' };
}

// ─── Data types ───────────────────────────────────────────────────────────────
export type Friend = {
  id: string;
  name: string;
  hue: number;
  initial: string;
  tag: string;
};

export type Bar = {
  id: string;
  name: string;
  tag: string;
  dist: string;
  price: string;
  rating: number;
  x: number;
  y: number;
  type: 'pub' | 'craft' | 'garden' | 'dive';
  hours: string;
  menu: string[];
  featured?: boolean;
};

export type Beer = {
  id: string;
  from: Friend;
  note: string;
  when: string;
  expires: string;
  new?: boolean;
  closing?: boolean;
};

// ─── Mock data ────────────────────────────────────────────────────────────────
export const FRIENDS: Friend[] = [
  { id: 'maya',  name: 'Maya R.',  hue: 32,  initial: 'MR', tag: 'coffee crew' },
  { id: 'kenji', name: 'Kenji T.', hue: 200, initial: 'KT', tag: 'roommate' },
  { id: 'sasha', name: 'Sasha P.', hue: 320, initial: 'SP', tag: 'climbing' },
  { id: 'omar',  name: 'Omar B.',  hue: 145, initial: 'OB', tag: 'work' },
  { id: 'iris',  name: 'Iris L.',  hue: 5,   initial: 'IL', tag: 'book club' },
  { id: 'theo',  name: 'Theo W.',  hue: 270, initial: 'TW', tag: 'fútbol' },
  { id: 'priya', name: 'Priya N.', hue: 50,  initial: 'PN', tag: 'sister' },
  { id: 'ben',   name: 'Ben H.',   hue: 175, initial: 'BH', tag: 'college' },
  { id: 'nora',  name: 'Nora K.',  hue: 95,  initial: 'NK', tag: 'work' },
];

export const BARS: Bar[] = [
  { id: 'fox',   name: 'The Foxhole',     tag: 'Neighborhood pub', dist: '0.3 mi', price: '$$',  rating: 4.7, x: 50, y: 42, type: 'pub',    hours: 'Open · til 2am',  menu: ['Lager', 'IPA', 'Cider', 'Stout', 'NA'],       featured: true },
  { id: 'hop',   name: 'Hopwell & Co.',   tag: 'Craft taproom',    dist: '0.5 mi', price: '$$$', rating: 4.8, x: 28, y: 58, type: 'craft',  hours: 'Open · til 12am', menu: ['IPA flight', 'Sour', 'Pilsner'] },
  { id: 'civic', name: 'Civic Tap',       tag: 'Sports bar',       dist: '0.7 mi', price: '$',   rating: 4.4, x: 70, y: 30, type: 'pub',    hours: 'Open · til 1am',  menu: ['Domestics', 'Pitchers'] },
  { id: 'mal',   name: 'Malted',          tag: 'Beer garden',      dist: '0.9 mi', price: '$$',  rating: 4.6, x: 80, y: 60, type: 'garden', hours: 'Open · til 11pm', menu: ['Wheat', 'Hefe', 'Sour'] },
  { id: 'gold',  name: 'Goldfinch Pints', tag: 'Wine + beer bar',  dist: '1.2 mi', price: '$$',  rating: 4.5, x: 18, y: 22, type: 'pub',    hours: 'Open · til 12am', menu: ['Saison', 'Lambic', 'Belgian'] },
  { id: 'cor',   name: 'Corner Snug',     tag: 'Dive · cash bar',  dist: '1.4 mi', price: '$',   rating: 4.2, x: 62, y: 72, type: 'dive',   hours: 'Open · til 2am',  menu: ['Cans', 'Drafts'] },
];

export const WALLET_BEERS: Beer[] = [
  { id: 'b1', from: FRIENDS[0], note: 'thanks for the latte yesterday ☕', when: 'Today',     expires: 'Jun 12', new: true },
  { id: 'b2', from: FRIENDS[3], note: 'For helping me move — you saved my back', when: '2d ago',   expires: 'Jun 04' },
  { id: 'b4', from: FRIENDS[2], note: 'gas money 🚗',                            when: 'Last week', expires: 'May 23', closing: true },
  { id: 'b5', from: FRIENDS[6], note: 'covered my round at trivia 🧠',           when: 'May 9',     expires: 'Jun 09' },
  { id: 'b6', from: FRIENDS[8], note: 'cheers for the printer help',             when: 'Apr 30',    expires: 'May 30' },
];
