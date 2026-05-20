import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BM, FRIENDS, type Friend } from '@/constants/bm';
import { Avatar, BeerGlyph, BMButton, Icons, ScreenHeader } from './primitives';

// ─── Pick Friend Screen ───────────────────────────────────────────────────────
export function PickFriendScreen({
  onPick,
  onBack,
  pickerStyle = 'list',
}: {
  onPick: (f: Friend) => void;
  onBack: () => void;
  pickerStyle?: 'list' | 'grid';
}) {
  const [q, setQ] = useState('');
  const filtered = FRIENDS.filter(
    (f) =>
      f.name.toLowerCase().includes(q.toLowerCase()) ||
      f.tag.toLowerCase().includes(q.toLowerCase())
  );
  const recent = FRIENDS.slice(0, 4);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Send a beer" big onBack={onBack} />

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          {Icons.search(18)}
          <TextInput
            placeholder="Search friends or contacts"
            value={q}
            onChangeText={setQ}
            style={styles.searchInput}
            placeholderTextColor={BM.malt3}
            autoCorrect={false}
          />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Recent strip */}
        {!q && (
          <View style={{ marginBottom: 18 }}>
            <Text style={styles.sectionLabel}>On the house lately</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
              {recent.map((f) => (
                <TouchableOpacity key={f.id} onPress={() => onPick(f)} activeOpacity={0.8} style={styles.recentItem}>
                  <View style={{ position: 'relative' }}>
                    <Avatar friend={f} size={56} />
                    <View style={styles.recentBadge}>
                      <BeerGlyph size={14} color={BM.malt} foam="#fff" />
                    </View>
                  </View>
                  <Text style={styles.recentName}>{f.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Contact list / grid */}
        <View>
          <Text style={styles.sectionLabel}>{q ? `${filtered.length} matches` : 'Your people'}</Text>
          {pickerStyle === 'grid' ? (
            <View style={styles.grid}>
              {filtered.map((f) => (
                <TouchableOpacity key={f.id} onPress={() => onPick(f)} activeOpacity={0.8} style={styles.gridItem}>
                  <Avatar friend={f} size={52} />
                  <Text style={styles.gridName}>{f.name.split(' ')[0]}</Text>
                  <Text style={styles.gridTag}>{f.tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.listCard}>
              {filtered.map((f, i) => (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => onPick(f)}
                  activeOpacity={0.8}
                  style={[styles.listRow, i < filtered.length - 1 && styles.listRowBorder]}
                >
                  <Avatar friend={f} size={42} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.listName}>{f.name}</Text>
                    <Text style={styles.listTag}>{f.tag}</Text>
                  </View>
                  <View style={styles.pourBtn}>
                    <Text style={styles.pourBtnText}>Pour</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Note Screen ──────────────────────────────────────────────────────────────
const CHIPS = [
  { id: 'coffee', emoji: '☕', label: 'coffee',     note: 'thanks for the coffee!' },
  { id: 'ride',   emoji: '🚗', label: 'ride',       note: 'cheers for the ride home 🙏' },
  { id: 'dinner', emoji: '🍜', label: 'dinner',     note: 'you saved my dinner — cheers' },
  { id: 'lunch',  emoji: '🥪', label: 'lunch',      note: 'thanks for grabbing lunch' },
  { id: 'favor',  emoji: '🛠️', label: 'favor',      note: 'thanks for the favor 🙌' },
  { id: 'bday',   emoji: '🎂', label: 'bday',       note: 'happy birthday — first round on me' },
  { id: 'thanks', emoji: '🤝', label: 'no reason',  note: 'just because' },
];

export function NoteScreen({
  friend,
  onBack,
  onSend,
}: {
  friend: Friend;
  onBack: () => void;
  onSend: (data: { friend: Friend; note: string; count: number }) => void;
}) {
  const [note, setNote] = useState('');
  const [chip, setChip] = useState<string | null>(null);
  const [count, setCount] = useState(1);
  const activeNote = chip ? (CHIPS.find((c) => c.id === chip)?.note ?? '') : note;
  const canSend = chip !== null || note.trim().length > 0;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Add a note"
        onBack={onBack}
        right={
          <TouchableOpacity
            onPress={() => canSend && onSend({ friend, note: activeNote, count })}
            activeOpacity={0.8}
            style={[styles.reviewBtn, !canSend && styles.reviewBtnDisabled]}
          >
            <Text style={[styles.reviewBtnText, !canSend && styles.reviewBtnTextDisabled]}>Review</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Recipient card */}
        <View style={styles.recipientCard}>
          <Avatar friend={friend} size={50} />
          <View style={{ flex: 1 }}>
            <Text style={styles.toLabel}>To</Text>
            <Text style={styles.recipientName}>{friend.name}</Text>
          </View>
          <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.changeBtn}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Quick reason chips */}
        <View style={{ marginBottom: 18 }}>
          <Text style={styles.sectionLabel}>Quick reason</Text>
          <View style={styles.chipWrap}>
            {CHIPS.map((c) => (
              <TouchableOpacity
                key={c.id}
                onPress={() => { setChip(c.id); setNote(''); }}
                activeOpacity={0.8}
                style={[styles.chip, chip === c.id && styles.chipActive]}
              >
                <Text style={{ fontSize: 15 }}>{c.emoji}</Text>
                <Text style={[styles.chipText, chip === c.id && styles.chipTextActive]}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Free-form textarea */}
        <View style={{ marginBottom: 18 }}>
          <Text style={styles.sectionLabel}>Or write something</Text>
          <View style={styles.textAreaWrap}>
            <TextInput
              multiline
              placeholder={`Say cheers to ${friend.name.split(' ')[0]}…`}
              value={chip ? '' : note}
              onChangeText={(t) => { setNote(t); setChip(null); }}
              style={styles.textArea}
              placeholderTextColor={BM.malt3}
              maxLength={140}
            />
            <Text style={styles.charCount}>{(chip ? activeNote.length : note.length)} / 140</Text>
          </View>
        </View>

        {/* Quantity selector */}
        <View>
          <Text style={styles.sectionLabel}>How many rounds?</Text>
          <View style={styles.quantityRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => setCount(n)}
                  activeOpacity={0.8}
                  style={[
                    styles.quantityBtn,
                    count >= n ? styles.quantityBtnActive : styles.quantityBtnInactive,
                  ]}
                >
                  <BeerGlyph
                    size={22}
                    color={count >= n ? BM.amberDeep : 'transparent'}
                    stroke={count >= n ? BM.malt : BM.malt3}
                    foam={count >= n ? '#fff' : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.countLabel}>{count} {count === 1 ? 'beer' : 'beers'}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Sent Screen ──────────────────────────────────────────────────────────────
export function SentScreen({
  friend,
  note,
  count = 1,
  onDone,
  onSendAnother,
}: {
  friend: Friend;
  note: string;
  count?: number;
  onDone: () => void;
  onSendAnother: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: 400, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, delay: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const bubbles = [
    { left: '10%', top: '8%',  size: 14 },
    { left: '85%', top: '12%', size: 22 },
    { left: '20%', top: '70%', size: 18 },
    { left: '70%', top: '78%', size: 12 },
    { left: '45%', top: '6%',  size: 9 },
    { left: '88%', top: '60%', size: 14 },
  ];

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.sentScreen}>
      {/* Bubbles */}
      {bubbles.map((b, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: b.left as any,
            top: b.top as any,
            width: b.size,
            height: b.size,
            borderRadius: b.size / 2,
            backgroundColor: 'rgba(255,255,255,0.5)',
            borderWidth: 1.5,
            borderColor: BM.malt,
            opacity: fadeAnim,
          }}
        />
      ))}

      {/* Close */}
      <TouchableOpacity onPress={onDone} activeOpacity={0.7} style={styles.sentClose}>
        {Icons.close(20, BM.malt)}
      </TouchableOpacity>

      <View style={styles.sentCenter}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
          <BeerGlyph size={150} />
        </Animated.View>

        <Animated.Text style={[styles.sentTime, { opacity: fadeAnim }]}>
          Beer sent · {time}
        </Animated.Text>

        <Animated.Text style={[styles.sentTitle, { opacity: fadeAnim }]}>
          One{count > 1 ? ` (× ${count})` : ''} for{'\n'}
          {friend.name.split(' ')[0]}, on you.
        </Animated.Text>

        <Animated.View style={[styles.sentNote, { opacity: fadeAnim }]}>
          <Text style={styles.sentNoteLabel}>Your note</Text>
          <Text style={styles.sentNoteText}>"{note || 'cheers!'}"</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.sentActions, { opacity: fadeAnim }]}>
        <BMButton kind="ghost" onPress={onSendAnother} style={{ flex: 1, borderColor: BM.malt }}>
          Send another
        </BMButton>
        <BMButton kind="dark" onPress={onDone} style={{ flex: 1 }}>
          Done
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
  searchWrap: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: BM.surface,
    borderWidth: 1,
    borderColor: BM.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: BM.malt,
    padding: 0,
  },
  scroll: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontFamily: BM.mono,
    fontSize: 10.5,
    color: BM.malt3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  recentItem: {
    alignItems: 'center',
    gap: 8,
    minWidth: 64,
  },
  recentBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: BM.amber,
    borderWidth: 2,
    borderColor: BM.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentName: {
    fontSize: 12,
    fontWeight: '600',
    color: BM.malt,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '30%',
    backgroundColor: BM.surface,
    borderWidth: 1,
    borderColor: BM.border,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  gridName: {
    fontSize: 13,
    fontWeight: '700',
    color: BM.malt,
  },
  gridTag: {
    fontSize: 10.5,
    color: BM.malt3,
    fontFamily: BM.mono,
  },
  listCard: {
    backgroundColor: BM.surface,
    borderWidth: 1,
    borderColor: BM.border,
    borderRadius: 22,
    overflow: 'hidden',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    paddingHorizontal: 14,
  },
  listRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: BM.border,
  },
  listName: {
    fontSize: 15,
    fontWeight: '600',
    color: BM.malt,
  },
  listTag: {
    fontSize: 12,
    color: BM.malt3,
  },
  pourBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: BM.amber,
  },
  pourBtnText: {
    fontWeight: '700',
    fontSize: 13,
    color: BM.malt,
  },
  reviewBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: BM.malt,
  },
  reviewBtnDisabled: {
    backgroundColor: BM.cream2,
  },
  reviewBtnText: {
    fontWeight: '700',
    fontSize: 13,
    color: BM.foam,
  },
  reviewBtnTextDisabled: {
    color: BM.malt3,
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 20,
    backgroundColor: BM.surface,
    borderWidth: 1,
    borderColor: BM.border,
    marginBottom: 18,
  },
  toLabel: {
    fontSize: 12,
    color: BM.malt3,
    fontFamily: BM.mono,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  recipientName: {
    fontWeight: '700',
    fontSize: 19,
    letterSpacing: -0.3,
    color: BM.malt,
  },
  changeBtn: {
    fontWeight: '600',
    fontSize: 13,
    color: BM.malt3,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: BM.surface,
    borderWidth: 1,
    borderColor: BM.border,
  },
  chipActive: {
    backgroundColor: BM.malt,
    borderColor: BM.malt,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: BM.malt,
  },
  chipTextActive: {
    color: BM.foam,
  },
  textAreaWrap: {
    backgroundColor: BM.surface,
    borderWidth: 1,
    borderColor: BM.border,
    borderRadius: 18,
    padding: 14,
    minHeight: 110,
  },
  textArea: {
    minHeight: 80,
    fontSize: 15,
    color: BM.malt,
    lineHeight: 21,
    padding: 0,
    textAlignVertical: 'top',
  },
  charCount: {
    fontFamily: BM.mono,
    fontSize: 11,
    color: BM.malt3,
    textAlign: 'right',
    marginTop: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BM.surface,
    borderWidth: 1,
    borderColor: BM.border,
    borderRadius: 18,
    padding: 10,
    paddingHorizontal: 14,
  },
  quantityBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  quantityBtnActive: {
    backgroundColor: BM.amber,
    borderColor: BM.amberDeep,
  },
  quantityBtnInactive: {
    backgroundColor: 'transparent',
    borderColor: BM.border,
  },
  countLabel: {
    fontWeight: '700',
    fontSize: 16,
    color: BM.malt,
  },
  // Sent screen
  sentScreen: {
    flex: 1,
    backgroundColor: BM.amber,
    position: 'relative',
  },
  sentClose: {
    position: 'absolute',
    top: 56,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: BM.malt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 8,
  },
  sentTime: {
    fontFamily: BM.mono,
    fontSize: 11,
    color: BM.malt2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 24,
    opacity: 0.8,
  },
  sentTitle: {
    fontWeight: '700',
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -1.8,
    color: BM.malt,
    textAlign: 'center',
  },
  sentNote: {
    backgroundColor: BM.malt,
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 20,
    maxWidth: 280,
  },
  sentNoteLabel: {
    fontSize: 11,
    color: BM.foam,
    opacity: 0.6,
    fontFamily: BM.mono,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sentNoteText: {
    fontSize: 15,
    color: BM.foam,
    marginTop: 4,
    lineHeight: 20,
  },
  sentActions: {
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    paddingBottom: 50,
  },
});
