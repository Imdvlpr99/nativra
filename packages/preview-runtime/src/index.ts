/**
 * @nativra/preview-runtime — deterministic preview fixtures shared by Studio and
 * the native-preview app, so both render the same states.
 */
export type PreviewProps = Record<string, string | boolean | number>;

export interface PreviewFixture {
  name: string;
  props: PreviewProps;
}

export const PREVIEW_FIXTURES: Record<string, PreviewFixture[]> = {
  button: [
    { name: "Default", props: { children: "Button" } },
    { name: "Primary", props: { variant: "primary", children: "Primary" } },
    { name: "Destructive", props: { variant: "destructive", children: "Delete" } },
    { name: "Loading", props: { loading: true, children: "Saving" } },
    { name: "Disabled", props: { disabled: true, children: "Disabled" } },
  ],
  badge: [
    { name: "Default", props: { label: "New" } },
    { name: "Destructive", props: { variant: "destructive", label: "Error" } },
  ],
  input: [
    { name: "Basic", props: { label: "Email", placeholder: "you@example.com" } },
    { name: "Error", props: { label: "Email", error: true, errorMessage: "Invalid email" } },
    { name: "Disabled", props: { label: "Email", disabled: true } },
  ],
  card: [
    { name: "Flat", props: {} },
    { name: "Elevated", props: { elevated: true } },
  ],
  separator: [
    { name: "Horizontal", props: { orientation: "horizontal" } },
    { name: "Vertical", props: { orientation: "vertical" } },
  ],
  text: [
    { name: "Heading 1", props: { variant: "h1", children: "Heading 1" } },
    { name: "Heading 2", props: { variant: "h2", children: "Heading 2" } },
    { name: "Body", props: { variant: "p", children: "This is body copy for mobile apps." } },
    { name: "Muted", props: { variant: "muted", children: "Secondary helper text" } },
  ],
  label: [
    { name: "Standard", props: { children: "Email address" } },
    { name: "Required", props: { children: "Password", required: true } },
    { name: "Disabled", props: { children: "Disabled field", disabled: true } },
  ],
  checkbox: [
    { name: "Unchecked", props: { checked: false, label: "Accept terms" } },
    { name: "Checked", props: { checked: true, label: "Accept terms" } },
    { name: "Disabled", props: { checked: true, disabled: true, label: "Locked option" } },
  ],
  switch: [
    { name: "Off", props: { value: false } },
    { name: "On", props: { value: true } },
    { name: "Disabled", props: { value: true, disabled: true } },
  ],
  skeleton: [
    { name: "Text line", props: { width: 180, height: 16 } },
    { name: "Card skeleton", props: { width: 240, height: 80, radius: "md" } },
  ],
  spinner: [
    { name: "Small", props: { size: "sm" } },
    { name: "Medium", props: { size: "md" } },
    { name: "Large", props: { size: "lg" } },
  ],
  avatar: [
    { name: "Fallback initials", props: { fallback: "JD", size: "md" } },
    { name: "Small avatar", props: { fallback: "NV", size: "sm" } },
    { name: "Large avatar", props: { fallback: "AB", size: "lg" } },
  ],
};

export function getFixtures(id: string): PreviewFixture[] {
  return PREVIEW_FIXTURES[id] ?? [];
}

