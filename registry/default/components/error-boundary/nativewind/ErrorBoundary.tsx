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
          className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5 dark:border-rose-900/60 dark:bg-rose-950/30"
        >
          <View className="flex-row items-center gap-2">
            <Text className="text-base">⚠️</Text>
            <Text className="text-sm font-bold text-rose-900 dark:text-rose-200">
              {title}
            </Text>
          </View>
          <Text className="mt-1.5 text-xs leading-relaxed text-rose-700 dark:text-rose-300">
            {message}
          </Text>
          <Pressable
            onPress={this.handleReset}
            accessibilityRole="button"
            accessibilityLabel="Try again"
            className="mt-4 self-start rounded-xl bg-rose-600 px-4 py-2 active:opacity-80"
          >
            <Text className="text-xs font-semibold text-white">Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

