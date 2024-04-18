/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"midnight": "#1f222b",
				"midnight-blue": "#201d36"
			}
		},
	},
	plugins: [],
}
