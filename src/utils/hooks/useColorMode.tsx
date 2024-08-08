import { useState, useEffect } from 'react';

type ColorMode = 'light' | 'dark';

export const useColorMode = () => {
	const [colorMode, setColorMode] = useState<ColorMode>(() => {
		if (typeof window !== 'undefined') {
			const storedPreference = localStorage.getItem('color-theme');
			if (storedPreference) {
				return storedPreference as ColorMode;
			}

			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			return prefersDark ? 'dark' : 'light';
		}

		// Default to 'light' if running on server
		return 'light';
	});

	useEffect(() => {
		const body = document.body;
		const html = document.documentElement
		body.classList.remove('light', 'dark');
		body.classList.add(colorMode);

		const root = window.document.documentElement;
		root.classList.remove('light', 'dark');
		root.classList.add(colorMode);

		html.setAttribute('data-theme', colorMode);

		localStorage.setItem('color-theme', colorMode);
	}, [colorMode]);

	return [colorMode, setColorMode] as const;
};