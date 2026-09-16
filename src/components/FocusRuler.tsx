import React, { useEffect, useState } from 'react';

interface FocusRulerProps {
  enabled: boolean;
}

export const FocusRuler: React.FC<FocusRulerProps> = ({ enabled }) => {
  const [mouseY, setMouseY] = useState(200);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setMouseY(e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="fixed left-0 right-0 pointer-events-none z-50 transition-transform duration-75 ease-out"
      style={{
        top: `${mouseY - 18}px`,
        height: '36px',
        backgroundColor: 'rgba(56, 189, 248, 0.07)',
        borderTop: '1px solid rgba(56, 189, 248, 0.35)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.35)',
        boxShadow: '0 0 20px rgba(56, 189, 248, 0.1)',
      }}
    />
  );
};
