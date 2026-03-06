import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FeatureCard } from "../components/feature-card";
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
    subtitle: "Your dynamic guide for handstand shape switches",
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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>HandyCue</Text>
          <ProfileMenu items={profileMenuItems} />
        </View>

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

        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 16, color: "#666", marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
});
