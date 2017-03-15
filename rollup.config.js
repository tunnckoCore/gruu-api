import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  plugins: [
    buble({
      target: { node: '0.10' }
    })
  ],
  targets: [
    { dest: 'dist/gruu.common.js', format: 'cjs' }
  ]
}
