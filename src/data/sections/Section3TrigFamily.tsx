/**
 * Section 3: Meet the Trig Family
 *
 * Students compare sine, cosine, and tangent functions side by side,
 * understanding their similarities and key differences.
 */

import { type ReactElement, useCallback } from "react";
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
    InlineClozeInput,
    InlineToggle,
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
 * Comparison chart showing all three trig functions
 */
function TrigFamilyComparison() {
    const angle = useVar("trigCompareAngle", 45) as number;
    const setVar = useSetVar();
    const highlightId = useVar("trigHighlight", "") as string;

    const radians = (angle * Math.PI) / 180;
    const xPos = radians;

    const sinValue = Math.sin(radians);
    const cosValue = Math.cos(radians);
    const tanValue = Math.tan(radians);

    // Clamp tangent for display
    const tanDisplay = Math.abs(tanValue) > 10 ? (tanValue > 0 ? 10 : -10) : tanValue;
    const isTanUndefined = Math.abs(Math.cos(radians)) < 0.001;

    // Handle point drag
    const handlePointChange = useCallback((point: [number, number]) => {
        let newAngle = (point[0] * 180) / Math.PI;
        newAngle = Math.max(0, Math.min(360, newAngle));
        setVar("trigCompareAngle", Math.round(newAngle / 5) * 5);
    }, [setVar]);

    // Determine colors based on highlight
    const sineColor = highlightId === "sine" ? "#8E90F5" : highlightId ? "rgba(142, 144, 245, 0.3)" : "#8E90F5";
    const cosineColor = highlightId === "cosine" ? "#62D0AD" : highlightId ? "rgba(98, 208, 173, 0.3)" : "#62D0AD";
    const tangentColor = highlightId === "tangent" ? "#F4A89A" : highlightId ? "rgba(244, 168, 154, 0.3)" : "#F4A89A";

    return (
        <div className="relative">
            <Cartesian2D
                height={320}
                viewBox={{ x: [-0.3, 7], y: [-3, 3] }}
                showGrid={true}
                highlightVarName="trigHighlight"
                plots={[
                    // Sine wave
                    { type: "function", fn: (x) => Math.sin(x), color: sineColor, weight: 3, highlightId: "sine" },
                    // Cosine wave
                    { type: "function", fn: (x) => Math.cos(x), color: cosineColor, weight: 3, highlightId: "cosine" },
                    // Tangent (clamped)
                    {
                        type: "function",
                        fn: (x) => {
                            const tan = Math.tan(x);
                            if (Math.abs(Math.cos(x)) < 0.05) return NaN; // Hide asymptotes
                            return Math.max(-3, Math.min(3, tan));
                        },
                        color: tangentColor,
                        weight: 3,
                        highlightId: "tangent",
                    },
                    // Vertical line at current angle
                    { type: "segment", point1: [xPos, -3], point2: [xPos, 3], color: "#F7B23B", weight: 1, style: "dashed" },
                    // Asymptote markers for tangent
                    { type: "segment", point1: [Math.PI / 2, -3], point2: [Math.PI / 2, 3], color: "#94a3b8", weight: 1, style: "dashed" },
                    { type: "segment", point1: [(3 * Math.PI) / 2, -3], point2: [(3 * Math.PI) / 2, 3], color: "#94a3b8", weight: 1, style: "dashed" },
                ]}
                movablePoints={[
                    {
                        initial: [xPos, 0],
                        color: "#F7B23B",
                        constrain: (p) => [p[0], 0],
                        onChange: handlePointChange,
                        position: [xPos, 0],
                    },
                ]}
            />
            <InteractionHintSequence
                hintKey="trig-family-comparison"
                steps={[
                    {
                        gesture: "drag-horizontal",
                        label: "Drag the point to compare function values at different angles",
                        position: { x: "50%", y: "55%" },
                    },
                ]}
            />
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
                <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#F4A89A" }} />
                    <span style={{ color: "#F4A89A" }}>tan(θ)</span>
                </span>
            </div>
        </div>
    );
}

/**
 * Shows current values of all three functions
 */
function TrigValuesDisplay() {
    const angle = useVar("trigCompareAngle", 45) as number;
    const radians = (angle * Math.PI) / 180;

    const sinValue = Math.sin(radians);
    const cosValue = Math.cos(radians);
    const tanValue = Math.tan(radians);
    const isTanUndefined = Math.abs(Math.cos(radians)) < 0.001;

    return (
        <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-1.5 px-3 rounded-lg" style={{ backgroundColor: "rgba(142, 144, 245, 0.1)" }}>
                <span style={{ color: "#8E90F5", fontWeight: 500 }}>sin({angle}°)</span>
                <span className="font-mono" style={{ color: "#8E90F5" }}>{sinValue.toFixed(3)}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 px-3 rounded-lg" style={{ backgroundColor: "rgba(98, 208, 173, 0.1)" }}>
                <span style={{ color: "#62D0AD", fontWeight: 500 }}>cos({angle}°)</span>
                <span className="font-mono" style={{ color: "#62D0AD" }}>{cosValue.toFixed(3)}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 px-3 rounded-lg" style={{ backgroundColor: "rgba(244, 168, 154, 0.1)" }}>
                <span style={{ color: "#F4A89A", fontWeight: 500 }}>tan({angle}°)</span>
                <span className="font-mono" style={{ color: "#F4A89A" }}>
                    {isTanUndefined ? "undefined" : tanValue.toFixed(3)}
                </span>
            </div>
        </div>
    );
}

/**
 * Individual function cards
 */
function FunctionCard({
    name,
    formula,
    description,
    color,
    range,
}: {
    name: string;
    formula: string;
    description: string;
    color: string;
    range: string;
}) {
    return (
        <div
            className="p-4 rounded-xl border-2"
            style={{
                borderColor: color,
                backgroundColor: `${color}10`,
            }}
        >
            <h4 className="font-semibold text-lg mb-2" style={{ color }}>
                {name}
            </h4>
            <div className="text-sm text-gray-600 mb-3">{description}</div>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-gray-500">Formula:</span>
                <span className="font-mono text-sm" style={{ color }}>{formula}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Range:</span>
                <span className="font-mono text-sm text-gray-700">{range}</span>
            </div>
        </div>
    );
}

// ─── Section Blocks ──────────────────────────────────────────────────────────

export const section3Blocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-trig-family-heading" maxWidth="xl">
        <Block id="trig-family-heading" padding="lg">
            <EditableH2 id="h2-trig-family-heading" blockId="trig-family-heading">
                Meet the Trig Family: Sine, Cosine, and Tangent
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-trig-family-intro" maxWidth="xl">
        <Block id="trig-family-intro" padding="sm">
            <EditableParagraph id="para-trig-family-intro" blockId="trig-family-intro">
                Sine, cosine, and tangent are the three primary trigonometric functions. They are closely related — in fact, tangent
                is simply sine divided by cosine. Each has its own personality: sine and cosine are smooth waves that stay between
                -1 and 1, while tangent can grow to infinity and has some dramatic behaviour at certain angles.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Function cards
    <GridLayout key="layout-function-cards" columns={3} gap="md">
        <Block id="sine-card" padding="sm">
            <FunctionCard
                name="Sine"
                formula="sin(θ) = opp/hyp"
                description="The vertical coordinate on the unit circle. Smooth and bounded."
                color="#8E90F5"
                range="[-1, 1]"
            />
        </Block>
        <Block id="cosine-card" padding="sm">
            <FunctionCard
                name="Cosine"
                formula="cos(θ) = adj/hyp"
                description="The horizontal coordinate on the unit circle. Same shape as sine, shifted 90°."
                color="#62D0AD"
                range="[-1, 1]"
            />
        </Block>
        <Block id="tangent-card" padding="sm">
            <FunctionCard
                name="Tangent"
                formula="tan(θ) = sin/cos"
                description="Ratio of sine to cosine. Unbounded with vertical asymptotes."
                color="#F4A89A"
                range="(-∞, ∞)"
            />
        </Block>
    </GridLayout>,

    // Comparison visualization heading
    <StackLayout key="layout-comparison-heading" maxWidth="xl">
        <Block id="comparison-heading" padding="md">
            <EditableH3 id="h3-comparison-heading" blockId="comparison-heading">
                Compare the Functions
            </EditableH3>
        </Block>
    </StackLayout>,

    // Interactive comparison
    <SplitLayout key="layout-comparison-split" ratio="2:1" gap="lg">
        <Block id="comparison-viz" padding="sm" hasVisualization>
            <TrigFamilyComparison />
        </Block>
        <div className="space-y-4">
            <Block id="comparison-angle-control" padding="sm">
                <EditableParagraph id="para-comparison-angle-control" blockId="comparison-angle-control">
                    Drag the point to explore how the three functions compare at different angles.
                    At θ ={" "}
                    <InlineScrubbleNumber
                        varName="trigCompareAngle"
                        {...numberPropsFromDefinition(getVariableInfo("trigCompareAngle"))}
                        formatValue={(v) => `${v}°`}
                    />:
                </EditableParagraph>
            </Block>
            <Block id="comparison-values" padding="sm">
                <TrigValuesDisplay />
            </Block>
        </div>
    </SplitLayout>,

    // Key relationships
    <StackLayout key="layout-relationships-heading" maxWidth="xl">
        <Block id="relationships-heading" padding="md">
            <EditableH3 id="h3-relationships-heading" blockId="relationships-heading">
                Key Relationships
            </EditableH3>
        </Block>
    </StackLayout>,

    // Cosine is shifted sine
    <StackLayout key="layout-cosine-shift" maxWidth="xl">
        <Block id="cosine-shift" padding="sm">
            <EditableParagraph id="para-cosine-shift" blockId="cosine-shift">
                Notice that the{" "}
                <InlineLinkedHighlight
                    id="highlight-cosine-curve"
                    varName="trigHighlight"
                    highlightId="cosine"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo("trigHighlight"))}
                    color="#62D0AD"
                >
                    cosine curve
                </InlineLinkedHighlight>{" "}
                looks exactly like the{" "}
                <InlineLinkedHighlight
                    id="highlight-sine-curve"
                    varName="trigHighlight"
                    highlightId="sine"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo("trigHighlight"))}
                    color="#8E90F5"
                >
                    sine curve
                </InlineLinkedHighlight>
                , just shifted 90° to the left. Mathematically: cos(θ) = sin(θ + 90°).
                This means sine and cosine carry exactly the same information, just with different starting points.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Tangent asymptotes
    <StackLayout key="layout-tangent-asymptotes" maxWidth="xl">
        <Block id="tangent-asymptotes" padding="sm">
            <EditableParagraph id="para-tangent-asymptotes" blockId="tangent-asymptotes">
                The{" "}
                <InlineLinkedHighlight
                    id="highlight-tangent-curve"
                    varName="trigHighlight"
                    highlightId="tangent"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo("trigHighlight"))}
                    color="#F4A89A"
                >
                    tangent curve
                </InlineLinkedHighlight>{" "}
                behaves very differently. At 90° and 270°, cosine equals zero, so tan(θ) = sin(θ)/cos(θ) involves dividing by zero.
                The function shoots off to infinity, creating vertical{" "}
                <InlineTooltip id="tooltip-asymptote" tooltip="A line that a curve approaches but never quite reaches">
                    asymptotes
                </InlineTooltip>{" "}
                (the dashed gray lines in the chart). Drag the point close to 90° and watch what happens to the tangent value.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Formula block showing relationship
    <StackLayout key="layout-tangent-formula" maxWidth="md">
        <Block id="tangent-formula" padding="md">
            <FormulaBlock
                latex="\tan(\theta) = \frac{\sin(\theta)}{\cos(\theta)}"
                colorMap={{ sin: "#8E90F5", cos: "#62D0AD", tan: "#F4A89A" }}
            />
        </Block>
    </StackLayout>,

    // Assessment
    <StackLayout key="layout-section3-assessment-heading" maxWidth="xl">
        <Block id="section3-assessment-heading" padding="md">
            <EditableH2 id="h2-section3-assessment-heading" blockId="section3-assessment-heading">
                Check Your Understanding
            </EditableH2>
        </Block>
    </StackLayout>,

    // Question: When is tangent undefined?
    <StackLayout key="layout-question-tangent-undefined" maxWidth="xl">
        <Block id="question-tangent-undefined" padding="sm">
            <EditableParagraph id="para-question-tangent-undefined" blockId="question-tangent-undefined">
                Tangent is undefined at{" "}
                <InlineFeedback
                    varName="answerTangentUndefined"
                    correctValue="90"
                    position="terminal"
                    successMessage="° — correct! At 90°, cos(90°) = 0, so we cannot divide by it"
                    failureMessage="° — not quite"
                    hint="Tangent equals sin/cos. At what angle in the first quadrant does cosine equal zero?"
                    reviewBlockId="comparison-viz"
                    reviewLabel="Check the graph"
                >
                    <InlineClozeInput
                        varName="answerTangentUndefined"
                        correctAnswer="90"
                        {...clozePropsFromDefinition(getVariableInfo("answerTangentUndefined"))}
                    />
                </InlineFeedback>° because at that angle, we would be dividing by zero.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Transition
    <StackLayout key="layout-section3-transition" maxWidth="xl">
        <Block id="section3-transition" padding="md">
            <EditableParagraph id="para-section3-transition" blockId="section3-transition">
                Now you have met the trig family. But these basic waves can be stretched, squeezed, and shifted in many ways.
                Let us explore how transformations change the shape of trigonometric functions.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
