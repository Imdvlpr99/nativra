/** Nativra — ErrorBoundary (NativeWind). Install: npx nativra-cli add error-boundary */
import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

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
        <View
          accessibilityRole="alert"
          className="rounded-card border border-destructive/30 bg-destructive/10 sp-p-5"
        >
          <View className="flex-row items-center sp-gap-2">
            <Text className="type-base">⚠️</Text>
            <Text className="type-sm weight-title text-destructive">
              {title}
            </Text>
          </View>
          <Text className="mt-1.5 type-xs leading-relaxed text-destructive">
            {message}
          </Text>
          <Pressable
            onPress={this.handleReset}
            accessibilityRole="button"
            accessibilityLabel="Try again"
            className="mt-4 self-start rounded-control bg-destructive sp-px-4 sp-py-2 active:opacity-80"
          >
            <Text className="type-xs weight-label text-destructive-foreground">Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

