import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { exportWatchlist, type ExportFormat } from "@/services/export";
import { colors, fontSize, fontWeight, spacing } from "@/theme";
import { showMessage } from "@/utils/feedback";

const FORMATS: { format: ExportFormat; label: string }[] = [
  { format: "csv", label: "CSV" },
  { format: "json", label: "JSON" },
  { format: "xml", label: "XML" },
];

export function ExportSection() {
  const { user } = useAuth();
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  if (!user) return null;

  const handleExport = async (format: ExportFormat) => {
    setExporting(format);
    const result = await exportWatchlist(user.uid, format);
    setExporting(null);
    if (!result.success && result.message) showMessage(result.message);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Export watchlist</Text>
      <Text style={styles.description}>
        Save or share your whole watchlist. Large lists can take a few seconds.
      </Text>
      <View style={styles.buttons}>
        {FORMATS.map(({ format, label }) => (
          <View key={format} style={styles.button}>
            <Button
              title={label}
              variant="secondary"
              size="sm"
              loading={exporting === format}
              disabled={exporting !== null}
              onPress={() => handleExport(format)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  heading: {
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  description: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  button: {
    flex: 1,
  },
});
