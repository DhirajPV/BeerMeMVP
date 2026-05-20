import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BARS, WALLET_BEERS, type Bar, type Beer, type Friend } from '@/constants/bm';
import { BarDetailScreen, MapScreen } from '@/components/bm/bars-map';
import { OnboardingScreen } from '@/components/bm/onboarding';
import { ActivityScreen, HomeScreen, ProfileScreen } from '@/components/bm/screens';
import { NoteScreen, PickFriendScreen, SentScreen } from '@/components/bm/send-flow';
import { QRScreen, SuccessScreen, WalletScreen } from '@/components/bm/wallet-redeem';
import type { TabId } from '@/components/bm/primitives';

// ─── Navigation state ─────────────────────────────────────────────────────────
type Screen =
  | { id: 'onboarding' }
  | { id: 'home' }
  | { id: 'activity' }
  | { id: 'wallet' }
  | { id: 'qr'; beer: Beer }
  | { id: 'success'; beer: Beer; bar: string }
  | { id: 'map' }
  | { id: 'bar-detail'; bar: Bar }
  | { id: 'profile' }
  | { id: 'pick-friend' }
  | { id: 'add-note'; friend: Friend }
  | { id: 'sent'; friend: Friend; note: string; count: number };

export default function BeerMeApp() {
  const insets = useSafeAreaInsets();
  const [stack, setStack] = useState<Screen[]>([{ id: 'onboarding' }]);
  const [activeTab, setActiveTab] = useState<TabId>('home');

  const current = stack[stack.length - 1];
  const push = (screen: Screen) => setStack((s) => [...s, screen]);
  const pop  = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const popTo = (id: Screen['id']) => setStack((s) => {
    const idx = s.findIndex((x) => x.id === id);
    return idx >= 0 ? s.slice(0, idx + 1) : s;
  });
  const reset = (screen: Screen) => setStack([screen]);

  const handleTabChange = (tab: TabId) => {
    if (tab === 'send') {
      push({ id: 'pick-friend' });
      return;
    }
    setActiveTab(tab);
    const tabScreen: Screen =
      tab === 'wallet'  ? { id: 'wallet' } :
      tab === 'map'     ? { id: 'map' } :
      tab === 'profile' ? { id: 'profile' } :
                          { id: 'home' };
    reset(tabScreen);
  };

  const tabProps = { activeTab, onTabChange: handleTabChange };

  return (
    <View style={[styles.root, { paddingTop: insets.top > 0 ? 0 : 0 }]}>
      {current.id === 'onboarding' && (
        <OnboardingScreen onDone={() => reset({ id: 'home' })} />
      )}

      {current.id === 'home' && (
        <HomeScreen
          {...tabProps}
          onSend={() => push({ id: 'pick-friend' })}
          onWallet={() => { setActiveTab('wallet'); reset({ id: 'wallet' }); }}
          onActivity={() => push({ id: 'activity' })}
        />
      )}

      {current.id === 'activity' && (
        <ActivityScreen onBack={pop} />
      )}

      {current.id === 'wallet' && (
        <WalletScreen
          {...tabProps}
          onOpenBeer={(beer) => push({ id: 'qr', beer })}
        />
      )}

      {current.id === 'qr' && (
        <QRScreen
          beer={current.beer}
          onBack={pop}
          onRedeem={() => push({ id: 'success', beer: current.beer, bar: 'The Foxhole' })}
        />
      )}

      {current.id === 'success' && (
        <SuccessScreen
          beer={current.beer}
          bar={current.bar}
          onDone={() => { setActiveTab('wallet'); reset({ id: 'wallet' }); }}
        />
      )}

      {current.id === 'map' && (
        <MapScreen
          {...tabProps}
          onOpenBar={(bar) => push({ id: 'bar-detail', bar })}
        />
      )}

      {current.id === 'bar-detail' && (
        <BarDetailScreen
          bar={current.bar}
          onBack={pop}
          onRedeemHere={() => push({ id: 'qr', beer: WALLET_BEERS[0] })}
        />
      )}

      {current.id === 'profile' && (
        <ProfileScreen {...tabProps} />
      )}

      {current.id === 'pick-friend' && (
        <PickFriendScreen
          onBack={pop}
          onPick={(friend) => push({ id: 'add-note', friend })}
        />
      )}

      {current.id === 'add-note' && (
        <NoteScreen
          friend={current.friend}
          onBack={pop}
          onSend={({ friend, note, count }) => push({ id: 'sent', friend, note, count })}
        />
      )}

      {current.id === 'sent' && (
        <SentScreen
          friend={current.friend}
          note={current.note}
          count={current.count}
          onDone={() => { setActiveTab('home'); reset({ id: 'home' }); }}
          onSendAnother={() => popTo('pick-friend')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
