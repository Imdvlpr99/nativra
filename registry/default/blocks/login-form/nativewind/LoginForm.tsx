/**
 * Nativra — Login Form Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add login-form
 */
import React, { useState } from "react";
import { View } from "react-native";
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
}

export function LoginForm({
  onSignIn,
  onForgotPassword,
  onSignUp,
  isLoading = false,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onSignIn?.({ email, password });
  };

  return (
    <Card elevated padding="lg" className="w-full max-w-sm">
      <View className="mb-6">
        <Text variant="h2" className="text-center mb-1">
          Welcome back
        </Text>
        <Text variant="muted" className="text-center">
          Enter your email to sign in to your account
        </Text>
      </View>

      <View className="gap-4">
        <View>
          <Label required>Email</Label>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <View className="flex-row items-center justify-between">
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
          className="mt-2"
        >
          Sign in
        </Button>
      </View>

      <View className="my-6">
        <Separator />
      </View>

      {onSignUp && (
        <View className="flex-row items-center justify-center gap-1">
          <Text variant="muted">Don't have an account?</Text>
          <Button variant="link" size="sm" onPress={onSignUp}>
            Sign up
          </Button>
        </View>
      )}
    </Card>
  );
}

