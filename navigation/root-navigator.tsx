import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { HomeScreen } from '../screens/home'
import { HoldOnScreen } from '../screens/hold-on'
import { HoldOnSettingsScreen } from '../screens/hold-on-settings'
import { HoldOnInfoScreen } from '../screens/hold-on-info'
import { VoiceSetScreen } from '../screens/voice-set'
import { AccountScreen } from '../screens/account'
import { LoginScreen } from '../screens/login'
const Stack = createNativeStackNavigator()

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Account"
          component={AccountScreen}
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
          name="VoiceSet"
          component={VoiceSetScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
