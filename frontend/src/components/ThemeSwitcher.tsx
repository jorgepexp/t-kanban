"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import LightThemeLogo from "@/public/sun.svg";
import DarkThemeLogo from "@/public/moon.svg";

export function ThemeSwitcher() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;
	if (!theme) return null;

	function changeTheme() {
		setTheme(theme === "light" ? "dark" : "light");
	}

	const themeInformation = {
		light: {
			alt: "Theme switcher icon - Light mode",
			src: LightThemeLogo,
		},
		dark: {
			alt: "Theme switcher icon - Dark mode",
			src: DarkThemeLogo,
		},
	};

	return (
		<div>
			<button onClick={() => changeTheme()}>
				{/* TODO Fix this type issue */}
				<Image
					src={themeInformation[theme].src}
					alt={themeInformation[theme].alt}
					height="50"
					width="50"
				/>
			</button>
		</div>
	);
}
