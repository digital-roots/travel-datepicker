import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import pluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  eslint.configs.recommended,
  stylistic.configs.customize({
    arrowParens: true,
    braceStyle: '1tbs',
    jsx: false,
    semi: true,
  }),
  ...pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      '@stylistic/object-property-newline': ['error'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/object-curly-newline': ['error', {
        ObjectExpression: { multiline: true },
        ObjectPattern: { multiline: true },
        ImportDeclaration: {
          multiline: true,
          minProperties: 3,
        },
        ExportDeclaration: {
          multiline: true,
          minProperties: 3,
        },
      }],
      'vue/no-v-html': 'off',
      'import/no-named-as-default': 0,
      'vue/multi-word-component-names': 'off',
      'vuejs-accessibility/label-has-for': 'off',
      'vuejs-accessibility/click-events-have-key-events': 'off',
      'vuejs-accessibility/no-autofocus': 'off',
      'vuejs-accessibility/mouse-events-have-key-events': 'off',
      'vue/no-v-for-template-key': 'error',
      'vue/first-attribute-linebreak': ['error', {
        singleline: 'beside',
        multiline: 'below',
      }],
      'vue/max-attributes-per-line': ['error', {
        singleline: { max: 1 },
        multiline: { max: 1 },
      }],
      'vue/html-self-closing': ['error', { html: { void: 'always' } }],
      'vue/multiline-html-element-content-newline': ['error', {
        ignoreWhenEmpty: true,
        allowEmptyLines: true,
        ignores: ['pre', 'textarea'],
      }],
      'vue/singleline-html-element-content-newline': ['error', {
        ignoreWhenNoAttributes: false,
        ignoreWhenEmpty: true,
        ignores: ['pre', 'textarea'],
      }],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    },
  },
);
