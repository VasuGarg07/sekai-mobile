import { useState } from "react";
import { ActivityIndicator } from "react-native";

import { ListGroup, ListItem } from "@/components/ui/list-item";
import { SheetHeader } from "@/components/ui/sheet-header";
import type { IconName } from "@/components/ui/icon";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { exportWatchlist, type ExportFormat } from "@/services/export";
import type { TintName } from "@/theme";
import { showMessage } from "@/utils/feedback";

import { SheetLayout } from "./sheet-layout";

const FORMATS: { format: ExportFormat; title: string; subtitle: string; icon: IconName; tint: TintName }[] = [
  { format: "csv", title: "CSV", subtitle: "Opens in Excel or Google Sheets", icon: "table_chart", tint: "green" },
  { format: "json", title: "JSON", subtitle: "For other apps and scripts", icon: "data_object", tint: "amber" },
  { format: "xml", title: "XML", subtitle: "Structured, widely supported", icon: "code", tint: "indigo" },
];

export function ExportSheet() {
  const { user } = useAuth();
  const { colors, tints } = useTheme();
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (!user || exporting) return;
    setExporting(format);
    const result = await exportWatchlist(user.uid, format);
    setExporting(null);
    if (!result.success && result.message) showMessage(result.message);
  };

  return (
    <SheetLayout>
      <SheetHeader title="Export list" subtitle="Your whole list, shared as a file. Large lists take a few seconds." />
      <ListGroup>
        {FORMATS.map(({ format, title, subtitle, icon, tint }) => (
          <ListItem
            key={format}
            icon={icon}
            iconColor={tints[tint]}
            title={title}
            subtitle={subtitle}
            disabled={exporting !== null && exporting !== format}
            onPress={() => handleExport(format)}
            trailing={exporting === format ? <ActivityIndicator color={colors.accent} /> : undefined}
          />
        ))}
      </ListGroup>
    </SheetLayout>
  );
}
