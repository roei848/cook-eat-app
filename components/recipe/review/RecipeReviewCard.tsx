import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { Recipe, Ingredient, Step } from "../../../types/recipe";
import { Category } from "../../../types/enums/category";
import { Difficulty } from "../../../types/enums/diffucalty";
import { Relative } from "../../../types/enums/relatives";

import RelativesPicker from "../form/RelativesPicker";
import IngredientEditor from "../form/IngredientEditor";
import StepEditor from "../form/StepEditor";
import RecipePhotoInput from "../form/RecipePhotoInput";

interface RecipeReviewCardProps {
  recipe: Partial<Recipe>;
  onUpdateRecipe: (updates: Partial<Recipe>) => void;
  photoUri?: string;
  onPhotoSelected: (uri: string) => void;
}

type ActiveModal =
  | "title"
  | "description"
  | "author"
  | "time"
  | "category"
  | "difficulty"
  | "relatives"
  | "ingredients"
  | "steps"
  | null;

export default function RecipeReviewCard({
  recipe,
  onUpdateRecipe,
  photoUri,
  onPhotoSelected,
}: RecipeReviewCardProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [editText, setEditText] = useState("");

  function openTextModal(field: "title" | "description" | "author" | "time") {
    const current =
      field === "title"
        ? recipe.title ?? ""
        : field === "description"
        ? recipe.description ?? ""
        : field === "author"
        ? recipe.byWho ?? ""
        : String(recipe.timeInMinutes ?? "");
    setEditText(current);
    setActiveModal(field);
  }

  function saveTextModal() {
    if (activeModal === "title") onUpdateRecipe({ title: editText });
    else if (activeModal === "description") onUpdateRecipe({ description: editText });
    else if (activeModal === "author") onUpdateRecipe({ byWho: editText });
    else if (activeModal === "time") {
      const num = parseInt(editText, 10);
      if (!isNaN(num)) onUpdateRecipe({ timeInMinutes: num });
    }
    setActiveModal(null);
  }

  function isMissing(value: unknown): boolean {
    if (value === undefined || value === null) return true;
    if (typeof value === "string") return value.trim() === "";
    if (Array.isArray(value)) return value.length === 0;
    return false;
  }

  function fieldStyle(value: unknown) {
    return [
      styles.field,
      isMissing(value) ? styles.fieldMissing : styles.fieldOk,
    ];
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Photo */}
      <View style={styles.section}>
        <RecipePhotoInput
          imageUri={photoUri ?? recipe.imageUrl}
          onImageSelected={onPhotoSelected}
        />
      </View>

      {/* Title */}
      <TouchableOpacity
        style={fieldStyle(recipe.title)}
        onPress={() => openTextModal("title")}
      >
        <Text style={styles.sectionLabel}>שם המתכון</Text>
        <Text style={isMissing(recipe.title) ? styles.placeholder : styles.fieldValue}>
          {recipe.title || "הקלד שם מתכון..."}
        </Text>
      </TouchableOpacity>

      {/* Description */}
      <TouchableOpacity
        style={fieldStyle(recipe.description)}
        onPress={() => openTextModal("description")}
      >
        <Text style={styles.sectionLabel}>תיאור</Text>
        <Text
          style={isMissing(recipe.description) ? styles.placeholder : styles.fieldValue}
          numberOfLines={3}
        >
          {recipe.description || "הוסף תיאור קצר..."}
        </Text>
      </TouchableOpacity>

      {/* Meta row */}
      <View style={styles.metaRow}>
        <TouchableOpacity
          style={[fieldStyle(recipe.category), styles.metaField]}
          onPress={() => setActiveModal("category")}
        >
          <Text style={styles.sectionLabel}>קטגוריה</Text>
          <Text style={isMissing(recipe.category) ? styles.placeholder : styles.fieldValue}>
            {recipe.category || "—"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[fieldStyle(recipe.difficulty), styles.metaField]}
          onPress={() => setActiveModal("difficulty")}
        >
          <Text style={styles.sectionLabel}>קושי</Text>
          <Text style={isMissing(recipe.difficulty) ? styles.placeholder : styles.fieldValue}>
            {recipe.difficulty || "—"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[fieldStyle(recipe.timeInMinutes), styles.metaField]}
          onPress={() => openTextModal("time")}
        >
          <Text style={styles.sectionLabel}>זמן (דק')</Text>
          <Text
            style={isMissing(recipe.timeInMinutes) ? styles.placeholder : styles.fieldValue}
          >
            {recipe.timeInMinutes ?? "—"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Author */}
      <TouchableOpacity
        style={fieldStyle(recipe.byWho)}
        onPress={() => openTextModal("author")}
      >
        <Text style={styles.sectionLabel}>מאת</Text>
        <Text style={isMissing(recipe.byWho) ? styles.placeholder : styles.fieldValue}>
          {recipe.byWho || "שם השף..."}
        </Text>
      </TouchableOpacity>

      {/* Relatives tags */}
      <TouchableOpacity
        style={styles.field}
        onPress={() => setActiveModal("relatives")}
      >
        <Text style={styles.sectionLabel}>תגיות תזונה</Text>
        <Text style={styles.fieldValue}>
          {recipe.relatives && recipe.relatives.length > 0
            ? recipe.relatives.join(", ")
            : "אופציונלי"}
        </Text>
      </TouchableOpacity>

      {/* Ingredients */}
      <TouchableOpacity
        style={fieldStyle(recipe.ingredients)}
        onPress={() => setActiveModal("ingredients")}
      >
        <Text style={styles.sectionLabel}>רכיבים</Text>
        <Text style={isMissing(recipe.ingredients) ? styles.placeholder : styles.fieldValue}>
          {recipe.ingredients && recipe.ingredients.length > 0
            ? `${recipe.ingredients.length} רכיבים`
            : "הוסף רכיבים..."}
        </Text>
        <Ionicons
          name="chevron-back"
          size={16}
          color={colors.text.muted}
          style={styles.chevron}
        />
      </TouchableOpacity>

      {/* Steps */}
      <TouchableOpacity
        style={fieldStyle(recipe.steps)}
        onPress={() => setActiveModal("steps")}
      >
        <Text style={styles.sectionLabel}>שלבי הכנה</Text>
        <Text style={isMissing(recipe.steps) ? styles.placeholder : styles.fieldValue}>
          {recipe.steps && recipe.steps.length > 0
            ? `${recipe.steps.length} שלבים`
            : "הוסף שלבים..."}
        </Text>
        <Ionicons
          name="chevron-back"
          size={16}
          color={colors.text.muted}
          style={styles.chevron}
        />
      </TouchableOpacity>

      {/* ── Text edit modal (title / description / author / time) ── */}
      <Modal
        visible={
          activeModal === "title" ||
          activeModal === "description" ||
          activeModal === "author" ||
          activeModal === "time"
        }
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>
              {activeModal === "title"
                ? "שם המתכון"
                : activeModal === "description"
                ? "תיאור"
                : activeModal === "author"
                ? "מאת"
                : "זמן הכנה (דקות)"}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={editText}
              onChangeText={setEditText}
              multiline={activeModal === "description"}
              keyboardType={activeModal === "time" ? "number-pad" : "default"}
              autoFocus
              textAlign="right"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.modalCancelText}>ביטול</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={saveTextModal}>
                <Text style={styles.modalSaveText}>שמור</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Category bottom sheet ── */}
      <Modal visible={activeModal === "category"} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>בחר קטגוריה</Text>
            {Object.values(Category).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.pickerOption, cat === recipe.category && styles.pickerOptionSelected]}
                onPress={() => {
                  onUpdateRecipe({ category: cat });
                  setActiveModal(null);
                }}
              >
                <Text style={[styles.pickerOptionText, cat === recipe.category && styles.pickerOptionTextSelected]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Difficulty bottom sheet ── */}
      <Modal visible={activeModal === "difficulty"} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>בחר רמת קושי</Text>
            {Object.values(Difficulty).map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[styles.pickerOption, diff === recipe.difficulty && styles.pickerOptionSelected]}
                onPress={() => {
                  onUpdateRecipe({ difficulty: diff });
                  setActiveModal(null);
                }}
              >
                <Text style={[styles.pickerOptionText, diff === recipe.difficulty && styles.pickerOptionTextSelected]}>
                  {diff}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Relatives modal ── */}
      <Modal visible={activeModal === "relatives"} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>תגיות תזונה</Text>
            <RelativesPicker
              value={recipe.relatives ?? []}
              onChange={(rels) => onUpdateRecipe({ relatives: rels })}
            />
            <TouchableOpacity
              style={styles.modalSave}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.modalSaveText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Ingredients modal ── */}
      <Modal visible={activeModal === "ingredients"} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, styles.modalSheetTall]}>
            <Text style={styles.modalTitle}>רכיבים</Text>
            <ScrollView>
              <IngredientEditor
                ingredients={recipe.ingredients ?? []}
                onChange={(ings) => onUpdateRecipe({ ingredients: ings })}
              />
            </ScrollView>
            <TouchableOpacity
              style={styles.modalSave}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.modalSaveText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Steps modal ── */}
      <Modal visible={activeModal === "steps"} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, styles.modalSheetTall]}>
            <Text style={styles.modalTitle}>שלבי הכנה</Text>
            <ScrollView>
              <StepEditor
                steps={recipe.steps ?? []}
                onChange={(steps) => onUpdateRecipe({ steps })}
              />
            </ScrollView>
            <TouchableOpacity
              style={styles.modalSave}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.modalSaveText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    section: {
      marginBottom: 12,
    },
    field: {
      backgroundColor: colors.card.default,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1.5,
    },
    fieldOk: {
      borderColor: colors.primary[300],
    },
    fieldMissing: {
      borderColor: colors.accent.amber,
      backgroundColor: colors.accent.amberBg,
    },
    sectionLabel: {
      fontSize: 12,
      color: colors.text.muted,
      marginBottom: 4,
    },
    fieldValue: {
      fontSize: 15,
      color: colors.text.primary,
    },
    placeholder: {
      fontSize: 15,
      color: colors.text.muted,
      fontStyle: "italic",
    },
    metaRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 10,
    },
    metaField: {
      flex: 1,
      marginBottom: 0,
    },
    chevron: {
      position: "absolute",
      left: 12,
      top: "50%",
      marginTop: -8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.45)",
      justifyContent: "flex-end",
    },
    modalSheet: {
      backgroundColor: colors.card.default,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: 36,
    },
    modalSheetTall: {
      maxHeight: "80%",
    },
    modalTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text.primary,
      textAlign: "center",
      marginBottom: 16,
    },
    modalInput: {
      backgroundColor: colors.background.secondary,
      borderRadius: 12,
      padding: 14,
      fontSize: 15,
      color: colors.text.primary,
      minHeight: 48,
      marginBottom: 16,
    },
    modalActions: {
      flexDirection: "row",
      gap: 12,
    },
    modalCancel: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: colors.background.secondary,
      alignItems: "center",
    },
    modalCancelText: {
      fontSize: 15,
      color: colors.text.secondary,
    },
    modalSave: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: colors.primary[500],
      alignItems: "center",
    },
    modalSaveText: {
      fontSize: 15,
      fontWeight: "700",
      color: "#fff",
    },
    pickerOption: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 10,
      marginBottom: 4,
    },
    pickerOptionSelected: {
      backgroundColor: colors.primary[100],
    },
    pickerOptionText: {
      fontSize: 15,
      color: colors.text.primary,
    },
    pickerOptionTextSelected: {
      color: colors.primary[700],
      fontWeight: "700",
    },
  });
