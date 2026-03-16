/**
 * Section 5: Trigonometry in Nature
 *
 * Students explore real-world applications of sine waves: sound waves,
 * ocean tides, daylight hours, and pendulum motion. They see how the
 * mathematical concepts they learned apply to natural phenomena.
 */

import { type ReactElement, useMemo, useCallback, useState, useEffect, useRef } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout, GridLayout } from "@/components/layouts";
import {
    EditableH1,
    EditableH2,
    EditableH3,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineTooltip,
    InlineToggle,
    InlineFeedback,
    InlineClozeChoice,
    Cartesian2D,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { InteractionHintSequence } from "@/components/atoms/visual/InteractionHint";
import {
    getVariableInfo,
    numberPropsFromDefinition,
    choicePropsFromDefinition,
} from "../variables";
import { useVar, useSetVar } from "@/stores";

// ─── Reactive Components ─────────────────────────────────────────────────────

/**
 * Sound wave visualization with frequency control
 */
function SoundWaveVisualization() {
    const frequency = useVar("soundFrequency", 440) as number;

    // Calculate wavelength visually (higher frequency = more waves)
    const waveMultiplier = frequency / 220;

    return (
        <div className="relative">
            <Cartesian2D
                height={200}
                viewBox={{ x: [0, 12.5], y: [-1.5, 1.5] }}
                showGrid={false}
                plots={[
                    {
                        type: "function",
                        fn: (x) => Math.sin(waveMultiplier * x * 2),
                        color: "#62CCF9",
                        weight: 3,
                    },
                ]}
            />
            <InteractionHintSequence
                hintKey="sound-wave-viz"
                steps={[
                    {
                        gesture: "hover",
                        label: "Change the frequency to hear different pitches",
                        position: { x: "50%", y: "50%" },
                    },
                ]}
            />
            {/* Frequency indicator */}
            <div className="absolute top-2 right-2 px-3 py-1 rounded-lg text-sm font-medium" style={{ backgroundColor: "rgba(98, 204, 249, 0.15)", color: "#62CCF9" }}>
                {frequency} Hz
            </div>
        </div>
    );
}

/**
 * Simple sound player button for demonstration
 */
function SoundPlayer() {
    const frequency = useVar("soundFrequency", 440) as number;
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);

    const playSound = useCallback(() => {
        if (isPlaying) {
            // Stop
            oscillatorRef.current?.stop();
            oscillatorRef.current = null;
            setIsPlaying(false);
        } else {
            // Play
            try {
                audioContextRef.current = new AudioContext();
                const oscillator = audioContextRef.current.createOscillator();
                const gainNode = audioContextRef.current.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContextRef.current.destination);

                oscillator.frequency.value = frequency;
                oscillator.type = "sine";
                gainNode.gain.value = 0.3;

                oscillator.start();
                oscillatorRef.current = oscillator;
                setIsPlaying(true);

                // Auto-stop after 2 seconds
                setTimeout(() => {
                    oscillator.stop();
                    setIsPlaying(false);
                }, 2000);
            } catch (e) {
                // Audio not supported
            }
        }
    }, [frequency, isPlaying]);

    useEffect(() => {
        // Update frequency if playing
        if (oscillatorRef.current) {
            oscillatorRef.current.frequency.value = frequency;
        }
    }, [frequency]);

    useEffect(() => {
        return () => {
            oscillatorRef.current?.stop();
        };
    }, []);

    return (
        <button
            onClick={playSound}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            style={{
                backgroundColor: isPlaying ? "rgba(239, 68, 68, 0.1)" : "rgba(98, 204, 249, 0.1)",
                color: isPlaying ? "#ef4444" : "#62CCF9",
                border: `1px solid ${isPlaying ? "#ef4444" : "#62CCF9"}`,
            }}
        >
            {isPlaying ? (
                <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                    </svg>
                    Stop
                </>
            ) : (
                <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <polygon points="5,3 19,12 5,21" />
                    </svg>
                    Play Sound
                </>
            )}
        </button>
    );
}

/**
 * Ocean tide visualization
 */
function TideVisualization() {
    const hour = useVar("tideHour", 0) as number;

    // Simulate semi-diurnal tide (two high tides per day)
    const tideLevel = Math.sin((hour / 12) * Math.PI * 2);
    const waterHeight = 50 + tideLevel * 30; // 20-80% height

    return (
        <div className="relative h-48 bg-gradient-to-b from-sky-100 to-sky-200 rounded-xl overflow-hidden">
            {/* Water */}
            <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                style={{
                    height: `${waterHeight}%`,
                    background: "linear-gradient(to bottom, rgba(98, 208, 173, 0.6), rgba(98, 208, 173, 0.9))",
                }}
            >
                {/* Wave animation */}
                <svg className="absolute top-0 left-0 w-full" viewBox="0 0 400 20" preserveAspectRatio="none">
                    <path
                        d="M0,10 Q25,0 50,10 T100,10 T150,10 T200,10 T250,10 T300,10 T350,10 T400,10"
                        fill="none"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth="2"
                    />
                </svg>
            </div>
            {/* Beach */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-amber-200" />
            {/* Time indicator */}
            <div className="absolute top-2 right-2 px-3 py-1 rounded-lg text-sm font-medium bg-white/80 text-gray-700">
                {hour}:00
            </div>
            {/* Tide level indicator */}
            <div className="absolute bottom-8 left-2 px-2 py-1 rounded text-xs font-medium" style={{ color: "#62D0AD" }}>
                Tide: {tideLevel > 0.3 ? "High" : tideLevel < -0.3 ? "Low" : "Mid"}
            </div>
        </div>
    );
}

/**
 * Daylight hours visualization
 */
function DaylightVisualization() {
    const day = useVar("dayOfYear", 172) as number;

    // Simulate daylight hours (simplified model for northern hemisphere)
    // Ranges from ~8 hours (winter solstice) to ~16 hours (summer solstice)
    const daylightHours = 12 + 4 * Math.sin(((day - 80) / 365) * 2 * Math.PI);
    const sunriseHour = 12 - daylightHours / 2;
    const sunsetHour = 12 + daylightHours / 2;

    // Sun position (simple arc)
    const noonProgress = 0.5;
    const sunX = 50; // Centered at noon
    const sunY = 20 + Math.sin(Math.PI * noonProgress) * 30; // Arc motion

    // Convert day to month name
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = Math.floor((day / 365) * 12);

    return (
        <div className="relative h-48 rounded-xl overflow-hidden" style={{ background: "linear-gradient(to bottom, #1e3a5f, #3b82f6, #fbbf24 95%, #f59e0b)" }}>
            {/* Daylight portion */}
            <div
                className="absolute top-0 bottom-0 transition-all duration-500"
                style={{
                    left: `${(sunriseHour / 24) * 100}%`,
                    right: `${100 - (sunsetHour / 24) * 100}%`,
                    background: "linear-gradient(to bottom, #87CEEB, #FDF5E6 90%)",
                }}
            />
            {/* Sun */}
            <div
                className="absolute w-10 h-10 rounded-full transition-all duration-500"
                style={{
                    left: "45%",
                    top: `${30}%`,
                    background: "radial-gradient(circle, #FFF9C4, #FFEB3B)",
                    boxShadow: "0 0 30px #FFEB3B",
                }}
            />
            {/* Info overlay */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-xs text-white/90">
                <span>Sunrise: {Math.floor(sunriseHour)}:{Math.round((sunriseHour % 1) * 60).toString().padStart(2, "0")}</span>
                <span className="font-medium">{monthNames[monthIndex]} (Day {day})</span>
                <span>Sunset: {Math.floor(sunsetHour)}:{Math.round((sunsetHour % 1) * 60).toString().padStart(2, "0")}</span>
            </div>
            {/* Daylight hours display */}
            <div className="absolute top-2 right-2 px-3 py-1 rounded-lg text-sm font-medium bg-white/20 text-white">
                {daylightHours.toFixed(1)} hours of daylight
            </div>
        </div>
    );
}

/**
 * Animated pendulum visualization
 */
function PendulumVisualization() {
    const [angle, setAngle] = useState(0);

    useEffect(() => {
        let animationId: number;
        let time = 0;

        const animate = () => {
            time += 0.03;
            // Damped harmonic motion (sine wave!)
            setAngle(30 * Math.sin(time * 2));
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, []);

    const radians = (angle * Math.PI) / 180;
    const pendulumLength = 80;
    const bobX = 100 + Math.sin(radians) * pendulumLength;
    const bobY = 20 + Math.cos(radians) * pendulumLength;

    return (
        <div className="relative h-48 bg-gray-50 rounded-xl overflow-hidden">
            <svg width="200" height="180" className="mx-auto">
                {/* Pivot point */}
                <circle cx="100" cy="20" r="5" fill="#64748b" />
                {/* String */}
                <line x1="100" y1="20" x2={bobX} y2={bobY} stroke="#94a3b8" strokeWidth="2" />
                {/* Bob */}
                <circle cx={bobX} cy={bobY} r="15" fill="#8E90F5" />
                {/* Arc showing swing range */}
                <path
                    d="M 60 100 A 80 80 0 0 1 140 100"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                    opacity="0.5"
                />
            </svg>
            {/* Angle indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg text-sm font-medium" style={{ backgroundColor: "rgba(142, 144, 245, 0.1)", color: "#8E90F5" }}>
                θ = {angle.toFixed(1)}°
            </div>
        </div>
    );
}

/**
 * Graph showing daylight hours through the year
 */
function DaylightGraph() {
    const day = useVar("dayOfYear", 172) as number;

    return (
        <div className="relative">
            <Cartesian2D
                height={200}
                viewBox={{ x: [0, 365], y: [6, 18] }}
                showGrid={true}
                plots={[
                    // Daylight hours curve
                    {
                        type: "function",
                        fn: (x) => 12 + 4 * Math.sin(((x - 80) / 365) * 2 * Math.PI),
                        color: "#F7B23B",
                        weight: 3,
                    },
                    // 12-hour reference line
                    { type: "segment", point1: [0, 12], point2: [365, 12], color: "#94a3b8", weight: 1, style: "dashed" },
                    // Current day marker
                    { type: "segment", point1: [day, 6], point2: [day, 18], color: "#ef4444", weight: 2, style: "dashed" },
                    {
                        type: "point",
                        x: day,
                        y: 12 + 4 * Math.sin(((day - 80) / 365) * 2 * Math.PI),
                        color: "#ef4444",
                    },
                ]}
            />
            {/* Month labels */}
            <div className="flex justify-between px-2 text-xs text-gray-500 mt-1">
                <span>Jan</span>
                <span>Apr</span>
                <span>Jul</span>
                <span>Oct</span>
                <span>Dec</span>
            </div>
        </div>
    );
}

// ─── Section Blocks ──────────────────────────────────────────────────────────

export const section5Blocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-nature-heading" maxWidth="xl">
        <Block id="nature-heading" padding="lg">
            <EditableH2 id="h2-nature-heading" blockId="nature-heading">
                Trigonometry in Nature: Waves All Around Us
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-nature-intro" maxWidth="xl">
        <Block id="nature-intro" padding="sm">
            <EditableParagraph id="para-nature-intro" blockId="nature-intro">
                Sine waves are not just mathematical abstractions — they are the language of nature. Whenever something oscillates,
                vibrates, or cycles, you will find a sine wave hiding underneath. Let us explore four places where trigonometry
                shapes the world around us.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Sound waves heading
    <StackLayout key="layout-sound-heading" maxWidth="xl">
        <Block id="sound-heading" padding="md">
            <EditableH3 id="h3-sound-heading" blockId="sound-heading">
                Sound Waves: The Music of Sine
            </EditableH3>
        </Block>
    </StackLayout>,

    // Sound explanation
    <StackLayout key="layout-sound-explanation" maxWidth="xl">
        <Block id="sound-explanation" padding="sm">
            <EditableParagraph id="para-sound-explanation" blockId="sound-explanation">
                Every sound you hear is a pressure wave traveling through the air. The simplest sounds — pure tones — are perfect sine waves.
                The{" "}
                <InlineTooltip id="tooltip-frequency-sound" tooltip="Frequency is measured in Hertz (Hz), the number of wave cycles per second">
                    frequency
                </InlineTooltip>{" "}
                of the wave determines the pitch: higher frequency means higher pitch. The standard tuning note A4 vibrates at 440 Hz —
                that means 440 complete sine wave cycles every second.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Sound visualization
    <SplitLayout key="layout-sound-viz" ratio="2:1" gap="lg">
        <div className="space-y-4">
            <Block id="sound-wave-viz" padding="sm" hasVisualization>
                <SoundWaveVisualization />
            </Block>
            <Block id="sound-controls" padding="sm">
                <div className="flex items-center justify-center gap-4">
                    <span className="text-sm text-gray-600">Frequency:</span>
                    <InlineScrubbleNumber
                        varName="soundFrequency"
                        {...numberPropsFromDefinition(getVariableInfo("soundFrequency"))}
                        formatValue={(v) => `${v} Hz`}
                    />
                    <SoundPlayer />
                </div>
            </Block>
        </div>
        <Block id="sound-info" padding="sm">
            <div className="space-y-2 text-sm text-gray-600">
                <p><strong>220 Hz</strong> — A3 (low A)</p>
                <p><strong>440 Hz</strong> — A4 (concert pitch)</p>
                <p><strong>880 Hz</strong> — A5 (high A)</p>
                <p className="text-xs mt-4">Each doubling of frequency raises the pitch by one octave.</p>
            </div>
        </Block>
    </SplitLayout>,

    // Ocean tides heading
    <StackLayout key="layout-tides-heading" maxWidth="xl">
        <Block id="tides-heading" padding="md">
            <EditableH3 id="h3-tides-heading" blockId="tides-heading">
                Ocean Tides: The Moon's Sine Wave
            </EditableH3>
        </Block>
    </StackLayout>,

    // Tides explanation
    <StackLayout key="layout-tides-explanation" maxWidth="xl">
        <Block id="tides-explanation" padding="sm">
            <EditableParagraph id="para-tides-explanation" blockId="tides-explanation">
                Ocean tides rise and fall in a pattern that closely follows a sine wave. The gravitational pull of the Moon
                (and to a lesser extent, the Sun) creates bulges in the ocean. As the Earth rotates, coastlines pass through
                these bulges, experiencing high and low tides roughly every 12 hours.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Tides visualization
    <SplitLayout key="layout-tides-viz" ratio="1:1" gap="lg">
        <Block id="tides-viz" padding="sm" hasVisualization>
            <TideVisualization />
        </Block>
        <Block id="tides-controls" padding="sm">
            <EditableParagraph id="para-tides-controls" blockId="tides-controls">
                Drag through the hours of the day to see how the tide rises and falls. Notice the wave pattern: high tide around 6:00 and 18:00,
                low tide around 0:00 and 12:00. Hour:{" "}
                <InlineScrubbleNumber
                    varName="tideHour"
                    {...numberPropsFromDefinition(getVariableInfo("tideHour"))}
                    formatValue={(v) => `${v}:00`}
                />
            </EditableParagraph>
        </Block>
    </SplitLayout>,

    // Daylight heading
    <StackLayout key="layout-daylight-heading" maxWidth="xl">
        <Block id="daylight-heading" padding="md">
            <EditableH3 id="h3-daylight-heading" blockId="daylight-heading">
                Daylight Hours: The Seasonal Sine Wave
            </EditableH3>
        </Block>
    </StackLayout>,

    // Daylight explanation
    <StackLayout key="layout-daylight-explanation" maxWidth="xl">
        <Block id="daylight-explanation" padding="sm">
            <EditableParagraph id="para-daylight-explanation" blockId="daylight-explanation">
                The number of daylight hours changes throughout the year in a beautiful sine wave pattern. Near the equator,
                days are always close to 12 hours. But farther from the equator, days grow long in summer and short in winter.
                This happens because Earth's axis is tilted — as we orbit the Sun, different hemispheres lean toward or away from the sunlight.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Daylight visualization
    <SplitLayout key="layout-daylight-viz" ratio="1:1" gap="lg">
        <Block id="daylight-scene" padding="sm" hasVisualization>
            <DaylightVisualization />
        </Block>
        <div className="space-y-4">
            <Block id="daylight-graph" padding="sm" hasVisualization>
                <DaylightGraph />
            </Block>
            <Block id="daylight-controls" padding="sm">
                <EditableParagraph id="para-daylight-controls" blockId="daylight-controls">
                    Day of year:{" "}
                    <InlineScrubbleNumber
                        varName="dayOfYear"
                        {...numberPropsFromDefinition(getVariableInfo("dayOfYear"))}
                    />
                    . The red line shows your selected day on the sine curve of daylight hours.
                </EditableParagraph>
            </Block>
        </div>
    </SplitLayout>,

    // Pendulum heading
    <StackLayout key="layout-pendulum-heading" maxWidth="xl">
        <Block id="pendulum-heading" padding="md">
            <EditableH3 id="h3-pendulum-heading" blockId="pendulum-heading">
                The Pendulum: Simple Harmonic Motion
            </EditableH3>
        </Block>
    </StackLayout>,

    // Pendulum explanation and visualization
    <SplitLayout key="layout-pendulum-viz" ratio="1:1" gap="lg">
        <Block id="pendulum-viz" padding="sm" hasVisualization>
            <PendulumVisualization />
        </Block>
        <Block id="pendulum-explanation" padding="sm">
            <EditableParagraph id="para-pendulum-explanation" blockId="pendulum-explanation">
                A swinging pendulum is a physical sine wave generator. The angle of the pendulum over time traces out a sine curve.
                This type of motion is called{" "}
                <InlineTooltip id="tooltip-shm" tooltip="Motion where the restoring force is proportional to displacement, producing sine wave patterns">
                    simple harmonic motion
                </InlineTooltip>
                . Springs, guitar strings, and even molecules vibrating in a solid all follow this same sine wave pattern.
            </EditableParagraph>
        </Block>
    </SplitLayout>,

    // Summary
    <StackLayout key="layout-summary-heading" maxWidth="xl">
        <Block id="summary-heading" padding="md">
            <EditableH2 id="h2-summary-heading" blockId="summary-heading">
                The Universal Pattern
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-summary-text" maxWidth="xl">
        <Block id="summary-text" padding="sm">
            <EditableParagraph id="para-summary-text" blockId="summary-text">
                From the vibrations of atoms to the orbit of planets, sine waves appear wherever there is repetitive, cyclical motion.
                Understanding trigonometric functions gives you the mathematical language to describe, predict, and manipulate
                these patterns. You have now seen how a simple point moving around a circle connects to the music you hear,
                the tides you watch, and the changing seasons — all through the elegant mathematics of trigonometry.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Final assessment
    <StackLayout key="layout-final-assessment-heading" maxWidth="xl">
        <Block id="final-assessment-heading" padding="md">
            <EditableH2 id="h2-final-assessment-heading" blockId="final-assessment-heading">
                Final Check
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-question-nature-sine" maxWidth="xl">
        <Block id="question-nature-sine" padding="sm">
            <EditableParagraph id="para-question-nature-sine" blockId="question-nature-sine">
                Which of the following natural phenomena follows a sine wave pattern?{" "}
                <InlineFeedback
                    varName="answerNatureSineWave"
                    correctValue="all"
                    position="terminal"
                    successMessage="— exactly right! Sound waves, tides, and daylight hours all follow sine patterns, as does any simple harmonic motion"
                    failureMessage="— not quite"
                    hint="Think about what all these phenomena have in common — they all involve repetitive, cyclical motion"
                    reviewBlockId="summary-text"
                    reviewLabel="Review the summary"
                >
                    <InlineClozeChoice
                        varName="answerNatureSineWave"
                        correctAnswer="all"
                        options={["sound only", "tides only", "daylight only", "all"]}
                        {...choicePropsFromDefinition(getVariableInfo("answerNatureSineWave"))}
                    />
                </InlineFeedback>
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Conclusion
    <StackLayout key="layout-conclusion" maxWidth="xl">
        <Block id="conclusion" padding="lg">
            <EditableParagraph id="para-conclusion" blockId="conclusion">
                Congratulations! You have journeyed from right triangles to the unit circle, from waves on a graph to waves in nature.
                Trigonometry is not just about solving triangles — it is the mathematics of cycles, rhythms, and patterns that shape our universe.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
