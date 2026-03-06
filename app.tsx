import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { RootNavigator } from './navigation/root-navigator'

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <RootNavigator />
      <StatusBar style="auto" />
    </View>
  )
}
