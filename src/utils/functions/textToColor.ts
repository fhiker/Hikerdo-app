export default function textToColor(text: string): string {
	let hash = 0;
	for (let i = 0; i < text.length; i++) {
		hash = text.charCodeAt(i) + ((hash << 5) - hash);
	}
	let hexColor = (hash & 0xffffff).toString(16).toUpperCase();
	hexColor = hexColor.padStart(6, "0");
	return `#${hexColor}`;
}
