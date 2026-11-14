import { CatalogPage, catalogMetadata } from "@/components/docs/CatalogPage";

export const metadata = catalogMetadata("component");

export default function Page() {
  return <CatalogPage type="component" />;
}
