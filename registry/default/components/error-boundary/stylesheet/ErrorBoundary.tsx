/** Nativra — ErrorBoundary (StyleSheet). Install: npx nativra-cli add error-boundary */
import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { type ThemeColors, alpha, useThemeColors, themeStyle } from "@/hooks/use-theme-colors";

export interface ErrorBoundaryProps {
  children?: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Consumers can attach crash reporting here
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  override render() {
    if (this.state.hasError || !this.props.children) {
      const title = this.props.fallbackTitle ?? "Something went wrong";
      const message =
        this.props.fallbackMessage ??
        this.state.error?.message ??
        "An unexpected rendering error occurred on this screen.";

      return <ErrorFallback title={title} message={message} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

/** Function component so the fallback can read theme colors (class components can't use hooks). */
function ErrorFallback({ title, message, onReset }: { title: string; message: string; onReset: () => void }) {
  const c = useThemeColors();
  const styles = createStyles(c);
  return (
    <View accessibilityRole="alert" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
      <Pressable onPress={onReset} accessibilityRole="button" accessibilityLabel="Try again" style={styles.button}>
        <Text style={styles.buttonText}>Try Again</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    borderRadius: themeStyle.radius.card,
    borderWidth: 1,
    borderColor: alpha(c.destructive, 0.3),
    backgroundColor: alpha(c.destructive, 0.08),
    padding: 20,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 8 },
  icon: { fontSize: 16 },
  title: { fontSize: 14, fontWeight: "700", color: c.destructive },
  message: { marginTop: 6, fontSize: 12, lineHeight: 18, color: c.destructive },
  button: {
    marginTop: 16,
    alignSelf: "flex-start",
    borderRadius: themeStyle.radius.control,
    backgroundColor: c.destructive,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: { fontSize: 12, fontWeight: "600", color: c["destructive-foreground"] },
});

