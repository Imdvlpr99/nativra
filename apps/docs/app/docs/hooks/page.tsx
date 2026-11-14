import { CatalogPage, catalogMetadata } from "@/components/docs/CatalogPage";

export const metadata = catalogMetadata("hook");

export default function Page() {
  return <CatalogPage type="hook" />;
}
