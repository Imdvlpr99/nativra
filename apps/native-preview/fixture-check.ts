/**
 * Compile-time check that preview fixtures only pass props their component declares. Without it,
 * a renamed prop (isLoading -> loading) left a fixture showing the default state under a
 * "Loading" label, and nothing noticed. `pnpm typecheck` fails here naming "item: prop".
 *
 * Items with a custom renderer in App.tsx are skipped: the renderer reads the fixture itself.
 */
import type { ComponentProps } from "react";
import type { FixtureDefinitions } from "@nativra/preview-runtime";
import type { ITEM_COMPONENTS } from "./components/nativra/items";
import type { RENDERERS } from "./App";

type Components = typeof ITEM_COMPONENTS;
/** Every key of every member of a union (keyof a union only gives the shared ones). */
type KeysOf<T> = T extends unknown ? keyof T : never;
type Checked = Exclude<keyof FixtureDefinitions & keyof Components, keyof typeof RENDERERS>;
type UnknownProps<K extends Checked> = Exclude<
  KeysOf<FixtureDefinitions[K][number]["props"]>,
  keyof ComponentProps<Components[K]>
>;
type Offenders = { [K in Checked]: [UnknownProps<K>] extends [never] ? never : `${K}: ${UnknownProps<K> & string}` }[Checked];

export const fixturePropsMatchComponents: [Offenders] extends [never] ? true : Offenders = true;
