import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface MedicineCardProps {
  id: string;
  name: string;
  brand: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  expiryDays: number;
  pharmacyName: string;
  distance: string;
}

export function MedicineCard({
  id,
  name,
  brand,
  originalPrice,
  discountedPrice,
  discountPercent,
  expiryDays,
  pharmacyName,
  distance,
}: MedicineCardProps) {
  const getExpiryStyle = () => {
    if (expiryDays <= 7) return styles.expiryDanger;
    if (expiryDays <= 30) return styles.expiryWarning;
    return styles.expirySafe;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
      onPress={() => router.push(`/medicine/${id}`)}
    >
      <View style={styles.row}>
        {/* Image placeholder */}
        <View style={styles.imageBox}>
          <View style={styles.imageCircle} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title + Discount */}
          <View style={styles.topRow}>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.name}>
                {name}
              </Text>
              <Text style={styles.brand}>{brand}</Text>
            </View>

            <View style={styles.discountBadge}>
              <Ionicons name="pricetag" size={12} color="#fff" />
              <Text style={styles.discountText}>
                {discountPercent}% OFF
              </Text>
            </View>
          </View>

          {/* Expiry + Distance */}
          <View style={styles.metaRow}>
            <View style={[styles.expiryBadge, getExpiryStyle()]}>
              <Ionicons name="time-outline" size={12} />
              <Text style={styles.expiryText}>{expiryDays}d left</Text>
            </View>

            <View style={styles.distance}>
              <Ionicons name="location-outline" size={12} color="#777" />
              <Text style={styles.distanceText}>{distance}</Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.newPrice}>₹{discountedPrice}</Text>
            <Text style={styles.oldPrice}>₹{originalPrice}</Text>
          </View>

          {/* Pharmacy */}
          <Text style={styles.pharmacy}>{pharmacyName}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  imageBox: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
  },
  imageCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563eb",
    opacity: 0.6,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  name: {
    fontWeight: "600",
    fontSize: 14,
  },
  brand: {
    fontSize: 12,
    color: "#777",
  },
  discountBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  discountText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  expiryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expiryDanger: {
    backgroundColor: "#fee2e2",
  },
  expiryWarning: {
    backgroundColor: "#fef3c7",
  },
  expirySafe: {
    backgroundColor: "#e0e7ff",
  },
  expiryText: {
    fontSize: 11,
    fontWeight: "500",
  },
  distance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  distanceText: {
    fontSize: 11,
    color: "#777",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  newPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563eb",
  },
  oldPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },
  pharmacy: {
    fontSize: 11,
    color: "#777",
    marginTop: 4,
  },
});
