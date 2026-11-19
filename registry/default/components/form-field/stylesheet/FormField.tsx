/** Nativra — FormField (StyleSheet). Install: npx nativra-cli add form-field */
import React from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { Label } from "@/components/ui/Label";
import { type ThemeColors, sp, ts, useThemeColors } from "@/hooks/use-theme-colors";

/** What a render-function child receives, to wire its control to the label and error. */
export interface FormFieldControlProps {
  /** Pass as the control's `accessibilityLabelledBy` (Android links it to the visible label). */
  labelId: string;
  /** Pass as the control's `accessibilityLabel` (iOS reads it; includes the error, if any). */
  accessibilityLabel: string;
  invalid: boolean;
  disabled: boolean;
}

export interface FormFieldProps {
  label: string;
  /** Helper text under the label. */
  description?: string;
  /** Shown under the control in the destructive color, and announced to screen readers. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  /** The control: a node, or a function that receives props to link it to the label. */
  children: React.ReactNode | ((control: FormFieldControlProps) => React.ReactNode);
  style?: StyleProp<ViewStyle>;
}

let nextId = 0;

/** Label, description, control and error message as one unit, for any control (Switch, Select, Slider, ...). */
export function FormField({ label, description, error, required = false, disabled = false, children, style }: FormFieldProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [labelId] = React.useState(() => `nativra-field-${++nextId}`);
  const invalid = Boolean(error);
  const control: FormFieldControlProps = {
    labelId,
    accessibilityLabel: invalid ? `${label}, ${error}` : label,
    invalid,
    disabled,
  };

  return (
    <View style={[styles.wrap, style]}>
      <Label nativeID={labelId} required={required} disabled={disabled}>
        {label}
      </Label>
      {description ? <Text style={[styles.description, disabled && styles.disabled]}>{description}</Text> : null}
      <View style={disabled && styles.disabled}>{typeof children === "function" ? children(control) : children}</View>
      {invalid ? (
        // Android announces it when it appears; iOS hears it through the control's label.
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrap: { width: "100%", gap: sp(6) },
    description: { fontSize: ts(13), color: c["muted-foreground"], marginTop: -sp(4) },
    error: { fontSize: ts(12), color: c.destructive },
    disabled: { opacity: 0.5 },
  });
