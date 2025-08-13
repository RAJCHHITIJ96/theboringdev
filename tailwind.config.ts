
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
				'accent-subtle': 'hsl(var(--accent-subtle))',
				'error-subtle': 'hsl(var(--error-subtle))',
				'success-subtle': 'hsl(var(--success-subtle))',
				'warm-accent': 'hsl(var(--warm-accent))',
				
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
				'micro': 'var(--space-micro)',    /* 8px */
				'small': 'var(--space-small)',    /* 16px */
				'medium': 'var(--space-medium)',  /* 32px */
				'large': 'var(--space-large)',    /* 64px */
				'xl': 'var(--space-xl)',          /* 96px */
				'xxl': 'var(--space-xxl)',        /* 128px */
			},
			borderRadius: {
				'small': 'var(--radius-small)',   /* 6px */
				'medium': 'var(--radius-medium)', /* 8px */
				'large': 'var(--radius-large)',   /* 12px */
				'xl': 'var(--radius-xl)',         /* 16px */
			},
			fontFamily: {
				// Typography System
				'serif-display': ['IBM Plex Serif', 'Georgia', 'serif'],
				'sans-interface': ['Inter', 'SF Pro Display', 'Helvetica Neue', 'sans-serif'],
				'serif-body': ['Source Serif 4', 'Georgia', 'serif'],
				'mono-data': ['IBM Plex Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
			},
			maxWidth: {
				// Content Containers
				'reading': '45rem',   /* 720px */
				'article': '42.5rem', /* 680px */
				'main': '80rem',      /* 1280px */
				'prose': '65ch',      /* Optimal reading width */
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
