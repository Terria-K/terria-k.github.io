import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"midnight": "#1f222b",
				"midnight-light": "#33324b",
				"midnight-blue": "#201d36"
			},
			fontFamily: {
				slab: ['Roboto Slab'],
				sans: ['Fira Sans'],
				cantarell: ['Cantarell']
			}
		},
	},
	plugins: [],
}
