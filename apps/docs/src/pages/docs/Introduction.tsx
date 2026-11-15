import React from "react";
import { Seo } from "@/lib/head";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { countOfType } from "@/lib/data";
import { ITEM_TYPE_ORDER, TYPE_META, catalogHref } from "@/lib/item-types";
import { C, P, PageHeader, Section } from "@/components/ui/Prose";


const PATH = [
  { title: "Installation", href: "/docs/installation", body: "Run init and add your first component.", time: "2 min" },
  { title: "Quick start", href: "/docs/quickstart", body: "Build a sign-in screen, edit it, theme it, update it.", time: "5 min" },
  { title: "How it works", href: "/docs/principles", body: "Dependencies, import rewriting and the lockfile.", time: "4 min" },
  { title: "Updating & rollback", href: "/docs/updating", body: "Take registry fixes without losing your edits.", time: "5 min" },
];

export default function Introduction() {

  return (
    <>
      <Seo title={"Introduction"} description={"What Nativra is, who it is for, and how its registry and CLI copy React Native and Expo UI source into your project."} path="/docs" />
      <PageHeader
        eyebrow="Get started"
        title="Introduction"
        description="Nativra is a registry of React Native and Expo UI and a CLI that copies it into your project as source code you own."
      />

      <Section id="what" title="What you get">
        <P>
          <p>
            Run <C>npx nativra-cli add button</C> and a typed <C>Button.tsx</C> appears in your <C>components/ui</C> folder.
            It is not a wrapper around a package: it is the whole component, ready to read and change.
          </p>
          <ul>
            <li>
              <strong>Two styling targets.</strong> Every item has a NativeWind v4 version and a <C>StyleSheet</C> version with
              the same props. You pick one for the project.
            </li>
            <li>
              <strong>Safe updates.</strong> The CLI hashes what it writes, so it can tell your edits apart from the original
              and never overwrite them without asking.
            </li>
            <li>
              <strong>Themes.</strong> Components read semantic color tokens from one installed theme file, with light and dark
              palettes.
            </li>
          </ul>
        </P>
      </Section>

      <Section id="fit" title="Is it a good fit?">
        <P>
          <p>Nativra suits you if you:</p>
          <ul>
            <li>build with Expo or React Native and want consistent, accessible building blocks;</li>
            <li>would rather edit a component than fight a theming API to change it;</li>
            <li>want upstream fixes later without giving up your local changes.</li>
          </ul>
          <p>
            If you want a package you install once and never look inside, a traditional component library is simpler.
          </p>
        </P>
      </Section>

      <Section id="registry" title="What's in the registry">
        <ul className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {ITEM_TYPE_ORDER.filter((t) => countOfType(t) > 0).map((t) => (
            <li key={t} className="bg-background">
              <Link to={catalogHref(t)} className="group flex h-full flex-col gap-1 p-5 transition-colors hover:bg-surface">
                <span className="flex items-baseline justify-between">
                  <span className="font-semibold">{TYPE_META[t].plural}</span>
                  <span className="font-mono text-sm text-muted-foreground">{countOfType(t)}</span>
                </span>
                <span className="text-[15px] text-muted-foreground">{TYPE_META[t].blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="path" title="Recommended reading order">
        <P>
          <p>About fifteen minutes from nothing to a themed screen you know how to update:</p>
        </P>
        <ol className="divide-y divide-border border-y border-border">
          {PATH.map((s, i) => (
            <li key={s.href}>
              <Link to={s.href} className="group grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 py-4 transition-colors hover:bg-surface sm:px-2">
                <span className="font-mono text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-medium">{s.title}</span>
                  <span className="block text-[15px] text-muted-foreground">{s.body}</span>
                </span>
                <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  {s.time}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
