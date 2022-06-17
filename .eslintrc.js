module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  plugins: ['html'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  globals: {
    PetiteVue: true,
    define: true,
  },
  rules: {
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'no-unused-vars': 'warn'
  },
}
