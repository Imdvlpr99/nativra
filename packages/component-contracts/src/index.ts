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


