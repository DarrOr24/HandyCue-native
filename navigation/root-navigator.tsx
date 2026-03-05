import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { HomeScreen } from '../screens/home'
import { HoldOnScreen } from '../screens/hold-on'

const Stack = createNativeStackNavigator()

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HoldOn" component={HoldOnScreen} options={{ title: 'HoldOn' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
