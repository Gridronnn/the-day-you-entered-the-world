import React from 'react';

// Green 12-point asterisk decal (matching reference image)
export const GreenAsteriskDecal: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[4px_4px_0px_#000000] select-none pointer-events-none ${className}`}
  >
    <path
      d="M50 0L58 35L93 15L73 50L100 65L65 65L65 100L50 73L35 100L35 65L0 65L27 50L7 15L42 35L50 0Z"
      fill="#22C55E"
      stroke="#000000"
      strokeWidth="5"
      strokeLinejoin="round"
    />
  </svg>
);

// Pink Zigzag ribbon decal (matching reference image)
export const PinkZigzagDecal: React.FC<{ className?: string; size?: number; color?: string }> = ({
  className = '',
  size = 64,
  color = '#FF4D8D',
}) => (
  <svg
    width={size}
    height={size * 0.45}
    viewBox="0 0 120 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[4px_4px_0px_#000000] select-none pointer-events-none ${className}`}
  >
    <path
      d="M10 44L38 10L68 44L98 10L112 24"
      stroke={color}
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 44L38 10L68 44L98 10L112 24"
      stroke="#000000"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Blue Donut / concentric ring decal (matching reference image)
export const BlueDonutDecal: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[4px_4px_0px_#000000] select-none pointer-events-none ${className}`}
  >
    <circle cx="40" cy="40" r="34" fill="#2563EB" stroke="#000000" strokeWidth="5" />
    <circle cx="40" cy="40" r="16" fill="#FFFDF0" stroke="#000000" strokeWidth="5" />
  </svg>
);

// Orange Wavy Blob decal (matching reference image)
export const OrangeWavyBlobDecal: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 60 }) => (
  <svg
    width={size}
    height={size * 0.7}
    viewBox="0 0 100 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[4px_4px_0px_#000000] select-none pointer-events-none ${className}`}
  >
    <path
      d="M10 60C10 60 15 20 30 20C45 20 40 5 55 5C70 5 70 30 85 30C100 30 90 60 90 60H10Z"
      fill="#FF7A00"
      stroke="#000000"
      strokeWidth="5"
      strokeLinejoin="round"
    />
  </svg>
);

// Yellow Semicircle decal (matching reference image)
export const YellowSemicircleDecal: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 50 }) => (
  <svg
    width={size}
    height={size * 0.6}
    viewBox="0 0 80 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[4px_4px_0px_#000000] select-none pointer-events-none ${className}`}
  >
    <path
      d="M5 42C5 18 20 5 40 5C60 5 75 18 75 42H5Z"
      fill="#FFE600"
      stroke="#000000"
      strokeWidth="5"
      strokeLinejoin="round"
    />
  </svg>
);

// Lilac 4-point Sparkle Star decal (matching reference image)
export const LilacSparkleDecal: React.FC<{ className?: string; size?: number; color?: string }> = ({
  className = '',
  size = 36,
  color = '#C084FC',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[3px_3px_0px_#000000] select-none pointer-events-none ${className}`}
  >
    <path
      d="M30 0C30 16 34 26 50 30C34 34 30 44 30 60C30 44 26 34 10 30C26 26 30 16 30 0Z"
      fill={color}
      stroke="#000000"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </svg>
);
