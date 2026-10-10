import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { fireAuth } from "@/lib/firebase";

/** Placeholder until the real screens (Phase 6): confirms the app runs and Firebase is reachable. */
export default function Index() {
    const [user, setUser] = useState<User | null | undefined>(undefined);

    useEffect(() => onAuthStateChanged(fireAuth, setUser), []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sekai</Text>
            <Text style={styles.subtitle}>
                {user === undefined
                    ? "Connecting to Firebase..."
                    : user
                        ? `Signed in as ${user.email ?? user.uid}`
                        : "Firebase connected. Not signed in."}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#18181b",
        padding: 24,
    },
    title: {
        color: "#f4f4f5",
        fontSize: 32,
        fontWeight: "700",
    },
    subtitle: {
        color: "#a1a1aa",
        fontSize: 15,
        marginTop: 8,
        textAlign: "center",
    },
});
