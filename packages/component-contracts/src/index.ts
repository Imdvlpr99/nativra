/**
 * @nativra/component-contracts
 *
 * Shared TypeScript types and behavioral contracts for Nativra components.
 * These types are intentionally framework-agnostic and do NOT import React Native
 * directly — they define the shape that component implementations must satisfy.
 */

// ---------------------------------------------------------------------------
// Core variant types
// ---------------------------------------------------------------------------

export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl";

export type ComponentVariant =
  | "default"
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

export type ComponentRadius = "none" | "sm" | "md" | "lg" | "full";

// ---------------------------------------------------------------------------
// Styling target marker
// ---------------------------------------------------------------------------

/** Used to mark which styling system a file targets at runtime */
export type StylingTarget = "nativewind" | "stylesheet";

// ---------------------------------------------------------------------------
// Accessibility contract
// ---------------------------------------------------------------------------

/** Minimum accessible label interface that every interactive component should accept */
export interface AccessibleProps {
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint for screen readers */
  accessibilityHint?: string;
  /** Whether this element is accessible */
  accessible?: boolean;
  /** Accessibility role */
  accessibilityRole?: string;
}

// ---------------------------------------------------------------------------
// Component metadata contract
// ---------------------------------------------------------------------------

/**
 * Every Nativra component file should export a `componentMeta` constant
 * conforming to this interface so tooling can introspect it without parsing TSX.
 */
export interface ComponentMeta {
  /** Registry item id */
  id: string;
  /** Display name */
  name: string;
  /** Full title */
  title?: string;
  /** Category, e.g. "actions", "layout", "forms", "feedback" */
  category?: string;
  /** Short description */
  description: string;
  /** Styling target this implementation file serves */
  stylingTarget: StylingTarget;
  /** Supported platforms */
  platforms: {
    android: boolean;
    ios: boolean;
    web?: boolean;
  };
  /** Component version (matches registry item version) */
  version: string;
}

// ---------------------------------------------------------------------------
// Button contract
// ---------------------------------------------------------------------------

export interface ButtonBaseProps extends AccessibleProps {
  /** Visual variant */
  variant?: ComponentVariant;
  /** Size preset */
  size?: ComponentSize;
  /** Disables the button */
  disabled?: boolean;
  /** Shows a loading indicator */
  loading?: boolean;
  /** Button label text */
  children: string;
  /** Press handler */
  onPress?: () => void;
}

// ---------------------------------------------------------------------------
// TextInput contract
// ---------------------------------------------------------------------------

export interface TextInputBaseProps extends AccessibleProps {
  /** Current value */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Disables input */
  disabled?: boolean;
  /** Shows error state */
  error?: boolean;
  /** Error message shown below input */
  errorMessage?: string;
  /** Label shown above the input */
  label?: string;
  /** Change handler */
  onChangeText?: (text: string) => void;
}

// ---------------------------------------------------------------------------
// Badge contract
// ---------------------------------------------------------------------------

export interface BadgeBaseProps {
  /** Badge label */
  label: string;
  variant?: Extract<ComponentVariant, "default" | "primary" | "secondary" | "destructive" | "outline">;
  size?: Extract<ComponentSize, "sm" | "md" | "lg">;
}

// ---------------------------------------------------------------------------
// Card contract
// ---------------------------------------------------------------------------

export interface CardBaseProps {
  /** Whether to render a shadow/elevation */
  elevated?: boolean;
  /** Border radius preset */
  radius?: ComponentRadius;
  /** Padding preset */
  padding?: ComponentSize;
}

// ---------------------------------------------------------------------------
// Separator contract
// ---------------------------------------------------------------------------

export interface SeparatorBaseProps {
  /** Orientation of the divider */
  orientation?: "horizontal" | "vertical";
  /** Whether the separator is purely decorative */
  decorative?: boolean;
}

// ---------------------------------------------------------------------------
// Text contract
// ---------------------------------------------------------------------------

export type TextVariant = "h1" | "h2" | "h3" | "h4" | "p" | "lead" | "muted" | "code";

export interface TextBaseProps extends AccessibleProps {
  /** Typography variant */
  variant?: TextVariant;
  /** Text content */
  children?: string | number | boolean | null | undefined;
}

// ---------------------------------------------------------------------------
// Label contract
// ---------------------------------------------------------------------------

export interface LabelBaseProps extends AccessibleProps {
  /** Text content of the label */
  children: string;
  /** Marks the field as required */
  required?: boolean;
  /** Disables the label visual state */
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Checkbox contract
// ---------------------------------------------------------------------------

export interface CheckboxBaseProps extends AccessibleProps {
  /** Checked state */
  checked: boolean;
  /** Callback when checked changes */
  onCheckedChange: (checked: boolean) => void;
  /** Disables the checkbox */
  disabled?: boolean;
  /** Optional label */
  label?: string;
}

// ---------------------------------------------------------------------------
// Switch contract
// ---------------------------------------------------------------------------

export interface SwitchBaseProps extends AccessibleProps {
  /** Switch value */
  value: boolean;
  /** Callback when switch value changes */
  onValueChange: (value: boolean) => void;
  /** Disables the switch */
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Skeleton contract
// ---------------------------------------------------------------------------

export interface SkeletonBaseProps {
  /** Width in pixels or percentage */
  width?: number | string;
  /** Height in pixels or percentage */
  height?: number | string;
  /** Radius preset */
  radius?: ComponentRadius;
}

// ---------------------------------------------------------------------------
// Spinner contract
// ---------------------------------------------------------------------------

export interface SpinnerBaseProps extends AccessibleProps {
  /** Spinner size preset */
  size?: "sm" | "md" | "lg";
  /** Optional color */
  color?: string;
}

// ---------------------------------------------------------------------------
// Avatar contract
// ---------------------------------------------------------------------------

export interface AvatarBaseProps extends AccessibleProps {
  /** Image source URI */
  src?: string;
  /** Fallback initials or text when image fails */
  fallback: string;
  /** Size preset */
  size?: "sm" | "md" | "lg" | "xl";
}

// ---------------------------------------------------------------------------
// Alert contract (V4 §3)
// ---------------------------------------------------------------------------

export type AlertVariant = "default" | "info" | "success" | "warning" | "destructive";

export interface AlertBaseProps extends AccessibleProps {
  /** Alert status variant */
  variant?: AlertVariant;
  /** Alert title */
  title?: string;
  /** Alert message or body */
  children?: unknown;
  /** Callback when alert dismiss button is pressed */
  onClose?: () => void;
}

// ---------------------------------------------------------------------------
// Progress contract (V4 §3)
// ---------------------------------------------------------------------------

export interface ProgressBaseProps extends AccessibleProps {
  /** Current progress value (0 to 100) */
  value: number;
  /** Maximum progress value (default 100) */
  max?: number;
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Optional track color indicator */
  color?: string;
}

// ---------------------------------------------------------------------------
// Slider contract (V4 §3)
// ---------------------------------------------------------------------------

export interface SliderBaseProps extends AccessibleProps {
  /** Current numerical value */
  value: number;
  /** Callback when slider value changes */
  onValueChange: (value: number) => void;
  /** Minimum range value (default 0) */
  min?: number;
  /** Maximum range value (default 100) */
  max?: number;
  /** Step increment (default 1) */
  step?: number;
  /** Disables interaction */
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Tabs contract (V4 §3)
// ---------------------------------------------------------------------------

export interface TabItem {
  label: string;
  value: string;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsBaseProps extends AccessibleProps {
  /** Currently active tab value */
  value: string;
  /** Callback when active tab changes */
  onValueChange: (value: string) => void;
  /** List of tab options */
  tabs: TabItem[];
  /** Visual variant */
  variant?: "default" | "pills" | "underline";
}

// ---------------------------------------------------------------------------
// Textarea contract (V4 Master Catalog)
// ---------------------------------------------------------------------------

export interface TextareaBaseProps extends AccessibleProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  rows?: number;
}

// ---------------------------------------------------------------------------
// Dialog contract (V4 Master Catalog)
// ---------------------------------------------------------------------------

export interface DialogBaseProps extends AccessibleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  destructive?: boolean;
}

// ---------------------------------------------------------------------------
// Toast contract (V4 Master Catalog)
// ---------------------------------------------------------------------------

export interface ToastBaseProps extends AccessibleProps {
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
  onDismiss?: () => void;
}

// ---------------------------------------------------------------------------
// RadioGroup contract (V4 Master Catalog)
// ---------------------------------------------------------------------------

export interface RadioOptionContract {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupBaseProps extends AccessibleProps {
  options: RadioOptionContract[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Select contract (V4 Master Catalog)
// ---------------------------------------------------------------------------

export interface SelectOptionContract {
  label: string;
  value: string;
}

export interface SelectBaseProps extends AccessibleProps {
  label?: string;
  placeholder?: string;
  options: SelectOptionContract[];
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Accordion contract (V4 Master Catalog)
// ---------------------------------------------------------------------------

export interface AccordionItemContract {
  id: string;
  title: string;
  content: string;
}

export interface AccordionBaseProps extends AccessibleProps {
  items: AccordionItemContract[];
  allowMultiple?: boolean;
}

