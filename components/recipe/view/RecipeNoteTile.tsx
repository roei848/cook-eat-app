import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { useThemeColors } from "../../../theme/useThemeColors";
import { ThemeColors } from "../../../theme/colors";
import { fonts, typography } from "../../../theme/typography";
import { radius } from "../../../theme/spacing";
import { DisplayNote, formatRelativeHe } from "../../../utils/recipeNotes";

type Props = {
  note: DisplayNote;
  canDelete: boolean;
  onDelete: (note: DisplayNote) => void;
};

export default function RecipeNoteTile({ note, canDelete, onDelete }: Props) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const confirmDelete = () => {
    Alert.alert("מחיקת הערה", "למחוק את ההערה?", [
      { text: "ביטול", style: "cancel" },
      { text: "מחק", style: "destructive", onPress: () => onDelete(note) },
    ]);
  };

  const initial = note.authorName?.trim().charAt(0) ?? "";
  const when = note.createdAt ? formatRelativeHe(note.createdAt, Date.now()) : null;

  return (
    <Pressable
      onLongPress={canDelete ? confirmDelete : undefined}
      delayLongPress={400}
      style={styles.tile}
    >
      <Text style={styles.text}>{note.text}</Text>

      {/* Legacy string notes predate authorship — no byline for them. */}
      {note.authorName && (
        <View style={styles.byline}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.meta}>
            {when ? `${note.authorName} · ${when}` : note.authorName}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    tile: {
      backgroundColor: colors.accent.amberBg,
      borderRadius: radius.md,
      // Logical property: lands on the right edge under forced RTL.
      borderStartWidth: 3,
      borderStartColor: colors.primary[300],
      padding: 14,
      marginBottom: 10,
    },
    text: {
      ...typography.body,
      color: colors.text.primary,
    },
    byline: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 10,
    },
    avatar: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.primary[500],
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      fontFamily: fonts.bodyBold,
      fontSize: 11,
      color: colors.text.inverse,
    },
    meta: {
      ...typography.caption,
      color: colors.text.secondary,
    },
  });
