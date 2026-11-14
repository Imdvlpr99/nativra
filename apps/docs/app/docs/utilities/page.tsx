import { CatalogPage, catalogMetadata } from "@/components/docs/CatalogPage";

export const metadata = catalogMetadata("utility");

export default function Page() {
  return <CatalogPage type="utility" />;
}
