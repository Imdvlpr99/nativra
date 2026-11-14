import { CatalogPage, catalogMetadata } from "@/components/docs/CatalogPage";

export const metadata = catalogMetadata("template");

export default function Page() {
  return <CatalogPage type="template" />;
}
