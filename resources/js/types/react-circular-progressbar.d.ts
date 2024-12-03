declare module 'react-circular-progressbar' {
    import { FC, CSSProperties } from 'react';

    export interface CircularProgressbarStyles {
        root?: CSSProperties;
        trail?: CSSProperties;
        path?: CSSProperties;
        text?: CSSProperties;
        background?: CSSProperties;
    }

    export interface CircularProgressbarProps {
        value: number;
        text?: string;
        className?: string;
        strokeWidth?: number;
        background?: boolean;
        backgroundPadding?: number;
        counterClockwise?: boolean;
        circleRatio?: number;
        styles?: CircularProgressbarStyles;
    }

    export function buildStyles(styles: {
        pathColor?: string;
        textColor?: string;
        textSize?: string;
        trailColor?: string;
        backgroundColor?: string;
        pathTransition?: string;
        pathTransitionDuration?: number;
        rotation?: number;
    }): CircularProgressbarStyles;

    export const CircularProgressbar: FC<CircularProgressbarProps>;
}
