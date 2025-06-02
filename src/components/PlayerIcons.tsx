import React from 'react';
import { SvgXml } from 'react-native-svg';

const playIconXml = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <polygon points="26,20 26,44 46,32" fill="#fff"/>
</svg>`;

const pauseIconXml = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="22" y="20" width="8" height="24" fill="#fff"/>
  <rect x="34" y="20" width="8" height="24" fill="#fff"/>
</svg>`;

const backIconXml = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M38,20 L26,32 L38,44" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;


interface IconProps {
    size?: number;
}

export const PlayIcon: React.FC<IconProps> = ({ size = 24 }) => (
    <SvgXml xml={playIconXml} width={size} height={size} />
);

export const PauseIcon: React.FC<IconProps> = ({ size = 24 }) => (
    <SvgXml xml={pauseIconXml} width={size} height={size} />
);

export const BackIcon: React.FC<IconProps> = ({ size = 24 }) => (
    <SvgXml xml={backIconXml} width={size} height={size} />
); 