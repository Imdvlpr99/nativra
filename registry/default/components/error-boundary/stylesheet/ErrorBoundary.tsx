/** Nativra — ErrorBoundary (StyleSheet). Install: npx nativra-cli add error-boundary */
import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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

      return (
        <View accessibilityRole="alert" style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.icon}>⚠️</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.message}>{message}</Text>
          <Pressable
            onPress={this.handleReset}
            accessibilityRole="button"
            accessibilityLabel="Try again"
            style={styles.button}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fecdd3",
    backgroundColor: "#fff1f2",
    padding: 20,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 8 },
  icon: { fontSize: 16 },
  title: { fontSize: 14, fontWeight: "700", color: "#881337" },
  message: { marginTop: 6, fontSize: 12, lineHeight: 18, color: "#be123c" },
  button: {
    marginTop: 16,
    alignSelf: "flex-start",
    borderRadius: 12,
    backgroundColor: "#e11d48",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: { fontSize: 12, fontWeight: "600", color: "#ffffff" },
});

