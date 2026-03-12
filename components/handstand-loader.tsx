import { useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Image, Animated } from 'react-native'

export function HandstandLoader() {
  const spin = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    )
    animation.start()
    return () => animation.stop()
  }, [spin])

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/imgs/straddle-handstand.png')}
        style={[styles.image, { transform: [{ rotate }] }]}
        resizeMode="contain"
      />
      <Text style={styles.text}>Loading…</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
  },
  text: {
    marginTop: 8,
    fontSize: 16,
    color: '#5B9A8B',
    fontWeight: '500',
  },
})
