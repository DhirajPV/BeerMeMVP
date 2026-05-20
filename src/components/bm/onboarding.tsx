import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ListRenderItem,
} from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { BM, FRIENDS } from '@/constants/bm';
import { Avatar, BeerGlyph, BMButton, FakeQR } from './primitives';

const { width: W } = Dimensions.get('window');

// ─── Per-slide hero visuals ───────────────────────────────────────────────────
function Hero0() {
  return (
    <View style={styles.heroContainer}>
      <View style={styles.heroCircle} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 36, position: 'relative' }}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Avatar friend={FRIENDS[0]} size={84} />
          <Text style={styles.heroLabel}>YOU</Text>
        </View>
        <View style={{ transform: [{ translateY: -12 }] }}>
          <BeerGlyph size={64} />
        </View>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Avatar friend={FRIENDS[3]} size={84} />
          <Text style={styles.heroLabel}>OMAR</Text>
        </View>
      </View>
      {/* dashed arc */}
      <Svg width={280} height={80} viewBox="0 0 280 80" style={{ position: 'absolute', bottom: 36 }}>
        <Path
          d="M 30 60 Q 140 -20 250 60"
          stroke={BM.malt3}
          strokeWidth={2}
          strokeDasharray="3 6"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

function Hero1() {
  return (
    <View style={[styles.heroContainer, { overflow: 'hidden' }]}>
      <View style={styles.phoneBody}>
        <View style={styles.phoneScreen}>
          <BeerGlyph size={48} />
          <Text style={{ fontWeight: '700', fontSize: 13, color: BM.malt }}>Beer Me</Text>
          <View style={{ width: 40, height: 4, backgroundColor: BM.amber, borderRadius: 2 }} />
        </View>
      </View>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            right: 40 + i * 26,
            top: 60 + i * 20,
            opacity: 0.35 - i * 0.08,
          }}
        >
          <BeerGlyph size={28 + i * 6} />
        </View>
      ))}
      <View style={{ position: 'absolute', top: 32, right: 24 }}>
        <BeerGlyph size={56} />
      </View>
    </View>
  );
}

function Hero2() {
  return (
    <View style={styles.heroContainer}>
      <View style={styles.qrCard}>
        <FakeQR size={148} />
      </View>
      <View style={{ position: 'absolute', bottom: 24, right: 56, transform: [{ rotate: '15deg' }] }}>
        <BeerGlyph size={56} />
      </View>
    </View>
  );
}

function Hero3() {
  return (
    <View style={styles.heroContainer}>
      <View style={[styles.heroCircle, { width: 240, height: 240, borderRadius: 120 }]} />
      <View style={{ flexDirection: 'row', gap: 8, position: 'relative' }}>
        <View style={{ transform: [{ rotate: '-18deg' }, { translateY: 8 }] }}>
          <BeerGlyph size={120} />
        </View>
        <View style={{ transform: [{ rotate: '18deg' }, { translateY: 8 }] }}>
          <BeerGlyph size={120} />
        </View>
      </View>
      {[
        { left: '20%', top: '15%', size: 14 },
        { left: '75%', top: '20%', size: 10 },
        { left: '15%', top: '60%', size: 8 },
        { left: '80%', top: '65%', size: 12 },
      ].map((s, i) => (
        <Text
          key={i}
          style={{
            position: 'absolute',
            left: s.left as any,
            top: s.top as any,
            fontWeight: '700',
            color: BM.amberDeep,
            fontSize: s.size,
          }}
        >
          ✦
        </Text>
      ))}
    </View>
  );
}

// ─── Slides data ──────────────────────────────────────────────────────────────
const SLIDES = [
  {
    kicker: '01 · The favor economy',
    titleParts: ['Someone always', { primary: 'owes you' }, 'a round.'] as (string | { primary: string })[],
    body: 'Track those "I got you next time" moments — without the spreadsheet or the awkward Venmo request.',
    Hero: Hero0,
  },
  {
    kicker: '02 · Send a beer',
    titleParts: ['Tap a friend.', { primary: 'Pour one over' }, '.'] as (string | { primary: string })[],
    body: 'Pick anyone in your contacts, slap a note on it, and a cold one lands in their wallet — paid for when redeemed.',
    Hero: Hero1,
  },
  {
    kicker: '03 · Redeem anywhere',
    titleParts: ['Scan, sip,', { primary: 'sorted' }, '.'] as (string | { primary: string })[],
    body: '100+ partner bars across the city. Show the QR, the bartender pours, your friend covers the tab.',
    Hero: Hero2,
  },
  {
    kicker: '04 · Keep it square',
    titleParts: ['Coffee debts,', { primary: 'closed' }, '.'] as (string | { primary: string })[],
    body: 'No IOUs. No awkward math. Just the universal currency of friendship — pour one out and call it even.',
    Hero: Hero3,
  },
];

// ─── Onboarding Screen ────────────────────────────────────────────────────────
export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList>(null);

  const goTo = (i: number) => {
    setIndex(i);
    ref.current?.scrollToIndex({ index: i, animated: true });
  };

  const handleNext = () => {
    if (index === SLIDES.length - 1) {
      onDone();
    } else {
      goTo(index + 1);
    }
  };

  const renderSlide: ListRenderItem<typeof SLIDES[0]> = ({ item }) => (
    <View style={{ width: W, flex: 1 }}>
      <item.Hero />
      <View style={styles.slideContent}>
        <Text style={styles.kicker}>{item.kicker}</Text>
        <Text style={styles.title} numberOfLines={3}>
          {item.titleParts.map((part, idx) =>
            typeof part === 'string' ? (
              <Text key={idx}>{part} </Text>
            ) : (
              <Text key={idx}>
                <Text style={styles.titleHighlight}>{part.primary}</Text>
                <Text> </Text>
              </Text>
            )
          )}
        </Text>
        <Text style={styles.body}>{item.body}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoRow}>
        <BeerGlyph size={24} />
        <Text style={styles.logoText}>Beer Me</Text>
      </View>
      {/* Skip */}
      {index < 3 && (
        <TouchableOpacity onPress={onDone} activeOpacity={0.7} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}
      {/* Slides */}
      <FlatList
        ref={ref}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / W);
          setIndex(i);
        }}
        style={{ flex: 1 }}
        getItemLayout={(_, i) => ({ length: W, offset: W * i, index: i })}
      />
      {/* Bottom: dots + CTA */}
      <View style={styles.bottomRow}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)} activeOpacity={0.7}>
              <View
                style={[
                  styles.dot,
                  i === index ? styles.dotActive : styles.dotInactive,
                  { width: i === index ? 22 : 8 },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flex: 1 }} />
        <BMButton
          onPress={handleNext}
          kind={index === SLIDES.length - 1 ? 'dark' : 'primary'}
        >
          {index === SLIDES.length - 1 ? 'Pour me a pint →' : 'Next'}
        </BMButton>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BM.cream,
  },
  logoRow: {
    position: 'absolute',
    top: 56,
    left: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: -0.2,
    color: BM.malt,
  },
  skipBtn: {
    position: 'absolute',
    top: 62,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: BM.malt3,
  },
  heroContainer: {
    height: 280,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 110,
    position: 'relative',
  },
  heroCircle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: BM.amberSoft,
    opacity: 0.5,
    top: 30,
  },
  heroLabel: {
    fontFamily: BM.mono,
    fontSize: 11,
    color: BM.malt3,
  },
  phoneBody: {
    width: 140,
    height: 220,
    borderRadius: 28,
    backgroundColor: BM.malt,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  phoneScreen: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: BM.cream2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  qrCard: {
    width: 180,
    height: 180,
    backgroundColor: BM.surface,
    borderWidth: 2,
    borderColor: BM.malt,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  slideContent: {
    paddingHorizontal: 28,
    paddingTop: 20,
    flex: 1,
  },
  kicker: {
    fontFamily: BM.mono,
    fontSize: 11,
    color: BM.malt3,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    fontWeight: '700',
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -1.4,
    color: BM.malt,
    marginBottom: 0,
  },
  titleHighlight: {
    backgroundColor: BM.amber,
    color: BM.malt,
    overflow: 'hidden',
    borderRadius: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 23,
    color: BM.malt2,
    marginTop: 18,
  },
  bottomRow: {
    paddingHorizontal: 28,
    paddingBottom: 90,
    paddingTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: BM.amberDeep,
  },
  dotInactive: {
    backgroundColor: BM.border,
  },
});
