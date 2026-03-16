import { type ReactElement } from "react";

// Initialize variables and their colors from this file's variable definitions
import { useVariableStore, initializeVariableColors } from "@/stores";
import { getDefaultValues, variableDefinitions } from "./variables";
useVariableStore.getState().initialize(getDefaultValues());
initializeVariableColors(variableDefinitions);

// Import all sections
import { section1Blocks } from "./sections/Section1TrianglesToCircles";
import { section2Blocks } from "./sections/Section2SineWaveEmerges";
import { section3Blocks } from "./sections/Section3TrigFamily";
import { section4Blocks } from "./sections/Section4TransformingWaves";
import { section5Blocks } from "./sections/Section5NatureApplications";

/**
 * ------------------------------------------------------------------
 * TRIGONOMETRY LESSON: Graphical Representation and Applications
 * ------------------------------------------------------------------
 *
 * This lesson teaches secondary school students about:
 * 1. How sine and cosine emerge from the unit circle
 * 2. The properties of sine waves (period, amplitude, special angles)
 * 3. Comparing sine, cosine, and tangent functions
 * 4. Transformations: amplitude, frequency, phase shift, vertical shift
 * 5. Real-world applications in nature: sound, tides, daylight, pendulums
 *
 * Target audience: Secondary school (ages 13-17)
 * Prerequisites: Basic understanding of right triangle trigonometry
 */

export const blocks: ReactElement[] = [
    // Section 1: From Triangles to Circles
    ...section1Blocks,

    // Section 2: The Sine Wave Emerges
    ...section2Blocks,

    // Section 3: Meet the Trig Family
    ...section3Blocks,

    // Section 4: Transforming Waves
    ...section4Blocks,

    // Section 5: Trigonometry in Nature
    ...section5Blocks,
];
