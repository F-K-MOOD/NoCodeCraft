import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort'

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    {
        files: ['*.vue', '**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
                extraFileExtensions: ['.vue']
            }
        },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'vue/html-indent': 'off'
        },
        plugins: {
            'simple-import-sort': pluginSimpleImportSort
        }
    },
    {
        files: ['*.ts', '**/*.ts'],
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error'
        },
        plugins: {
            'simple-import-sort': pluginSimpleImportSort
        }
    }
]
