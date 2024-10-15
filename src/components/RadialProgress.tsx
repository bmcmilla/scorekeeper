import { Component } from "solid-js";

const RadialProgress: Component<{ score: number, endScore: number }> = (props) => {

    const interpolateColor = (percentage: number): string => {

        // Ratio between 0 and 1
        const ratio = Math.max(0, Math.min(100, percentage)) / 100;

        // OKLCH values for start (greenish) and end (reddish)
        const startL = 90.13;  // Lightness
        const startC = 0.153;  // Chroma
        const startH = 164.14; // Hue
        const endL = 78.66;
        const endC = 0.15;
        const endH = 28.47;

        // Interpolate each component
        const L = startL + (endL - startL) * ratio;
        const C = startC + (endC - startC) * ratio;
        const H = startH + (endH - startH) * ratio;

        // Return the OKLCH color
        return `oklch(${L}% ${C} ${H})`;
    };
    return (
        <div
            class="radial-progress bg-transparent border-0 text-[var(--dynamic-color)]"
            style={{
                '--size': '4rem',
                '--thickness': props.score > 0 ? '5px' : '0px',
                '--value': 100 * props.score / props.endScore,
                '--dynamic-color': interpolateColor(100 * props.score / props.endScore)
            }}
            role="progressbar">
            <span class="text-xl font-extrabold text-neutral-content">
                {props.score}
            </span>
        </div>
    );
}

export default RadialProgress;