import * as React from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { cn } from "@/lib/utils";

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
  className?: string;
}

export function AuthFlow({
  initialStep = "login",
  appName = "Nativra Mobile",
  onSubmit,
  onSuccess,
  className,
}: AuthFlowProps) {
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
      contentContainerClassName="flex-grow justify-center p-6 bg-background"
      className={cn("w-full", className)}
    >
      <View className="w-full max-w-sm mx-auto space-y-6">
        {/* Header Branding */}
        <View className="items-center space-y-2">
          <View className="h-12 w-12 rounded-card bg-primary items-center justify-center shadow-lg shadow-primary/20">
            <Text className="text-xl font-black text-primary-foreground">NV</Text>
          </View>
          <Text className="text-2xl font-black text-foreground text-center">
            {step === "login" && `Welcome to ${appName}`}
            {step === "signup" && "Create an Account"}
            {step === "forgot" && "Reset Password"}
            {step === "otp" && "Verify Code"}
          </Text>
          <Text className="text-xs text-muted-foreground text-center">
            {step === "login" && "Enter your credentials to access your mobile workspace."}
            {step === "signup" && "Join thousands of developers building native UI."}
            {step === "forgot" && "We will send a 6-digit one-time code to your email."}
            {step === "otp" && `Enter the 6-digit code sent to ${email || "your email"}.`}
          </Text>
        </View>

        {/* Form Body */}
        <View className="rounded-card border border-border bg-card p-6 shadow-xl space-y-4">
          {step === "signup" && (
            <View className="space-y-1.5">
              <Text className="text-xs font-semibold text-foreground">Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                accessibilityLabel="Full name"
                autoComplete="name"
                textContentType="name"
                placeholder="Alex Morgan"
                className="w-full rounded-control border border-border bg-background px-3.5 py-2.5 text-sm text-foreground"
              />
            </View>
          )}

          {(step === "login" || step === "signup" || step === "forgot") && (
            <View className="space-y-1.5">
              <Text className="text-xs font-semibold text-foreground">Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCorrect={false}
                accessibilityLabel="Email address"
                autoComplete="email"
                textContentType="emailAddress"
                autoCapitalize="none"
                placeholder="alex@example.com"
                className="w-full rounded-control border border-border bg-background px-3.5 py-2.5 text-sm text-foreground"
              />
            </View>
          )}

          {(step === "login" || step === "signup") && (
            <View className="space-y-1.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-semibold text-foreground">Password</Text>
                {step === "login" && (
                  <Pressable accessibilityRole="button" onPress={() => goTo("forgot")}>
                    <Text className="text-[11px] font-medium text-primary">Forgot?</Text>
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
                className="w-full rounded-control border border-border bg-background px-3.5 py-2.5 text-sm text-foreground"
              />
            </View>
          )}

          {step === "otp" && (
            <View className="space-y-2 py-2">
              <View className="flex-row justify-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <View
                    key={idx}
                    className="h-12 w-10 items-center justify-center rounded-control border-2 border-border bg-background"
                  >
                    <Text className="text-lg font-bold font-mono text-foreground">
                      {otp[idx] ?? ""}
                    </Text>
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
                className="w-full rounded-control border border-border bg-background px-3 py-2 text-center text-xs text-foreground"
              />
            </View>
          )}

          {error ? (
            <Text accessibilityRole="alert" className="text-[13px] leading-[18px] text-destructive">
              {error}
            </Text>
          ) : null}

          {/* Submit Action */}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: loading || !canSubmit, busy: loading }}
            disabled={loading || !canSubmit}
            onPress={handleSubmit}
            className={cn(
              "w-full items-center justify-center rounded-control bg-primary py-3 shadow-md shadow-primary/20 active:scale-95 transition-all",
              !canSubmit && "opacity-50"
            )}
          >
            <Text className="text-sm font-bold text-primary-foreground">
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

        {/* Footer Toggle Navigation */}
        <View className="flex-row items-center justify-center gap-1.5 text-xs">
          <Text className="text-muted-foreground text-xs">
            {step === "login" ? "Don't have an account?" : "Already have an account?"}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => goTo(step === "login" ? "signup" : "login")}
          >
            <Text className="text-xs font-bold text-primary">
              {step === "login" ? "Sign Up" : "Sign In"}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

