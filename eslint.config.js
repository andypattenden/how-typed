import globals from 'globals'
import pluginJs from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import nodePlugin from 'eslint-plugin-n'
import vitest from '@vitest/eslint-plugin'
import { configs as tsEslintConfig } from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

const nodeRecommended = nodePlugin.configs['flat/recommended-module']

export default [
  {
    ignores: ['**/*.snap', 'dist'],
  },
  {
    files: ['**/*.spec.*'],
    plugins: {
      vitest,
    },
    languageOptions: {
      globals: {
        ...vitest.configs.env.languageOptions.globals,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tsEslintConfig.recommended,
  nodeRecommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,

  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        node: true,
      },
    },
  },
  { rules: { 'n/no-missing-import': 'off', 'import/order': 'error' } },
]
