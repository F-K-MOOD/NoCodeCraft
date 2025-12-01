export default {
    extends: ['stylelint-config-recommended-vue'],
    overrides: [
        {
            files: ['*.vue', '**/*.vue'],
            rules: {
                'unit-allowed-list': ['em', 'rem', 's'],
                'no-empty-source': null
            }
        }
    ]
}
