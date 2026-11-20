/**
 * Nativra — Register Form Block (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add register-form
 */
import React from "react";
import { StyleSheet, View, type StyleProp, type TextInput, type ViewStyle } from "react-native";
import { Card } from "./Card";
import { Text } from "./Text";
import { Input } from "./Input";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Separator } from "./Separator";
import { sp, ts, useThemeColors } from "@/hooks/use-theme-colors";
import { useForm } from "@/hooks/use-form";

export interface RegisterValues {
  name: string;
  email: string;
  password: string;
}

export interface RegisterFormProps {
  /** Called with valid values. Return a promise to show the button's spinner until it settles. */
  onSubmit?: (values: RegisterValues) => void | Promise<void>;
  onSignIn?: () => void;
  /** Shows a terms checkbox that must be ticked, with this text. */
  termsLabel?: string;
  /** Minimum password length (default 8). */
  minPasswordLength?: number;
  /** Forces the loading state (e.g. while a parent submits). */
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm({
  onSubmit,
  onSignIn,
  termsLabel = "I agree to the Terms and Privacy Policy",
  minPasswordLength = 8,
  isLoading = false,
  style,
}: RegisterFormProps) {
  const c = useThemeColors();
  const [accepted, setAccepted] = React.useState(false);
  const [termsError, setTermsError] = React.useState(false);
  const emailRef = React.useRef<React.ComponentRef<typeof TextInput>>(null);
  const passwordRef = React.useRef<React.ComponentRef<typeof TextInput>>(null);
  const confirmRef = React.useRef<React.ComponentRef<typeof TextInput>>(null);

  const rules = React.useMemo(
    () => ({
      name: (v: string) => (v.trim() ? undefined : "Enter your name"),
      email: (v: string) => (EMAIL.test(v.trim()) ? undefined : "Enter a valid email"),
      password: (v: string) => (v.length >= minPasswordLength ? undefined : `At least ${minPasswordLength} characters`),
      confirm: (v: string, all: { password: string }) => (v === all.password ? undefined : "Passwords don't match"),
    }),
    [minPasswordLength]
  );
  const form = useForm({
    initialValues: { name: "", email: "", password: "", confirm: "" },
    rules,
    onSubmit: async ({ name, email, password }) => {
      await onSubmit?.({ name: name.trim(), email: email.trim(), password });
    },
  });

  const submit = () => {
    if (isLoading) return;
    if (termsLabel && !accepted) {
      setTermsError(true);
      // Show every field error at once, not only the terms.
      form.validate();
      return;
    }
    void form.handleSubmit();
  };
  const busy = isLoading || form.isSubmitting;

  return (
    <Card elevated padding="lg" style={[styles.card, style]}>
      <View style={styles.header}>
        <Text variant="h2" style={styles.center}>
          Create an account
        </Text>
        <Text variant="muted" style={styles.center}>
          It takes less than a minute
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Name"
          {...form.field("name")}
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <Input
          ref={emailRef}
          label="Email"
          {...form.field("email")}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <Input
          ref={passwordRef}
          label="Password"
          {...form.field("password")}
          secureTextEntry
          // Lets password managers offer a strong generated password.
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => confirmRef.current?.focus()}
        />
        <Input
          ref={confirmRef}
          label="Confirm password"
          {...form.field("confirm")}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={submit}
        />

        {termsLabel ? (
          <View style={styles.terms}>
            <Checkbox
              checked={accepted}
              onCheckedChange={(next) => {
                setAccepted(next);
                if (next) setTermsError(false);
              }}
              label={termsLabel}
            />
            {termsError ? (
              <Text accessibilityLiveRegion="polite" style={[styles.termsError, { color: c.destructive }]}>
                Accept the terms to continue
              </Text>
            ) : null}
          </View>
        ) : null}

        {form.submitError ? (
          <Text accessibilityLiveRegion="polite" style={[styles.termsError, { color: c.destructive }]}>
            {form.submitError.message || "Couldn't create the account. Try again."}
          </Text>
        ) : null}

        <Button variant="default" size="lg" loading={busy} onPress={submit} style={styles.submit}>
          Create account
        </Button>
      </View>

      {onSignIn ? (
        <>
          <Separator style={styles.separator} />
          <View style={styles.footer}>
            <Text variant="muted">Already have an account?</Text>
            <Button variant="link" size="sm" onPress={onSignIn}>
              Sign in
            </Button>
          </View>
        </>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { width: "100%", maxWidth: 380, alignSelf: "center" },
  header: { marginBottom: sp(24), gap: sp(4) },
  center: { textAlign: "center" },
  form: { gap: sp(16) },
  terms: { gap: sp(6) },
  termsError: { fontSize: ts(12) },
  submit: { marginTop: sp(4) },
  separator: { marginVertical: sp(24) },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: sp(4) },
});
