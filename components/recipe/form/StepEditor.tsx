import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { Step } from "../../../types/recipe";

interface StepEditorProps {
  steps: Step[];
  onChange: (steps: Step[]) => void;
}

export default function StepEditor({ steps, onChange }: StepEditorProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  function updateStep(index: number, text: string) {
    const updated = steps.map((step, i) =>
      i === index ? { ...step, text } : step
    );
    onChange(updated);
  }

  function addStep() {
    onChange([...steps, { order: steps.length + 1, text: "" }]);
  }

  function removeStep(index: number) {
    const updated = steps
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, order: i + 1 }));
    onChange(updated);
  }

  return (
    <View>
      <FlatList
        data={steps}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeStep(index)}
            >
              <Ionicons name="remove-circle" size={22} color={colors.danger[500]} />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={item.text}
              onChangeText={(text) => updateStep(index, text)}
              placeholder={`שלב ${item.order}`}
              placeholderTextColor={colors.text.muted}
              multiline
              textAlign="right"
            />
            <View style={styles.orderBadge}>
              <Text style={styles.orderText}>{item.order}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.addButton} onPress={addStep}>
            <Ionicons name="add-circle-outline" size={20} color={colors.primary[500]} />
            <Text style={styles.addButtonText}>הוסף שלב</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 10,
      gap: 8,
    },
    deleteButton: {
      padding: 2,
      marginTop: 10,
    },
    input: {
      flex: 1,
      backgroundColor: colors.card.default,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      fontSize: 15,
      color: colors.text.primary,
      minHeight: 48,
    },
    orderBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary[100],
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
    },
    orderText: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.primary[700],
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 10,
      justifyContent: "center",
    },
    addButtonText: {
      fontSize: 15,
      color: colors.primary[500],
      fontWeight: "600",
    },
  });
