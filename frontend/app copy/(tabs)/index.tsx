import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MedicineCard } from "../../components/MedicineCard";

import { useMedicineStore } from "../../store/useMedicineStore";

const medicines = useMedicineStore((s) => s.medicines);


export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subText}>Good Morning,</Text>
          <Text style={styles.title}>Welcome to PharmaSave</Text>
        </View>

        <Pressable style={styles.bell}>
          <Ionicons name="notifications-outline" size={22} color="#111" />
          <View style={styles.dot} />
        </Pressable>
      </View>

      {/* Search */}
      <Pressable onPress={() => router.push("/search")}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#777" />
          <TextInput
            placeholder="Search medicines, salt composition..."
            editable={false}
            style={styles.searchInput}
          />
        </View>
      </Pressable>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerSmall}>Featured Deals</Text>
        <Text style={styles.bannerTitle}>Medicines Expiring Soon</Text>
        <Text style={styles.bannerDesc}>
          Save up to 70% on quality medicines
        </Text>

        <Pressable onPress={() => router.push("/search")}>
          <Text style={styles.bannerLink}>Explore Now →</Text>
        </Pressable>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["all", "expiry", "discount", "nearby"].map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[styles.chip, activeFilter === filter && styles.activeChip]}
          >
            <Text
              style={[
                styles.chipText,
                activeFilter === filter && styles.activeChipText,
              ]}
            >
              {filter.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Featured medicines */}
      <View style={{ marginTop: 16 }}>
        {/* Featured medicines */}
        <View style={{ marginTop: 16 }}>
         {medicines.map((item) => (
  <MedicineCard key={item.id} {...item} />
))}

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subText: {
    color: "#777",
    fontSize: 13,
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
  },
  banner: {
    backgroundColor: "#2563eb",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  bannerSmall: {
    color: "#dbeafe",
    marginBottom: 4,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  bannerDesc: {
    color: "#e0e7ff",
    marginVertical: 8,
  },
  bannerLink: {
    color: "#fff",
    fontWeight: "600",
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: "#2563eb",
  },
  chipText: {
    fontSize: 12,
  },
  activeChipText: {
    color: "#fff",
  },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
  },
  cardTitle: {
    fontWeight: "600",
  },
  cardSub: {
    color: "#777",
    fontSize: 12,
  },
  price: {
    marginTop: 6,
    fontWeight: "700",
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "#999",
    fontSize: 12,
  },
});
