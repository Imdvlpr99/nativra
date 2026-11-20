/** Nativra — useForm. Install: npx nativra-cli add use-form */
import { useCallback, useMemo, useRef, useState } from "react";

/** Returns an error message, or undefined when the value is valid. */
export type FieldRule<V, K extends keyof V> = (value: V[K], values: V) => string | undefined;
export type FormRules<V> = { [K in keyof V]?: FieldRule<V, K> };
export type FormErrors<V> = { [K in keyof V]?: string };

export interface UseFormOptions<V extends Record<string, unknown>> {
  initialValues: V;
  rules?: FormRules<V>;
  /** Called with the values when every rule passes. A returned promise keeps `isSubmitting` true. */
  onSubmit: (values: V) => void | Promise<void>;
}

/** Props for a text field (Input, Textarea): spread them with `{...form.field("email")}`. */
export interface TextFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  error: boolean;
  errorMessage?: string;
}

/** Keys of V whose value is a string. */
type StringKeys<V> = { [K in keyof V]: V[K] extends string ? K : never }[keyof V];

function validateAll<V extends Record<string, unknown>>(values: V, rules: FormRules<V> | undefined): FormErrors<V> {
  const errors: FormErrors<V> = {};
  if (!rules) return errors;
  for (const key of Object.keys(rules) as Array<keyof V>) {
    const message = rules[key]?.(values[key], values);
    if (message) errors[key] = message;
  }
  return errors;
}

export function useForm<V extends Record<string, unknown>>({ initialValues, rules, onSubmit }: UseFormOptions<V>) {
  const [values, setValues] = useState<V>(initialValues);
  const [touched, setTouched] = useState<{ [K in keyof V]?: boolean }>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  // Read by handleSubmit, so a submit right after a change validates the newest values.
  const latest = useRef(values);
  latest.current = values;
  const submitting = useRef(false);

  const errors = useMemo(() => validateAll(values, rules), [values, rules]);
  const isValid = Object.keys(errors).length === 0;

  const setValue = useCallback(<K extends keyof V>(name: K, value: V[K]) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      latest.current = next;
      return next;
    });
  }, []);

  const setFieldTouched = useCallback((name: keyof V, isTouched = true) => {
    setTouched((prev) => (prev[name] === isTouched ? prev : { ...prev, [name]: isTouched }));
  }, []);

  /** The error to display: shown once the field was left, or after a submit attempt. */
  const errorFor = (name: keyof V): string | undefined => (touched[name] || submitted ? errors[name] : undefined);

  const field = (name: StringKeys<V>): TextFieldProps => {
    const message = errorFor(name);
    return {
      value: values[name] as string,
      onChangeText: (text: string) => setValue(name, text as V[StringKeys<V>]),
      onBlur: () => setFieldTouched(name),
      error: message !== undefined,
      ...(message !== undefined ? { errorMessage: message } : {}),
    };
  };

  /** Shows every field's error (as a submit attempt would) and returns whether the form is valid. */
  const validate = useCallback((): boolean => {
    setSubmitted(true);
    return Object.keys(validateAll(latest.current, rules)).length === 0;
  }, [rules]);

  const handleSubmit = useCallback(async () => {
    if (submitting.current) return;
    setSubmitted(true);
    const current = latest.current;
    if (Object.keys(validateAll(current, rules)).length > 0) return;
    submitting.current = true;
    setSubmitting(true);
    try {
      await onSubmit(current);
    } finally {
      submitting.current = false;
      setSubmitting(false);
    }
  }, [rules, onSubmit]);

  const reset = useCallback(
    (next: V = initialValues) => {
      latest.current = next;
      setValues(next);
      setTouched({});
      setSubmitted(false);
    },
    [initialValues]
  );

  return { values, errors, touched, isValid, isSubmitting, setValue, setFieldTouched, errorFor, field, validate, handleSubmit, reset };
}
