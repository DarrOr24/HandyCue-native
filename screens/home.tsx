import { useLayoutEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { FeatureCard } from "../components/feature-card";
import { DrillExamplesCard } from "../components/drill-examples-card";
import { ProfileMenu } from "../components/profile-menu";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

const FEATURES = [
  {
    id: "holdOn",
    label: "HoldOn",
    subtitle: "Your voice-guided timer for balance and endurance holds",
    img: require("../assets/imgs/straight-handstand.png"),
  },
  {
    id: "entryBuddy",
    label: "EntryBuddy",
    subtitle: "Your smart counter for handstand entries",
    img: require("../assets/imgs/straddle-handstand.png"),
  },
  {
    id: "shapeJam",
    label: "ShapeJam",
    subtitle: "Your dynamic guide for handstand shape transitions",
    img: require("../assets/imgs/diamond-handstand.png"),
  },
  {
    id: "drillDJ",
    label: "DrillDJ",
    subtitle: "Your tempo-driven, voice-guided drill companion",
    img: require("../assets/imgs/split-leg-handstand.png"),
  },
];

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { session } = useAuth();

  const profileMenuItems = [
    {
      icon: "person-outline" as const,
      label: "Account",
      onPress: () => {
        if (session) {
          navigation.navigate("Account");
        } else {
          Alert.alert("Log in required", "Please log in to manage your account.");
        }
      },
    },
    session
      ? {
          icon: "log-out-outline" as const,
          label: "Log out",
          onPress: async () => {
            await supabase.auth.signOut();
          },
          variant: "danger" as const,
        }
      : {
          icon: "log-in-outline" as const,
          label: "Log in",
          onPress: () => navigation.navigate("Login"),
        },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../assets/app-icon.png")}
            style={{ width: 32, height: 32, marginRight: 8 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>HandyCue</Text>
        </View>
      ),
      headerRight: () => <ProfileMenu items={profileMenuItems} />,
    });
  }, [navigation, session]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <LinearGradient
        colors={["#ffffff", "#e0f0eb"]}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {FEATURES.map((f) => (
          <FeatureCard
            key={f.id}
            label={f.label}
            subtitle={f.subtitle}
            img={f.img}
            onPress={() => {
              if (f.id === "holdOn") navigation.navigate("HoldOn")
              else if (f.id === "entryBuddy") navigation.navigate("EntryBuddy")
              else if (f.id === "shapeJam") navigation.navigate("ShapeJam")
              else if (f.id === "drillDJ") navigation.navigate("DrillDJ")
            }}
          />
        ))}

        <DrillExamplesCard />

        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
});
