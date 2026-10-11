import { useState } from "react";
import { useWindowDimensions, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";

// Position checks don't need every frame, and a coarser rate keeps scrolling off the JS thread's back.
const SCROLL_EVENT_THROTTLE = 100;

/** Tells whether a list has scrolled more than a screen down, so it can offer a way back to the top. */
export function useScrollToTopVisibility() {
  const { height } = useWindowDimensions();
  const [visible, setVisible] = useState(false);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setVisible(event.nativeEvent.contentOffset.y > height);
  };

  return { visible, scrollProps: { onScroll, scrollEventThrottle: SCROLL_EVENT_THROTTLE } };
}
