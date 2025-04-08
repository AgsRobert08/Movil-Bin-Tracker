module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      '@babel/plugin-transform-private-methods',
      { loose: true }, // Configuración uniforme
    ],
    [
      '@babel/plugin-transform-class-properties',
      { loose: true }, // Mismo valor "loose"
    ],
    [
      '@babel/plugin-transform-private-property-in-object',
      { loose: true }, // Igual aquí
    ],
  ],
};