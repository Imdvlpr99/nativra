import { itemRoute } from "@/components/docs/ItemPage";

const route = itemRoute("theme");

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
