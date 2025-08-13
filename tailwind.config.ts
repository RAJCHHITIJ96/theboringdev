
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				charcoal: 'hsl(var(--charcoal))',
				'medium-gray': 'hsl(var(--medium-gray))',
				'light-gray': 'hsl(var(--light-gray))',
				'border-gray': 'hsl(var(--border-gray))',
				'intelligence-blue': 'hsl(var(--intelligence-blue))',
				'success-green': 'hsl(var(--success-green))',
				'attention-orange': 'hsl(var(--attention-orange))',
				
				// New Refined Accent Colors
				'accent-subtle': 'hsl(var(--accent-subtle))',
				'error-subtle': 'hsl(var(--error-subtle))',
				'success-subtle': 'hsl(var(--success-subtle))',
				'warm-accent': 'hsl(var(--warm-accent))',
				
				// Legacy support for existing components
				border: 'hsl(var(--foreground) / 0.08)',
				input: 'hsl(var(--foreground) / 0.08)',
				ring: 'hsl(var(--intelligence-blue))',
				'border-subtle': 'hsl(var(--foreground) / var(--border-subtle))',
				
				primary: {
					DEFAULT: 'hsl(var(--foreground))',
					foreground: 'hsl(var(--background))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--background))',
					foreground: 'hsl(var(--foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--light-gray))',
					foreground: 'hsl(var(--medium-gray))'
				},
				card: {
					DEFAULT: 'hsl(var(--background))',
					foreground: 'hsl(var(--foreground))'
				},
			},
			spacing: {
				'micro': 'var(--space-micro)',
				'small': 'var(--space-small)',
				'medium': 'var(--space-medium)',
				'large': 'var(--space-large)',
				'xl': 'var(--space-xl)',
				'xxl': 'var(--space-xxl)',
			},
			borderRadius: {
				'small': 'var(--radius-small)',
				'medium': 'var(--radius-medium)',
				'large': 'var(--radius-large)',
				'xl': 'var(--radius-xl)',
			},
			fontFamily: {
				'serif-display': ['IBM Plex Serif', 'Georgia', 'serif'],
				'sans-interface': ['Inter', 'SF Pro Display', 'Helvetica Neue', 'sans-serif'],
				'serif-body': ['Source Serif 4', 'Georgia', 'serif'],
				'mono-data': ['IBM Plex Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
			},
			maxWidth: {
				'reading': '45rem',   /* 720px */
				'article': '42.5rem', /* 680px */
				'main': '80rem',      /* 1280px */
			},
			animation: {
				'fade-in-up': 'fadeInUp 0.6s ease-out',
				'interactive-hover': 'interactiveHover 0.2s ease',
			},
			keyframes: {
				fadeInUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				interactiveHover: {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(-1px)' },
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
