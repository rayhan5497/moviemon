import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import boundaries from 'eslint-plugin-boundaries'
import importPlugin from 'eslint-plugin-import'
import { defineConfig, globalIgnores } from 'eslint/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const featuresDir = path.join(__dirname, 'src', 'features')
const featuresDirRel = 'src/features'
const featureNames = fs.existsSync(featuresDir)
  ? fs
      .readdirSync(featuresDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  : []

const featureZones = featureNames.flatMap((feature) => {
  const otherFeatures = featureNames.filter((name) => name !== feature)
  if (otherFeatures.length === 0) return []
  return [
    {
      target: [`${featuresDirRel}/${feature}/**`],
      from: otherFeatures.map((name) => `${featuresDirRel}/${name}/**`),
    },
  ]
})

export default defineConfig([
  globalIgnores(['dist', '__LOCAL__']),
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      boundaries,
      react,
      import: importPlugin,
    },
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off',
      'import/no-restricted-paths': ['error', { zones: featureZones }],
      'boundaries/no-unknown': 'error',
      'boundaries/no-unknown-files': 'error',
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'app', allow: ['*'] },
            {
              from: 'pages',
              allow: ['features', 'widgets', 'shared'],
            },
            {
              from: 'widgets',
              allow: ['features', 'shared'],
            },
            {
              from: 'features',
              allow: ['features', 'widgets', 'shared'],
            },
            {
              from: 'shared',
              allow: ['shared'],
            },
            { from: 'dev', allow: ['*'] },
          ],
        },
      ],
    },
    settings: {
      'boundaries/root-path': __dirname,
      'boundaries/include': ['src/**/*'],
      'boundaries/ignore': ['**/node_modules/**', 'dist/**', 'build/**', 'coverage/**'],
      'boundaries/flag-as-external': {
        inNodeModules: true,
        outsideRootPath: true,
        unresolvableAlias: true,
      },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/*.js', mode: 'file' },
        { type: 'app', pattern: 'src/*.jsx', mode: 'file' },
        { type: 'app', pattern: 'src/app', mode: 'folder' },
        { type: 'pages', pattern: 'src/pages', mode: 'folder' },
        { type: 'features', pattern: 'src/features', mode: 'folder' },
        { type: 'widgets', pattern: 'src/widgets', mode: 'folder' },
        { type: 'shared', pattern: 'src/shared', mode: 'folder' },
        { type: 'dev', pattern: 'src/dev', mode: 'folder' },
      ],
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
        },
        alias: {
          map: [['@', './src']],
          extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
        },
      },
    },
  },
  {
    files: ['src/shared/context/**/*.{js,jsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
