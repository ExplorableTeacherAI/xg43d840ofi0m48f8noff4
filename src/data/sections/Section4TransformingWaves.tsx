/**
 * Section 4: Transforming Waves
 *
 * Students explore how amplitude, period, and phase shift transform
 * the basic sine wave. They learn to read and write the general form
 * y = A·sin(B(x - C)) + D.
 */

import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout, GridLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableH3,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineTooltip,
    InlineLinkedHighlight,
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
    scrubVarsFromDefinitions,
} from "../variables";
import { useVar, useSetVar } from "@/stores";

// ─── Reactive Components ─────────────────────────────────────────────────────

/**
 * Interactive wave transformation explorer
 */
function WaveTransformationExplorer() {
    const amplitude = useVar("waveAmplitude", 1) as number;
    const period = useVar("wavePeriod", 1) as number;
    const phaseShift = useVar("wavePhaseShift", 0) as number;
    const verticalShift = useVar("waveVerticalShift", 0) as number;

    const phaseRadians = (phaseShift * Math.PI) / 180;

    return (
        <div className="relative">
            <Cartesian2D
                height={350}
                viewBox={{ x: [-1, 13], y: [-4, 4] }}
                showGrid={true}
                plots={[
                    // Reference sine wave (faded)
                    { type: "function", fn: (x) => Math.sin(x), color: "#94a3b8", weight: 1 },
                    // Transformed wave
                    {
                        type: "function",
                        fn: (x) => amplitude * Math.sin(period * (x - phaseRadians)) + verticalShift,
                        color: "#8E90F5",
                        weight: 3,
                    },
                    // Center line for vertical shift
                    { type: "segment", point1: [-1, verticalShift], point2: [13, verticalShift], color: "#AC8BF9", weight: 1, style: "dashed" },
                    // Amplitude markers
                    {
                        type: "segment",
                        point1: [-1, verticalShift + amplitude],
                        point2: [13, verticalShift + amplitude],
                        color: "#62D0AD",
                        weight: 1,
                        style: "dashed",
                    },
                    {
                        type: "segment",
                        point1: [-1, verticalShift - amplitude],
                        point2: [13, verticalShift - amplitude],
                        color: "#62D0AD",
                        weight: 1,
                        style: "dashed",
                    },
                ]}
            />
            <InteractionHintSequence
                hintKey="wave-transformation"
                steps={[
                    {
                        gesture: "hover",
                        label: "Use the sliders below to transform the wave",
                        position: { x: "50%", y: "50%" },
                    },
                ]}
            />
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-3 text-sm">
                <span className="flex items-center gap-2">
                    <span className="w-3 h-0.5" style={{ backgroundColor: "#94a3b8" }} />
                    <span className="text-gray-500">Original sin(x)</span>
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-3 h-1" style={{ backgroundColor: "#8E90F5" }} />
                    <span style={{ color: "#8E90F5" }}>Transformed wave</span>
                </span>
            </div>
        </div>
    );
}

/**
 * Parameter controls panel
 */
function TransformationControls() {
    return (
        <div className="space-y-4">
            {/* Amplitude control */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(98, 208, 173, 0.1)" }}>
                <div className="flex items-center justify-between mb-1">
                    <span className="font-medium" style={{ color: "#62D0AD" }}>Amplitude (A)</span>
                    <InlineScrubbleNumber
                        varName="waveAmplitude"
                        {...numberPropsFromDefinition(getVariableInfo("waveAmplitude"))}
                        formatValue={(v) => v.toFixed(1)}
                    />
                </div>
                <p className="text-xs text-gray-500">Controls the height of the wave</p>
            </div>

            {/* Period control */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(142, 144, 245, 0.1)" }}>
                <div className="flex items-center justify-between mb-1">
                    <span className="font-medium" style={{ color: "#8E90F5" }}>Frequency (B)</span>
                    <InlineScrubbleNumber
                        varName="wavePeriod"
                        {...numberPropsFromDefinition(getVariableInfo("wavePeriod"))}
                        formatValue={(v) => v.toFixed(1)}
                    />
                </div>
                <p className="text-xs text-gray-500">Controls how compressed or stretched the wave is</p>
            </div>

            {/* Phase shift control */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(247, 178, 59, 0.1)" }}>
                <div className="flex items-center justify-between mb-1">
                    <span className="font-medium" style={{ color: "#F7B23B" }}>Phase Shift (C)</span>
                    <InlineScrubbleNumber
                        varName="wavePhaseShift"
                        {...numberPropsFromDefinition(getVariableInfo("wavePhaseShift"))}
                        formatValue={(v) => `${v}°`}
                    />
                </div>
                <p className="text-xs text-gray-500">Shifts the wave left or right</p>
            </div>

            {/* Vertical shift control */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(172, 139, 249, 0.1)" }}>
                <div className="flex items-center justify-between mb-1">
                    <span className="font-medium" style={{ color: "#AC8BF9" }}>Vertical Shift (D)</span>
                    <InlineScrubbleNumber
                        varName="waveVerticalShift"
                        {...numberPropsFromDefinition(getVariableInfo("waveVerticalShift"))}
                        formatValue={(v) => v.toFixed(1)}
                    />
                </div>
                <p className="text-xs text-gray-500">Shifts the wave up or down</p>
            </div>
        </div>
    );
}

/**
 * Displays the current formula with actual values
 */
function CurrentFormulaDisplay() {
    const amplitude = useVar("waveAmplitude", 1) as number;
    const period = useVar("wavePeriod", 1) as number;
    const phaseShift = useVar("wavePhaseShift", 0) as number;
    const verticalShift = useVar("waveVerticalShift", 0) as number;

    const phaseRadians = (phaseShift * Math.PI) / 180;

    // Build the formula string
    let formula = "y = ";
    if (amplitude !== 1) formula += `${amplitude.toFixed(1)} \\cdot `;
    formula += "\\sin(";
    if (period !== 1) formula += `${period.toFixed(1)} \\cdot `;
    formula += "x";
    if (phaseRadians !== 0) {
        formula += phaseRadians > 0 ? ` - ${phaseRadians.toFixed(2)}` : ` + ${Math.abs(phaseRadians).toFixed(2)}`;
    }
    formula += ")";
    if (verticalShift !== 0) {
        formula += verticalShift > 0 ? ` + ${verticalShift.toFixed(1)}` : ` - ${Math.abs(verticalShift).toFixed(1)}`;
    }

    return (
        <FormulaBlock
            latex={formula}
            colorMap={{ sin: "#8E90F5" }}
        />
    );
}

/**
 * Amplitude comparison mini-viz
 */
function AmplitudeDemo() {
    return (
        <Cartesian2D
            height={150}
            viewBox={{ x: [0, 6.5], y: [-2.5, 2.5] }}
            showGrid={false}
            plots={[
                { type: "function", fn: (x) => Math.sin(x), color: "#94a3b8", weight: 2 },
                { type: "function", fn: (x) => 2 * Math.sin(x), color: "#62D0AD", weight: 2 },
            ]}
        />
    );
}

/**
 * Frequency comparison mini-viz
 */
function FrequencyDemo() {
    return (
        <Cartesian2D
            height={150}
            viewBox={{ x: [0, 6.5], y: [-1.5, 1.5] }}
            showGrid={false}
            plots={[
                { type: "function", fn: (x) => Math.sin(x), color: "#94a3b8", weight: 2 },
                { type: "function", fn: (x) => Math.sin(2 * x), color: "#8E90F5", weight: 2 },
            ]}
        />
    );
}

// ─── Section Blocks ──────────────────────────────────────────────────────────

export const section4Blocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-transforming-heading" maxWidth="xl">
        <Block id="transforming-heading" padding="lg">
            <EditableH2 id="h2-transforming-heading" blockId="transforming-heading">
                Transforming Waves: Amplitude, Frequency, and Shift
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-transforming-intro" maxWidth="xl">
        <Block id="transforming-intro" padding="sm">
            <EditableParagraph id="para-transforming-intro" blockId="transforming-intro">
                The basic sine wave y = sin(x) is just the starting point. By adding multipliers and shifts, we can create waves
                of any height, any frequency, and starting at any point. The general form is:
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // General formula
    <StackLayout key="layout-general-formula" maxWidth="md">
        <Block id="general-formula" padding="md">
            <FormulaBlock
                latex="y = \clr{amplitude}{A} \cdot \sin(\clr{frequency}{B}(x - \clr{phase}{C})) + \clr{vertical}{D}"
                colorMap={{
                    amplitude: "#62D0AD",
                    frequency: "#8E90F5",
                    phase: "#F7B23B",
                    vertical: "#AC8BF9",
                }}
            />
        </Block>
    </StackLayout>,

    // Parameter explanations
    <StackLayout key="layout-parameters-explanation" maxWidth="xl">
        <Block id="parameters-explanation" padding="sm">
            <EditableParagraph id="para-parameters-explanation" blockId="parameters-explanation">
                Each letter controls a different aspect of the wave:{" "}
                <InlineTooltip id="tooltip-a-param" tooltip="The amplitude stretches or compresses the wave vertically">
                    <span style={{ color: "#62D0AD", fontWeight: 600 }}>A</span>
                </InlineTooltip>{" "}
                is the amplitude (height),{" "}
                <InlineTooltip id="tooltip-b-param" tooltip="The frequency controls how many cycles fit in a given space">
                    <span style={{ color: "#8E90F5", fontWeight: 600 }}>B</span>
                </InlineTooltip>{" "}
                is the frequency (how fast it oscillates),{" "}
                <InlineTooltip id="tooltip-c-param" tooltip="The phase shift moves the wave left or right">
                    <span style={{ color: "#F7B23B", fontWeight: 600 }}>C</span>
                </InlineTooltip>{" "}
                is the phase shift (horizontal position), and{" "}
                <InlineTooltip id="tooltip-d-param" tooltip="The vertical shift moves the entire wave up or down">
                    <span style={{ color: "#AC8BF9", fontWeight: 600 }}>D</span>
                </InlineTooltip>{" "}
                is the vertical shift.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive explorer heading
    <StackLayout key="layout-explorer-heading" maxWidth="xl">
        <Block id="explorer-heading" padding="md">
            <EditableH3 id="h3-explorer-heading" blockId="explorer-heading">
                Explore Wave Transformations
            </EditableH3>
        </Block>
    </StackLayout>,

    // Interactive explorer instruction
    <StackLayout key="layout-explorer-instruction" maxWidth="xl">
        <Block id="explorer-instruction" padding="sm">
            <EditableParagraph id="para-explorer-instruction" blockId="explorer-instruction">
                Drag each parameter value to see how it changes the wave. The faded gray curve shows the original y = sin(x)
                for comparison. Watch how the blue wave transforms as you adjust each parameter.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive transformation explorer
    <SplitLayout key="layout-transformation-explorer" ratio="2:1" gap="lg">
        <div className="space-y-4">
            <Block id="transformation-viz" padding="sm" hasVisualization>
                <WaveTransformationExplorer />
            </Block>
            <Block id="current-formula" padding="sm">
                <CurrentFormulaDisplay />
            </Block>
        </div>
        <Block id="transformation-controls" padding="sm">
            <TransformationControls />
        </Block>
    </SplitLayout>,

    // Amplitude explanation
    <StackLayout key="layout-amplitude-heading" maxWidth="xl">
        <Block id="amplitude-heading" padding="md">
            <EditableH3 id="h3-amplitude-heading" blockId="amplitude-heading">
                Amplitude: The Height of the Wave
            </EditableH3>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-amplitude-explanation" ratio="1:1" gap="lg">
        <Block id="amplitude-text" padding="sm">
            <EditableParagraph id="para-amplitude-text" blockId="amplitude-text">
                The amplitude A controls how tall the wave is. When A = 2, the wave oscillates between -2 and +2 instead of -1 and +1.
                When A = 0.5, the wave is only half as tall. Try increasing the amplitude in the explorer above and watch the
                green dashed lines (marking the max and min) spread apart.
            </EditableParagraph>
        </Block>
        <Block id="amplitude-demo" padding="sm" hasVisualization>
            <AmplitudeDemo />
            <p className="text-xs text-center text-gray-500 mt-2">Gray: sin(x) | Green: 2·sin(x)</p>
        </Block>
    </SplitLayout>,

    // Frequency explanation
    <StackLayout key="layout-frequency-heading" maxWidth="xl">
        <Block id="frequency-heading" padding="md">
            <EditableH3 id="h3-frequency-heading" blockId="frequency-heading">
                Frequency: How Fast It Oscillates
            </EditableH3>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-frequency-explanation" ratio="1:1" gap="lg">
        <Block id="frequency-text" padding="sm">
            <EditableParagraph id="para-frequency-text" blockId="frequency-text">
                The frequency B controls how many complete waves fit in a given space. When B = 2, the wave completes two full cycles
                in the same space where the original wave completes one. This makes the wave look "compressed". When B = 0.5,
                the wave is "stretched" — it takes twice as long to complete one cycle.
            </EditableParagraph>
        </Block>
        <Block id="frequency-demo" padding="sm" hasVisualization>
            <FrequencyDemo />
            <p className="text-xs text-center text-gray-500 mt-2">Gray: sin(x) | Blue: sin(2x)</p>
        </Block>
    </SplitLayout>,

    // Assessment
    <StackLayout key="layout-section4-assessment-heading" maxWidth="xl">
        <Block id="section4-assessment-heading" padding="md">
            <EditableH2 id="h2-section4-assessment-heading" blockId="section4-assessment-heading">
                Check Your Understanding
            </EditableH2>
        </Block>
    </StackLayout>,

    // Question 1: Amplitude effect
    <StackLayout key="layout-question-amplitude" maxWidth="xl">
        <Block id="question-amplitude" padding="sm">
            <EditableParagraph id="para-question-amplitude" blockId="question-amplitude">
                Increasing the amplitude makes the wave{" "}
                <InlineFeedback
                    varName="answerAmplitudeEffect"
                    correctValue="taller"
                    position="terminal"
                    successMessage="— exactly! A larger amplitude means the wave reaches higher peaks and lower valleys"
                    failureMessage="— not quite"
                    hint="Try changing the amplitude in the explorer. Does the wave get taller, wider, or shift?"
                    reviewBlockId="transformation-viz"
                    reviewLabel="Try the explorer"
                >
                    <InlineClozeChoice
                        varName="answerAmplitudeEffect"
                        correctAnswer="taller"
                        options={["taller", "wider", "shifts right", "shifts up"]}
                        {...choicePropsFromDefinition(getVariableInfo("answerAmplitudeEffect"))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Question 2: Frequency effect
    <StackLayout key="layout-question-frequency" maxWidth="xl">
        <Block id="question-frequency" padding="sm">
            <EditableParagraph id="para-question-frequency" blockId="question-frequency">
                When you increase the frequency multiplier B, the wave becomes{" "}
                <InlineFeedback
                    varName="answerPeriodEffect"
                    correctValue="compressed"
                    position="terminal"
                    successMessage="— right! Higher frequency means more cycles in the same space, so the wave looks squeezed together"
                    failureMessage="— not quite"
                    hint="Set the frequency to 2 or 3 in the explorer. Does the wave get wider or narrower?"
                    reviewBlockId="transformation-viz"
                    reviewLabel="Try the explorer"
                >
                    <InlineClozeChoice
                        varName="answerPeriodEffect"
                        correctAnswer="compressed"
                        options={["stretched", "compressed", "taller", "shorter"]}
                        {...choicePropsFromDefinition(getVariableInfo("answerPeriodEffect"))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Transition
    <StackLayout key="layout-section4-transition" maxWidth="xl">
        <Block id="section4-transition" padding="md">
            <EditableParagraph id="para-section4-transition" blockId="section4-transition">
                Now that you can create waves of any shape, let us see where these patterns appear in the world around us.
                Spoiler: they are everywhere.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
