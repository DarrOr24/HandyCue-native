import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from '../lib/navigation-ref'
import { HomeScreen } from '../screens/home'
import { HoldOnScreen } from '../screens/hold-on'
import { HoldOnSettingsScreen } from '../screens/hold-on-settings'
import { HoldOnInfoScreen } from '../screens/hold-on-info'
import { EntryBuddyScreen } from '../screens/entry-buddy'
import { EntryBuddySettingsScreen } from '../screens/entry-buddy-settings'
import { EntryBuddyInfoScreen } from '../screens/entry-buddy-info'
import { ShapeJamScreen } from '../screens/shape-jam'
import { ShapeJamInfoScreen } from '../screens/shape-jam-info'
import { ShapeJamSettingsScreen } from '../screens/shape-jam-settings'
import { DrillDJScreen } from '../screens/drill-dj'
import { DrillDJInfoScreen } from '../screens/drill-dj-info'
import { DrillDJSettingsScreen } from '../screens/drill-dj-settings'
import { DrillDJExampleVideosScreen } from '../screens/drill-dj-example-videos'
import { VoiceSetScreen } from '../screens/voice-set'
import { AccountScreen } from '../screens/account'
import { BillingScreen } from '../screens/billing'
import { LoginScreen } from '../screens/login'

const Stack = createNativeStackNavigator()

export function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'HandyCue' }} />
        <Stack.Screen
          name="Account"
          component={AccountScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Billing"
          component={BillingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HoldOn"
          component={HoldOnScreen}
          options={{ title: 'HoldOn' }}
        />
        <Stack.Screen
          name="HoldOnSettings"
          component={HoldOnSettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HoldOnInfo"
          component={HoldOnInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EntryBuddy"
          component={EntryBuddyScreen}
          options={{ title: 'EntryBuddy' }}
        />
        <Stack.Screen
          name="EntryBuddySettings"
          component={EntryBuddySettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EntryBuddyInfo"
          component={EntryBuddyInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ShapeJam"
          component={ShapeJamScreen}
          options={{ title: 'ShapeJam' }}
        />
        <Stack.Screen
          name="ShapeJamSettings"
          component={ShapeJamSettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ShapeJamInfo"
          component={ShapeJamInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DrillDJ"
          component={DrillDJScreen}
          options={{ title: 'DrillDJ' }}
        />
        <Stack.Screen
          name="DrillDJSettings"
          component={DrillDJSettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DrillDJInfo"
          component={DrillDJInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DrillDJExampleVideos"
          component={DrillDJExampleVideosScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VoiceSet"
          component={VoiceSetScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
