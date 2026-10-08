import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import tailwind from 'eslint-plugin-tailwindcss'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      //...tailwind.configs['flat/recommended'], // <- Agregamos Tailwind aquí
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
     ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      'react-hooks/exhaustive-deps': 'off',
    }
      
      // Reglas adicionales de Tailwind:
      //'tailwindcss/no-custom-classname': 'warn', // Marca errores de tipeo como "text-gren-600"
      //'tailwindcss/classnames-order': 'warn',    // Te ayuda a mantener un orden estándar
    
  },
)