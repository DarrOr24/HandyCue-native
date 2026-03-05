import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { HomeScreen } from '../screens/home'
import { HoldOnScreen } from '../screens/hold-on'
import { HoldOnSettingsScreen } from '../screens/hold-on-settings'
import { IconButtonGroup } from '../components/icon-button-group'

const Stack = createNativeStackNavigator()

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="HoldOn"
          component={HoldOnScreen}
          options={({ navigation }) => ({
            title: 'HoldOn',
            headerRight: () => (
              <IconButtonGroup
                configs={[
                  {
                    name: 'information-circle-outline',
                    onPress: () => {}, // TODO: HoldOnInfo
                    accessibilityLabel: 'Info',
                  },
                  {
                    name: 'heart-outline',
                    onPress: () => {}, // TODO: Favorites
                    accessibilityLabel: 'Favorites',
                  },
                  {
                    name: 'bookmark-outline',
                    onPress: () => {}, // TODO: Save
                    accessibilityLabel: 'Save',
                  },
                  {
                    name: 'settings-outline',
                    onPress: () => navigation.navigate('HoldOnSettings'),
                    accessibilityLabel: 'Settings',
                  },
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
      </Stack.Navigator>
    </NavigationContainer>
  )
}
