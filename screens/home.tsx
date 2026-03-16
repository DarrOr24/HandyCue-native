import { useLayoutEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Image,
  useWindowDimensions,
  Platform,
} from "react-native";
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
  {
    id: "cueCraft",
    label: "CueCraft",
    subtitle: "Build your own voice-guided sequence from scratch",
    img: require("../assets/imgs/cuecraft-tuck-handstand.png"),
  },
];

const CARD_GAP = 12;
const MAX_CONTENT_WIDTH = 1500;

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { session } = useAuth();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const useGrid = Platform.OS === "android" && isLandscape;
  const numColumns = useGrid ? 2 : 1;
  const contentWidth = useGrid
    ? Math.min(width - 40, MAX_CONTENT_WIDTH)
    : width - 40;
  const cardWidth =
    numColumns === 1
      ? undefined
      : (contentWidth - CARD_GAP * (numColumns - 1)) / numColumns;

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
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <LinearGradient
        colors={["#ffffff", "#e0f0eb"]}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {useGrid ? (
          <View
            style={[
              styles.cardGrid,
              {
                width: contentWidth,
                gap: CARD_GAP,
                alignSelf: "center",
              },
            ]}
          >
            {FEATURES.map((f) => (
              <View
                key={f.id}
                style={[
                  styles.cardWrapper,
                  cardWidth !== undefined && { width: cardWidth },
                ]}
              >
                <FeatureCard
                  label={f.label}
                  subtitle={f.subtitle}
                  img={f.img}
                  imageZoom={f.id === "cueCraft" ? 1.55 : undefined}
                  inGrid
                  onPress={() => {
                    if (f.id === "holdOn") navigation.navigate("HoldOn")
                    else if (f.id === "entryBuddy") navigation.navigate("EntryBuddy")
                    else if (f.id === "shapeJam") navigation.navigate("ShapeJam")
                    else if (f.id === "drillDJ") navigation.navigate("DrillDJ")
                    else if (f.id === "cueCraft") navigation.navigate("CueCraft")
                  }}
                />
              </View>
            ))}
            <View
              style={[
                styles.cardWrapper,
                cardWidth !== undefined && { width: cardWidth },
              ]}
            >
              <DrillExamplesCard inGrid />
            </View>
          </View>
        ) : (
          <>
            {FEATURES.map((f) => (
              <FeatureCard
                key={f.id}
                label={f.label}
                subtitle={f.subtitle}
                img={f.img}
                imageZoom={f.id === "cueCraft" ? 1.55 : undefined}
                onPress={() => {
                  if (f.id === "holdOn") navigation.navigate("HoldOn")
                  else if (f.id === "entryBuddy") navigation.navigate("EntryBuddy")
                  else if (f.id === "shapeJam") navigation.navigate("ShapeJam")
                  else if (f.id === "drillDJ") navigation.navigate("DrillDJ")
                  else if (f.id === "cueCraft") navigation.navigate("CueCraft")
                }}
              />
            ))}
            <DrillExamplesCard />
          </>
        )}

        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 24, paddingBottom: 40 },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cardWrapper: {},
});
