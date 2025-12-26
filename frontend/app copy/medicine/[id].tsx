import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMedicineStore } from "../../store/useMedicineStore";
import { useOrderStore } from "../../store/useOrderStore";

/**
 * Temporary static data
 * (Later this will come from API using the id param)
 */
const medicineData = {
  id: "1",
  name: "Panadol Extra - 500mg",
  brand: "GSK Pharmaceuticals",
  originalPrice: 120,
  discountedPrice: 36,
  discountPercent: 70,
  expiryDate: "Jan 12, 2025",
  expiryDays: 18,
  pharmacyName: "MedPlus Pharmacy",
  pharmacyAddress: "123 Health Street, Sector 15",
  distance: "1.2 km",
  description:
    "Panadol Extra contains paracetamol and caffeine. It provides fast and effective relief from headache, migraine, toothache, and period pain.",
  composition: "Paracetamol 500mg, Caffeine 65mg",
  packSize: "10 tablets per strip",
  storageInfo:
    "Store below 25°C in a dry place. Protect from light.",
};

export default function MedicineDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Quantity state (local UI state)
  const [quantity, setQuantity] = useState(1);

  // 🔗 Zustand stores
  const toggleSave = useMedicineStore((s) => s.toggleSave);
  const isSaved = useMedicineStore((s) => s.isSaved(medicineData.id));
  const addOrder = useOrderStore((s) => s.addOrder);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} />
          </Pressable>

          <View style={styles.headerActions}>
            {/* Save / Unsave */}
            <Pressable onPress={() => toggleSave(medicineData)}>
              <Ionicons
                name={isSaved ? "heart" : "heart-outline"}
                size={22}
                color={isSaved ? "red" : "#111"}
              />
            </Pressable>

            <Ionicons name="share-outline" size={22} />
          </View>
        </View>

        {/* Image */}
        <View style={styles.imageBox}>
          <View style={styles.imageCircle} />
        </View>

        {/* Info */}
        <Text style={styles.name}>{medicineData.name}</Text>
        <Text style={styles.brand}>{medicineData.brand}</Text>

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.newPrice}>
            ₹{medicineData.discountedPrice}
          </Text>
          <Text style={styles.oldPrice}>
            ₹{medicineData.originalPrice}
          </Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {medicineData.discountPercent}% OFF
            </Text>
          </View>
        </View>

        {/* Expiry */}
        <View style={styles.warning}>
          <Ionicons name="time-outline" size={22} color="#d97706" />
          <View>
            <Text style={styles.warningTitle}>
              Expires on {medicineData.expiryDate}
            </Text>
            <Text style={styles.warningSub}>
              {medicineData.expiryDays} days remaining
            </Text>
          </View>
        </View>

        {/* Safety */}
        <View style={styles.safeBox}>
          <Ionicons name="shield-checkmark-outline" size={20} />
          <Text style={styles.safeText}>
            Safe for use before expiry when stored properly.
          </Text>
        </View>

        {/* Pharmacy */}
        <View style={styles.pharmacy}>
          <Text style={styles.pharmacyName}>
            {medicineData.pharmacyName}
          </Text>
          <Text style={styles.pharmacyAddr}>
            {medicineData.pharmacyAddress}
          </Text>

          <View style={styles.distance}>
            <Ionicons name="location-outline" size={14} />
            <Text>{medicineData.distance}</Text>
          </View>

          <Pressable
            style={styles.mapBtn}
            onPress={() => router.push("/map")}
          >
            <Text>View on Map</Text>
          </Pressable>
        </View>

        {/* Details */}
        <Text style={styles.sectionTitle}>About this medicine</Text>
        <Text style={styles.desc}>{medicineData.description}</Text>

        <View style={styles.grid}>
          <View style={styles.gridBox}>
            <Text style={styles.gridLabel}>Composition</Text>
            <Text>{medicineData.composition}</Text>
          </View>
          <View style={styles.gridBox}>
            <Text style={styles.gridLabel}>Pack Size</Text>
            <Text>{medicineData.packSize}</Text>
          </View>
        </View>

        <View style={styles.storage}>
          <Ionicons name="warning-outline" size={16} />
          <Text>{medicineData.storageInfo}</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.qtyBox}>
          <Pressable
            onPress={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            <Ionicons name="remove" size={20} />
          </Pressable>

          <Text style={styles.qty}>{quantity}</Text>

          <Pressable onPress={() => setQuantity(quantity + 1)}>
            <Ionicons name="add" size={20} />
          </Pressable>
        </View>

        {/* RESERVE */}
        <Pressable
          style={styles.reserveBtn}
          onPress={() => {
            addOrder({
              id: Date.now().toString(),
              medicineName: medicineData.name,
              quantity,
              status: "reserved",
            });

            router.replace("/(tabs)/orders");
          }}
        >
          <Text style={styles.reserveText}>Reserve for Pickup</Text>
        </Pressable>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerActions: { flexDirection: "row", gap: 16 },

  imageBox: {
    height: 220,
    backgroundColor: "#eef2ff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  imageCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#2563eb",
    opacity: 0.6,
  },

  name: { fontSize: 22, fontWeight: "700" },
  brand: { color: "#777", marginBottom: 12 },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  newPrice: { fontSize: 24, fontWeight: "700", color: "#2563eb" },
  oldPrice: { textDecorationLine: "line-through", color: "#999" },
  discountBadge: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: { color: "#fff", fontSize: 11 },

  warning: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fef3c7",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  warningTitle: { fontWeight: "600" },
  warningSub: { fontSize: 12, color: "#555" },

  safeBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#f3f4f6",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  safeText: { fontSize: 13 },

  pharmacy: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  pharmacyName: { fontWeight: "600" },
  pharmacyAddr: { fontSize: 12, color: "#777", marginVertical: 4 },
  distance: { flexDirection: "row", gap: 6, alignItems: "center" },
  mapBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
  },

  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  desc: { color: "#555", marginBottom: 16 },

  grid: { flexDirection: "row", gap: 10, marginBottom: 16 },
  gridBox: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 10,
  },
  gridLabel: { fontSize: 11, color: "#777" },

  storage: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#fef3c7",
    padding: 12,
    borderRadius: 10,
  },

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 8,
    borderWidth: 1,
    borderRadius: 10,
  },
  qty: { fontWeight: "600" },

  reserveBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    marginLeft: 12,
    alignItems: "center",
  },
  reserveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
