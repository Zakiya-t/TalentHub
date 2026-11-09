import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  linkToHome?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 'md', 
  showTagline = false,
  linkToHome = true 
}) => {
  const iconSizes = {
    sm: { w: 26, h: 26, font: '1.15rem' },
    md: { w: 34, h: 34, font: '1.35rem' },
    lg: { w: 46, h: 46, font: '1.75rem' }
  };

  const currentSize = iconSizes[size];

  const logoContent = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {/* Geometric upward growth symbol */}
      <svg 
        width={currentSize.w} 
        height={currentSize.h} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect width="40" height="40" rx="10" fill="#0B0F19" />
        <rect x="0.5" y="0.5" width="39" height="39" rx="9.5" stroke="rgba(255,255,255,0.12)" />
        
        {/* Ascending Chevron Nodes */}
        <path 
          d="M10 27L20 17L30 27" 
          stroke="#6366F1" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M14 18L20 12L26 18" 
          stroke="#84CC16" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Apex Pinnacle Node */}
        <circle cx="20" cy="8" r="3" fill="#A3E635" />
      </svg>

      <div>
        <div style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: currentSize.font, 
          fontWeight: 800, 
          letterSpacing: '-0.03em',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem'
        }}>
          <span style={{ color: '#ffffff' }}>Talent</span>
          <span style={{ 
            background: 'linear-gradient(135deg, #818cf8, #a3e635)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>Hub</span>
        </div>
        {showTagline && (
          <div style={{ 
            fontSize: '0.7rem', 
            color: '#94a3b8', 
            fontWeight: 500, 
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginTop: '0.2rem'
          }}>
            Campus Placement OS
          </div>
        )}
      </div>
    </div>
  );

  if (linkToHome) {
    return <Link to="/" style={{ textDecoration: 'none' }}>{logoContent}</Link>;
  }

  return logoContent;
};
