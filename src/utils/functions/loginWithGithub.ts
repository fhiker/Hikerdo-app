export default function loginWithGithub() {
	const CLIENT_ID = "98f8f9abfbc41a8dacfa";
	window.location.assign(
		`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`,
	);
}
