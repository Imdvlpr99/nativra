import { CatalogPage, catalogMetadata } from "@/components/docs/CatalogPage";

export const metadata = catalogMetadata("block");

export default function Page() {
  return <CatalogPage type="block" />;
}
