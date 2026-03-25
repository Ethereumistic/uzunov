import React from 'react';

/**
 * Super-lightweight architectural background pattern.
 * Uses CSS gradients for maximum performance and zero lag.
 */
export const BackgroundPattern: React.FC = () => {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-[-1] select-none transition-opacity duration-1000 translate-z-0"
            aria-hidden="true"
        >
            {/* 
              LAYER 1: Subtle Point Grid (24px)
              Provides a sense of scale and precision.
            */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `radial-gradient(var(--stone-200) 0.75px, transparent 0.75px)`,
                    backgroundSize: '24px 24px',
                }}
            />

            {/* 
              LAYER 2: Larger Technical Grid (96px)
              Subtle lines every 4 dots, typical of drafting paper.
            */}
            <div
                className="absolute inset-0 opacity-[0.2]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, var(--stone-400) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--stone-400) 1px, transparent 1px)
                    `,
                    backgroundSize: '96px 96px',
                }}
            />

            {/* 
              LAYER 3: Accent Crosshairs (192px)
              Small architectural '+' markers in the brand accent color.
            */}
            <div
                className="absolute inset-0 opacity-[0.2]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, var(--accent) 1px, transparent 1px, transparent 7px, var(--accent) 1px),
                        linear-gradient(to bottom, var(--accent) 1px, transparent 1px, transparent 7px, var(--accent) 1px)
                    `,
                    backgroundSize: '192px 192px',
                    backgroundPosition: '-3.5px -3.5px',
                }}
            />

            {/* 
              LAYER 4: Vignette / Depth
              Softens the edges to keep the focus on the content.
            */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--stone-50)_90%)] opacity-[0.6]" />
        </div>
    );
};
