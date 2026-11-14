import { CatalogPage, catalogMetadata } from "@/components/docs/CatalogPage";

export const metadata = catalogMetadata("theme");

export default function Page() {
  return <CatalogPage type="theme" />;
}
