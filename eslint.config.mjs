import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import neostandard from 'neostandard' // 1. Importamos el Standard moderno

export default [
  ...neostandard({
    // Esto le dice a Standard que use las opciones que ya tenías
    noStyle: true // Evita conflictos drásticos de formato con Prettier
  }),
  {
    files: ['**/*.mjs', '**/*.js'], // Añadí .js por si acaso, pero puedes dejar solo .mjs
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      prettier
    },
    rules: {
      // 2. Aquí metes tus reglas personalizadas y apagas las de Standard que no quieras
      eqeqeq: 'error',
      'space-before-function-paren': 'off',
      'spaced-comment': 'off',

      // Ejemplo: Si quisieras apagar la regla de camelcase de Standard, la pones aquí:
      // 'camelcase': 'off',

      // 3. Prettier siempre al final para que mande sobre el formato
      ...prettierConfig.rules,
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'lf'
        }
      ]
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'volume/**', 'playground/**']
  }
]
