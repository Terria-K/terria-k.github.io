/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"midnight": "var(--col-midnight)",
				"midnight-light": "var(--col-midnight-light)",
				"midnight-blue": "var(--col-midnight-blue)"
			},
			fontFamily: {
				slab: ['Roboto Slab Variable'],
				sans: ['Fira Sans'],
				deca: ["Lexend Deca"]
			}
		},
	},
	plugins: [],
}
