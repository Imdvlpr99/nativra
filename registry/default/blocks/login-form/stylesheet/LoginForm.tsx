/**
 * Nativra — Login Form Block (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add login-form
 */
import React, { useState } from "react";
import { View, StyleSheet, type ViewStyle } from "react-native";
import { Card } from "./Card";
import { Text } from "./Text";
import { Label } from "./Label";
import { Input } from "./Input";
import { Button } from "./Button";
import { Separator } from "./Separator";

export interface LoginFormProps {
  onSignIn?: (credentials: { email: string; password: string }) => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  isLoading?: boolean;
  style?: ViewStyle;
}

export function LoginForm({
  onSignIn,
  onForgotPassword,
  onSignUp,
  isLoading = false,
  style,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onSignIn?.({ email, password });
  };

  return (
    <Card elevated padding="lg" style={[styles.card, style]}>
      <View style={styles.header}>
        <Text variant="h2" style={styles.title}>
          Welcome back
        </Text>
        <Text variant="muted" style={styles.subtitle}>
          Enter your email to sign in to your account
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Label required>Email</Label>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <View style={styles.passwordRow}>
            <Label required>Password</Label>
            {onForgotPassword && (
              <Button
                variant="link"
                size="xs"
                onPress={onForgotPassword}
              >
                Forgot?
              </Button>
            )}
          </View>
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />
        </View>

        <Button
          variant="default"
          size="lg"
          loading={isLoading}
          onPress={handleSubmit}
          style={styles.submitBtn}
        >
          Sign in
        </Button>
      </View>

      <View style={styles.separatorContainer}>
        <Separator />
      </View>

      {onSignUp && (
        <View style={styles.footer}>
          <Text variant="muted">Don't have an account?</Text>
          <Button variant="link" size="sm" onPress={onSignUp}>
            Sign up
          </Button>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  field: {},
  passwordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  submitBtn: {
    marginTop: 8,
  },
  separatorContainer: {
    marginVertical: 24,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});

