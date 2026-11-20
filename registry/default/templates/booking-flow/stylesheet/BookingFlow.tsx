/**
 * Nativra — Booking Flow Template (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add booking-flow
 */
import React from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CalendarCheck, ChevronLeft } from "lucide-react-native";
import { SafeArea } from "./SafeArea";
import { Button } from "./Button";
import { Card } from "./Card";
import { Chip } from "./Chip";
import { DatePicker } from "./DatePicker";
import { Input } from "./Input";
import { PhoneInput, toE164 } from "./PhoneInput";
import { Progress } from "./Progress";
import { Textarea } from "./Textarea";
import { type ThemeColors, alpha, pressedStyle, sp, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";

export interface BookingService {
  name: string;
  /** Minutes */
  duration: number;
  /** Formatted price, e.g. "$45". */
  price: string;
}

export interface Booking {
  service: BookingService;
  /** "YYYY-MM-DD" */
  date: string;
  /** "HH:mm" */
  time: string;
  name: string;
  /** E.164, e.g. "+14155550100" */
  phone: string;
  notes: string;
}

export interface BookingFlowProps {
  service?: BookingService;
  /** Free "HH:mm" slots for a "YYYY-MM-DD" day. Defaults to demo slots. */
  getSlots?: (date: string) => string[] | Promise<string[]>;
  /** Called on confirm; a rejection shows its message and keeps the user on the summary. */
  onConfirm?: (booking: Booking) => Promise<void> | void;
  onDone?: () => void;
  /** BCP 47 locale for the summary (default: the device's). */
  locale?: string;
}

const STEPS = ["When", "Details", "Confirm"] as const;
const pad = (n: number) => String(n).padStart(2, "0");
const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** Demo availability: half-hour slots 09:00–17:00, a few taken depending on the day. */
function demoSlots(date: string): string[] {
  const seed = Number(date.slice(-2));
  const slots: string[] = [];
  for (let m = 9 * 60; m < 17 * 60; m += 30) if ((m / 30 + seed) % 4 !== 0) slots.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  return slots;
}

export function BookingFlow({
  service = { name: "Haircut & style", duration: 45, price: "$45" },
  getSlots = demoSlots,
  onConfirm,
  onDone,
  locale,
}: BookingFlowProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [step, setStep] = React.useState(0);
  const [date, setDate] = React.useState(todayIso);
  const [slots, setSlots] = React.useState<string[] | null>(null);
  const [time, setTime] = React.useState<string | null>(null);
  const [name, setName] = React.useState("");
  const [country, setCountry] = React.useState("US");
  const [phone, setPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [triedDetails, setTriedDetails] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Read through a ref: an inline getSlots arrow must not refetch on every render.
  const getSlotsRef = React.useRef(getSlots);
  getSlotsRef.current = getSlots;

  // Slots for the chosen day; a late answer for a previous day is ignored.
  React.useEffect(() => {
    let current = true;
    setSlots(null);
    setTime(null);
    Promise.resolve()
      .then(() => getSlotsRef.current(date))
      .then((s) => {
        if (current) setSlots(s);
      })
      .catch(() => {
        if (current) setSlots([]);
      });
    return () => {
      current = false;
    };
  }, [date]);

  const e164 = toE164(country, phone);
  const detailsValid = name.trim().length > 0 && e164.length >= 8;
  const when = new Date(`${date}T${time ?? "00:00"}`);
  const whenLabel = `${when.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })} · ${when.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })}`;

  const confirm = async () => {
    if (!time) return;
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm?.({ service, date, time, name: name.trim(), phone: e164, notes: notes.trim() });
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't book. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <SafeArea style={styles.safe}>
        <View style={styles.done}>
          <View style={styles.doneIcon}>
            <CalendarCheck size={ts(36)} color={c.primary} />
          </View>
          <Text accessibilityRole="header" style={styles.title}>
            You're booked
          </Text>
          <Text style={styles.doneText}>
            {service.name} on {whenLabel}. We'll text {e164} a reminder.
          </Text>
          <Button variant="primary" size="lg" onPress={onDone} style={styles.full}>
            Done
          </Button>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.header}>
          {step > 0 ? (
            <Pressable onPress={() => setStep(step - 1)} accessibilityRole="button" accessibilityLabel="Back" hitSlop={8} style={({ pressed }) => pressedStyle(pressed)}>
              <ChevronLeft size={ts(24)} color={c.foreground} />
            </Pressable>
          ) : (
            <View style={styles.headerSpacer} />
          )}
          <Text style={styles.stepLabel}>
            Step {step + 1} of {STEPS.length} · {STEPS[step]}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <Progress value={((step + 1) / STEPS.length) * 100} style={styles.progress} />

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text accessibilityRole="header" style={styles.title}>
            {step === 0 ? "Pick a time" : step === 1 ? "Your details" : "Check and confirm"}
          </Text>
          <Text style={styles.subtitle}>
            {service.name} · {service.duration} min · {service.price}
          </Text>

          {step === 0 ? (
            <>
              <DatePicker label="Date" value={date} onChange={setDate} minDate={todayIso()} {...(locale ? { locale } : {})} />
              <Text style={styles.section}>Available times</Text>
              {slots === null ? (
                <Text style={styles.muted}>Loading times…</Text>
              ) : slots.length === 0 ? (
                <Text style={styles.muted}>No free times this day. Try another date.</Text>
              ) : (
                <View style={styles.slots} accessibilityRole="radiogroup" accessibilityLabel="Available times">
                  {slots.map((s) => (
                    <Chip key={s} label={s} selected={s === time} onPress={() => setTime(s)} accessibilityRole="radio" accessibilityState={{ checked: s === time }} aria-checked={s === time} />
                  ))}
                </View>
              )}
            </>
          ) : null}

          {step === 1 ? (
            <View style={styles.form}>
              <Input label="Full name" value={name} onChangeText={setName} autoComplete="name" textContentType="name" error={triedDetails && !name.trim()} errorMessage="Enter your name" />
              <PhoneInput
                label="Mobile number"
                country={country}
                onCountryChange={(x) => setCountry(x.code)}
                value={phone}
                onChangeText={setPhone}
                error={triedDetails && e164.length < 8}
                errorMessage="Enter a phone number for the reminder"
              />
              <Textarea label="Notes (optional)" value={notes} onChangeText={setNotes} rows={3} placeholder="Anything we should know?" />
            </View>
          ) : null}

          {step === 2 ? (
            <Card padding="lg" style={styles.summary}>
              {[
                ["Service", `${service.name} (${service.duration} min)`],
                ["When", whenLabel],
                ["Name", name.trim()],
                ["Phone", e164],
                ...(notes.trim() ? [["Notes", notes.trim()]] : []),
                ["Price", service.price],
              ].map(([k, v]) => (
                <View key={k} style={styles.summaryRow}>
                  <Text style={styles.muted}>{k}</Text>
                  <Text style={styles.summaryValue}>{v}</Text>
                </View>
              ))}
              {error ? (
                <Text accessibilityLiveRegion="polite" style={styles.error}>
                  {error}
                </Text>
              ) : null}
            </Card>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          {step === 0 ? (
            <Button variant="primary" size="lg" disabled={!time} onPress={() => setStep(1)}>
              {time ? `Continue · ${time}` : "Pick a time"}
            </Button>
          ) : step === 1 ? (
            <Button
              variant="primary"
              size="lg"
              onPress={() => {
                setTriedDetails(true);
                if (detailsValid) setStep(2);
              }}
            >
              Review booking
            </Button>
          ) : (
            <Button variant="primary" size="lg" loading={submitting} onPress={() => void confirm()}>
              Confirm booking · {service.price}
            </Button>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    flex: { flex: 1 },
    full: { alignSelf: "stretch" },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: sp(12), paddingVertical: sp(10) },
    headerSpacer: { width: ts(24) },
    stepLabel: { fontSize: ts(13), color: c["muted-foreground"], fontWeight: themeStyle.fontWeight.label },
    progress: { marginHorizontal: sp(16) },
    content: { padding: sp(16), gap: sp(12) },
    title: { fontSize: ts(24), fontWeight: themeStyle.fontWeight.title, color: c.foreground },
    subtitle: { fontSize: ts(14), color: c["muted-foreground"], marginBottom: sp(8) },
    section: { fontSize: ts(14), fontWeight: themeStyle.fontWeight.label, color: c.foreground, marginTop: sp(8) },
    muted: { fontSize: ts(14), color: c["muted-foreground"] },
    slots: { flexDirection: "row", flexWrap: "wrap", gap: sp(8) },
    form: { gap: sp(16) },
    summary: { gap: sp(12) },
    summaryRow: { flexDirection: "row", justifyContent: "space-between", gap: sp(16) },
    summaryValue: { flex: 1, textAlign: "right", fontSize: ts(14), color: c.foreground, fontWeight: themeStyle.fontWeight.label },
    error: { fontSize: ts(13), color: c.destructive },
    footer: { padding: sp(16), borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border },
    done: { flex: 1, alignItems: "center", justifyContent: "center", padding: sp(24), gap: sp(12) },
    doneIcon: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", backgroundColor: alpha(c.primary, 0.12), marginBottom: sp(8) },
    doneText: { fontSize: ts(15), color: c["muted-foreground"], textAlign: "center", marginBottom: sp(16) },
  });
