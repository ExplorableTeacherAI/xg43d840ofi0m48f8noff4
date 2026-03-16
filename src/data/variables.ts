/**
 * Variables Configuration
 * =======================
 *
 * CENTRAL PLACE TO DEFINE ALL SHARED VARIABLES
 *
 * This file defines all variables that can be shared across sections.
 * AI agents should read this file to understand what variables are available.
 *
 * USAGE:
 * 1. Define variables here with their default values and metadata
 * 2. Use them in any section with: const x = useVar('variableName', defaultValue)
 * 3. Update them with: setVar('variableName', newValue)
 */

import { type VarValue } from '@/stores';

/**
 * Variable definition with metadata
 */
export interface VariableDefinition {
    /** Default value */
    defaultValue: VarValue;
    /** Human-readable label */
    label?: string;
    /** Description for AI agents */
    description?: string;
    /** Variable type hint */
    type?: 'number' | 'text' | 'boolean' | 'select' | 'array' | 'object' | 'spotColor' | 'linkedHighlight';
    /** Unit (e.g., 'Hz', '°', 'm/s') - for numbers */
    unit?: string;
    /** Minimum value (for number sliders) */
    min?: number;
    /** Maximum value (for number sliders) */
    max?: number;
    /** Step increment (for number sliders) */
    step?: number;
    /** Display color for InlineScrubbleNumber / InlineSpotColor (e.g. '#D81B60') */
    color?: string;
    /** Options for 'select' type variables */
    options?: string[];
    /** Placeholder text for text inputs */
    placeholder?: string;
    /** Correct answer for cloze input validation */
    correctAnswer?: string;
    /** Whether cloze matching is case sensitive */
    caseSensitive?: boolean;
    /** Background color for inline components */
    bgColor?: string;
    /** Schema hint for object types (for AI agents) */
    schema?: string;
}

/**
 * =====================================================
 * 🎯 TRIGONOMETRY LESSON VARIABLES
 * =====================================================
 */
export const variableDefinitions: Record<string, VariableDefinition> = {
    // ========================================
    // SECTION 1: From Triangles to Circles
    // ========================================

    // Angle for unit circle exploration
    unitCircleAngle: {
        defaultValue: 45,
        type: 'number',
        label: 'Angle',
        description: 'Angle in degrees for the unit circle point',
        unit: '°',
        min: 0,
        max: 360,
        step: 1,
        color: '#8E90F5',
    },

    // Animation time for the sine wave trace
    animationTime: {
        defaultValue: 0,
        type: 'number',
        label: 'Time',
        description: 'Animation progress from 0 to 2π',
        min: 0,
        max: 6.28,
        step: 0.01,
        color: '#62D0AD',
    },

    // Animation playing state
    animationPlaying: {
        defaultValue: false,
        type: 'boolean',
        label: 'Playing',
        description: 'Whether the animation is currently playing',
    },

    // Linked highlight for unit circle parts
    unitCircleHighlight: {
        defaultValue: '',
        type: 'text',
        label: 'Unit Circle Highlight',
        description: 'Currently highlighted element in unit circle',
        color: '#62D0AD',
        bgColor: 'rgba(98, 208, 173, 0.15)',
    },

    // Section 1 assessment answers
    answerSineDefinition: {
        defaultValue: '',
        type: 'text',
        label: 'Sine Definition Answer',
        description: 'Student answer for what sine represents',
        placeholder: '???',
        correctAnswer: 'y',
        color: '#8E90F5',
    },

    answerCosineDefinition: {
        defaultValue: '',
        type: 'text',
        label: 'Cosine Definition Answer',
        description: 'Student answer for what cosine represents',
        placeholder: '???',
        correctAnswer: 'x',
        color: '#62D0AD',
    },

    // ========================================
    // SECTION 2: The Sine Wave Emerges
    // ========================================

    sineWaveAngle: {
        defaultValue: 90,
        type: 'number',
        label: 'Angle',
        description: 'Angle for exploring sine wave values',
        unit: '°',
        min: 0,
        max: 720,
        step: 15,
        color: '#8E90F5',
    },

    answerSineMaxValue: {
        defaultValue: '',
        type: 'text',
        label: 'Sine Max Value',
        description: 'Student answer for maximum sine value',
        placeholder: '???',
        correctAnswer: '1',
        color: '#F7B23B',
    },

    answerSineZeroAngle: {
        defaultValue: '',
        type: 'text',
        label: 'Sine Zero Angle',
        description: 'Student answer for when sine equals zero',
        placeholder: '???',
        correctAnswer: '180',
        color: '#F7B23B',
    },

    // ========================================
    // SECTION 3: Meet the Trig Family
    // ========================================

    trigFunctionType: {
        defaultValue: 'sine',
        type: 'select',
        label: 'Function Type',
        description: 'Which trig function to display',
        options: ['sine', 'cosine', 'tangent'],
        color: '#AC8BF9',
    },

    trigCompareAngle: {
        defaultValue: 45,
        type: 'number',
        label: 'Comparison Angle',
        description: 'Angle for comparing trig functions',
        unit: '°',
        min: 0,
        max: 360,
        step: 5,
        color: '#62CCF9',
    },

    trigHighlight: {
        defaultValue: '',
        type: 'text',
        label: 'Trig Function Highlight',
        description: 'Currently highlighted trig function',
        color: '#AC8BF9',
        bgColor: 'rgba(172, 139, 249, 0.15)',
    },

    answerTangentUndefined: {
        defaultValue: '',
        type: 'text',
        label: 'Tangent Undefined Angle',
        description: 'Student answer for when tangent is undefined',
        placeholder: '???',
        correctAnswer: '90',
        color: '#F4A89A',
    },

    // ========================================
    // SECTION 4: Transforming Waves
    // ========================================

    waveAmplitude: {
        defaultValue: 1,
        type: 'number',
        label: 'Amplitude',
        description: 'Controls the height of the wave',
        min: 0.5,
        max: 3,
        step: 0.1,
        color: '#62D0AD',
    },

    wavePeriod: {
        defaultValue: 1,
        type: 'number',
        label: 'Period Multiplier',
        description: 'Controls how stretched or compressed the wave is',
        min: 0.5,
        max: 3,
        step: 0.1,
        color: '#8E90F5',
    },

    wavePhaseShift: {
        defaultValue: 0,
        type: 'number',
        label: 'Phase Shift',
        description: 'Horizontal shift of the wave',
        unit: '°',
        min: -180,
        max: 180,
        step: 15,
        color: '#F7B23B',
    },

    waveVerticalShift: {
        defaultValue: 0,
        type: 'number',
        label: 'Vertical Shift',
        description: 'Vertical shift of the wave',
        min: -2,
        max: 2,
        step: 0.1,
        color: '#AC8BF9',
    },

    answerAmplitudeEffect: {
        defaultValue: '',
        type: 'select',
        label: 'Amplitude Effect',
        description: 'What happens when amplitude increases',
        placeholder: '???',
        correctAnswer: 'taller',
        options: ['taller', 'wider', 'shifts right', 'shifts up'],
        color: '#62D0AD',
    },

    answerPeriodEffect: {
        defaultValue: '',
        type: 'select',
        label: 'Period Effect',
        description: 'What happens when period multiplier increases',
        placeholder: '???',
        correctAnswer: 'compressed',
        options: ['stretched', 'compressed', 'taller', 'shorter'],
        color: '#8E90F5',
    },

    // ========================================
    // SECTION 5: Trigonometry in Nature
    // ========================================

    soundFrequency: {
        defaultValue: 440,
        type: 'number',
        label: 'Sound Frequency',
        description: 'Frequency of sound wave in Hz',
        unit: 'Hz',
        min: 220,
        max: 880,
        step: 10,
        color: '#62CCF9',
    },

    tideHour: {
        defaultValue: 0,
        type: 'number',
        label: 'Hour of Day',
        description: 'Time of day for tide visualization',
        unit: 'h',
        min: 0,
        max: 24,
        step: 1,
        color: '#7DD3C0',
    },

    dayOfYear: {
        defaultValue: 172,
        type: 'number',
        label: 'Day of Year',
        description: 'Day number for daylight hours visualization',
        min: 1,
        max: 365,
        step: 1,
        color: '#F7B23B',
    },

    natureExampleType: {
        defaultValue: 'sound',
        type: 'select',
        label: 'Nature Example',
        description: 'Which natural phenomenon to explore',
        options: ['sound', 'tides', 'daylight', 'pendulum'],
        color: '#A8D5A2',
    },

    answerNatureSineWave: {
        defaultValue: '',
        type: 'select',
        label: 'Natural Sine Wave',
        description: 'Which phenomenon follows a sine pattern',
        placeholder: '???',
        correctAnswer: 'all',
        options: ['sound only', 'tides only', 'daylight only', 'all'],
        color: '#A8D5A2',
    },
};

/**
 * Get all variable names (for AI agents to discover)
 */
export const getVariableNames = (): string[] => {
    return Object.keys(variableDefinitions);
};

/**
 * Get a variable's default value
 */
export const getDefaultValue = (name: string): VarValue => {
    return variableDefinitions[name]?.defaultValue ?? 0;
};

/**
 * Get a variable's metadata
 */
export const getVariableInfo = (name: string): VariableDefinition | undefined => {
    return variableDefinitions[name];
};

/**
 * Get all default values as a record (for initialization)
 */
export const getDefaultValues = (): Record<string, VarValue> => {
    const defaults: Record<string, VarValue> = {};
    for (const [name, def] of Object.entries(variableDefinitions)) {
        defaults[name] = def.defaultValue;
    }
    return defaults;
};

/**
 * Get number props for InlineScrubbleNumber from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
export function numberPropsFromDefinition(def: VariableDefinition | undefined): {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    color?: string;
} {
    if (!def || def.type !== 'number') return {};
    return {
        defaultValue: def.defaultValue as number,
        min: def.min,
        max: def.max,
        step: def.step,
        ...(def.color ? { color: def.color } : {}),
    };
}

/**
 * Get cloze input props for InlineClozeInput from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
/**
 * Get cloze choice props for InlineClozeChoice from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function choicePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Get toggle props for InlineToggle from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function togglePropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

export function clozePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
    caseSensitive?: boolean;
} {
    if (!def || def.type !== 'text') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
        ...(def.caseSensitive !== undefined ? { caseSensitive: def.caseSensitive } : {}),
    };
}

/**
 * Get spot-color props for InlineSpotColor from a variable definition.
 * Extracts the `color` field.
 *
 * @example
 * <InlineSpotColor
 *     varName="radius"
 *     {...spotColorPropsFromDefinition(getVariableInfo('radius'))}
 * >
 *     radius
 * </InlineSpotColor>
 */
export function spotColorPropsFromDefinition(def: VariableDefinition | undefined): {
    color: string;
} {
    return {
        color: def?.color ?? '#8B5CF6',
    };
}

/**
 * Get linked-highlight props for InlineLinkedHighlight from a variable definition.
 * Extracts the `color` and `bgColor` fields.
 *
 * @example
 * <InlineLinkedHighlight
 *     varName="activeHighlight"
 *     highlightId="radius"
 *     {...linkedHighlightPropsFromDefinition(getVariableInfo('activeHighlight'))}
 * >
 *     radius
 * </InlineLinkedHighlight>
 */
export function linkedHighlightPropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    return {
        ...(def?.color ? { color: def.color } : {}),
        ...(def?.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Build the `variables` prop for FormulaBlock from variable definitions.
 *
 * Takes an array of variable names and returns the config map expected by
 * `<FormulaBlock variables={...} />`.
 *
 * @example
 * import { scrubVarsFromDefinitions } from './variables';
 *
 * <FormulaBlock
 *     latex="\scrub{mass} \times \scrub{accel}"
 *     variables={scrubVarsFromDefinitions(['mass', 'accel'])}
 * />
 */
export function scrubVarsFromDefinitions(
    varNames: string[],
): Record<string, { min?: number; max?: number; step?: number; color?: string }> {
    const result: Record<string, { min?: number; max?: number; step?: number; color?: string }> = {};
    for (const name of varNames) {
        const def = variableDefinitions[name];
        if (!def) continue;
        result[name] = {
            ...(def.min !== undefined ? { min: def.min } : {}),
            ...(def.max !== undefined ? { max: def.max } : {}),
            ...(def.step !== undefined ? { step: def.step } : {}),
            ...(def.color ? { color: def.color } : {}),
        };
    }
    return result;
}
