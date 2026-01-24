import { defineConfig, buildLegacyTheme } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

// Dark theme configuration
const darkTheme = buildLegacyTheme({
    '--black': '#1a1a1a',
    '--white': '#fff',
    '--gray-base': '#2c2c2c',

    '--component-bg': '#1a1a1a',
    '--component-text-color': '#e0e0e0',

    // Brand colors
    '--brand-primary': '#8b4513',

    // Default button
    '--default-button-color': '#e0e0e0',
    '--default-button-primary-color': '#8b4513',

    // State colors
    '--state-info-color': '#2196F3',
    '--state-success-color': '#4CAF50',
    '--state-warning-color': '#FF9800',
    '--state-danger-color': '#F44336',

    // Navbar
    '--main-navigation-color': '#1a1a1a',
    '--main-navigation-color--inverted': '#e0e0e0',

    '--focus-color': '#8b4513',
})

export default defineConfig({
    name: 'default',
    title: 'Vishwa Wellness',

    projectId: 'dsifqj4y',
    dataset: 'production',

    plugins: [structureTool(), visionTool()],

    schema: {
        types: schemaTypes,
    },

    theme: darkTheme,
})
