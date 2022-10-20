/* eslint-disable */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		screens: {
			xs: '500px',
			...defaultTheme.screens
		},
		extend: {
			colors: {
				primaryBlue: '#117FFF',
				primaryBlueHover: '#0065d8',
				primaryBlueActive: '#0058bd',
				primaryBlueDisabled: '#6fb2ff'
				// primaryBlueActiveRoute: '#e14b50',
			},
			borderWidth: {
				1: '1px'
			},
			width: {
				64: '16rem'
			}
		}
	},
	plugins: []
};
