import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { HomeScreen } from '../screens/home'
import { HoldOnScreen } from '../screens/hold-on'
import { HoldOnSettingsScreen } from '../screens/hold-on-settings'
import { HoldOnInfoScreen } from '../screens/hold-on-info'
import { VoiceSetScreen } from '../screens/voice-set'
import { AccountScreen } from '../screens/account'
import { LoginScreen } from '../screens/login'
import { OverflowMenu } from '../components/overflow-menu'

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
          options={({ navigation }) => ({
            title: 'HoldOn',
            headerRight: () => (
              <OverflowMenu
                items={[
                  { icon: 'information-circle-outline', label: 'Info', onPress: () => navigation.navigate('HoldOnInfo') },
                  { icon: 'mic-outline', label: 'Set voice', onPress: () => navigation.navigate('VoiceSet') },
                  { icon: 'heart-outline', label: 'Favorites', onPress: () => {} },
                  { icon: 'bookmark-outline', label: 'Save', onPress: () => {} },
                  { icon: 'settings-outline', label: 'Settings', onPress: () => navigation.navigate('HoldOnSettings') },
                ]}
              />
            ),
            headerRightContainerStyle: { alignItems: 'center' },
          })}
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
