import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MedicineCard } from "../../components/MedicineCard";
import { router } from "expo-router";

import { useAuthStore } from "../../store/useAuthStore";

const logout = useAuthStore((s) => s.logout);

const user = {
  name: "Arshal Rejith",
  email: "arshal@example.com",
};

import { useMedicineStore } from "../../store/useMedicineStore";

const savedMedicines = useMedicineStore((s) => s.saved);

export default function ProfileScreen() {
  const handleLogout = () => {
    logout();
    router.replace("/login");
};

  return (
    <ScrollView style={styles.container}>
      {/* User Info */}
      <View style={styles.userBox}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color="#fff" />
        </View>
        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      {/* Saved Medicines */}
      <Text style={styles.sectionTitle}>Saved Medicines</Text>

      {savedMedicines.length === 0 ? (
        <Text style={styles.empty}>No saved medicines</Text>
      ) : (
        savedMedicines.map((item) => (
          <MedicineCard key={item.id} {...item} />
        ))
      )}

      {/* Settings */}
      <Text style={styles.sectionTitle}>Settings</Text>

      <Pressable style={styles.settingItem}>
        <Ionicons name="notifications-outline" size={18} />
        <Text style={styles.settingText}>Notifications</Text>
      </Pressable>

      <Pressable style={styles.settingItem}>
        <Ionicons name="help-circle-outline" size={18} />
        <Text style={styles.settingText}>Help & Support</Text>
      </Pressable>

      <Pressable style={styles.settingItem}>
        <Ionicons name="information-circle-outline" size={18} />
        <Text style={styles.settingText}>About</Text>
      </Pressable>

      {/* Logout */}
      <Pressable style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  userBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  email: {
    fontSize: 12,
    color: "#777",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 12,
  },

  empty: {
    color: "#777",
    marginBottom: 12,
  },

  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  settingText: {
    fontSize: 14,
  },

  logout: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#dc2626",
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
