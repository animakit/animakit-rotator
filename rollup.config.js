import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  dest: 'dist/index.js',
  format: 'umd',
  moduleName: 'AnimakitRotator',

  plugins: [babel()]
};
