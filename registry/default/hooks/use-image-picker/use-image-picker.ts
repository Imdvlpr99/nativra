/** Nativra — useImagePicker. Install: npx nativra-cli add use-image-picker */
import { useCallback, useEffect, useRef, useState } from "react";
import { Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";

export type PickSource = "library" | "camera";
export type PickedImage = ImagePicker.ImagePickerAsset;

export interface UseImagePickerOptions {
  /** Crop to `aspect` after picking (one image only). */
  allowsEditing?: boolean;
  /** Crop ratio, e.g. [1, 1] for avatars. */
  aspect?: [number, number];
  /** 0–1 JPEG quality (default 0.8). */
  quality?: number;
  /** Pick several from the library (default 1). Ignored with allowsEditing or the camera. */
  selectionLimit?: number;
}

/**
 * Picks photos from the library or the camera, asking for permission first. When the user has
 * blocked access, `blocked` names the source and `openSettings()` sends them to fix it.
 */
export function useImagePicker({ allowsEditing = false, aspect, quality = 0.8, selectionLimit = 1 }: UseImagePickerOptions = {}) {
  const [images, setImages] = useState<PickedImage[]>([]);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [blocked, setBlocked] = useState<PickSource | null>(null);
  const busy = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  /** Resolves to the picked images, or null when cancelled, blocked or failed. */
  const pick = useCallback(
    async (source: PickSource = "library"): Promise<PickedImage[] | null> => {
      if (busy.current) return null;
      busy.current = true;
      setPicking(true);
      setError(null);
      try {
        const permission =
          source === "camera" ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          // Only "blocked" when the system won't ask again; a plain "no" can be asked again later.
          if (mounted.current) setBlocked(permission.canAskAgain ? null : source);
          return null;
        }
        if (mounted.current) setBlocked(null);
        const options: ImagePicker.ImagePickerOptions = {
          mediaTypes: ["images"],
          allowsEditing,
          quality,
          ...(aspect ? { aspect } : {}),
          ...(source === "library" && !allowsEditing && selectionLimit !== 1
            ? { allowsMultipleSelection: true, selectionLimit }
            : {}),
        };
        const result = source === "camera" ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
        if (result.canceled) return null;
        if (mounted.current) setImages(result.assets);
        return result.assets;
      } catch (err) {
        if (mounted.current) setError(err instanceof Error ? err : new Error(String(err)));
        return null;
      } finally {
        busy.current = false;
        if (mounted.current) setPicking(false);
      }
    },
    [allowsEditing, aspect, quality, selectionLimit]
  );

  const clear = useCallback(() => setImages([]), []);
  const openSettings = useCallback(() => Linking.openSettings(), []);

  return {
    /** The last picked images. */
    images,
    /** The first of them, for single-image pickers. */
    image: images[0] ?? null,
    picking,
    error,
    /** The source whose permission the user blocked, or null. */
    blocked,
    pick,
    clear,
    openSettings,
  };
}
