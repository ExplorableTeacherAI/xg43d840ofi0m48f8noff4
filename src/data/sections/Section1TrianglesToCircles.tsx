/**
 * Section 1: From Triangles to Circles
 *
 * This section introduces the unit circle and shows how sine and cosine
 * emerge from circular motion, connecting to what students already know
 * about right triangle trigonometry.
 */

import { type ReactElement, useEffect, useRef, useCallback } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH1,
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineTooltip,
    InlineLinkedHighlight,
    InlineFeedback,
    InlineClozeInput,
    Cartesian2D,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { InteractionHintSequence } from "@/components/atoms/visual/InteractionHint";
import {
    getVariableInfo,
    numberPropsFromDefinition,
    clozePropsFromDefinition,
    linkedHighlightPropsFromDefinition,
} from "../variables";
import { useVar, useSetVar, useVariableStore } from "@/stores";

// ─── Reactive Components ─────────────────────────────────────────────────────

/**
 * Displays computed sine and cosine values based on the current angle
 */
function SineCosineValues() {
    const angle = useVar("unitCircleAngle", 45) as number;
    const radians = (angle * Math.PI) / 180;
    const sinValue = Math.sin(radians).toFixed(3);
    const cosValue = Math.cos(radians).toFixed(3);

    return (
        <span>
            sin({angle}°) = <span style={{ color: "#8E90F5", fontWeight: 600 }}>{sinValue}</span>,{" "}
            cos({angle}°) = <span style={{ color: "#62D0AD", fontWeight: 600 }}>{cosValue}</span>
        </span>
    );
}

/**
 * Interactive Unit Circle with animated sine wave trace
 * Shows a point moving around the circle while drawing the sine wave
 */
function AnimatedSineWaveTrace() {
    const time = useVar("animationTime", 0) as number;
    const isPlaying = useVar("animationPlaying", false) as boolean;
    const setVar = useSetVar();
    const getVar = useVariableStore((state) => state.getVariable);
    const animationRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);

    // Animation loop
    useEffect(() => {
        if (isPlaying) {
            const animate = (timestamp: number) => {
                if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
                const delta = (timestamp - lastTimeRef.current) / 1000;
                lastTimeRef.current = timestamp;

                const currentTime = getVar("animationTime", 0) as number;
                const newTime = currentTime + delta * 0.5;
                setVar("animationTime", newTime > 2 * Math.PI ? 0 : newTime);

                animationRef.current = requestAnimationFrame(animate);
            };
            animationRef.current = requestAnimationFrame(animate);
        } else {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
            lastTimeRef.current = 0;
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, setVar, getVar]);

    const togglePlay = useCallback(() => {
        setVar("animationPlaying", !isPlaying);
    }, [isPlaying, setVar]);

    const reset = useCallback(() => {
        setVar("animationTime", 0);
        setVar("animationPlaying", false);
    }, [setVar]);

    // Current point position on the unit circle
    const pointX = Math.cos(time);
    const pointY = Math.sin(time);

    // Generate the sine wave trace - starts at x=1 (edge of unit circle)
    const generateSineWavePath = (): [number, number][] => {
        const points: [number, number][] = [];
        const steps = 100;
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * time;
            const x = 1 + t * 0.8; // Start at x=1 (circle edge)
            const y = Math.sin(t);
            if (x <= 7) {
                points.push([x, y]);
            }
        }
        return points;
    };

    // Generate the cosine wave trace - starts at x=1 (edge of unit circle)
    const generateCosineWavePath = (): [number, number][] => {
        const points: [number, number][] = [];
        const steps = 100;
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * time;
            const x = 1 + t * 0.8; // Start at x=1 (circle edge)
            const y = Math.cos(t);
            if (x <= 7) {
                points.push([x, y]);
            }
        }
        return points;
    };

    const wavePath = generateSineWavePath();
    const cosineWavePath = generateCosineWavePath();

    // Generate sine wave segments for the plots array
    const waveSegments = wavePath.length > 1
        ? wavePath.slice(1).map((point, i) => ({
              type: "segment" as const,
              point1: wavePath[i] as [number, number],
              point2: point as [number, number],
              color: "#8E90F5",
              weight: 2,
          }))
        : [];

    // Generate cosine wave segments for the plots array
    const cosineWaveSegments = cosineWavePath.length > 1
        ? cosineWavePath.slice(1).map((point, i) => ({
              type: "segment" as const,
              point1: cosineWavePath[i] as [number, number],
              point2: point as [number, number],
              color: "#62D0AD",
              weight: 2,
          }))
        : [];

    return (
        <div className="relative">
            <Cartesian2D
                height={350}
                viewBox={{ x: [-1.8, 7], y: [-1.8, 1.8] }}
                showGrid={true}
                plots={[
                    // Unit circle
                    { type: "circle", center: [0, 0], radius: 1, color: "#94a3b8", fillOpacity: 0.05 },
                    // Horizontal line from point to sine wave
                    { type: "segment", point1: [pointX, pointY], point2: [1 + time * 0.8, pointY], color: "#8E90F5", style: "dashed", weight: 1 },
                    // Horizontal line from point to cosine wave
                    { type: "segment", point1: [pointX, pointY], point2: [1 + time * 0.8, pointX], color: "#62D0AD", style: "dashed", weight: 1 },
                    // Vertical line (sine value)
                    { type: "segment", point1: [pointX, 0], point2: [pointX, pointY], color: "#8E90F5", weight: 3 },
                    // Horizontal line (cosine value)
                    { type: "segment", point1: [0, 0], point2: [pointX, 0], color: "#62D0AD", weight: 3 },
                    // Radius line
                    { type: "segment", point1: [0, 0], point2: [pointX, pointY], color: "#64748b", weight: 2 },
                    // Current point on circle
                    { type: "point", x: pointX, y: pointY, color: "#ef4444" },
                    // Origin point
                    { type: "point", x: 0, y: 0, color: "#64748b" },
                    // Sine wave trace point
                    ...(time > 0.1 ? [{ type: "point" as const, x: 1 + time * 0.8, y: pointY, color: "#8E90F5" }] : []),
                    // Cosine wave trace point
                    ...(time > 0.1 ? [{ type: "point" as const, x: 1 + time * 0.8, y: pointX, color: "#62D0AD" }] : []),
                    // Sine wave trace segments
                    ...waveSegments,
                    // Cosine wave trace segments
                    ...cosineWaveSegments,
                ]}
            />
            {/* Play/Pause and Reset controls */}
            <div className="flex justify-center gap-3 mt-4">
                <button
                    onClick={togglePlay}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                    style={{
                        backgroundColor: isPlaying ? "rgba(239, 68, 68, 0.1)" : "rgba(98, 208, 173, 0.1)",
                        color: isPlaying ? "#ef4444" : "#62D0AD",
                        border: `1px solid ${isPlaying ? "#ef4444" : "#62D0AD"}`,
                    }}
                >
                    {isPlaying ? (
                        <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                            </svg>
                            Pause
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <polygon points="5,3 19,12 5,21" />
                            </svg>
                            Play
                        </>
                    )}
                </button>
                <button
                    onClick={reset}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                    style={{
                        backgroundColor: "rgba(148, 163, 184, 0.1)",
                        color: "#64748b",
                        border: "1px solid #94a3b8",
                    }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset
                </button>
            </div>
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-3 text-sm">
                <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#8E90F5" }} />
                    <span style={{ color: "#8E90F5" }}>sin(θ)</span>
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#62D0AD" }} />
                    <span style={{ color: "#62D0AD" }}>cos(θ)</span>
                </span>
            </div>
        </div>
    );
}

/**
 * Interactive Unit Circle with Angle Arc and Radian Measure
 * Emphasizes the angle itself with a colored arc sector, showing both
 * degree and radian measures. The arc length visually represents the radian value.
 */
function InteractiveUnitCircle() {
    const angle = useVar("unitCircleAngle", 45) as number;
    const setVar = useSetVar();
    const highlightId = useVar("unitCircleHighlight", "") as string;

    const radians = (angle * Math.PI) / 180;
    const pointX = Math.cos(radians);
    const pointY = Math.sin(radians);

    // Handle point drag
    const handlePointChange = useCallback(
        (point: [number, number]) => {
            const [x, y] = point;
            let newAngle = Math.atan2(y, x) * (180 / Math.PI);
            if (newAngle < 0) newAngle += 360;
            setVar("unitCircleAngle", Math.round(newAngle));
        },
        [setVar]
    );

    // Determine colors based on highlight state
    const sineColor = highlightId === "sine" ? "#8E90F5" : highlightId ? "rgba(142, 144, 245, 0.3)" : "#8E90F5";
    const cosineColor = highlightId === "cosine" ? "#62D0AD" : highlightId ? "rgba(98, 208, 173, 0.3)" : "#62D0AD";
    const arcColor = "#F7B23B"; // Warm amber for the angle arc

    // Generate arc path points for the angle sector
    const generateArcPoints = (): [number, number][] => {
        const points: [number, number][] = [];
        const arcRadius = 0.35; // Inner arc radius for visibility
        const steps = Math.max(2, Math.ceil(angle / 5)); // More points for smoother arc
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * radians;
            points.push([arcRadius * Math.cos(t), arcRadius * Math.sin(t)]);
        }
        return points;
    };

    const arcPoints = generateArcPoints();

    // Format radian display
    const formatRadians = (rad: number): string => {
        const piMultiple = rad / Math.PI;
        if (Math.abs(piMultiple - Math.round(piMultiple)) < 0.01) {
            const rounded = Math.round(piMultiple);
            if (rounded === 0) return "0";
            if (rounded === 1) return "π";
            if (rounded === -1) return "-π";
            return `${rounded}π`;
        }
        // Show as fraction of π for common angles
        const fractions = [
            { num: 1, den: 6 }, { num: 1, den: 4 }, { num: 1, den: 3 }, { num: 1, den: 2 },
            { num: 2, den: 3 }, { num: 3, den: 4 }, { num: 5, den: 6 },
            { num: 5, den: 4 }, { num: 4, den: 3 }, { num: 3, den: 2 }, { num: 5, den: 3 }, { num: 7, den: 4 }, { num: 11, den: 6 },
        ];
        for (const f of fractions) {
            if (Math.abs(piMultiple - f.num / f.den) < 0.02) {
                return f.num === 1 ? `π/${f.den}` : `${f.num}π/${f.den}`;
            }
        }
        return `${rad.toFixed(2)} rad`;
    };

    // Calculate label position for angle display (midway along arc)
    const labelAngle = radians / 2;
    const labelRadius = 0.55;
    const labelX = labelRadius * Math.cos(labelAngle);
    const labelY = labelRadius * Math.sin(labelAngle);

    return (
        <div className="relative">
            {/* Custom SVG overlay for angle arc and labels */}
            <svg
                className="absolute inset-0 pointer-events-none"
                viewBox="-1.5 -1.5 3 3"
                style={{ width: "100%", height: "320px" }}
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Angle arc sector fill - SVG has y-axis pointing down, so we negate y values */}
                {angle > 0 && (
                    <path
                        d={`M 0 0 L 0.35 0 A 0.35 0.35 0 ${angle > 180 ? 1 : 0} 0 ${0.35 * Math.cos(radians)} ${-0.35 * Math.sin(radians)} Z`}
                        fill={arcColor}
                        fillOpacity={0.2}
                    />
                )}
                {/* Angle arc stroke */}
                {arcPoints.length > 1 && (
                    <path
                        d={`M ${arcPoints[0][0]} ${-arcPoints[0][1]} ${arcPoints.slice(1).map(p => `L ${p[0]} ${-p[1]}`).join(" ")}`}
                        stroke={arcColor}
                        strokeWidth={0.03}
                        fill="none"
                    />
                )}
                {/* Angle label */}
                {angle > 10 && (
                    <text
                        x={labelX}
                        y={-labelY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={arcColor}
                        fontSize="0.14"
                        fontWeight="600"
                    >
                        θ
                    </text>
                )}
            </svg>

            <Cartesian2D
                height={320}
                viewBox={{ x: [-1.5, 1.5], y: [-1.5, 1.5] }}
                showGrid={true}
                highlightVarName="unitCircleHighlight"
                plots={[
                    // Unit circle
                    { type: "circle", center: [0, 0], radius: 1, color: "#94a3b8", fillOpacity: 0.05 },
                    // Reference line along positive x-axis
                    { type: "segment", point1: [0, 0], point2: [1.2, 0], color: "#cbd5e1", weight: 1, style: "dashed" as const },
                    // Vertical line (sine)
                    { type: "segment", point1: [pointX, 0], point2: [pointX, pointY], color: sineColor, weight: 3, highlightId: "sine" },
                    // Horizontal line (cosine)
                    { type: "segment", point1: [0, 0], point2: [pointX, 0], color: cosineColor, weight: 3, highlightId: "cosine" },
                    // Radius to point
                    { type: "segment", point1: [0, 0], point2: [pointX, pointY], color: "#64748b", weight: 2 },
                    // Origin point
                    { type: "point", x: 0, y: 0, color: "#64748b" },
                    // Point at (1, 0) to mark the start of the angle
                    { type: "point", x: 1, y: 0, color: "#cbd5e1" },
                ]}
                movablePoints={[
                    {
                        initial: [pointX, pointY],
                        color: "#ef4444",
                        constrain: (p) => {
                            // Constrain to unit circle
                            const len = Math.hypot(p[0], p[1]);
                            if (len === 0) return [1, 0];
                            return [p[0] / len, p[1] / len];
                        },
                        onChange: handlePointChange,
                        position: [pointX, pointY],
                    },
                ]}
            />

            {/* Angle measurements display */}
            <div className="flex justify-center gap-6 mt-3 text-sm">
                <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: arcColor }} />
                    <span style={{ color: arcColor, fontWeight: 600 }}>{angle}° = {formatRadians(radians)}</span>
                </span>
                <span className="flex items-center gap-2 text-slate-500">
                    Arc length = {radians.toFixed(2)} (radius × θ)
                </span>
            </div>

            <InteractionHintSequence
                hintKey="unit-circle-angle-arc"
                steps={[
                    {
                        gesture: "drag-circular",
                        label: "Drag the red point to change the angle",
                        position: { x: "70%", y: "30%" },
                        dragPath: { type: "arc", startAngle: 45, endAngle: 135, radius: 40 },
                    },
                ]}
            />
        </div>
    );
}

// ─── Section Blocks ──────────────────────────────────────────────────────────

export const section1Blocks: ReactElement[] = [
    // Title
    <StackLayout key="layout-triangles-title" maxWidth="xl">
        <Block id="triangles-title" padding="lg">
            <EditableH1 id="h1-triangles-title" blockId="triangles-title">
                Trigonometric Functions: From Triangles to Waves
            </EditableH1>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-triangles-intro" maxWidth="xl">
        <Block id="triangles-intro" padding="sm">
            <EditableParagraph id="para-triangles-intro" blockId="triangles-intro">
                You already know that{" "}
                <InlineTooltip id="tooltip-sine" tooltip="In a right triangle, sine is the ratio of the opposite side to the hypotenuse">
                    sine
                </InlineTooltip>
                ,{" "}
                <InlineTooltip id="tooltip-cosine" tooltip="In a right triangle, cosine is the ratio of the adjacent side to the hypotenuse">
                    cosine
                </InlineTooltip>
                , and{" "}
                <InlineTooltip id="tooltip-tangent" tooltip="In a right triangle, tangent is the ratio of the opposite side to the adjacent side">
                    tangent
                </InlineTooltip>{" "}
                come from right triangles. But here is something surprising: if you watch a point travel around a circle and track its height over time,
                you get a beautiful wave pattern. This simple connection between circular motion and waves explains everything from sound and light to the rhythm of ocean tides.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Section heading
    <StackLayout key="layout-unit-circle-heading" maxWidth="xl">
        <Block id="unit-circle-heading" padding="md">
            <EditableH2 id="h2-unit-circle-heading" blockId="unit-circle-heading">
                The Unit Circle: Where It All Begins
            </EditableH2>
        </Block>
    </StackLayout>,

    // Unit circle explanation
    <StackLayout key="layout-unit-circle-explanation" maxWidth="xl">
        <Block id="unit-circle-explanation" padding="sm">
            <EditableParagraph id="para-unit-circle-explanation" blockId="unit-circle-explanation">
                A{" "}
                <InlineTooltip id="tooltip-unit-circle" tooltip="A circle centered at the origin with radius exactly 1">
                    unit circle
                </InlineTooltip>{" "}
                is simply a circle with radius 1, centered at the origin. When we place a point on this circle and measure the angle from the positive x-axis,
                something magical happens: the point's coordinates are exactly the cosine and sine of that angle.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive unit circle
    <SplitLayout key="layout-unit-circle-interactive" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="unit-circle-controls" padding="sm">
                <EditableParagraph id="para-unit-circle-controls" blockId="unit-circle-controls">
                    Drag the <span style={{ color: "#ef4444", fontWeight: 600 }}>red point</span> around the circle and watch the amber arc grow or shrink. This arc shows the angle θ, measured from the positive x-axis. Notice how the angle is displayed in both degrees and radians. When the angle is{" "}
                    <InlineScrubbleNumber
                        varName="unitCircleAngle"
                        {...numberPropsFromDefinition(getVariableInfo("unitCircleAngle"))}
                        formatValue={(v) => `${v}°`}
                    />
                    , the arc length equals the radian measure because the radius is exactly 1. The{" "}
                    <InlineLinkedHighlight
                        id="highlight-sine-value"
                        varName="unitCircleHighlight"
                        highlightId="sine"
                        {...linkedHighlightPropsFromDefinition(getVariableInfo("unitCircleHighlight"))}
                        color="#8E90F5"
                    >
                        vertical line (sine)
                    </InlineLinkedHighlight>{" "}
                    and{" "}
                    <InlineLinkedHighlight
                        id="highlight-cosine-value"
                        varName="unitCircleHighlight"
                        highlightId="cosine"
                        {...linkedHighlightPropsFromDefinition(getVariableInfo("unitCircleHighlight"))}
                        color="#62D0AD"
                    >
                        horizontal line (cosine)
                    </InlineLinkedHighlight>{" "}
                    show the coordinates: <SineCosineValues />.
                </EditableParagraph>
            </Block>
            <Block id="unit-circle-formula" padding="sm">
                <FormulaBlock
                    latex="\text{Point on circle: } (\cos\theta, \sin\theta)"
                    colorMap={{ cos: "#62D0AD", sin: "#8E90F5" }}
                />
            </Block>
        </div>
        <Block id="unit-circle-viz" padding="sm" hasVisualization>
            <InteractiveUnitCircle />
        </Block>
    </SplitLayout>,

    // Key insight
    <StackLayout key="layout-unit-circle-insight" maxWidth="xl">
        <Block id="unit-circle-insight" padding="sm">
            <EditableParagraph id="para-unit-circle-insight" blockId="unit-circle-insight">
                Notice how the sine value (the vertical distance from the x-axis) oscillates between -1 and 1 as the point moves around.
                When the point is at the top of the circle (90°), sine equals 1. At the bottom (270°), sine equals -1.
                This up-and-down motion is the heartbeat of the sine wave.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Animation section heading
    <StackLayout key="layout-animation-heading" maxWidth="xl">
        <Block id="animation-heading" padding="md">
            <EditableH2 id="h2-animation-heading" blockId="animation-heading">
                Watch the Wave Emerge
            </EditableH2>
        </Block>
    </StackLayout>,

    // Animation explanation
    <StackLayout key="layout-animation-explanation" maxWidth="xl">
        <Block id="animation-explanation" padding="sm">
            <EditableParagraph id="para-animation-explanation" blockId="animation-explanation">
                Now for the beautiful part. Press the Play button below and watch carefully: as the point travels around the circle,
                we trace its height (the sine value) over time. The result? A perfect sine wave unfolds before your eyes.
                This is the fundamental connection between circular motion and wave patterns.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Animated visualization
    <StackLayout key="layout-animated-sine-trace" maxWidth="2xl">
        <Block id="animated-sine-trace" padding="md" hasVisualization>
            <AnimatedSineWaveTrace />
        </Block>
    </StackLayout>,

    // Observation prompt
    <StackLayout key="layout-observation-prompt" maxWidth="xl">
        <Block id="observation-prompt" padding="sm">
            <EditableParagraph id="para-observation-prompt" blockId="observation-prompt">
                Watch how the dashed horizontal line connects the point on the circle to the growing wave.
                The vertical position of the point becomes the height of the wave at each moment.
                This is why we call it a "sine wave" — it is literally the path traced by the sine of an angle as that angle increases.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Assessment heading
    <StackLayout key="layout-assessment-heading" maxWidth="xl">
        <Block id="assessment-heading" padding="md">
            <EditableH2 id="h2-assessment-heading" blockId="assessment-heading">
                Check Your Understanding
            </EditableH2>
        </Block>
    </StackLayout>,

    // Question 1
    <StackLayout key="layout-question-sine-coordinate" maxWidth="xl">
        <Block id="question-sine-coordinate" padding="sm">
            <EditableParagraph id="para-question-sine-coordinate" blockId="question-sine-coordinate">
                For a point on the unit circle, the sine of the angle gives us the{" "}
                <InlineFeedback
                    varName="answerSineDefinition"
                    correctValue="y"
                    position="terminal"
                    successMessage="— that's right! The sine is the vertical (y) coordinate of the point"
                    failureMessage="— not quite"
                    hint="Think about which direction sine measures — is it horizontal or vertical?"
                    reviewBlockId="unit-circle-controls"
                    reviewLabel="Review the unit circle"
                >
                    <InlineClozeInput
                        varName="answerSineDefinition"
                        correctAnswer="y"
                        {...clozePropsFromDefinition(getVariableInfo("answerSineDefinition"))}
                    />
                </InlineFeedback>-coordinate.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Question 2
    <StackLayout key="layout-question-cosine-coordinate" maxWidth="xl">
        <Block id="question-cosine-coordinate" padding="sm">
            <EditableParagraph id="para-question-cosine-coordinate" blockId="question-cosine-coordinate">
                Similarly, the cosine of the angle gives us the{" "}
                <InlineFeedback
                    varName="answerCosineDefinition"
                    correctValue="x"
                    position="terminal"
                    successMessage="— exactly! Cosine gives the horizontal (x) coordinate"
                    failureMessage="— not quite"
                    hint="If sine is vertical, what direction must cosine be?"
                    reviewBlockId="unit-circle-controls"
                    reviewLabel="Review the unit circle"
                >
                    <InlineClozeInput
                        varName="answerCosineDefinition"
                        correctAnswer="x"
                        {...clozePropsFromDefinition(getVariableInfo("answerCosineDefinition"))}
                    />
                </InlineFeedback>-coordinate.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Transition to next section
    <StackLayout key="layout-section1-transition" maxWidth="xl">
        <Block id="section1-transition" padding="md">
            <EditableParagraph id="para-section1-transition" blockId="section1-transition">
                Now that you have seen how circular motion creates a wave, let us explore the properties of this sine wave in more detail.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
