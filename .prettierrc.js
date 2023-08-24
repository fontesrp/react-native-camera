module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: false,
  bracketSpacing: true,
  jsxSingleQuote: false,
  overrides: [
    { files: '*.ts', options: { parser: 'babel-ts' } },
    { files: '*.d.ts', options: { parser: 'babel-ts', semi: true } }
  ],
  parser: 'babel',
  printWidth: 100,
  quoteProps: 'as-needed',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false
}
