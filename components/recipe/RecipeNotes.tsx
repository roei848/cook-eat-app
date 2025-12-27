import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";

type Props = {
  notes: string[];
  onChange: (notes: string[]) => void;
};

export default function RecipeNotes({ notes, onChange }: Props) {
  const colors = useThemeColors();
  const [text, setText] = useState("");

  const addNote = () => {
    if (!text.trim()) return;
    onChange([text, ...notes]); // newest first
    setText("");
  };

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Add a note..."
          style={styles(colors).input}
        />
        <Pressable onPress={addNote}>
          <Text style={{ color: colors.primary[500], fontWeight: "600" }}>
            Add
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles(colors).note}>
            <Text style={{ color: colors.text.primary }}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background.default,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    input: {
      flex: 1,
      backgroundColor: colors.card.default,
      borderRadius: 12,
      padding: 12,
      marginRight: 8,
      color: colors.text.primary,
    },
    note: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.card.default,
      marginBottom: 8,
    },
  });
