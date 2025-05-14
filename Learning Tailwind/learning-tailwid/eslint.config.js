import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    plugins: {
      '@next/next': nextPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  prettierConfig,
];
