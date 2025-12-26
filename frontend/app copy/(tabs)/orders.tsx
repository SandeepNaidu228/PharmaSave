import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useOrderStore } from "../../store/useOrderStore";

export default function OrdersScreen() {
  // ✅ Hook INSIDE component
  const orders = useOrderStore((s) => s.orders);

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Orders Yet</Text>
        <Text style={styles.emptyText}>
          Medicines you reserve will appear here.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>My Orders</Text>

      {orders.map((order) => (
        <View key={order.id} style={styles.card}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{order.medicineName}</Text>

              <Text style={styles.qty}>
                Quantity: {order.quantity}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                order.status === "reserved" && styles.reserved,
                order.status === "picked" && styles.picked,
                order.status === "expired" && styles.expired,
              ]}
            >
              <Text style={styles.statusText}>
                {order.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  name: {
    fontWeight: "600",
    fontSize: 14,
  },

  pharmacy: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },

  qty: {
    fontSize: 12,
    marginTop: 4,
  },

  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },

  reserved: {
    backgroundColor: "#2563eb",
  },

  picked: {
    backgroundColor: "#16a34a",
  },

  expired: {
    backgroundColor: "#dc2626",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
  },
});
