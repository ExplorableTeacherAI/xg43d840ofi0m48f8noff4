/**
 * Section 2: The Sine Wave Emerges
 *
 * Students explore the key properties of sine waves: period, amplitude,
 * and special angle values. They see how the wave repeats and discover
 * the relationship between angle values and sine outputs.
 */

import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
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
import { useVar, useSetVar } from "@/stores";

// ─── Reactive Components ─────────────────────────────────────────────────────

/**
 * Interactive sine wave explorer with scrubable angle
 */
function SineWaveExplorer() {
    const angle = useVar("sineWaveAngle", 90) as number;
    const setVar = useSetVar();

    const radians = (angle * Math.PI) / 180;
    const sineValue = Math.sin(radians);
    const xPos = radians; // x position on the graph

    // Handle dragging the point on the wave
    const handlePointChange = (point: [number, number]) => {
        let newAngle = (point[0] * 180) / Math.PI;
        newAngle = Math.max(0, Math.min(720, newAngle));
        setVar("sineWaveAngle", Math.round(newAngle / 15) * 15);
    };

    return (
        <div className="relative">
            <Cartesian2D
                height={300}
                viewBox={{ x: [-0.5, 13], y: [-1.8, 1.8] }}
                showGrid={true}
                plots={[
                    // Sine wave
                    { type: "function", fn: (x) => Math.sin(x), color: "#8E90F5", weight: 3 },
                    // Zero line
                    { type: "segment", point1: [0, 0], point2: [13, 0], color: "#94a3b8", weight: 1 },
                    // Vertical line at current x
                    { type: "segment", point1: [xPos, 0], point2: [xPos, sineValue], color: "#F7B23B", weight: 2, style: "dashed" },
                    // Horizontal line to y-axis
                    { type: "segment", point1: [0, sineValue], point2: [xPos, sineValue], color: "#F7B23B", weight: 1, style: "dashed" },
                    // Max/min reference lines
                    { type: "segment", point1: [0, 1], point2: [13, 1], color: "#62D0AD", weight: 1, style: "dashed" },
                    { type: "segment", point1: [0, -1], point2: [13, -1], color: "#ef4444", weight: 1, style: "dashed" },
                ]}
                movablePoints={[
                    {
                        initial: [xPos, sineValue],
                        color: "#F7B23B",
                        constrain: (p) => [p[0], Math.sin(p[0])],
                        onChange: handlePointChange,
                        position: [xPos, sineValue],
                    },
                ]}
            />
            <InteractionHintSequence
                hintKey="sine-wave-explorer"
                steps={[
                    {
                        gesture: "drag-horizontal",
                        label: "Drag the point along the wave to explore sine values",
                        position: { x: "40%", y: "35%" },
                    },
                ]}
            />
            {/* Angle markers */}
            <div className="flex justify-between px-4 text-xs text-gray-500 mt-1">
                <span>0°</span>
                <span>90°</span>
                <span>180°</span>
                <span>270°</span>
                <span>360°</span>
                <span>450°</span>
                <span>540°</span>
                <span>630°</span>
                <span>720°</span>
            </div>
        </div>
    );
}

/**
 * Displays the current sine value with the angle
 */
function CurrentSineValue() {
    const angle = useVar("sineWaveAngle", 90) as number;
    const radians = (angle * Math.PI) / 180;
    const sineValue = Math.sin(radians);

    return (
        <span>
            sin(<span style={{ color: "#8E90F5" }}>{angle}°</span>) ={" "}
            <span style={{ color: "#F7B23B", fontWeight: 600 }}>{sineValue.toFixed(3)}</span>
        </span>
    );
}

/**
 * Special angles table showing key sine values
 */
function SpecialAnglesTable() {
    const angles = [0, 30, 45, 60, 90, 180, 270, 360];

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="px-3 py-2 text-left font-medium" style={{ color: "#8E90F5" }}>Angle (θ)</th>
                        <th className="px-3 py-2 text-left font-medium" style={{ color: "#F7B23B" }}>sin(θ)</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Pattern</th>
                    </tr>
                </thead>
                <tbody>
                    {angles.map((angle) => {
                        const radians = (angle * Math.PI) / 180;
                        const sineValue = Math.sin(radians);
                        let pattern = "";
                        if (angle === 0 || angle === 180 || angle === 360) pattern = "Zero crossing";
                        else if (angle === 90) pattern = "Maximum";
                        else if (angle === 270) pattern = "Minimum";
                        else pattern = "Rising/Falling";

                        return (
                            <tr key={angle} className="border-b border-gray-100">
                                <td className="px-3 py-2" style={{ color: "#8E90F5" }}>{angle}°</td>
                                <td className="px-3 py-2 font-mono" style={{ color: "#F7B23B" }}>{sineValue.toFixed(3)}</td>
                                <td className="px-3 py-2 text-gray-600">{pattern}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// ─── Section Blocks ──────────────────────────────────────────────────────────

export const section2Blocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-sine-wave-heading" maxWidth="xl">
        <Block id="sine-wave-heading" padding="lg">
            <EditableH2 id="h2-sine-wave-heading" blockId="sine-wave-heading">
                The Sine Wave: A Closer Look
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-sine-wave-intro" maxWidth="xl">
        <Block id="sine-wave-intro" padding="sm">
            <EditableParagraph id="para-sine-wave-intro" blockId="sine-wave-intro">
                The sine wave has a distinctive shape that repeats forever. As the angle increases from 0° to 360°, the sine value
                rises from 0 to its maximum of 1, falls back through 0 to its minimum of -1, and returns to 0. Then the whole pattern
                repeats. This repeating distance is called the{" "}
                <InlineTooltip id="tooltip-period" tooltip="The distance (or time) it takes for the wave to complete one full cycle">
                    period
                </InlineTooltip>{" "}
                of the wave.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive sine explorer
    <SplitLayout key="layout-sine-explorer" ratio="2:1" gap="lg">
        <Block id="sine-explorer-viz" padding="sm" hasVisualization>
            <SineWaveExplorer />
        </Block>
        <div className="space-y-4">
            <Block id="sine-explorer-value" padding="sm">
                <EditableParagraph id="para-sine-explorer-value" blockId="sine-explorer-value">
                    Drag the orange point along the wave. At{" "}
                    <InlineScrubbleNumber
                        varName="sineWaveAngle"
                        {...numberPropsFromDefinition(getVariableInfo("sineWaveAngle"))}
                        formatValue={(v) => `${v}°`}
                    />
                    , you can see that <CurrentSineValue />.
                </EditableParagraph>
            </Block>
            <Block id="sine-explorer-formula" padding="sm">
                <FormulaBlock
                    latex="-1 \leq \sin(\theta) \leq 1"
                    colorMap={{ sin: "#8E90F5" }}
                />
            </Block>
        </div>
    </SplitLayout>,

    // Key observations heading
    <StackLayout key="layout-key-observations-heading" maxWidth="xl">
        <Block id="key-observations-heading" padding="md">
            <EditableH2 id="h2-key-observations-heading" blockId="key-observations-heading">
                Key Properties of the Sine Wave
            </EditableH2>
        </Block>
    </StackLayout>,

    // Period explanation
    <StackLayout key="layout-period-explanation" maxWidth="xl">
        <Block id="period-explanation" padding="sm">
            <EditableParagraph id="para-period-explanation" blockId="period-explanation">
                The sine wave completes one full cycle every 360° (or 2π radians). This means that
                sin(θ) = sin(θ + 360°) for any angle θ. Try dragging the point past 360° — you will see the same pattern repeat.
                This property of repeating is what makes sine so useful for describing cyclical phenomena like sound, light, and seasons.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Amplitude explanation
    <StackLayout key="layout-amplitude-explanation" maxWidth="xl">
        <Block id="amplitude-explanation" padding="sm">
            <EditableParagraph id="para-amplitude-explanation" blockId="amplitude-explanation">
                The{" "}
                <InlineTooltip id="tooltip-amplitude" tooltip="The maximum distance from the center line (0) to the peak of the wave">
                    amplitude
                </InlineTooltip>{" "}
                of this basic sine wave is 1, meaning the wave oscillates between -1 and 1.
                The green dashed line at y = 1 marks the maximum, and the red dashed line at y = -1 marks the minimum.
                The wave is perfectly symmetric about the x-axis.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Special angles section
    <StackLayout key="layout-special-angles-heading" maxWidth="xl">
        <Block id="special-angles-heading" padding="md">
            <EditableH2 id="h2-special-angles-heading" blockId="special-angles-heading">
                Special Angles to Remember
            </EditableH2>
        </Block>
    </StackLayout>,

    // Special angles intro
    <StackLayout key="layout-special-angles-intro" maxWidth="xl">
        <Block id="special-angles-intro" padding="sm">
            <EditableParagraph id="para-special-angles-intro" blockId="special-angles-intro">
                Some angles produce particularly memorable sine values. These are worth committing to memory,
                as they appear constantly in mathematics and physics. Use the interactive wave above to verify each of these values.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Special angles table
    <StackLayout key="layout-special-angles-table" maxWidth="lg">
        <Block id="special-angles-table" padding="md">
            <SpecialAnglesTable />
        </Block>
    </StackLayout>,

    // Assessment heading
    <StackLayout key="layout-section2-assessment-heading" maxWidth="xl">
        <Block id="section2-assessment-heading" padding="md">
            <EditableH2 id="h2-section2-assessment-heading" blockId="section2-assessment-heading">
                Check Your Understanding
            </EditableH2>
        </Block>
    </StackLayout>,

    // Question 1: Maximum value
    <StackLayout key="layout-question-max-value" maxWidth="xl">
        <Block id="question-max-value" padding="sm">
            <EditableParagraph id="para-question-max-value" blockId="question-max-value">
                The maximum value of sin(θ) is{" "}
                <InlineFeedback
                    varName="answerSineMaxValue"
                    correctValue="1"
                    position="terminal"
                    successMessage="— correct! The sine function reaches its peak of 1 at 90°"
                    failureMessage="— not quite"
                    hint="Drag the point on the wave above to find where the wave reaches its highest point"
                    reviewBlockId="sine-explorer-viz"
                    reviewLabel="Check the wave"
                >
                    <InlineClozeInput
                        varName="answerSineMaxValue"
                        correctAnswer="1"
                        {...clozePropsFromDefinition(getVariableInfo("answerSineMaxValue"))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Question 2: Zero crossing
    <StackLayout key="layout-question-zero-crossing" maxWidth="xl">
        <Block id="question-zero-crossing" padding="sm">
            <EditableParagraph id="para-question-zero-crossing" blockId="question-zero-crossing">
                After starting at 0° and rising to a maximum at 90°, the sine wave crosses zero again at{" "}
                <InlineFeedback
                    varName="answerSineZeroAngle"
                    correctValue="180"
                    position="terminal"
                    successMessage="° — exactly right! The wave returns to zero at 180° before continuing to its minimum"
                    failureMessage="° — not quite"
                    hint="After the peak at 90°, where does the wave cross the x-axis? Drag the point to find it"
                    reviewBlockId="sine-explorer-viz"
                    reviewLabel="Check the wave"
                >
                    <InlineClozeInput
                        varName="answerSineZeroAngle"
                        correctAnswer="180"
                        {...clozePropsFromDefinition(getVariableInfo("answerSineZeroAngle"))}
                    />
                </InlineFeedback>°.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Transition
    <StackLayout key="layout-section2-transition" maxWidth="xl">
        <Block id="section2-transition" padding="md">
            <EditableParagraph id="para-section2-transition" blockId="section2-transition">
                Sine is not alone — it has two close relatives: cosine and tangent. Together, they form the family of
                trigonometric functions. Let us meet the whole family.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
