import type { ReactNode } from "react";
import Svg, { Circle, Path, Rect, Text as SvgText } from "react-native-svg";

interface GenreIconProps {
  genre: string;
  size: number;
  color: string;
}

type Shape = (color: string) => ReactNode;

const GENRE_SHAPES: Record<string, Shape> = {
  action: () => <Path d="M13 2 4 14h7l-1 8 10-13h-7z" />,
  adventure: () => (
    <>
      <Circle cx={12} cy={12} r={9} />
      <Path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  comedy: (color) => (
    <>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M8 14c1 3 7 3 8 0" />
      <Circle cx={9} cy={9.5} r={1} fill={color} />
      <Circle cx={15} cy={9.5} r={1} fill={color} />
    </>
  ),
  drama: () => (
    <>
      <Path d="M5 4h14v7a7 7 0 0 1-14 0z" />
      <Path d="M8 9h2M14 9h2M9 16c1.5-2 4.5-2 6 0" />
    </>
  ),
  ecchi: () => (
    <>
      <Path d="M3 12c3-5 7-4 9-2 2-2 6-3 9 2" />
      <Path d="M3 12c4 7 14 7 18 0" />
      <Path d="M3 12c5 1.5 13 1.5 18 0" />
    </>
  ),
  fantasy: () => (
    <>
      <Path d="M4 21V6h3v3h3V6h4v3h3V6h3v15z" />
      <Path d="M10 21v-4a2 2 0 0 1 4 0v4" />
    </>
  ),
  hentai: (color) => (
    <>
      <Circle cx={12} cy={12} r={9} />
      <SvgText x={12} y={15.5} fontSize={9.5} fontWeight="700" textAnchor="middle" fill={color} stroke="none">
        18+
      </SvgText>
    </>
  ),
  horror: (color) => (
    <>
      <Path d="M5 21V11a7 7 0 0 1 14 0v10l-2.33-2-2.34 2-2.33-2-2.33 2-2.34-2z" />
      <Circle cx={9.5} cy={11} r={1.2} fill={color} />
      <Circle cx={14.5} cy={11} r={1.2} fill={color} />
    </>
  ),
  "mahou shoujo": () => (
    <>
      <Path d="m4 20 9-9" />
      <Path d="m18 3 1.2 3.8L23 8l-3.8 1.2L18 13l-1.2-3.8L13 8l3.8-1.2z" />
      <Path d="M6 2v5M3.5 4.5h5" />
    </>
  ),
  mecha: (color) => (
    <>
      <Rect x={5} y={8} width={14} height={11} rx={2} />
      <Path d="M12 8V5M3 12v4M21 12v4M9.5 17h5" />
      <Circle cx={12} cy={3.5} r={1} fill={color} />
      <Circle cx={9} cy={13} r={1.3} fill={color} />
      <Circle cx={15} cy={13} r={1.3} fill={color} />
    </>
  ),
  music: () => (
    <>
      <Path d="M9 18V5l12-2v13" />
      <Circle cx={6} cy={18} r={3} />
      <Circle cx={18} cy={16} r={3} />
    </>
  ),
  mystery: () => (
    <>
      <Circle cx={10.5} cy={10.5} r={6.5} />
      <Path d="m15.5 15.5 5.5 5.5" />
    </>
  ),
  psychological: () => <Path d="M12 12a1.5 1.5 0 0 1 3 0 3.5 3.5 0 0 1-7 0 5.5 5.5 0 0 1 11 0 7.5 7.5 0 0 1-15 0" />,
  romance: (color) => (
    <Path
      d="M12 21C5 15.5 3 12 3 8.5a4.5 4.5 0 0 1 9-2 4.5 4.5 0 0 1 9 2C21 12 19 15.5 12 21z"
      fill={color}
    />
  ),
  "sci-fi": () => (
    <>
      <Path d="M12 2c3.5 2.5 5 6.5 5 11v3H7v-3c0-4.5 1.5-8.5 5-11z" />
      <Circle cx={12} cy={9.5} r={1.8} />
      <Path d="M7 12.5 4 16.5V19l3-2M17 12.5l3 4V19l-3-2M10 19c.5 2 3.5 2 4 0" />
    </>
  ),
  "slice of life": () => (
    <>
      <Path d="M4 9h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
      <Path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3v3M12 3v3" />
    </>
  ),
  sports: () => (
    <>
      <Path d="M7 4h10v6a5 5 0 0 1-10 0z" />
      <Path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 15v4M8 20h8" />
    </>
  ),
  supernatural: () => (
    <>
      <Path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
      <Path d="M17 3v4M15 5h4" />
    </>
  ),
  thriller: () => (
    <>
      <Path d="M2 12c3-5.5 6.5-7 10-7s7 1.5 10 7c-3 5.5-6.5 7-10 7s-7-1.5-10-7z" />
      <Circle cx={12} cy={12} r={3} />
    </>
  ),
};

const FALLBACK_SHAPE: Shape = () => (
  <>
    <Rect x={4} y={4} width={6.5} height={6.5} rx={1.5} />
    <Rect x={13.5} y={4} width={6.5} height={6.5} rx={1.5} />
    <Rect x={4} y={13.5} width={6.5} height={6.5} rx={1.5} />
    <Rect x={13.5} y={13.5} width={6.5} height={6.5} rx={1.5} />
  </>
);

/** Line icon drawn for each AniList genre; unknown genres get a generic grid. */
export function GenreIcon({ genre, size, color }: GenreIconProps) {
  const shape = GENRE_SHAPES[genre.toLowerCase()] ?? FALLBACK_SHAPE;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shape(color)}
    </Svg>
  );
}
