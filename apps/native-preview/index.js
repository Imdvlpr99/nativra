import { registerRootComponent } from "expo";
import { Platform } from "react-native";

// On web, ?item=<id> renders a single embeddable preview and ?playground runs a project sent by
// the docs playground; otherwise the full component gallery.
const search = Platform.OS === "web" && typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

registerRootComponent(
  search?.has("playground")
    ? require("./Playground").default
    : search?.has("item")
      ? require("./Embed").default
      : require("./App").default
);
