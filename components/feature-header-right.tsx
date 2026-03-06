import { StyleSheet, View, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ProfileMenu } from './profile-menu'
import { supabase } from '../lib/supabase'
import type { Session } from '@supabase/supabase-js'
import { ReactNode } from 'react'

interface FeatureHeaderRightProps {
  session: Session | null
  overflowMenu: ReactNode
}

/**
 * Header right for feature screens: profile icon + three-dots overflow menu.
 * Matches home screen profile menu behavior (Account, Log in/out).
 */
export function FeatureHeaderRight({ session, overflowMenu }: FeatureHeaderRightProps) {
  const navigation = useNavigation<any>()

  const profileMenuItems = [
    {
      icon: 'person-outline' as const,
      label: 'Account',
      onPress: () => {
        if (session) {
          navigation.navigate('Account')
        } else {
          Alert.alert('Log in required', 'Please log in to manage your account.')
        }
      },
    },
    session
      ? {
          icon: 'log-out-outline' as const,
          label: 'Log out',
          onPress: async () => {
            await supabase.auth.signOut()
          },
          variant: 'danger' as const,
        }
      : {
          icon: 'log-in-outline' as const,
          label: 'Log in',
          onPress: () => navigation.navigate('Login'),
        },
  ]

  return (
    <View style={styles.container}>
      {overflowMenu}
      <ProfileMenu items={profileMenuItems} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
})
