/** Nativra — useKeyboard. Install: npx nativra-cli add use-keyboard */
import { useEffect, useState } from "react";
import { Keyboard, Platform, type KeyboardEvent } from "react-native";

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

    // iOS sends "will" events as the keyboard starts moving, so layouts move with it; "did" events
    // arrive after the animation. Android only sends "did" events.
    const ios = Platform.OS === "ios";
    const showSub = Keyboard.addListener(ios ? "keyboardWillShow" : "keyboardDidShow", onShow);
    const hideSub = Keyboard.addListener(ios ? "keyboardWillHide" : "keyboardDidHide", onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return { isVisible, keyboardHeight, dismiss: Keyboard.dismiss };
}

