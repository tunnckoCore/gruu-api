import buble from 'rollup-plugin-buble'

export default {
  entry: 'index.js',
  plugins: [
    buble({
      target: { node: '0.10' }
    })
  ],
  targets: [
    { dest: 'dist/index.js', format: 'cjs' }
  ]
}
