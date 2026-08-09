import React, { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  LinearTransition,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { Step } from "../../../types/recipe";
import { fonts, typography } from "../../../theme/typography";
import { radius, spacing } from "../../../theme/spacing";
import ScalePressable from "../../ui/ScalePressable";
import { ScrollLockContext } from "./scrollLockContext";

interface StepEditorProps {
  steps: Step[];
  onChange: (steps: Step[]) => void;
}

/** Vertical gap between rows — must match styles.row marginBottom. */
const GAP = spacing.sm;
const SNAP = { duration: 150 };
const SHIFT = { duration: 160 };

interface RowLayout {
  y: number;
  h: number;
}

function dragStartHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

export default function StepEditor({ steps, onChange }: StepEditorProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const setScrollLocked = useContext(ScrollLockContext);

  // ── Drag-to-reorder state ────────────────────────────────────────────
  // Index of the row being dragged (-1 = none) and its finger offset.
  const activeIndex = useSharedValue(-1);
  const dragY = useSharedValue(0);
  // Measured row layouts (variable heights — steps are multiline).
  const layouts = useSharedValue<RowLayout[]>([]);
  const layoutsRef = useRef<RowLayout[]>([]);
  const pendingReset = useRef(false);

  layoutsRef.current.length = steps.length;

  // Reset the drag transforms in the same commit that re-renders the
  // reordered rows, so the preview positions hand off seamlessly.
  useEffect(() => {
    if (pendingReset.current) {
      pendingReset.current = false;
      activeIndex.value = -1;
      dragY.value = 0;
    }
  }, [steps, activeIndex, dragY]);

  const handleRowLayout = useCallback(
    (index: number, y: number, h: number) => {
      layoutsRef.current[index] = { y, h };
      layouts.value = [...layoutsRef.current];
    },
    [layouts]
  );

  // Kept in a ref so row gestures never capture a stale steps array.
  const reorderRef = useRef<(from: number, to: number) => void>(() => {});
  reorderRef.current = (from: number, to: number) => {
    pendingReset.current = true;
    const reordered = [...steps];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    onChange(reordered.map((step, i) => ({ ...step, order: i + 1 })));
  };
  const handleDrop = useCallback((from: number, to: number) => {
    reorderRef.current(from, to);
  }, []);

  // Freeze the host ScrollView while a row is lifted — otherwise the
  // scroll steals the touch and cancels the drag mid-gesture.
  const handleDragStart = useCallback(() => {
    setScrollLocked(true);
    dragStartHaptic();
  }, [setScrollLocked]);
  const handleDragEnd = useCallback(() => {
    setScrollLocked(false);
  }, [setScrollLocked]);

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
      {steps.map((item, index) => (
        <StepRow
          key={item.order.toString()}
          item={item}
          index={index}
          count={steps.length}
          activeIndex={activeIndex}
          dragY={dragY}
          layouts={layouts}
          styles={styles}
          colors={colors}
          onRowLayout={handleRowLayout}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onChangeText={updateStep}
          onRemove={removeStep}
        />
      ))}

      <Animated.View layout={LinearTransition}>
        <ScalePressable
          onPress={addStep}
          style={styles.addButton}
          accessibilityRole="button"
        >
          <Ionicons name="add-circle-outline" size={20} color={colors.primary[500]} />
          <Text style={styles.addButtonText}>הוספת שלב</Text>
        </ScalePressable>
      </Animated.View>
    </View>
  );
}

interface StepRowProps {
  item: Step;
  index: number;
  count: number;
  activeIndex: SharedValue<number>;
  dragY: SharedValue<number>;
  layouts: SharedValue<RowLayout[]>;
  styles: ReturnType<typeof createStyles>;
  colors: ThemeColors;
  onRowLayout: (index: number, y: number, h: number) => void;
  onDrop: (from: number, to: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onChangeText: (index: number, text: string) => void;
  onRemove: (index: number) => void;
}

function StepRow({
  item,
  index,
  count,
  activeIndex,
  dragY,
  layouts,
  styles,
  colors,
  onRowLayout,
  onDrop,
  onDragStart,
  onDragEnd,
  onChangeText,
  onRemove,
}: StepRowProps) {
  // Long-press the order circle to lift the row, then drag to reorder.
  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activateAfterLongPress(180)
        .hitSlop(8)
        .shouldCancelWhenOutside(false)
        .onStart(() => {
          activeIndex.value = index;
          dragY.value = 0;
          runOnJS(onDragStart)();
        })
        .onUpdate((e) => {
          if (activeIndex.value === index) {
            dragY.value = e.translationY;
          }
        })
        .onFinalize(() => {
          if (activeIndex.value !== index) return;
          runOnJS(onDragEnd)();

          const ls = layouts.value;
          const active = ls[index];
          if (!active) {
            activeIndex.value = -1;
            dragY.value = 0;
            return;
          }

          // Target slot = last row whose midpoint the dragged center crossed
          const center = active.y + dragY.value + active.h / 2;
          let to = index;
          for (let i = index + 1; i < count; i++) {
            const l = ls[i];
            if (l && center > l.y + l.h / 2) to = i;
          }
          for (let i = index - 1; i >= 0; i--) {
            const l = ls[i];
            if (l && center < l.y + l.h / 2) to = i;
          }

          if (to === index) {
            dragY.value = withTiming(0, SNAP, (finished) => {
              if (finished) activeIndex.value = -1;
            });
            return;
          }

          // Snap to the exact final slot, then commit the reorder
          let offset = 0;
          if (to > index) {
            for (let i = index + 1; i <= to; i++) offset += ls[i].h + GAP;
          } else {
            for (let i = to; i < index; i++) offset -= ls[i].h + GAP;
          }
          dragY.value = withTiming(offset, SNAP, (finished) => {
            if (finished) {
              runOnJS(onDrop)(index, to);
            } else {
              activeIndex.value = -1;
              dragY.value = 0;
            }
          });
        }),
    [index, count, activeIndex, dragY, layouts, onDrop, onDragStart, onDragEnd]
  );

  // zIndex lives on the outer wrapper (stacking vs sibling rows); the drag
  // transform lives on the inner view so the wrapper's layout animation
  // can't overwrite it.
  const wrapperAnimatedStyle = useAnimatedStyle(() => ({
    zIndex: activeIndex.value === index ? 10 : 0,
  }));

  const rowAnimatedStyle = useAnimatedStyle(() => {
    const active = activeIndex.value;
    if (active === -1) {
      return {
        transform: [{ translateY: 0 }, { scale: 1 }],
        elevation: 0,
        shadowOpacity: 0,
      };
    }

    if (active === index) {
      return {
        transform: [{ translateY: dragY.value }, { scale: 1.02 }],
        elevation: 8,
        shadowOpacity: 0.15,
      };
    }

    // Live preview: make room for the dragged row once it crosses this
    // row's midpoint (shift by the dragged row's height — rows vary)
    const ls = layouts.value;
    const draggedLayout = ls[active];
    const myLayout = ls[index];
    let shift = 0;
    if (draggedLayout && myLayout) {
      const center = draggedLayout.y + dragY.value + draggedLayout.h / 2;
      const myCenter = myLayout.y + myLayout.h / 2;
      if (index > active && center > myCenter) {
        shift = -(draggedLayout.h + GAP);
      } else if (index < active && center < myCenter) {
        shift = draggedLayout.h + GAP;
      }
    }
    return {
      transform: [{ translateY: withTiming(shift, SHIFT) }, { scale: 1 }],
      elevation: 0,
      shadowOpacity: 0,
    };
  });

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(18)}
      layout={LinearTransition}
      style={[styles.rowWrapper, wrapperAnimatedStyle]}
      onLayout={(e) =>
        onRowLayout(index, e.nativeEvent.layout.y, e.nativeEvent.layout.height)
      }
    >
      <Animated.View style={[styles.row, rowAnimatedStyle]}>
        {/* Order circle doubles as the drag handle */}
        <GestureDetector gesture={pan}>
          <View style={styles.orderCircle} accessibilityLabel="גרירה לשינוי סדר">
            <Text style={styles.orderText}>{item.order}</Text>
          </View>
        </GestureDetector>
        <TextInput
          style={styles.input}
          value={item.text}
          onChangeText={(text) => onChangeText(index, text)}
          placeholder={`שלב ${item.order}`}
          placeholderTextColor={colors.text.muted}
          multiline
          textAlignVertical="top"
        />
        <ScalePressable
          onPress={() => onRemove(index)}
          hitSlop={8}
          style={styles.deleteButton}
          accessibilityRole="button"
          accessibilityLabel="הסרת שלב"
        >
          <Ionicons name="remove-circle" size={22} color={colors.danger[500]} />
        </ScalePressable>
      </Animated.View>
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    rowWrapper: {
      marginBottom: GAP,
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      // Dragged-row shadow (opacity animated from 0)
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      backgroundColor: colors.card.default,
      borderRadius: radius.sm,
    },
    orderCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary[100],
      justifyContent: "center",
      alignItems: "center",
      marginTop: 6,
    },
    orderText: {
      fontFamily: fonts.bodyExtraBold,
      fontSize: 16,
      color: colors.primary[500],
    },
    input: {
      flex: 1,
      backgroundColor: colors.card.default,
      borderWidth: 1.5,
      borderColor: colors.border.default,
      borderRadius: radius.sm,
      paddingVertical: 12,
      paddingHorizontal: 14,
      ...typography.body,
      color: colors.text.primary,
      minHeight: 48,
    },
    deleteButton: {
      marginTop: 12,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: spacing.md,
    },
    addButtonText: {
      ...typography.title,
      color: colors.primary[500],
    },
  });
