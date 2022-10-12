module.exports = {
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	ignorePatterns: ['dist/', 'node_modules/', '**/pd.ts', '*.js', '**/*.js', '*.prettierignore', '*.prettierrc'],
	extends: [
		'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
		'prettier', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
		'plugin:prettier/recommended' // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
	],
	plugins: ['deprecation'],
	parserOptions: {
		ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports.
		tsconfigRootDir: __dirname,
		project: './tsconfig.json'
	},
	rules: {
		// add only eslint rule here, if you want to add typescript plugin rule, please add them at the bottom section
		'max-len': ['error', { code: 175, ignoreComments: true }],
		'linebreak-style': ['error', 'unix'],
		semi: ['error', 'always'],
		'new-parens': ['error', 'always'],
		'no-caller': 'error',
		'no-bitwise': 'error',
		'no-cond-assign': 'error',
		'no-trailing-spaces': 'error',
		'no-return-await': 'error',
		'no-multiple-empty-lines': ['error', { max: 3, maxEOF: 1 }],
		'no-console': ['error', { allow: ['time', 'timeEnd', 'error'] }],
		'deprecation/deprecation': 'error',
		camelcase: 'error',
		quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
		'sort-imports': [
			'error',
			{
				ignoreCase: true,
				ignoreDeclarationSort: true,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single']
			}
		],
		'comma-dangle': ['error', 'never'],
		'no-use-before-define': 'off',

		// add only @typescript-eslint here, do not mix both eslint rule and typescript rule
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/member-access': 'off',
		'@typescript-eslint/member-ordering': ['error', { default: ['signature', 'field', 'constructor', 'method'] }],
		'@typescript-eslint/object-literal-sort-keys': 'off',
		'@typescript-eslint/typedef': [
			'error',
			{
				allowExpressions: true,
				variableDeclaration: true,
				arrowParameter: false
			}
		],
		'@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/camelcase': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				vars: 'all',
				args: 'after-used',
				ignoreRestSiblings: false
			}
		],
		'@typescript-eslint/no-use-before-define': [
			'error',
			{
				functions: true,
				classes: false,
				variables: true,
				typedefs: true
			}
		]
	}
};
