import { registerRootComponent } from "expo";
import { Platform } from "react-native";

// On web, ?item=<id> renders a single embeddable preview (used by the docs site);
// otherwise the full component gallery.
const embed =
  Platform.OS === "web" && typeof window !== "undefined" && new URLSearchParams(window.location.search).has("item");

registerRootComponent(embed ? require("./Embed").default : require("./App").default);
