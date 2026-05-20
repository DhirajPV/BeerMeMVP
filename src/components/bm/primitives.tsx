import React, { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type PressableProps,
  type ViewStyle,
} from 'react-native';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Path,
  Rect,
} from 'react-native-svg';
import { BM, avatarColors, type Friend } from '@/constants/bm';

// ─── Beer Glyph (SVG) ─────────────────────────────────────────────────────────
export function BeerGlyph({
  size = 44,
  color = BM.amber,
  foam = '#fff',
  stroke = BM.malt,
}: {
  size?: number;
  color?: string;
  foam?: string;
  stroke?: string;
}) {
  const sw = (2 * size) / 44;
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <G transform="translate(8,4)">
        <Circle cx="7"  cy="6"   r="6"   fill={foam} stroke={stroke} strokeWidth={sw} />
        <Circle cx="16" cy="3.5" r="4.5" fill={foam} stroke={stroke} strokeWidth={sw} />
        <Circle cx="22" cy="6.5" r="5.5" fill={foam} stroke={stroke} strokeWidth={sw} />
        <Circle cx="13" cy="3"   r="3.5" fill={foam} stroke={stroke} strokeWidth={sw} />
      </G>
      <Path
        d="M11 12 L33 12 L31 38 Q31 41 28 41 L16 41 Q13 41 13 38 Z"
        fill={color}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <Path d="M15 16 L14 36" stroke={foam} strokeWidth={(1.6 * size) / 44} strokeLinecap="round" opacity={0.8} />
      <Path
        d="M33 18 Q39 19 38 26 Q39 33 33 34"
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Pint Fill (SVG w/ clip) ──────────────────────────────────────────────────
export function PintFill({
  value = 0.6,
  size = 80,
  label,
}: {
  value?: number;
  size?: number;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(1, value));
  const id = useMemo(() => `pint-${Math.random().toString(36).slice(2)}`, []);
  const h = size * 1.1;
  return (
    <View style={{ width: size, height: h }}>
      <Svg viewBox="0 0 44 48" width={size} height={h}>
        <Defs>
          <ClipPath id={id}>
            <Path d="M11 12 L33 12 L31 38 Q31 41 28 41 L16 41 Q13 41 13 38 Z" />
          </ClipPath>
        </Defs>
        {/* glass background */}
        <Path
          d="M11 12 L33 12 L31 38 Q31 41 28 41 L16 41 Q13 41 13 38 Z"
          fill={BM.cream2}
          stroke={BM.malt}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
        {/* liquid fill */}
        <Rect x="11" y={41 - pct * 29} width="22" height={pct * 29} fill={BM.amber} clipPath={`url(#${id})`} />
        {/* meniscus */}
        <Rect x="11" y={41 - pct * 29 - 1} width="22" height={2} fill={BM.amberDeep} opacity={0.3} clipPath={`url(#${id})`} />
        {/* foam when full */}
        {pct > 0.85 && (
          <>
            <Circle cx="14" cy="11" r="3.2" fill="#fff" stroke={BM.malt} strokeWidth={1.4} />
            <Circle cx="22" cy="9"  r="3"   fill="#fff" stroke={BM.malt} strokeWidth={1.4} />
            <Circle cx="30" cy="11" r="3.2" fill="#fff" stroke={BM.malt} strokeWidth={1.4} />
          </>
        )}
        {/* glass outline on top */}
        <Path
          d="M11 12 L33 12 L31 38 Q31 41 28 41 L16 41 Q13 41 13 38 Z"
          fill="none"
          stroke={BM.malt}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </Svg>
      {label && (
        <Text style={{ textAlign: 'center', fontFamily: BM.mono, fontSize: 11, color: BM.malt3, marginTop: -4 }}>
          {label}
        </Text>
      )}
    </View>
  );
}

// ─── Fake QR (View grid, no SVG needed) ───────────────────────────────────────
export function FakeQR({ size = 160 }: { size?: number }) {
  const GRID = 17;
  const pattern = useMemo(() => {
    const arr: number[][] = [];
    let seed = 31;
    const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    for (let y = 0; y < GRID; y++) {
      const row: number[] = [];
      for (let x = 0; x < GRID; x++) row.push(rng() < 0.55 ? 1 : 0);
      arr.push(row);
    }
    // Finder squares in 3 corners
    [[0, 0], [0, GRID - 7], [GRID - 7, 0]].forEach(([cy, cx]) => {
      for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
        arr[cy + y][cx + x] = (y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4)) ? 1 : 0;
      }
    });
    return arr;
  }, []);

  const cell = size / GRID;
  return (
    <View style={{ width: size, height: size }}>
      {pattern.map((row, y) => (
        <View key={y} style={{ flexDirection: 'row', height: cell }}>
          {row.map((v, x) => (
            <View
              key={x}
              style={{
                width: cell,
                height: cell,
                backgroundColor: v ? BM.malt : 'transparent',
                borderRadius: cell * 0.18,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({
  friend,
  size = 44,
  ring = false,
}: {
  friend: { initial: string; hue: number };
  size?: number;
  ring?: boolean;
}) {
  const { bg, fg } = avatarColors(friend.hue);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...(ring ? { borderWidth: 3, borderColor: BM.amber } : {}),
      }}
    >
      <Text style={{ color: fg, fontWeight: '700', fontSize: size * 0.4, letterSpacing: -0.5 }}>
        {friend.initial}
      </Text>
    </View>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
type ButtonKind = 'primary' | 'dark' | 'ghost' | 'surface';
type ButtonSize = 'sm' | 'md' | 'lg';

export function BMButton({
  children,
  kind = 'primary',
  size: btnSize = 'md',
  onPress,
  style,
  icon,
  disabled,
}: {
  children: React.ReactNode;
  kind?: ButtonKind;
  size?: ButtonSize;
  onPress?: () => void;
  style?: ViewStyle;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  const sizes = { sm: { h: 40, fs: 14, px: 16, r: 12 }, md: { h: 52, fs: 16, px: 20, r: 16 }, lg: { h: 60, fs: 17, px: 24, r: 18 } }[btnSize];
  const kinds: Record<ButtonKind, { bg: string; fg: string; border?: string }> = {
    primary: { bg: BM.amber,   fg: BM.malt },
    dark:    { bg: BM.malt,    fg: BM.foam },
    ghost:   { bg: 'transparent', fg: BM.malt, border: BM.border },
    surface: { bg: BM.surface, fg: BM.malt, border: BM.border },
  };
  const k = kinds[kind];

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          height: sizes.h,
          paddingHorizontal: sizes.px,
          borderRadius: sizes.r,
          backgroundColor: k.bg,
          borderWidth: k.border ? 1.5 : 0,
          borderColor: k.border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: disabled ? 0.4 : 1,
        },
        style,
      ]}
    >
      {icon}
      <Text style={{ color: k.fg, fontWeight: '700', fontSize: sizes.fs, letterSpacing: -0.2 }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
export const Icons = {
  back: (size = 22, color = BM.malt) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 5L8 12l7 7" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  close: (size = 22, color = BM.malt) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  ),
  send: (size = 20, color = BM.malt) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12l18-9-9 18-2-7-7-2z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  ),
  qr: (size = 22, color = BM.malt) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="7" height="7" rx="1.4" stroke={color} strokeWidth={1.8} />
      <Rect x="14" y="3" width="7" height="7" rx="1.4" stroke={color} strokeWidth={1.8} />
      <Rect x="3" y="14" width="7" height="7" rx="1.4" stroke={color} strokeWidth={1.8} />
      <Rect x="16" y="16" width="5" height="5" stroke={color} strokeWidth={1.8} />
    </Svg>
  ),
  pin: (size = 18, color = BM.malt) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" stroke={color} strokeWidth={1.9} />
      <Circle cx="12" cy="10" r="2.4" fill={color} />
    </Svg>
  ),
  bell: (size = 20, color = BM.malt) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 8a6 6 0 1112 0v4l2 3H4l2-3V8zM10 19a2 2 0 004 0" stroke={color} strokeWidth={1.9} strokeLinejoin="round" />
    </Svg>
  ),
  plus: (size = 20, color = BM.malt) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  ),
  beer: (size = 18, color = BM.malt) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 8h10v11a2 2 0 01-2 2H8a2 2 0 01-2-2V8z" stroke={color} strokeWidth={1.9} strokeLinejoin="round" />
      <Path d="M16 10h2a2 2 0 012 2v3a2 2 0 01-2 2h-2" stroke={color} strokeWidth={1.9} />
      <Path d="M6 8c1-3 9-3 10 0" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  ),
  search: (size = 20, color = BM.malt3) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="6.5" stroke={color} strokeWidth={2} />
      <Path d="M20 20l-3.5-3.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  ),
  check: (size = 20, color = BM.malt) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12l5 5L20 6" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  home: (size = 22, color = BM.malt3) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-9z" stroke={color} strokeWidth={1.9} strokeLinejoin="round" />
    </Svg>
  ),
  wallet: (size = 22, color = BM.malt3) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="13" rx="2.5" stroke={color} strokeWidth={1.9} />
      <Path d="M3 10h18M17 14h2" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  ),
  map: (size = 22, color = BM.malt3) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z" stroke={color} strokeWidth={1.9} strokeLinejoin="round" />
      <Path d="M9 4v16M15 6v16" stroke={color} strokeWidth={1.9} />
    </Svg>
  ),
  user: (size = 22, color = BM.malt3) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8.5" r="4" stroke={color} strokeWidth={1.9} />
      <Path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  ),
  more: (size = 20, color = BM.malt) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="5"  cy="12" r="1.8" fill={color} />
      <Circle cx="12" cy="12" r="1.8" fill={color} />
      <Circle cx="19" cy="12" r="1.8" fill={color} />
    </Svg>
  ),
  arrowRight: (size = 20, color = BM.malt) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14M13 5l7 7-7 7" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  ),
  chevronRight: (size = 8, color = BM.malt3) => (
    <Svg width={size} height={14} viewBox="0 0 8 14" fill="none">
      <Path d="M1 1l6 6-6 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  ),
};

// ─── Tab Bar ──────────────────────────────────────────────────────────────────
export type TabId = 'home' | 'wallet' | 'send' | 'map' | 'profile';

export function TabBar({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
}) {
  const tabs: { id: TabId; label: string; icon: (c: string) => React.ReactNode; cta?: boolean }[] = [
    { id: 'home',    label: 'Home',    icon: (c) => Icons.home(24, c) },
    { id: 'wallet',  label: 'Wallet',  icon: (c) => Icons.wallet(24, c) },
    { id: 'send',    label: 'Send',    icon: () => null, cta: true },
    { id: 'map',     label: 'Bars',    icon: (c) => Icons.map(24, c) },
    { id: 'profile', label: 'You',     icon: (c) => Icons.user(24, c) },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        if (tab.cta) {
          return (
            <TouchableOpacity key={tab.id} onPress={() => onChange('send')} activeOpacity={0.85} style={styles.tabCTA}>
              <BeerGlyph size={32} color="#fff" foam="#fff" stroke={BM.malt} />
            </TouchableOpacity>
          );
        }
        const isActive = active === tab.id;
        return (
          <TouchableOpacity key={tab.id} onPress={() => onChange(tab.id)} activeOpacity={0.7} style={styles.tabItem}>
            {tab.icon(isActive ? BM.amberDeep : BM.malt3)}
            <Text style={[styles.tabLabel, isActive && { color: BM.amberDeep }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Screen Header ────────────────────────────────────────────────────────────
export function ScreenHeader({
  title,
  big,
  onBack,
  left,
  right,
  dark,
}: {
  title?: string;
  big?: boolean;
  onBack?: () => void;
  left?: React.ReactNode;
  right?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <View style={[styles.header, big && styles.headerBig]}>
      <View style={styles.headerRow}>
        <View style={{ width: 40 }}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.7}
              style={[styles.iconBtn, dark && styles.iconBtnDark]}
            >
              {Icons.back(20, dark ? BM.foam : BM.malt)}
            </TouchableOpacity>
          )}
          {left}
        </View>
        {!big && title ? (
          <Text style={[styles.headerTitle, dark && { color: BM.foam }]}>{title}</Text>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <View style={{ width: 40, alignItems: 'flex-end' }}>{right}</View>
      </View>
      {big && title && (
        <Text style={[styles.headerBigTitle, dark && { color: BM.foam }]}>{title}</Text>
      )}
    </View>
  );
}

// ─── Wordmark ─────────────────────────────────────────────────────────────────
export function Wordmark({ size = 28 }: { size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: size * 0.28 }}>
      <BeerGlyph size={size * 1.5} />
      <Text style={{ fontWeight: '800', fontSize: size, letterSpacing: -size * 0.025, color: BM.malt }}>
        Beer Me
      </Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 24,
    paddingTop: 10,
    backgroundColor: BM.cream,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    zIndex: 30,
    borderTopWidth: 1,
    borderTopColor: BM.border,
  },
  tabItem: {
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: BM.malt3,
  },
  tabCTA: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: BM.amber,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: BM.amberDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerBig: {
    paddingBottom: 4,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 32,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 17,
    color: BM.malt,
    letterSpacing: -0.3,
  },
  headerBigTitle: {
    fontWeight: '700',
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -1,
    color: BM.malt,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BM.surface,
    borderWidth: 1,
    borderColor: BM.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnDark: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
});
