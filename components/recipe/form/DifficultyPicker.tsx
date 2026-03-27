import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { Difficulty } from "../../../types/enums/diffucalty";

interface DifficultyPickerProps {
  label?: string;
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

const DIFFICULTIES = Object.values(Difficulty);

export default function DifficultyPicker({
  label = "רמת קושי",
  value,
  onChange,
}: DifficultyPickerProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={() => setVisible(true)}>
        <Text style={styles.triggerValue}>{value}</Text>
        <Text style={styles.triggerLabel}>{label}</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>בחר רמת קושי</Text>
            <FlatList
              data={DIFFICULTIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item === value && styles.optionSelected,
                  ]}
                  onPress={() => {
                    onChange(item);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item === value && styles.optionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    trigger: {
      backgroundColor: colors.card.default,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    triggerLabel: {
      fontSize: 14,
      color: colors.text.secondary,
    },
    triggerValue: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text.primary,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.45)",
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: colors.card.default,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      maxHeight: "50%",
    },
    sheetTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text.primary,
      textAlign: "center",
      marginBottom: 16,
    },
    option: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 10,
      marginBottom: 4,
    },
    optionSelected: {
      backgroundColor: colors.primary[100],
    },
    optionText: {
      fontSize: 15,
      color: colors.text.primary,
      textAlign: "right",
    },
    optionTextSelected: {
      color: colors.primary[700],
      fontWeight: "700",
    },
  });
