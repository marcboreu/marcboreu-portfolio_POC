import type { Meta, StoryObj } from '@storybook/react';
import Timeline3, { Timeline3Group, Timeline3Config } from './Timeline3';

const meta = {
  component: Timeline3,
  title: 'Components/Timeline3',
  tags: ['autodocs'],
} satisfies Meta<typeof Timeline3>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for all stories
const sampleGroups: Timeline3Group[] = [
  {
    id: 'discovery',
    label: 'Discovery',
    phases: [
      {
        id: 'requirements',
        phase: '01',
        title: 'Requirements',
        description: 'Gather and define project requirements and objectives.',
      },
      {
        id: 'research',
        phase: '02',
        title: 'Research',
        description: 'Market research and competitive analysis.',
      },
    ],
  },
  {
    id: 'strategy',
    label: 'Strategy',
    phases: [
      {
        id: 'planning',
        phase: '03',
        title: 'Planning',
        description: 'Create strategic roadmap and milestones.',
      },
      {
        id: 'scoping',
        phase: '04',
        title: 'Scoping',
        description: 'Define project scope and deliverables.',
      },
    ],
  },
  {
    id: 'execution',
    label: 'Execution',
    phases: [
      {
        id: 'design',
        phase: '05',
        title: 'Design',
        description: 'Create design prototypes and mockups.',
      },
      {
        id: 'development',
        phase: '06',
        title: 'Development',
        description: 'Implement and build the solution.',
      },
      {
        id: 'testing',
        phase: '07',
        title: 'Testing',
        description: 'Quality assurance and bug fixes.',
      },
    ],
  },
  {
    id: 'launch',
    label: 'Launch',
    phases: [
      {
        id: 'deployment',
        phase: '08',
        title: 'Deployment',
        description: 'Deploy to production environment.',
      },
      {
        id: 'monitoring',
        phase: '09',
        title: 'Monitoring',
        description: 'Monitor performance and gather feedback.',
      },
    ],
  },
];

/**
 * Default timeline with no configuration overrides.
 * Uses built-in defaults for animations, colors, and layout.
 */
export const Default: Story = {
  args: {
    groups: sampleGroups,
    title: 'Project Timeline',
  },
};

/**
 * Timeline with custom animation timing and energetic variant.
 * Faster animations with more dynamic easing curves.
 */
export const EnergeticAnimation: Story = {
  args: {
    groups: sampleGroups,
    title: 'Quick Timeline',
    config: {
      animations: {
        duration: 1200,
        variant: 'energetic',
      },
    },
  },
};

/**
 * Timeline with custom smooth animation variant.
 * Slower, more relaxed animations.
 */
export const SmoothAnimation: Story = {
  args: {
    groups: sampleGroups,
    title: 'Smooth Timeline',
    config: {
      animations: {
        duration: 1500,
        variant: 'smooth',
      },
    },
  },
};

/**
 * Timeline with custom indigo color scheme.
 * Demonstrates color customization for branding.
 */
export const CustomColors: Story = {
  args: {
    groups: sampleGroups,
    title: 'Indigo Timeline',
    config: {
      colors: {
        progress: '#4f46e5',
        line: '#6366f1',
        circle: '#818cf8',
        text: '#e0e7ff',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#1e293b', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Timeline with custom orange/amber color scheme.
 * Another color customization example.
 */
export const OrangeTheme: Story = {
  args: {
    groups: sampleGroups,
    title: 'Orange Timeline',
    config: {
      colors: {
        progress: '#f97316',
        line: '#fb923c',
        circle: '#fdba74',
        text: '#fed7aa',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#1f2937', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Timeline with compact layout and reduced spacing.
 * Useful for fitting more content in limited space.
 */
export const CompactLayout: Story = {
  args: {
    groups: sampleGroups,
    title: 'Compact Timeline',
    config: {
      layout: {
        itemSpacing: '3rem',
        circleSize: '4.5rem',
        contentPadding: '5rem',
      },
    },
  },
};

/**
 * Timeline with spacious layout and larger circles.
 * Emphasizes visual hierarchy and breathing room.
 */
export const SpaciousLayout: Story = {
  args: {
    groups: sampleGroups,
    title: 'Spacious Timeline',
    config: {
      layout: {
        itemSpacing: '8rem',
        circleSize: '7.5rem',
        contentPadding: '9rem',
      },
    },
  },
};

/**
 * Timeline with fully customized per-animation-type easing.
 * Each animation type has unique easing curves.
 */
export const CustomEasing: Story = {
  args: {
    groups: sampleGroups,
    title: 'Custom Easing Timeline',
    config: {
      animations: {
        duration: 800,
        easing: {
          circle: 'cubic-bezier(0.1, 0.7, 0.3, 1)',
          line: 'cubic-bezier(0.4, 0.8, 0.2, 1)',
          text: 'cubic-bezier(0.3, 0.6, 0.1, 1)',
        },
      },
    },
  },
};

/**
 * Timeline with comprehensive customization.
 * Combines custom animations, colors, and layout.
 */
export const FullCustomization: Story = {
  args: {
    groups: sampleGroups,
    title: 'Fully Customized Timeline',
    config: {
      animations: {
        duration: 1000,
        easing: {
          circle: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          line: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          text: 'cubic-bezier(0.22, 1, 0.36, 1)',
        },
      },
      colors: {
        progress: '#9333ea',
        line: '#a855f7',
        circle: '#c084fc',
        text: '#e9d5ff',
      },
      layout: {
        itemSpacing: '5rem',
        circleSize: '5.5rem',
        contentPadding: '6.5rem',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#1e1b4b', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Timeline with minimal animation duration for quick interactions.
 * Demonstrates very fast animation configuration.
 */
export const FastAnimations: Story = {
  args: {
    groups: sampleGroups,
    title: 'Fast Timeline',
    config: {
      animations: {
        duration: 400,
        variant: 'energetic',
      },
    },
  },
};

/**
 * Timeline with slow, dramatic animation duration.
 * Demonstrates very slow animation configuration.
 */
export const SlowAnimations: Story = {
  args: {
    groups: sampleGroups,
    title: 'Slow Timeline',
    config: {
      animations: {
        duration: 2000,
        variant: 'smooth',
      },
    },
  },
};
