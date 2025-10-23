import React from 'react';
// FIX: Import `TreasureType` to resolve missing type errors.
import { TreasureType } from '../types';

export const ExcavatorIcon: React.FC<{ className?: string; isDigging?: boolean; isMoving?: boolean }> = ({ className, isDigging, isMoving }) => (
  <svg viewBox="0 0 200 150" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <g id="tread-circles">
        {/* Original 4 circles plus one extra for a seamless loop */}
        <circle cx="60" cy="110" r="8" fill="#616161" />
        <circle cx="85" cy="110" r="8" fill="#616161" />
        <circle cx="110" cy="110" r="8" fill="#616161" />
        <circle cx="135" cy="110" r="8" fill="#616161" />
        <circle cx="160" cy="110" r="8" fill="#616161" />
      </g>
      <clipPath id="treads-clip">
        <rect x="40" y="100" width="120" height="20" rx="10" />
      </clipPath>
    </defs>
    <g transform="translate(0, 20)">
      {/* Body */}
      <rect x="50" y="50" width="100" height="50" rx="10" fill="#FFC107" stroke="#E6A200" strokeWidth="4"/>
      <rect x="55" y="55" width="40" height="40" rx="5" fill="#212121" />
      <rect x="60" y="60" width="30" height="30" fill="#64B5F6" />
      
      {/* Arm */}
      <g
        className="transition-transform duration-300 ease-in-out"
        style={{
          transformOrigin: '150px 60px',
          transform: isDigging ? 'rotate(40deg)' : 'rotate(0deg)',
        }}
      >
        <rect x="140" y="55" width="20" height="10" fill="#F57C00" />
        <path d="M 150 60 L 180 30 L 190 40 L 160 70 Z" fill="#FF9800" stroke="#E65100" strokeWidth="3" />
        <path d="M 185 25 L 200 40 L 190 50 L 175 35 Z" fill="#FF9800" stroke="#E65100" strokeWidth="3" />
      </g>

      {/* Treads */}
      <rect x="40" y="100" width="120" height="20" rx="10" fill="#424242" />
      <g clipPath="url(#treads-clip)">
        <use href="#tread-circles" className={isMoving ? 'animate-treads-move' : ''} />
      </g>
    </g>
  </svg>
);

export const DirtPileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M0 100 V 60 Q 20 40, 50 60 T 100 60 V 100 Z" fill="#8D6E63"/>
    <path d="M5 95 V 70 Q 25 55, 50 70 T 95 70 V 95 Z" fill="#795548"/>
  </svg>
);

export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

export const GemIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 8.5l10 13.5L22 8.5z"/>
  </svg>
);

export const BoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M54.4,9.6C49.9,5.1,42.6,5.1,38,9.6l-2.8,2.8c-1.6,1.6-1.6,4.1,0,5.7l8.5,8.5c1.6,1.6,4.1,1.6,5.7,0l2.8-2.8 C63.6,18.3,58.9,5.1,54.4,9.6z M9.6,54.4c4.5,4.5,11.8,4.5,16.4,0l2.8-2.8c1.6-1.6,1.6-4.1,0-5.7L19,37.5c-1.6-1.6-4.1-1.6-5.7,0 l-2.8,2.8C-0.5,45.6,5.1,63.6,9.6,54.4z M46.5,14.1c-1.6-1.6-4.1-1.6-5.7,0L14.1,40.8c-1.6,1.6-1.6,4.1,0,5.7l2.8,2.8 c1.6,1.6,4.1,1.6,5.7,0l26.7-26.7c1.6-1.6,1.6-4.1,0-5.7L46.5,14.1z"/>
    </svg>
);

export const ToyCarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M58,34H52V28a2,2,0,0,0-2-2H40a2,2,0,0,0-2,2v2H26V28a2,2,0,0,0-2-2H14a2,2,0,0,0-2,2v6H6a2,2,0,0,0-2,2v8a2,2,0,0,0,2,2H8a6,6,0,0,0,12,0h24a6,6,0,0,0,12,0h2a2,2,0,0,0,2-2V36A2,2,0,0,0,58,34ZM14,44a4,4,0,1,1,4-4A4,4,0,0,1,14,44Zm36,0a4,4,0,1,1,4-4A4,4,0,0,1,50,44Z"/>
        <path d="M14.2,28.8l6-8a2,2,0,0,1,1.6-.8h20.4a2,2,0,0,1,1.6.8l6,8Z"/>
    </svg>
);

export const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"></path>
    </svg>
);

export const LeftArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
);

export const RightArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);

export const DigIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 20h8v-2H2v2zm10.71-3.12c-.52.26-1.14.3-1.71.08-.63-.25-1.15-.8-1.5-1.45l-2.58-4.79c-.31-.58-.21-1.3.23-1.75l.18-.18c.5-.5 1.31-.5 1.81 0l3.07 3.07-1.5 2.8zM4 2h4v2H4V2zm4 4H4v2h4V6zm14.25-1.18c.22-.22.22-.58 0-.79l-1.41-1.41c-.22-.22-.58-.22-.79 0l-1.06 1.06-2.5-2.5c-.22-.22-.58-.22-.79 0l-1.41 1.41c-.22-.22-.22-.58 0 .79l2.5 2.5-3.89 3.89c-.63.63-.18 1.71.71 1.71h1.41l4.95-4.95 1.06-1.06z"/>
    </svg>
);

export const ResetIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
    </svg>
);

export const TreasureMap: React.FC<{ type: TreasureType, className?: string }> = ({ type, className }) => {
  let icon: React.ReactNode = null;
  let glowColor = 'transparent';

  switch (type) {
    case TreasureType.Star:
      icon = <StarIcon className={`${className} text-yellow-400`} />;
      glowColor = '#facc15';
      break;
    case TreasureType.Gem:
      icon = <GemIcon className={`${className} text-cyan-400`} />;
      glowColor = '#22d3ee';
      break;
    case TreasureType.Bone:
      icon = <BoneIcon className={`${className} text-stone-100`} />;
      glowColor = '#f1f5f9';
      break;
    case TreasureType.ToyCar:
      icon = <ToyCarIcon className={`${className} text-red-500`} />;
      glowColor = '#ef4444';
      break;
    case TreasureType.Crown:
      icon = <CrownIcon className={`${className} text-amber-400`} />;
      glowColor = '#f59e0b';
      break;
    default:
      return null;
  }
  
  return (
    <div
      className="animate-treasure-bob animate-treasure-glow"
      style={{ '--glow-color': glowColor } as React.CSSProperties}
    >
      {icon}
    </div>
  );
};