import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BM, WALLET_BEERS, type Beer } from '@/constants/bm';
import { Avatar, BeerGlyph, BMButton, FakeQR, Icons, PintFill, ScreenHeader, TabBar } from './primitives';
import type { TabId } from './primitives';

// ─── Wallet Screen ────────────────────────────────────────────────────────────
export function WalletScreen({
  onBack,
  onOpenBeer,
  activeTab,
  onTabChange,
}: {
  onBack?: () => void;
  onOpenBeer: (b: Beer) => void;
  activeTab: TabId;
  onTabChange: (t: TabId) => void;
}) {
  const beers = WALLET_BEERS;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Wallet"
        big
        onBack={onBack}
        right={
          <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
            {Icons.qr(20)}
          </TouchableOpacity>
        }
      />

      {/* Stash banner */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
        <View style={styles.stashBanner}>
          <View style={styles.stashBannerBg}>
            <BeerGlyph size={130} color={BM.foam} foam={BM.foam} stroke={BM.foam} />
          </View>
          <PintFill value={1} size={64} />
          <View>
            <Text style={styles.bannerLabel}>Stashed</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
              <Text style={styles.bannerNumber}>{beers.length}</Text>
              <Text style={styles.bannerSub}>beers waiting</Text>
            </View>
            <Text style={styles.bannerEst}>≈ $42 at partner bars</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {beers.map((b) => (
          <TouchableOpacity key={b.id} onPress={() => onOpenBeer(b)} activeOpacity={0.85} style={styles.beerTicket}>
            {/* Avatar stub */}
            <View style={[styles.ticketLeft, { backgroundColor: b.closing ? '#F5D0C0' : BM.amberSoft }]}>
              <Avatar friend={b.from} size={44} />
              <Text style={styles.ticketName}>{b.from.name.split(' ')[0]}</Text>
              {b.new && <View style={styles.newBadge}><Text style={styles.newBadgeText}>NEW</Text></View>}
            </View>
            {/* Perforation */}
            <View style={styles.perforation}>
              <View style={styles.perforationLine} />
            </View>
            {/* Content */}
            <View style={styles.ticketContent}>
              <Text style={styles.ticketNote} numberOfLines={2}>"{b.note}"</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={styles.ticketMeta}>{b.when}</Text>
                <Text style={styles.ticketMeta}>·</Text>
                <Text style={[styles.ticketMeta, b.closing && { color: '#C04010' }]}>
                  {b.closing ? '⚠ expires ' : 'exp '}{b.expires}
                </Text>
              </View>
            </View>
            {/* QR button */}
            <View style={styles.qrCircle}>
              {Icons.qr(16, BM.malt)}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TabBar active={activeTab} onChange={onTabChange} />
    </View>
  );
}

// ─── QR Screen ────────────────────────────────────────────────────────────────
export function QRScreen({
  beer,
  onBack,
  onRedeem,
  layout = 'classic',
}: {
  beer: Beer;
  onBack: () => void;
  onRedeem: () => void;
  layout?: 'classic' | 'ticket' | 'coaster';
}) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const i = setInterval(() => setPulse((p) => !p), 1400);
    return () => clearInterval(i);
  }, []);

  const tokenId = `BM·${beer.id.toUpperCase()}·${Math.floor(Date.now() / 60000) % 100000}`;

  return (
    <View style={styles.qrScreen}>
      <View style={styles.qrRadial} />

      <ScreenHeader
        dark
        onBack={onBack}
        right={
          <TouchableOpacity activeOpacity={0.7} style={styles.iconBtnDark}>
            {Icons.more(18, BM.foam)}
          </TouchableOpacity>
        }
      />

      <View style={styles.qrCenter}>
        <Text style={styles.showBar}>Show this at the bar</Text>

        {layout === 'ticket' ? (
          <TicketCard beer={beer} />
        ) : layout === 'coaster' ? (
          <CoasterCard beer={beer} />
        ) : (
          <ClassicCard beer={beer} />
        )}

        <View style={styles.tokenRow}>
          <View style={[styles.tokenDot, { opacity: pulse ? 1 : 0.4 }]} />
          <Text style={styles.tokenText}>{tokenId}</Text>
        </View>
      </View>

      <View style={styles.qrBottom}>
        <BMButton kind="primary" size="lg" onPress={onRedeem} style={{ width: '100%' }}>
          Redeem now — mark as poured
        </BMButton>
        <TouchableOpacity activeOpacity={0.7} style={{ padding: 8 }}>
          <Text style={styles.findBarText}>Find a partner bar near me →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ClassicCard({ beer }: { beer: Beer }) {
  return (
    <View style={styles.classicCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Avatar friend={beer.from} size={42} />
        <View style={{ flex: 1 }}>
          <Text style={styles.cardFromLabel}>From</Text>
          <Text style={styles.cardFromName}>{beer.from.name}</Text>
        </View>
        <BeerGlyph size={32} />
      </View>
      <View style={styles.classicQR}>
        <FakeQR size={220} />
      </View>
      <Text style={styles.classicNote}>"{beer.note}"</Text>
      <View style={styles.classicMeta}>
        <Text style={styles.classicMetaText}>Beer · 1 round</Text>
        <Text style={styles.classicMetaText}>exp {beer.expires}</Text>
      </View>
    </View>
  );
}

function TicketCard({ beer }: { beer: Beer }) {
  return (
    <View style={styles.ticketCard}>
      {/* Top stub */}
      <View style={styles.ticketTop}>
        <View>
          <Text style={styles.ticketTopLabel}>Beer Me · admit one</Text>
          <Text style={styles.ticketTopTitle}>1 cold one</Text>
        </View>
        <BeerGlyph size={44} />
      </View>
      {/* Perforation */}
      <View style={styles.ticketPerf}>
        <View style={styles.ticketPerfLine} />
      </View>
      {/* Body */}
      <View style={styles.ticketBody}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Avatar friend={beer.from} size={38} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardFromLabel}>FROM</Text>
            <Text style={{ fontWeight: '700', fontSize: 14, color: BM.malt }}>{beer.from.name}</Text>
          </View>
        </View>
        <View style={styles.classicQR}>
          <FakeQR size={180} />
        </View>
        <Text style={[styles.classicNote, { marginTop: 14 }]}>"{beer.note}"</Text>
      </View>
    </View>
  );
}

function CoasterCard({ beer }: { beer: Beer }) {
  return (
    <View style={styles.coasterCard}>
      <Text style={styles.coasterTitle}>· Beer Me ·</Text>
      <FakeQR size={170} />
      <Text style={styles.coasterBottom}>From {beer.from.name.split(' ')[0]} · 1 round</Text>
      <Text style={styles.coasterLeft}>🌾</Text>
      <Text style={styles.coasterRight}>🌾</Text>
    </View>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
export function SuccessScreen({
  beer,
  bar = 'The Foxhole',
  onDone,
}: {
  beer: Beer;
  bar?: string;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const bodyFade  = useRef(new Animated.Value(0)).current;
  const pintValue = useRef(new Animated.Value(0.1)).current;

  useEffect(() => {
    setTimeout(() => {
      setPhase(1);
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
        Animated.timing(titleFade, { toValue: 1, duration: 400, delay: 200, useNativeDriver: true }),
      ]).start();
    }, 150);
    setTimeout(() => {
      setPhase(2);
      Animated.parallel([
        Animated.timing(pintValue, { toValue: 1, duration: 700, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        Animated.timing(bodyFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    }, 900);
  }, []);

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.successScreen}>
      {/* Confetti dots */}
      {phase >= 2 && Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * 360;
        const dist = 120 + (i % 3) * 40;
        const colors = ['#fff', BM.amber, BM.malt];
        return (
          <View key={i} style={{
            position: 'absolute',
            top: '38%' as any,
            left: '50%' as any,
            width: 8,
            height: 14,
            borderRadius: 2,
            backgroundColor: colors[i % 3],
            transform: [
              { translateX: Math.cos((angle * Math.PI) / 180) * dist },
              { translateY: Math.sin((angle * Math.PI) / 180) * dist },
              { rotate: `${angle * 2}deg` },
            ],
          }}/>
        );
      })}

      <View style={styles.successCenter}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <PintFill value={phase >= 2 ? 1 : phase >= 1 ? 0.7 : 0.1} size={170} />
        </Animated.View>

        <Text style={styles.successTime}>Redeemed · {time}</Text>

        <Animated.Text style={[styles.successTitle, { opacity: titleFade }]}>Cheers.</Animated.Text>

        <Animated.Text style={[styles.successSub, { opacity: bodyFade }]}>
          Round's on {beer.from.name.split(' ')[0]} at {bar}.
        </Animated.Text>

        <Animated.View style={[styles.serverNote, { opacity: bodyFade }]}>
          <Text style={styles.serverNoteLabel}>Server</Text>
          <Text style={styles.serverNoteText}>
            ✓ Tab confirmed. Enjoy the pour — show your server this screen if asked.
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.successActions, { opacity: bodyFade }]}>
        <BMButton kind="dark" size="lg" onPress={onDone} style={{ width: '100%' }}>
          Send {beer.from.name.split(' ')[0]} a thank-you →
        </BMButton>
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BM.cream,
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
  stashBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 22,
    backgroundColor: BM.malt,
    overflow: 'hidden',
    position: 'relative',
  },
  stashBannerBg: {
    position: 'absolute',
    right: -10,
    bottom: -16,
    opacity: 0.16,
  },
  bannerLabel: {
    fontFamily: BM.mono,
    fontSize: 10,
    color: BM.foam,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bannerNumber: {
    fontWeight: '700',
    fontSize: 44,
    letterSpacing: -1.6,
    lineHeight: 46,
    color: BM.foam,
  },
  bannerSub: {
    fontSize: 13,
    color: BM.foam,
    opacity: 0.75,
  },
  bannerEst: {
    fontSize: 12,
    color: BM.foam,
    opacity: 0.65,
    marginTop: 4,
  },
  scroll: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 110,
    gap: 12,
  },
  beerTicket: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: BM.surface,
    borderWidth: 1,
    borderColor: BM.border,
    borderRadius: 22,
    overflow: 'hidden',
  },
  ticketLeft: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 6,
    position: 'relative',
  },
  ticketName: {
    fontSize: 11,
    fontWeight: '600',
    color: BM.malt2,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: BM.malt,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    fontSize: 9,
    fontFamily: BM.mono,
    fontWeight: '700',
    color: BM.foam,
    letterSpacing: 0.5,
  },
  perforation: {
    width: 16,
    position: 'relative',
    flexShrink: 0,
  },
  perforationLine: {
    position: 'absolute',
    top: 12,
    bottom: 12,
    left: 7,
    borderLeftWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: BM.border,
  },
  ticketContent: {
    flex: 1,
    padding: 14,
    paddingLeft: 4,
    justifyContent: 'center',
    gap: 6,
  },
  ticketNote: {
    fontSize: 14.5,
    fontWeight: '600',
    color: BM.malt,
    lineHeight: 19,
  },
  ticketMeta: {
    fontSize: 11,
    color: BM.malt3,
    fontFamily: BM.mono,
  },
  qrCircle: {
    alignSelf: 'center',
    marginRight: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: BM.amber,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BM.amberDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  // QR screen
  qrScreen: {
    flex: 1,
    backgroundColor: BM.malt,
  },
  qrRadial: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(60,20,0,0.3)',
  },
  iconBtnDark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    position: 'relative',
  },
  showBar: {
    fontFamily: BM.mono,
    fontSize: 11,
    color: BM.foam,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 18,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 28,
  },
  tokenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BM.hop,
  },
  tokenText: {
    fontFamily: BM.mono,
    fontSize: 12,
    color: BM.foam,
    opacity: 0.55,
    letterSpacing: 0.5,
  },
  qrBottom: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    gap: 10,
  },
  findBarText: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  // QR card layouts
  classicCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: BM.foam,
    borderRadius: 28,
    padding: 22,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  cardFromLabel: {
    fontSize: 11,
    color: BM.malt3,
    fontFamily: BM.mono,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardFromName: {
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: -0.3,
    color: BM.malt,
  },
  classicQR: {
    backgroundColor: BM.surface,
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classicNote: {
    textAlign: 'center',
    fontSize: 13,
    color: BM.malt2,
    lineHeight: 18,
  },
  classicMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: BM.cream2,
  },
  classicMetaText: {
    fontFamily: BM.mono,
    fontSize: 11,
    color: BM.malt2,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  ticketCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  ticketTop: {
    padding: 18,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BM.amber,
    borderRadius: 0,
  },
  ticketTopLabel: {
    fontFamily: BM.mono,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: BM.malt,
    opacity: 0.75,
  },
  ticketTopTitle: {
    fontWeight: '800',
    fontSize: 22,
    letterSpacing: -0.8,
    color: BM.malt,
  },
  ticketPerf: {
    height: 18,
    backgroundColor: BM.foam,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketPerfLine: {
    width: '85%',
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: BM.border,
  },
  ticketBody: {
    padding: 14,
    paddingHorizontal: 22,
    paddingBottom: 22,
    backgroundColor: BM.foam,
  },
  coasterCard: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: BM.foam,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 30,
    borderWidth: 9,
    borderColor: BM.malt,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 25,
  },
  coasterTitle: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: BM.malt,
  },
  coasterBottom: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: BM.mono,
    fontSize: 10,
    color: BM.malt3,
    letterSpacing: 0.5,
  },
  coasterLeft: {
    position: 'absolute',
    left: 16,
    top: '50%' as any,
    fontSize: 22,
    transform: [{ translateY: -11 }],
  },
  coasterRight: {
    position: 'absolute',
    right: 16,
    top: '50%' as any,
    fontSize: 22,
    transform: [{ translateY: -11 }, { scaleX: -1 }],
  },
  // Success screen
  successScreen: {
    flex: 1,
    backgroundColor: BM.hop,
  },
  successCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 8,
  },
  successTime: {
    fontFamily: BM.mono,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: BM.malt,
    opacity: 0.7,
    marginTop: 18,
  },
  successTitle: {
    fontWeight: '700',
    fontSize: 44,
    letterSpacing: -1.6,
    lineHeight: 48,
    color: BM.malt,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 17,
    marginTop: 4,
    textAlign: 'center',
    color: BM.malt2,
  },
  serverNote: {
    marginTop: 22,
    backgroundColor: BM.malt,
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
    maxWidth: 280,
  },
  serverNoteLabel: {
    fontSize: 11,
    color: BM.foam,
    opacity: 0.6,
    fontFamily: BM.mono,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  serverNoteText: {
    fontSize: 14,
    color: BM.foam,
    marginTop: 4,
    lineHeight: 19,
  },
  successActions: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
});
