import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BM, FRIENDS } from '@/constants/bm';
import { Avatar, BeerGlyph, Icons, PintFill, ScreenHeader, TabBar } from './primitives';
import type { TabId } from './primitives';

// ─── Home Screen ──────────────────────────────────────────────────────────────
export function HomeScreen({
  onSend,
  onWallet,
  onActivity,
  activeTab,
  onTabChange,
}: {
  onSend: () => void;
  onWallet: () => void;
  onActivity: () => void;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}) {
  const feed = [
    { f: FRIENDS[0], dir: 'in',  text: 'sent a cold one — coffee yesterday', when: '2h',  n: 1 },
    { f: FRIENDS[3], dir: 'in',  text: 'pour after the move ♥',              when: '1d',  n: 2 },
    { f: FRIENDS[1], dir: 'out', text: 'you sent — late-night ramen',         when: '3d',  n: 1 },
  ] as const;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        left={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <BeerGlyph size={28} />
            <Text style={{ fontWeight: '800', fontSize: 17, letterSpacing: -0.3, color: BM.malt }}>Beer Me</Text>
          </View>
        }
        right={
          <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
            {Icons.bell(20)}
            <View style={styles.notifDot} />
          </TouchableOpacity>
        }
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.greetSub}>Friday evening, Casey.</Text>
          <Text style={styles.greetMain}>
            You're{' '}
            <Text style={styles.highlight}>3 beers up</Text>
            {' '}this week.
          </Text>
        </View>

        {/* Dual stash cards */}
        <View style={styles.dualCard}>
          <TouchableOpacity onPress={onWallet} activeOpacity={0.85} style={styles.stashDark}>
            <Text style={styles.stashLabel}>You're owed</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
              <Text style={styles.stashNumber}>5</Text>
              <Text style={[styles.stashSub, { paddingBottom: 8 }]}>cold ones</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <PintFill value={0.92} size={36} />
              <View style={{ flexDirection: 'row', marginLeft: 4 }}>
                {FRIENDS.slice(0, 3).map((f, i) => (
                  <View key={f.id} style={[styles.stackAvatar, { marginLeft: i === 0 ? 0 : -8 }]}>
                    <Avatar friend={f} size={24} />
                  </View>
                ))}
                <View style={[styles.stackAvatar, { marginLeft: -8, backgroundColor: '#3A2C18' }]}>
                  <Text style={{ color: BM.foam, fontSize: 10, fontWeight: '700' }}>+2</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onActivity} activeOpacity={0.85} style={styles.stashLight}>
            <Text style={styles.stashLabelLight}>You owe</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
              <Text style={styles.stashNumberLight}>2</Text>
              <Text style={[styles.stashSubLight, { paddingBottom: 8 }]}>still pending</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Avatar friend={FRIENDS[1]} size={26} />
              <Text style={styles.stashNote}>Kenji covered{'\n'}your Lyft Sat</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Big CTA */}
        <TouchableOpacity onPress={onSend} activeOpacity={0.88} style={styles.ctaCard}>
          <View style={styles.ctaBg}>
            <BeerGlyph size={120} color={BM.amberDeep} foam={BM.foam} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaKicker}>Quick send</Text>
            <Text style={styles.ctaTitle}>Pour one for a friend</Text>
          </View>
          <View style={styles.ctaArrow}>
            {Icons.arrowRight(20, BM.foam)}
          </View>
        </TouchableOpacity>

        {/* The Tab — recent ledger */}
        <View style={{ marginBottom: 16 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>The Tab</Text>
            <TouchableOpacity onPress={onActivity} activeOpacity={0.7}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.feedCard}>
            {feed.map((row, i) => (
              <View key={i} style={[styles.feedRow, i < feed.length - 1 && styles.feedRowBorder]}>
                <Avatar friend={row.f} size={40} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.feedText} numberOfLines={1}>
                    {row.f.name.split(' ')[0]} {row.text}
                  </Text>
                  <Text style={styles.feedWhen}>{row.when} ago</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: row.dir === 'in' ? BM.receivedBg : BM.cream2 }]}>
                  <Text style={[styles.badgeText, { color: row.dir === 'in' ? BM.receivedFg : BM.malt2 }]}>
                    {row.dir === 'in' ? '+' : '−'}{row.n} 🍺
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.footer}>Drink responsibly · 21+ only · 100+ partner bars</Text>
      </ScrollView>

      <TabBar active={activeTab} onChange={onTabChange} />
    </View>
  );
}

// ─── Activity Screen ──────────────────────────────────────────────────────────
export function ActivityScreen({ onBack }: { onBack: () => void }) {
  const items = [
    { f: FRIENDS[0], dir: 'in',  note: 'thanks for the latte yesterday ☕',  when: 'Today, 4:12pm', status: 'In your wallet' },
    { f: FRIENDS[3], dir: 'in',  note: 'For helping me move. you saved my back', when: 'Yesterday', status: 'Redeemed at The Foxhole' },
    { f: FRIENDS[1], dir: 'out', note: 'late night ramen save',               when: 'Wed',       status: 'Sent — waiting for redeem' },
    { f: FRIENDS[2], dir: 'in',  note: 'gas money 🚗',                        when: 'Mon',       status: 'Redeemed at Hopwell & Co' },
    { f: FRIENDS[6], dir: 'in',  note: 'covered my round at trivia',          when: 'May 9',     status: 'Redeemed at The Foxhole' },
    { f: FRIENDS[5], dir: 'out', note: 'cheers — happy bday',                 when: 'May 4',     status: 'Redeemed by Theo' },
    { f: FRIENDS[4], dir: 'in',  note: 'book club host gift 📚',              when: 'Apr 30',    status: 'Redeemed at Civic Tap' },
  ] as const;

  const [filter, setFilter] = React.useState(0);
  const filters = ['All', 'Received', 'Sent', 'Redeemed'];

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="The Tab"
        big
        onBack={onBack}
        right={
          <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
            {Icons.search(18)}
          </TouchableOpacity>
        }
      />
      <View style={styles.filterRow}>
        {filters.map((f, i) => (
          <TouchableOpacity key={f} onPress={() => setFilter(i)} activeOpacity={0.7}
            style={[styles.filterPill, i === filter && styles.filterPillActive]}>
            <Text style={[styles.filterText, i === filter && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 10 }} showsVerticalScrollIndicator={false}>
        {items.map((it, i) => {
          const isRedeemed = it.status.startsWith('Redeemed');
          const isIn = it.dir === 'in';
          return (
            <View key={i} style={styles.activityItem}>
              <Avatar friend={it.f} size={40} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
                  <Text style={styles.activityName}>
                    {isIn ? `${it.f.name.split(' ')[0]} → you` : `you → ${it.f.name.split(' ')[0]}`}
                  </Text>
                  <Text style={styles.activityWhen}>{it.when}</Text>
                </View>
                <Text style={styles.activityNote} numberOfLines={2}>"{it.note}"</Text>
                <View style={[
                  styles.statusTag,
                  {
                    backgroundColor: isRedeemed ? BM.receivedBg
                      : it.status.startsWith('In') ? BM.amberSoft
                      : BM.cream2,
                  }
                ]}>
                  <Text style={[styles.statusText, { color: isRedeemed ? BM.receivedFg : BM.malt2 }]}>
                    {isRedeemed ? '✓ ' : ''}{it.status}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─── Profile Screen ───────────────────────────────────────────────────────────
export function ProfileScreen({ activeTab, onTabChange }: { activeTab: TabId; onTabChange: (t: TabId) => void }) {
  const stats = [{ n: 47, l: 'sent' }, { n: 32, l: 'received' }, { n: 5, l: 'pending' }];
  const badges = [
    { e: '🍻', l: 'First round',  ok: true },
    { e: '🎂', l: 'Birthday saver', ok: true },
    { e: '🚖', l: 'Designated',   ok: true },
    { e: '🌃', l: 'Night owl',    ok: false },
  ];
  const settings = [
    { l: 'Payment method',  r: 'Visa •• 4421' },
    { l: 'Linked contacts', r: '184' },
    { l: 'Notifications',   r: 'On' },
    { l: 'Drink preference', r: 'Lager · Cider · NA' },
    { l: 'Help & support',  r: '' },
  ];

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="You"
        big
        right={
          <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
            {Icons.more(18)}
          </TouchableOpacity>
        }
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 }]} showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={{ position: 'absolute', right: -10, top: -10, opacity: 0.18 }}>
            <BeerGlyph size={140} color={BM.foam} foam={BM.foam} stroke={BM.foam} />
          </View>
          <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
            <Avatar friend={{ initial: 'CK', hue: 60 }} size={64} />
            <View>
              <Text style={styles.profileName}>Casey Kim</Text>
              <Text style={styles.profileHandle}>@casey.k · since Apr '26</Text>
            </View>
          </View>
          <View style={styles.profileStats}>
            {stats.map((s) => (
              <View key={s.l}>
                <Text style={styles.statNumber}>{s.n}</Text>
                <Text style={styles.statLabel}>{s.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Badges */}
        <View style={{ marginBottom: 18 }}>
          <Text style={styles.sectionTitle}>Coaster collection</Text>
          <View style={styles.badgeGrid}>
            {badges.map((b, i) => (
              <View key={i} style={[styles.badgeItem, { opacity: b.ok ? 1 : 0.5, borderColor: b.ok ? BM.amber : BM.border, backgroundColor: b.ok ? BM.amberSoft : BM.surface }]}>
                <Text style={{ fontSize: 22 }}>{b.e}</Text>
                <Text style={styles.badgeLabel}>{b.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsList}>
          {settings.map((row, i) => (
            <View key={i} style={[styles.settingRow, i < settings.length - 1 && { borderBottomWidth: 1, borderBottomColor: BM.border }]}>
              <Text style={styles.settingLabel}>{row.l}</Text>
              <Text style={styles.settingValue}>{row.r}</Text>
              {Icons.chevronRight()}
            </View>
          ))}
        </View>
      </ScrollView>
      <TabBar active={activeTab} onChange={onTabChange} />
    </View>
  );
}

// ─── Shared Styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BM.cream,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110,
    gap: 0,
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
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BM.amberDeep,
  },
  greetSub: {
    fontSize: 14,
    color: BM.malt3,
    fontWeight: '500',
    marginBottom: 4,
  },
  greetMain: {
    fontWeight: '700',
    fontSize: 28,
    letterSpacing: -0.8,
    lineHeight: 32,
    color: BM.malt,
  },
  highlight: {
    backgroundColor: BM.amber,
    color: BM.malt,
    overflow: 'hidden',
    borderRadius: 8,
  },
  dualCard: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  stashDark: {
    flex: 1,
    backgroundColor: BM.malt,
    borderRadius: 22,
    padding: 16,
    gap: 10,
    shadowColor: BM.malt,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  stashLabel: {
    fontFamily: BM.mono,
    fontSize: 10,
    color: BM.foam,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stashNumber: {
    fontWeight: '700',
    fontSize: 54,
    lineHeight: 52,
    letterSpacing: -2,
    color: BM.foam,
  },
  stashSub: {
    fontSize: 13,
    color: BM.foam,
    opacity: 0.7,
  },
  stackAvatar: {
    borderWidth: 2,
    borderColor: BM.malt,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stashLight: {
    flex: 1,
    backgroundColor: BM.surface,
    borderWidth: 1,
    borderColor: BM.border,
    borderRadius: 22,
    padding: 16,
    gap: 10,
  },
  stashLabelLight: {
    fontFamily: BM.mono,
    fontSize: 10,
    color: BM.malt3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stashNumberLight: {
    fontWeight: '700',
    fontSize: 54,
    lineHeight: 52,
    letterSpacing: -2,
    color: BM.malt,
  },
  stashSubLight: {
    fontSize: 13,
    color: BM.malt3,
  },
  stashNote: {
    fontSize: 12,
    color: BM.malt2,
    lineHeight: 16,
  },
  ctaCard: {
    backgroundColor: BM.amber,
    borderRadius: 26,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: BM.amberDeep,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  ctaBg: {
    position: 'absolute',
    right: -18,
    top: -8,
    opacity: 0.5,
    transform: [{ rotate: '15deg' }],
  },
  ctaKicker: {
    fontFamily: BM.mono,
    fontSize: 10,
    letterSpacing: 0.5,
    opacity: 0.7,
    textTransform: 'uppercase',
    color: BM.malt,
  },
  ctaTitle: {
    fontWeight: '700',
    fontSize: 22,
    letterSpacing: -0.6,
    color: BM.malt,
    marginTop: 2,
  },
  ctaArrow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BM.malt,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: -0.3,
    color: BM.malt,
    marginBottom: 10,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: BM.malt3,
  },
  feedCard: {
    backgroundColor: BM.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BM.border,
    overflow: 'hidden',
  },
  feedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  feedRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: BM.border,
  },
  feedText: {
    fontWeight: '600',
    fontSize: 14,
    color: BM.malt,
  },
  feedWhen: {
    fontSize: 12,
    color: BM.malt3,
    marginTop: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 13,
  },
  footer: {
    fontFamily: BM.mono,
    fontSize: 10.5,
    color: BM.malt3,
    textAlign: 'center',
    paddingVertical: 4,
  },
  // Activity
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: BM.surface,
    borderWidth: 1,
    borderColor: BM.border,
  },
  filterPillActive: {
    backgroundColor: BM.malt,
    borderColor: BM.malt,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: BM.malt2,
  },
  filterTextActive: {
    color: BM.foam,
  },
  activityItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: BM.surface,
    borderWidth: 1,
    borderColor: BM.border,
  },
  activityName: {
    fontWeight: '700',
    fontSize: 14,
    color: BM.malt,
  },
  activityWhen: {
    fontSize: 11,
    color: BM.malt3,
    fontFamily: BM.mono,
  },
  activityNote: {
    fontSize: 13,
    color: BM.malt2,
    marginTop: 4,
    lineHeight: 18,
  },
  statusTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: BM.mono,
  },
  // Profile
  profileCard: {
    backgroundColor: BM.malt,
    borderRadius: 26,
    padding: 20,
    marginBottom: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  profileName: {
    fontWeight: '700',
    fontSize: 22,
    letterSpacing: -0.4,
    color: BM.foam,
  },
  profileHandle: {
    fontSize: 13,
    color: BM.foam,
    opacity: 0.7,
    marginTop: 2,
    fontFamily: BM.mono,
  },
  profileStats: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  statNumber: {
    fontWeight: '700',
    fontSize: 26,
    letterSpacing: -1,
    color: BM.foam,
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: BM.foam,
    opacity: 0.6,
    fontFamily: BM.mono,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  badgeItem: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: BM.malt2,
    textAlign: 'center',
    lineHeight: 13,
  },
  settingsList: {
    backgroundColor: BM.surface,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BM.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 16,
  },
  settingLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: BM.malt,
  },
  settingValue: {
    fontSize: 13,
    color: BM.malt3,
    marginRight: 8,
  },
});
