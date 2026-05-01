'use client';

import {useEffect, useRef} from 'react';

const WORDS = [
    {text: '普洱', lang: 'Chinese'},
    {text: 'Пуэр', lang: 'Russian'},
    {text: 'Puer', lang: 'English'},
    {text: 'Pu-erh', lang: 'French'},
    {text: '보이차', lang: 'Korean'},
    {text: 'プーアル茶', lang: 'Japanese'},
    {text: "Pu'er", lang: 'German'},
    {text: 'Пуер', lang: 'Ukrainian'},
    {text: 'Πούερ', lang: 'Greek'},
    {text: 'Puerh', lang: 'Spanish'},
    {text: 'پوئر', lang: 'Persian'},
    {text: 'Пуэрий', lang: 'Mongolian'},
    {text: '普洱茶', lang: 'Traditional'},
    {text: 'Pu-erh', lang: 'Italian'},
];

const WEIGHTS = [200, 300, 400, 500, 600, 700, 800];
const SIZES   = [12, 15, 19, 25, 33, 43, 55, 68];

interface Box { x1: number; y1: number; x2: number; y2: number }

function overlaps(a: Box, b: Box, pad = 8) {
    return !(a.x2 < b.x1 - pad || a.x1 > b.x2 + pad || a.y2 < b.y1 - pad || a.y1 > b.y2 + pad);
}

interface Props {
    /** Height of the cloud container in px. Default: 260 */
    height?: number;
    /** Base green color. Default: #7a9e7e */
    color?: string;
    className?: string;
}

export default function PuerCloud({height = 260, color = '#7a9e7e', className = ''}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = '';
        const W = container.offsetWidth;
        const H = height;
        const placed: Box[] = [];

        const shuffled = [...WORDS].sort(() => Math.random() - 0.5);

        shuffled.forEach(word => {
            const el = document.createElement('span');
            const size    = SIZES[Math.floor(Math.random() * SIZES.length)];
            const weight  = WEIGHTS[Math.floor(Math.random() * WEIGHTS.length)];
            const rot     = (Math.random() - 0.5) * 24;
            const opacity = 0.15 + Math.random() * 0.75;

            Object.assign(el.style, {
                position:   'absolute',
                fontSize:   `${size}px`,
                fontWeight: String(weight),
                transform:  `rotate(${rot}deg)`,
                opacity:    String(opacity),
                color,
                lineHeight: '1',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                userSelect: 'none',
            });

            el.textContent = word.text;
            el.setAttribute('aria-hidden', 'true');
            container.appendChild(el);

            const ew = el.offsetWidth  || size * word.text.length * 0.68;
            const eh = size * 1.25;
            container.removeChild(el);

            for (let attempt = 0; attempt < 100; attempt++) {
                const x = Math.random() * (W - ew - 10) + 5;
                const y = Math.random() * (H - eh - 10) + 5;
                const box: Box = {x1: x, y1: y, x2: x + ew, y2: y + eh};

                if (!placed.some(p => overlaps(p, box))) {
                    el.style.left = `${x}px`;
                    el.style.top  = `${y}px`;
                    container.appendChild(el);
                    placed.push(box);
                    break;
                }
            }
        });
    }, [height, color]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{position: 'relative', width: '100%', height, overflow: 'hidden'}}
            aria-label="The word Puer written in many languages"
        />
    );
}