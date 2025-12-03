export type ThemeColor = 'gold' | 'diamond' | 'patriot';

export interface TreeState {
  rotationSpeed: number;
  lightIntensity: number;
  theme: ThemeColor;
  isSnowing: boolean;
  useCamera: boolean;
}

export interface OrnamentProps {
  position: [number, number, number];
  color: string;
  scale?: number;
  type?: 'ball' | 'star' | 'diamond';
}