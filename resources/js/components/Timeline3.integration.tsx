import Timeline3, { Timeline3Group, Timeline3Config } from './Timeline3';

/**
 * Integration test component demonstrating Timeline3 with multiple instances
 * using different configurations to verify independent customization.
 */
export function Timeline3IntegrationTest() {
  // Sample data for testing
  const sampleGroups: Timeline3Group[] = [
    {
      id: 'phase-1',
      label: 'Phase 1',
      phases: [
        {
          id: 'p1-a',
          phase: '01',
          title: 'Concept',
          description: 'Initial concept and planning phase',
        },
        {
          id: 'p1-b',
          phase: '02',
          title: 'Design',
          description: 'Design and prototyping phase',
        },
      ],
    },
    {
      id: 'phase-2',
      label: 'Phase 2',
      phases: [
        {
          id: 'p2-a',
          phase: '03',
          title: 'Development',
          description: 'Development and implementation phase',
        },
        {
          id: 'p2-b',
          phase: '04',
          title: 'Testing',
          description: 'Testing and quality assurance phase',
        },
      ],
    },
  ];

  // Config 1: Default configuration
  const defaultConfig: Timeline3Config = {};

  // Config 2: Custom animation timing and energetic variant
  const energeticConfig: Timeline3Config = {
    animations: {
      duration: 1200,
      variant: 'energetic',
    },
  };

  // Config 3: Custom colors
  const customColorsConfig: Timeline3Config = {
    colors: {
      progress: '#4f46e5',
      line: '#6366f1',
      circle: '#818cf8',
      text: '#e0e7ff',
    },
  };

  // Config 4: Custom layout with reduced spacing
  const compactLayoutConfig: Timeline3Config = {
    layout: {
      itemSpacing: '3rem',
      circleSize: '4.5rem',
      contentPadding: '5rem',
    },
  };

  // Config 5: All customizations combined
  const fullCustomConfig: Timeline3Config = {
    animations: {
      duration: 800,
      easing: {
        circle: 'cubic-bezier(0.1, 0.7, 0.3, 1)',
        line: 'cubic-bezier(0.4, 0.8, 0.2, 1)',
        text: 'cubic-bezier(0.3, 0.6, 0.1, 1)',
      },
    },
    colors: {
      progress: '#f97316',
      line: '#fb923c',
      circle: '#fdba74',
      text: '#fed7aa',
    },
    layout: {
      itemSpacing: '4.5rem',
      circleSize: '5rem',
      contentPadding: '6rem',
    },
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff' }}>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Timeline3 Integration Tests</h1>
        <p>Scroll through each timeline to verify independent configuration</p>
      </div>

      {/* Test 1: Default config */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ padding: '2rem', paddingBottom: '0' }}>Test 1: Default Configuration</h2>
        <Timeline3 groups={sampleGroups} title="Default Timeline" config={defaultConfig} />
      </div>

      {/* Test 2: Energetic variant */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ padding: '2rem', paddingBottom: '0' }}>Test 2: Energetic Animation</h2>
        <Timeline3 groups={sampleGroups} title="Energetic Timeline" config={energeticConfig} />
      </div>

      {/* Test 3: Custom colors */}
      <div style={{ marginBottom: '4rem', backgroundColor: '#1e293b' }}>
        <h2 style={{ padding: '2rem', paddingBottom: '0' }}>Test 3: Custom Colors (Indigo)</h2>
        <Timeline3 groups={sampleGroups} title="Colored Timeline" config={customColorsConfig} />
      </div>

      {/* Test 4: Compact layout */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ padding: '2rem', paddingBottom: '0' }}>Test 4: Compact Layout</h2>
        <Timeline3 groups={sampleGroups} title="Compact Timeline" config={compactLayoutConfig} />
      </div>

      {/* Test 5: Full customization */}
      <div style={{ marginBottom: '4rem', backgroundColor: '#1f2937' }}>
        <h2 style={{ padding: '2rem', paddingBottom: '0' }}>Test 5: Full Customization</h2>
        <Timeline3 groups={sampleGroups} title="Custom Timeline" config={fullCustomConfig} />
      </div>

      {/* Test 6: No config prop (backwards compatibility) */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ padding: '2rem', paddingBottom: '0' }}>Test 6: No Config (Backwards Compatibility)</h2>
        <Timeline3 groups={sampleGroups} title="Legacy Timeline" />
      </div>
    </div>
  );
}
