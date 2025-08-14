
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
				
				// Subtle Accent Backgrounds
				'accent-green-subtle': 'hsl(var(--accent-green-subtle))',
				'accent-error-subtle': 'hsl(var(--accent-error-subtle))',
				'accent-success-subtle': 'hsl(var(--accent-success-subtle))',
				'accent-warm': 'hsl(var(--accent-warm))',
				
				// Legacy support for existing components
				border: 'hsl(var(--foreground) / 0.08)',
				input: 'hsl(var(--foreground) / 0.08)',
				ring: 'hsl(var(--intelligence-blue))',
				'border-subtle': 'hsl(var(--foreground) / 0.08)',
				
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
				// 8px Base Unit Spacing System
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
				'serif': ['Crimson Text', 'Times New Roman', 'serif'],
				'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
				'mono': ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
			},
			maxWidth: {
				'reading': '45rem',
				'article': '42.5rem',
				'main': '80rem',
				'prose': '65ch',
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
