import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { zql } from '@/zero/schema';
import { useQuery, useZero } from '@rocicorp/zero/react';
import { useEffect, useState } from 'react';

// FIXED: Using Zero useQuery correctly as per their documentation
function SimpleDataDisplay() {
  console.log('=== 🔍 SimpleDataDisplay COMPONENT EXECUTING ===');
  
  // Get the Zero client directly to debug connection
  const { zero } = useZero();
  console.log('🔧 Zero client:', {
    zero: zero,
    userID: zero?.userID,
    hasZero: !!zero
  });
  
  // Debug: Check what zql query objects look like
  console.log('🔧 Query objects:', {
    ticketsQuery: zql.tickets,
    usersQuery: zql.users,
    ticketsType: typeof zql.tickets,
    usersType: typeof zql.users
  });
  
  // State to track multiple attempts
  const [attempt, setAttempt] = useState(1);
  const [syncStatus, setSyncStatus] = useState<string>('initializing');
  
  // Monitor Zero sync status
  useEffect(() => {
    if (!zero) {
      console.log('❌ No Zero client available');
      setSyncStatus('no-client');
      return;
    }
    
    console.log('✅ Zero client available, checking sync...');
    setSyncStatus('client-ready');
    
    // Try to trigger initial sync
    zero.query(zql.tickets).then((result) => {
      console.log('📊 Direct zero.query result:', result);
    }).catch(err => {
      console.error('❌ Direct query error:', err);
    });
  }, [zero]);
  
  // Back to useQuery to see actual data being returned
  const [tickets] = useQuery(zql.tickets);
  const [users] = useQuery(zql.users);
  
  // Add effect to retry if data is empty
  useEffect(() => {
    if ((!tickets || tickets.length === 0) && (!users || users.length === 0) && attempt <= 3) {
      console.log(`🔄 Attempt ${attempt}: Data empty, retrying...`);
      const timer = setTimeout(() => {
        setAttempt(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [tickets, users, attempt]);
  
  console.log('📊 Zero Query Results:', {
    tickets: tickets,
    ticketsType: typeof tickets,
    ticketsArray: Array.isArray(tickets),
    ticketsLength: tickets?.length,
    users: users,
    usersType: typeof users,
    usersArray: Array.isArray(users),
    usersLength: users?.length,
  });
  
  // Check if we have actual data (not empty arrays)
  const hasTickets = Array.isArray(tickets) && tickets.length > 0;
  const hasUsers = Array.isArray(users) && users.length > 0;
  
  if (hasTickets || hasUsers) {
    console.log('✅ SUCCESS: Data loaded from Zero!', { 
      ticketsCount: tickets.length, 
      usersCount: users.length,
      attempt: attempt,
      syncStatus
    });
    return (
      <ThemedText style={{backgroundColor: 'green', color: 'white', padding: 10}}>
        ✅ SUCCESS (attempt {attempt}): {tickets.length} tickets, {users.length} users from Zero cache! Status: {syncStatus}
      </ThemedText>
    );
  }
  
  // If we get empty arrays, that means Zero is connected but no data yet
  if (Array.isArray(tickets) && Array.isArray(users)) {
    console.log('⏳ Connected to Zero but data is empty - sync may still be in progress');
    return (
      <ThemedText style={{backgroundColor: 'orange', color: 'black', padding: 10}}>{'\n'}
        Status: {syncStatus} | userID: {zero?.userID}
      </ThemedText>
    );
  }
  
  // Still loading/connecting
  console.log('🔄 Zero still connecting...', { syncStatus, hasZero: !!zero });
  return (
    <ThemedText style={{backgroundColor: 'blue', color: 'white', padding: 10}}>
      🔄 Connecting to Zero cache... (attempt {attempt}){'\n'}
      Status: {syncStatus}'white', padding: 10}}>
      🔄 Connecting to Zero cache... (attempt {attempt})
    </ThemedText>
  );
}

export default function HomeScreen() {
  console.log('=== HomeScreen rendering (MINIMAL) ===');
  
  // REMOVED: useEffect that was monitoring old useQuery results
  
  // REMOVED: Old render-time logging for deprecated useQuery
  
  // Zero client connects via WebSocket (no CORS issues)
  

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Namma Chennai!</ThemedText>
        <ThemedText type="subtitle" style={{backgroundColor: 'orange', color: 'white', padding: 10}}>
          ⚠️ Old useQuery methods removed - using only useSuspenseQuery below
        </ThemedText>
        
        <ThemedText style={{backgroundColor: 'green', color: 'white', padding: 10}}>
          ✅ FINAL TEST: Simple data verification from database
        </ThemedText>
        <ThemedText style={{backgroundColor: 'cyan', color: 'black', padding: 10}}>
          📊 Expected: 4 tickets, 6 users (verified in PostgreSQL)
        </ThemedText>
        <SimpleDataDisplay />
        <ThemedText style={{backgroundColor: 'purple', color: 'white', padding: 10}}>
          🔄 Data loading handled by useQuery above
        </ThemedText>
        {/* {tickets?.map(ticket => (
          <ThemedText key={ticket.id}>- {ticket.title}</ThemedText>
        ))} */}
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
