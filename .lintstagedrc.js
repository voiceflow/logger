module.exports = {
  'package.json': ['fixpack'],
  '**/*.{js,ts}': ['eslint --fix', 'prettier-eslint --write'],
};
