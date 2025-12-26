import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MedicineCard } from "../../components/MedicineCard";

import { useMedicineStore } from "../../store/useMedicineStore";

const medicines = useMedicineStore((s) => s.medicines);


export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

 const results = medicines.filter((m) =>
  m.name.toLowerCase().includes(query.toLowerCase())
);


  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length > 2 && !recent.includes(text)) {
      setRecent([text, ...recent.slice(0, 4)]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Search input */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#777" />
        <TextInput
          placeholder="Search medicines..."
          value={query}
          onChangeText={handleSearch}
          style={styles.input}
        />
      </View>

      {/* Recent searches */}
      {query.length === 0 && recent.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          {recent.map((item) => (
            <Pressable key={item} onPress={() => setQuery(item)}>
              <Text style={styles.recentItem}>{item}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["all", "expiry", "discount", "nearby"].map((f) => (
          <Pressable
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[
              styles.filterChip,
              activeFilter === f && styles.activeChip,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === f && styles.activeText,
              ]}
            >
              {f.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Results */}
      <View style={{ marginTop: 16 }}>
        {results.length === 0 ? (
          <Text style={styles.empty}>No medicines found</Text>
        ) : (
          results.map((item) => (
            <MedicineCard key={item.id} {...item} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  input: { flex: 1, marginLeft: 8 },

  section: { marginBottom: 16 },
  sectionTitle: { fontWeight: "600", marginBottom: 6 },

  recentItem: {
    paddingVertical: 6,
    color: "#2563eb",
  },

  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
  },
  activeChip: { backgroundColor: "#2563eb" },
  filterText: { fontSize: 12 },
  activeText: { color: "#fff" },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
  },
});
