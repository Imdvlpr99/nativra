/** Nativra — useKeyboard. Install: npx nativra add use-keyboard */
import { useEffect, useState } from "react";
import { Keyboard, type KeyboardEvent } from "react-native";

export function useKeyboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const onShow = (e: KeyboardEvent) => {
      setIsVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
    };

    const onHide = () => {
      setIsVisible(false);
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener("keyboardDidShow", onShow);
    const hideSub = Keyboard.addListener("keyboardDidHide", onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return { isVisible, keyboardHeight, dismiss: Keyboard.dismiss };
}

