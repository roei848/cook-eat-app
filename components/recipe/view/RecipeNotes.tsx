import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { StoredNote } from "../../../types/recipe";
import { useThemeColors } from "../../../theme/useThemeColors";
import { ThemeColors } from "../../../theme/colors";
import { typography } from "../../../theme/typography";
import { radius } from "../../../theme/spacing";
import { useRecipeNotes } from "../../../hooks/useRecipeNotes";
import RecipeNoteTile from "./RecipeNoteTile";
import NoteComposer from "./NoteComposer";

type Props = {
  recipeId: string;
  notes?: StoredNote[];
  onComposerFocus: () => void;
};

export default function RecipeNotes({ recipeId, notes, onComposerFocus }: Props) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const { displayNotes, addNote, removeNote, currentUid, canWrite } =
    useRecipeNotes(recipeId, notes);

  return (
    <Animated.View entering={FadeInUp.delay(500)} style={styles.card}>
      {/* Section header */}
      <View style={styles.header}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={20}
          color={colors.primary[500]}
        />
        <Text style={styles.headerText}>הערות</Text>
        {displayNotes.length > 0 && (
          <View style={styles.countPill}>
            <Text style={styles.countText}>{displayNotes.length}</Text>
          </View>
        )}
      </View>

      {displayNotes.length === 0 ? (
        <Text style={styles.empty}>עדיין אין הערות — מה שינית בפעם שבישלת?</Text>
      ) : (
        displayNotes.map((note) => (
          <RecipeNoteTile
            key={note.id}
            note={note}
            // Legacy notes have no author, so anyone may remove them.
            canDelete={note.authorUid === null || note.authorUid === currentUid}
            onDelete={removeNote}
          />
        ))
      )}

      {canWrite && (
        <NoteComposer onSubmit={addNote} onFocus={onComposerFocus} />
      )}
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      marginHorizontal: 16,
      marginTop: 20,
      backgroundColor: colors.card.default,
      borderRadius: radius.lg,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 4,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
    },
    headerText: {
      ...typography.titleL,
      color: colors.text.primary,
    },
    countPill: {
      marginStart: "auto",
      backgroundColor: colors.primary[100],
      borderRadius: radius.pill,
      paddingHorizontal: 10,
      paddingVertical: 2,
    },
    countText: {
      ...typography.caption,
      color: colors.primary[900],
    },
    empty: {
      ...typography.bodySmall,
      color: colors.text.muted,
      marginBottom: 14,
    },
  });
