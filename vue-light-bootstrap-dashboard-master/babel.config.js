module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        polyfills: ['es7.object.entries', 'es6.promise']
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining'
  ]
};

