import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BM, BARS, type Bar } from '@/constants/bm';
import { BeerGlyph, BMButton, Icons, ScreenHeader, TabBar } from './primitives';
import type { TabId } from './primitives';

const { width: W, height: H } = Dimensions.get('window');

// ─── Map Screen ───────────────────────────────────────────────────────────────
export function MapScreen({
  onBack,
  onOpenBar,
  activeTab,
  onTabChange,
}: {
  onBack?: () => void;
  onOpenBar: (bar: Bar) => void;
  activeTab: TabId;
  onTabChange: (t: TabId) => void;
}) {
  const [selected, setSelected] = useState('fox');
  const cur = BARS.find((b) => b.id === selected) ?? BARS[0];
  const mapH = H * 0.62;

  return (
    <View style={styles.screen}>
      {/* Map area */}
      <View style={[styles.mapArea, { height: mapH }]}>
        {/* Dotted background */}
        <View style={styles.mapBg} />
        {/* "Streets" as colored rectangles */}
        <View style={[styles.road, { top: '35%', left: 0, right: 0, height: 8 }]} />
        <View style={[styles.road, { top: '75%', left: 0, right: 0, height: 8 }]} />
        <View style={[styles.road, { left: '35%', top: 0, bottom: 0, width: 8 }]} />
        <View style={[styles.road, { left: '72%', top: 0, bottom: 0, width: 8 }]} />
        <View style={[styles.minorRoad, { top: '52%', left: 0, right: 0, height: 4 }]} />
        <View style={[styles.minorRoad, { left: '15%', top: 0, bottom: 0, width: 4 }]} />
        <View style={[styles.minorRoad, { left: '55%', top: 0, bottom: 0, width: 4 }]} />
        {/* Park blob */}
        <View style={styles.park}>
          <Text style={styles.parkLabel}>CIVIC PARK</Text>
        </View>
        {/* You-are-here */}
        <View style={[styles.youHere, { left: '48%', top: '52%' }]}>
          <View style={styles.youDot} />
          <View style={styles.youPulse} />
        </View>
        {/* Bar pins */}
        {BARS.map((bar) => {
          const isSel = bar.id === selected;
          return (
            <TouchableOpacity
              key={bar.id}
              onPress={() => setSelected(bar.id)}
              activeOpacity={0.8}
              style={[
                styles.pin,
                {
                  left: `${bar.x}%` as any,
                  top: `${bar.y}%` as any,
                  zIndex: isSel ? 3 : 1,
                },
              ]}
            >
              <View style={[styles.pinHead, isSel && styles.pinHeadSelected]}>
                <BeerGlyph
                  size={22}
                  color={isSel ? BM.amber : BM.amberDeep}
                  foam="#fff"
                  stroke={BM.malt}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Overlay: header + search */}
      <View style={styles.mapOverlay}>
        <ScreenHeader
          onBack={onBack}
          left={
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.8}
              style={styles.mapHeaderBtn}
            >
              {Icons.back(20)}
            </TouchableOpacity>
          }
          right={
            <TouchableOpacity activeOpacity={0.8} style={styles.mapListBtn}>
              <Text style={styles.mapListBtnText}>List</Text>
            </TouchableOpacity>
          }
        />
        <View style={styles.searchPill}>
          {Icons.search(18)}
          <Text style={styles.searchPlaceholder}>Beer Me bars near you</Text>
          <View style={styles.openCount}>
            <Text style={styles.openCountText}>{BARS.length} open</Text>
          </View>
        </View>
      </View>

      {/* Bottom bar sheet */}
      <View style={styles.barSheet}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={styles.barIcon}>
            <Text style={{ fontSize: 28 }}>
              {cur.type === 'craft' ? '🍺' : cur.type === 'garden' ? '🌳' : cur.type === 'dive' ? '🪩' : '🍻'}
            </Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.barName}>{cur.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.barMeta}>★ {cur.rating}</Text>
              <Text style={styles.barMeta}>·</Text>
              <Text style={styles.barMeta}>{cur.price}</Text>
              <Text style={styles.barMeta}>·</Text>
              <Text style={styles.barMeta}>{cur.dist}</Text>
            </View>
            <Text style={styles.barHours}>{cur.hours}</Text>
          </View>
          <TouchableOpacity onPress={() => onOpenBar(cur)} activeOpacity={0.8} style={styles.openBtn}>
            <Text style={styles.openBtnText}>Open</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TabBar active={activeTab} onChange={onTabChange} />
    </View>
  );
}

// ─── Bar Detail Screen ────────────────────────────────────────────────────────
export function BarDetailScreen({
  bar,
  onBack,
  onRedeemHere,
}: {
  bar: Bar;
  onBack: () => void;
  onRedeemHere: () => void;
}) {
  return (
    <View style={styles.screen}>
      {/* Cover image */}
      <View style={styles.cover}>
        <View style={styles.coverPattern} />
        <View style={styles.coverGlyph}>
          <BeerGlyph size={180} color={BM.amber} foam={BM.foam} stroke={BM.malt} />
        </View>
        <View style={styles.coverHeader}>
          <TouchableOpacity onPress={onBack} activeOpacity={0.8} style={styles.coverBackBtn}>
            {Icons.back(20)}
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity activeOpacity={0.8} style={styles.coverActionBtn}>
              <Text style={{ fontSize: 18 }}>♡</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.coverActionBtn}>
              <Text style={{ fontSize: 18 }}>↗</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.detailScroll} showsVerticalScrollIndicator={false}>
        {/* Header card */}
        <View style={styles.detailCard}>
          <View style={styles.partnerBadge}>
            <BeerGlyph size={12} />
            <Text style={styles.partnerBadgeText}>Partner bar</Text>
          </View>
          <Text style={styles.detailName}>{bar.name}</Text>
          <Text style={styles.detailTag}>{bar.tag}</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            {[`★ ${bar.rating}`, bar.price, bar.dist].map((v, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Text style={styles.detailMetaSep}>·</Text>}
                <Text style={styles.detailMeta}>{v}</Text>
              </React.Fragment>
            ))}
            <Text style={styles.detailMetaSep}>·</Text>
            <Text style={styles.detailOpen}>● {bar.hours}</Text>
          </View>
        </View>

        {/* What they pour */}
        <View style={{ marginBottom: 18 }}>
          <Text style={styles.sectionLabel}>What they pour</Text>
          <View style={styles.menuWrap}>
            {bar.menu.map((m) => (
              <View key={m} style={styles.menuTag}>
                <Text style={styles.menuTagText}>{m}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Redeemable card */}
        <View style={styles.redeemCard}>
          <View style={styles.redeemCardBg}>
            <BeerGlyph size={120} color={BM.foam} foam={BM.foam} stroke={BM.foam} />
          </View>
          <Text style={styles.redeemLabel}>Redeemable here</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <Text style={styles.redeemNumber}>5</Text>
            <Text style={styles.redeemSub}>beers in your wallet</Text>
          </View>
          <BMButton kind="primary" size="md" onPress={onRedeemHere} style={{ marginTop: 14, width: '100%' }}>
            Pull up the QR
          </BMButton>
        </View>

        {/* House rules */}
        <View>
          <Text style={styles.sectionLabel}>House rules</Text>
          <View style={styles.rulesCard}>
            <Text style={styles.rulesText}>
              One redemption per visit. Drafts only — bottles excluded. 21+ ID required.{'\n'}
              Tipping the bartender encouraged (it's not on Beer Me's tab).
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BM.cream,
  },
  mapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#EDE8DC',
    overflow: 'hidden',
  },
  mapBg: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#EDEADC',
  } as any,
  road: {
    position: 'absolute',
    backgroundColor: BM.foam,
    zIndex: 1,
  },
  minorRoad: {
    position: 'absolute',
    backgroundColor: BM.foam,
    zIndex: 1,
  },
  park: {
    position: 'absolute',
    left: '38%',
    top: '58%',
    width: '24%',
    height: '12%',
    borderRadius: 999,
    backgroundColor: 'rgba(120,200,80,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  parkLabel: {
    fontSize: 7,
    fontFamily: BM.mono,
    color: 'rgba(40,100,20,0.8)',
    letterSpacing: 0.5,
  },
  youHere: {
    position: 'absolute',
    zIndex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: BM.hop,
    borderWidth: 3,
    borderColor: BM.foam,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  youPulse: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(90,200,40,0.2)',
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 2,
    transform: [{ translateX: -22 }, { translateY: -44 }],
  },
  pinHead: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderBottomLeftRadius: 0,
    transform: [{ rotate: '-45deg' }],
    backgroundColor: BM.amber,
    borderWidth: 2,
    borderColor: BM.malt,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  pinHeadSelected: {
    backgroundColor: BM.malt,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  mapHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BM.foam,
    borderWidth: 1,
    borderColor: BM.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapListBtn: {
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 999,
    backgroundColor: BM.foam,
    borderWidth: 1,
    borderColor: BM.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapListBtnText: {
    fontWeight: '600',
    fontSize: 13,
    color: BM.malt,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginTop: -4,
    backgroundColor: BM.foam,
    borderWidth: 1,
    borderColor: BM.border,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: BM.malt3,
  },
  openCount: {
    backgroundColor: BM.amberSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  openCountText: {
    fontFamily: BM.mono,
    fontSize: 11,
    color: BM.malt2,
  },
  barSheet: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    zIndex: 6,
    backgroundColor: BM.foam,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: BM.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 18,
  },
  barIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: BM.cream2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barName: {
    fontWeight: '700',
    fontSize: 19,
    letterSpacing: -0.4,
    color: BM.malt,
  },
  barMeta: {
    fontSize: 12,
    color: BM.malt3,
    fontFamily: BM.mono,
  },
  barHours: {
    fontSize: 12,
    color: BM.hop,
    marginTop: 2,
  },
  openBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: BM.malt,
  },
  openBtnText: {
    fontWeight: '700',
    fontSize: 13,
    color: BM.foam,
  },
  // Bar detail
  cover: {
    height: 200,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#7A4000',
  },
  coverPattern: {
    position: 'absolute',
    inset: 0,
    opacity: 0.18,
    backgroundColor: 'transparent',
  } as any,
  coverGlyph: {
    position: 'absolute',
    right: -20,
    bottom: -16,
    opacity: 0.4,
  },
  coverHeader: {
    position: 'absolute',
    top: 56,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coverBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailScroll: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 110,
    gap: 0,
    marginTop: -22,
    zIndex: 2,
  },
  detailCard: {
    backgroundColor: BM.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: BM.border,
    marginBottom: 18,
  },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: BM.amberSoft,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  partnerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: BM.mono,
    color: BM.malt2,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailName: {
    fontWeight: '700',
    fontSize: 28,
    letterSpacing: -1,
    lineHeight: 30,
    color: BM.malt,
  },
  detailTag: {
    fontSize: 13,
    color: BM.malt3,
    marginTop: 2,
  },
  detailMeta: {
    fontSize: 12,
    color: BM.malt2,
    fontFamily: BM.mono,
  },
  detailMetaSep: {
    fontSize: 12,
    color: BM.malt3,
  },
  detailOpen: {
    fontSize: 12,
    color: BM.hop,
  },
  sectionLabel: {
    fontFamily: BM.mono,
    fontSize: 10.5,
    color: BM.malt3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  menuWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  menuTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: BM.surface,
    borderWidth: 1,
    borderColor: BM.border,
  },
  menuTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: BM.malt,
  },
  redeemCard: {
    backgroundColor: BM.malt,
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  redeemCardBg: {
    position: 'absolute',
    right: -10,
    bottom: -16,
    opacity: 0.18,
  },
  redeemLabel: {
    fontSize: 11,
    color: BM.foam,
    opacity: 0.6,
    fontFamily: BM.mono,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  redeemNumber: {
    fontWeight: '700',
    fontSize: 42,
    letterSpacing: -1.5,
    lineHeight: 46,
    color: BM.foam,
  },
  redeemSub: {
    fontSize: 14,
    color: BM.foam,
    opacity: 0.75,
  },
  rulesCard: {
    backgroundColor: BM.surface,
    borderWidth: 1,
    borderColor: BM.border,
    borderRadius: 18,
    padding: 14,
  },
  rulesText: {
    fontSize: 13,
    color: BM.malt2,
    lineHeight: 19,
  },
});
