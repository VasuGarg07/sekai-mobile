import { BlurTargetView, BlurView } from "expo-blur";
import { createContext, useContext, useRef, type ReactNode, type RefObject } from "react";
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";

import { useTheme } from "@/providers/theme-provider";
import { createStyles } from "@/theme/create-styles";

const BlurTargetContext = createContext<RefObject<View | null> | null>(null);
const InsideTargetContext = createContext(false);

interface ChildrenProps {
  children: ReactNode;
}

export function GlassScope({ children }: ChildrenProps) {
  const targetRef = useRef<View | null>(null);
  return (
    <BlurTargetContext.Provider value={targetRef}>
      <InsideTargetContext.Provider value={false}>{children}</InsideTargetContext.Provider>
    </BlurTargetContext.Provider>
  );
}

interface GlassBackdropProps extends ChildrenProps {
  style?: StyleProp<ViewStyle>;
}

/** The content that glass surfaces in the same scope blur. */
export function GlassBackdrop({ children, style }: GlassBackdropProps) {
  const targetRef = useContext(BlurTargetContext);
  if (!targetRef) return <View style={style}>{children}</View>;
  return (
    <BlurTargetView ref={targetRef} style={style}>
      <InsideTargetContext.Provider value>{children}</InsideTargetContext.Provider>
    </BlurTargetView>
  );
}

interface GlassViewProps extends ViewProps {
  strong?: boolean;
}

/**
 * Translucent, blurred surface. Outside a GlassScope, or on Android versions without RenderNode
 * blur (before 12), it falls back to the tinted fill alone, which still reads as frosted. Inside
 * the backdrop it also skips the blur: a blur view drawing the target that contains it recurses
 * until the render thread overflows its stack.
 */
export function GlassView({ strong = false, style, children, ...viewProps }: GlassViewProps) {
  const { glass } = useTheme();
  const styles = useStyles();
  const targetRef = useContext(BlurTargetContext);
  const insideTarget = useContext(InsideTargetContext);

  return (
    <View style={[styles.container, style]} {...viewProps}>
      {targetRef && !insideTarget && (
        <BlurView
          blurTarget={targetRef}
          blurMethod="dimezisBlurViewSdk31Plus"
          intensity={glass.intensity}
          tint={glass.tint}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={[StyleSheet.absoluteFill, strong ? styles.fillStrong : styles.fill]} />
      {children}
    </View>
  );
}

const useStyles = createStyles(({ glass }) => ({
  container: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: glass.border,
  },
  fill: {
    backgroundColor: glass.fill,
  },
  fillStrong: {
    backgroundColor: glass.fillStrong,
  },
}));
