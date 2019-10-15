module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base', 'prettier',
  ],
  plugins: ["prettier"],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier": "error", // envia os erros encontrados pelo prettier como erros para o eslint
    "class-methods-use-this": "off", // desabilita o uso do this nos metodos
    "no-param-reassing": "off", // alteração de parametros nos metodos
    "camelcase": "off", // desabilita o camelcase
    "no-unused-vars": ["error", {"argsIgnorePattern": "next"}], // permite a utilização de variaveis "não utilizadas" como o next nos middlewares
    "linebreak-style" : ["error", "windows"] // remove erros ao utilizar quebra de linha CRLF ao inves de LF
  },
};
