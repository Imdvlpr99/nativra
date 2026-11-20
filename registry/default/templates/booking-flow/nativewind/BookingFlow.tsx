/**
 * Nativra — Booking Flow Template (NativeWind)
 * @version 0.1.0
 * @target nativewind
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
import { ts, useThemeColors } from "@/hooks/use-theme-colors";

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
  const palette = useThemeColors();
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
      <SafeArea className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center p-6 sp-gap-3">
          <View className="h-20 w-20 rounded-full items-center justify-center bg-primary/10 mb-2">
            <CalendarCheck size={ts(36)} color={palette.primary} />
          </View>
          <Text accessibilityRole="header" className="type-2xl weight-title text-foreground">
            You're booked
          </Text>
          <Text className="type-base text-muted-foreground text-center mb-4">
            {service.name} on {whenLabel}. We'll text {e164} a reminder.
          </Text>
          <Button variant="primary" size="lg" onPress={onDone} className="self-stretch">
            Done
          </Button>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea className="flex-1 bg-background">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View className="flex-row items-center justify-between px-3 py-2.5">
          {step > 0 ? (
            <Pressable onPress={() => setStep(step - 1)} accessibilityRole="button" accessibilityLabel="Back" hitSlop={8} className="active:opacity-70">
              <ChevronLeft size={ts(24)} color={palette.foreground} />
            </Pressable>
          ) : (
            <View style={{ width: ts(24) }} />
          )}
          <Text className="type-sm weight-label text-muted-foreground">
            Step {step + 1} of {STEPS.length} · {STEPS[step]}
          </Text>
          <View style={{ width: ts(24) }} />
        </View>
        <Progress value={((step + 1) / STEPS.length) * 100} className="mx-4" />

        <ScrollView contentContainerClassName="p-4 sp-gap-3" keyboardShouldPersistTaps="handled">
          <Text accessibilityRole="header" className="type-2xl weight-title text-foreground">
            {step === 0 ? "Pick a time" : step === 1 ? "Your details" : "Check and confirm"}
          </Text>
          <Text className="type-sm text-muted-foreground mb-2">
            {service.name} · {service.duration} min · {service.price}
          </Text>

          {step === 0 ? (
            <>
              <DatePicker label="Date" value={date} onChange={setDate} minDate={todayIso()} {...(locale ? { locale } : {})} />
              <Text className="type-sm weight-label text-foreground mt-2">Available times</Text>
              {slots === null ? (
                <Text className="type-sm text-muted-foreground">Loading times…</Text>
              ) : slots.length === 0 ? (
                <Text className="type-sm text-muted-foreground">No free times this day. Try another date.</Text>
              ) : (
                <View className="flex-row flex-wrap sp-gap-2" accessibilityRole="radiogroup" accessibilityLabel="Available times">
                  {slots.map((s) => (
                    <Chip key={s} label={s} selected={s === time} onPress={() => setTime(s)} accessibilityRole="radio" accessibilityState={{ checked: s === time }} aria-checked={s === time} />
                  ))}
                </View>
              )}
            </>
          ) : null}

          {step === 1 ? (
            <View className="sp-gap-4">
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
            <Card padding="lg" className="sp-gap-3">
              {[
                ["Service", `${service.name} (${service.duration} min)`],
                ["When", whenLabel],
                ["Name", name.trim()],
                ["Phone", e164],
                ...(notes.trim() ? [["Notes", notes.trim()]] : []),
                ["Price", service.price],
              ].map(([k, v]) => (
                <View key={k} className="flex-row justify-between sp-gap-4">
                  <Text className="type-sm text-muted-foreground">{k}</Text>
                  <Text className="flex-1 text-right type-sm weight-label text-foreground">{v}</Text>
                </View>
              ))}
              {error ? (
                <Text accessibilityLiveRegion="polite" className="type-sm text-destructive">
                  {error}
                </Text>
              ) : null}
            </Card>
          ) : null}
        </ScrollView>

        <View className="p-4 border-border" style={{ borderTopWidth: StyleSheet.hairlineWidth }}>
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
