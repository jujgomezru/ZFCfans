import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'release/**',
      'public/**',
      '*.config.js', // Archivos de configuración
      'coverage/**', // Coverage de tests
      'main.js', // Archivo temporal de electron-builder
    ],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Reglas base
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // React específico
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/jsx-key': 'error',
      'react/no-array-index-key': 'warn',
      'react/self-closing-comp': 'error',

      // JavaScript limpio
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-console': 'warn', // Advertir sobre console.log
      'no-debugger': 'error', // No usar debugger en producción
      'no-duplicate-imports': 'error',
      'no-var': 'error', // Usar let/const en lugar de var
      'prefer-const': 'error', // Usar const cuando sea posible
      'prefer-template': 'error', // Usar template literals

      // Estilo y legibilidad
      curly: ['error', 'all'], // Siempre usar llaves
      eqeqeq: ['error', 'always'], // Usar === en lugar de ==
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
      'object-shorthand': 'error', // Usar object shorthand
      'arrow-spacing': 'error', // Espacios alrededor de flechas
      'comma-spacing': 'error', // Espacios alrededor de comas
      'comma-dangle': ['error', 'always-multiline'], // Comas al final de objetos/arrays
      semi: ['error', 'always'], // Siempre usar punto y coma
      'key-spacing': 'error', // Espacios alrededor de los dos puntos en objetos
      'keyword-spacing': 'error', // Espacios alrededor de palabras clave
      'space-before-blocks': 'error', // Espacio antes de bloques

      // Imports y exports
      'import/no-duplicates': 'off', // Prettier lo maneja
      'sort-imports': [
        'error',
        {
          ignoreCase: true, // Ignorar mayúsculas/minúsculas
          ignoreDeclarationSort: true, // No ordenar declaraciones
        },
      ],
    },
    settings: {
      react: {
        version: 'detect', // Detecta automáticamente la versión de React
      },
    },
  },
  // Configuración específica para archivos de test
  {
    files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}', '**/tests/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.vitest, // Variables globales de Vitest
      },
    },
    rules: {
      'no-console': 'off', // Permitir console en tests
    },
  },
];
