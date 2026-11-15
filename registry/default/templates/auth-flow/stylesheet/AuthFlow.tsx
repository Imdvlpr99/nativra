import * as React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { themeStyle, useThemeColors, type ThemeColors, elevation } from "@/hooks/use-theme-colors";

export type AuthStep = "login" | "signup" | "forgot" | "otp";

export interface AuthValues {
  email: string;
  password: string;
  name: string;
  otp: string;
}

export interface AuthFlowProps {
  initialStep?: AuthStep;
  appName?: string;
  /**
   * Runs the step against your auth backend: sign in, create the account, send or verify the
   * code. Throw (or reject) with an Error to show its message and stay on the step. Without it
   * the form only demonstrates the flow and accepts any input, so always pass it in an app.
   */
  onSubmit?: (step: AuthStep, values: AuthValues) => Promise<void> | void;
  /** Called after sign-in or code verification succeeds. */
  onSuccess?: (details: { email: string }) => void;
  style?: StyleProp<ViewStyle>;
}

export function AuthFlow({
  initialStep = "login",
  appName = "Nativra Mobile",
  onSubmit,
  onSuccess,
  style,
}: AuthFlowProps) {
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
  const [step, setStep] = React.useState<AuthStep>(initialStep);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const mounted = React.useRef(true);
  React.useEffect(
    () => () => {
      mounted.current = false;
    },
    []
  );
  React.useEffect(() => {
    if (__DEV__ && !onSubmit) {
      console.warn("AuthFlow: no onSubmit prop, so any credentials are accepted. Pass onSubmit to call your auth backend.");
    }
  }, [onSubmit]);

  const canSubmit =
    step === "otp"
      ? otp.length === 6
      : email.trim() !== "" && (step === "forgot" || password !== "") && (step !== "signup" || name.trim() !== "");

  const goTo = (next: AuthStep) => {
    setError(null);
    setStep(next);
  };

  const handleSubmit = async () => {
    if (loading || !canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit?.(step, { email: email.trim(), password, name: name.trim(), otp });
      if (!mounted.current) return;
      if (step === "login" || step === "otp") onSuccess?.({ email: email.trim() });
      else setStep("otp");
    } catch (err) {
      if (mounted.current) setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={[styles.container, style]}
    >
      <View style={styles.contentWrap}>
        {/* Header Branding */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>NV</Text>
          </View>
          <Text style={styles.titleText}>
            {step === "login" && `Welcome to ${appName}`}
            {step === "signup" && "Create an Account"}
            {step === "forgot" && "Reset Password"}
            {step === "otp" && "Verify Code"}
          </Text>
          <Text style={styles.subtitleText}>
            {step === "login" && "Enter your credentials to access your mobile workspace."}
            {step === "signup" && "Join thousands of developers building native UI."}
            {step === "forgot" && "We will send a 6-digit one-time code to your email."}
            {step === "otp" && `Enter the 6-digit code sent to ${email || "your email"}.`}
          </Text>
        </View>

        {/* Form Card Body */}
        <View style={styles.card}>
          {step === "signup" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                accessibilityLabel="Full name"
                autoComplete="name"
                textContentType="name"
                placeholder="Alex Morgan"
                style={styles.input}
              />
            </View>
          )}

          {(step === "login" || step === "signup" || step === "forgot") && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Email address"
                autoComplete="email"
                textContentType="emailAddress"
                placeholder="alex@example.com"
                style={styles.input}
              />
            </View>
          )}

          {(step === "login" || step === "signup") && (
            <View style={styles.inputGroup}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Password</Text>
                {step === "login" && (
                  <Pressable accessibilityRole="button" onPress={() => goTo("forgot")}>
                    <Text style={styles.forgotText}>Forgot?</Text>
                  </Pressable>
                )}
              </View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                accessibilityLabel="Password"
                autoComplete={step === "signup" ? "new-password" : "current-password"}
                textContentType={step === "signup" ? "newPassword" : "password"}
                placeholder="••••••••"
                style={styles.input}
              />
            </View>
          )}

          {step === "otp" && (
            <View style={styles.otpSection}>
              <View style={styles.otpGrid}>
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <View key={idx} style={styles.otpCell}>
                    <Text style={styles.otpDigit}>{otp[idx] ?? ""}</Text>
                  </View>
                ))}
              </View>
              <TextInput
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                accessibilityLabel="Verification code"
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                placeholder="Type 6 digits..."
                style={[styles.input, styles.otpInputHidden]}
              />
            </View>
          )}

          {error ? (
            <Text accessibilityRole="alert" style={styles.errorText}>
              {error}
            </Text>
          ) : null}

          {/* Submit Action */}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: loading || !canSubmit, busy: loading }}
            disabled={loading || !canSubmit}
            onPress={handleSubmit}
            style={({ pressed }) => [styles.submitBtn, !canSubmit && styles.submitDisabled, pressed && styles.btnPressed]}
          >
            <Text style={styles.submitBtnText}>
              {loading
                ? "Processing..."
                : step === "login"
                ? "Sign In"
                : step === "signup"
                ? "Create Account"
                : step === "forgot"
                ? "Send Reset Code"
                : "Verify & Enter"}
            </Text>
          </Pressable>
        </View>

        {/* Footer Navigation */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            {step === "login" ? "Don't have an account?" : "Already have an account?"}
          </Text>
          <Pressable accessibilityRole="button" onPress={() => goTo(step === "login" ? "signup" : "login")}>
            <Text style={styles.switchAuthText}>
              {step === "login" ? "Sign Up" : "Sign In"}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 24 },
  contentWrap: { width: "100%", maxWidth: 380, alignSelf: "center", gap: 24 },
  header: { alignItems: "center", gap: 8 },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: themeStyle.radius.card,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: { color: palette["primary-foreground"], fontSize: 20, fontWeight: "900" },
  titleText: { fontSize: 22, fontWeight: "900", color: palette.foreground, textAlign: "center" },
  subtitleText: { fontSize: 13, color: palette["muted-foreground"], textAlign: "center", lineHeight: 18 },
  card: {
    backgroundColor: palette.card,
    borderRadius: themeStyle.radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 24,
    gap: 16,
    ...elevation("card"),
  },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: "700", color: palette.foreground },
  input: {
    width: "100%",
    borderRadius: themeStyle.radius.control,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.background,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: palette.foreground,
  },
  passwordHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  forgotText: { fontSize: 12, fontWeight: "600", color: palette.primary },
  otpSection: { gap: 12, alignItems: "center" },
  otpGrid: { flexDirection: "row", gap: 8 },
  otpCell: {
    width: 40,
    height: 48,
    borderRadius: themeStyle.radius.control,
    borderWidth: 2,
    borderColor: palette.border,
    backgroundColor: palette.background,
    alignItems: "center",
    justifyContent: "center",
  },
  otpDigit: { fontSize: 18, fontWeight: "700", color: palette.foreground, fontFamily: "monospace" },
  otpInputHidden: { textAlign: "center", fontSize: 12 },
  submitBtn: {
    width: "100%",
    borderRadius: themeStyle.radius.button,
    backgroundColor: palette.primary,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  btnPressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
  submitDisabled: { opacity: 0.5 },
  errorText: { color: palette.destructive, fontSize: 13, lineHeight: 18 },
  submitBtnText: { color: palette["primary-foreground"], fontWeight: "700", fontSize: 14 },
  footerRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6 },
  footerText: { fontSize: 13, color: palette["muted-foreground"] },
  switchAuthText: { fontSize: 13, fontWeight: "700", color: palette.primary },
});

