<script>
  // Let's import application's styles
  import Tailwind from "../styles/tailwind.svelte";

	import { fade } from "svelte/transition";

  // import
	import { user } from "../config/stores/user.js";
	
	import { colors, theme, Spinner } from "darkmode-components/src/index"
  import Cookie from "cookie-universal";

  // Cookies instance
  const cookies = Cookie();

	// Let's check (and update if needed) our current
	// theme
	const currentTheme = cookies.get('_theme');

	theme.setTheme("light");
	if (currentTheme != null) {
		theme.setTheme(currentTheme);
	};

  // Let's get user token and then
  // let's do something very interesting...
  const token = cookies.get('_account_token');

  if (token != null) {
		user.setToken(token);
  } else {
    user.setLoaded(true);
  }
</script>

<svelte:head>
	<link rel="stylesheet" href="./fonts/Junegull/junegull.css">
</svelte:head>

{ #if $user.loaded } 
	<main>
		<slot></slot>
	</main>
{ :else }
	<div out:fade class="w-full h-screen bg-white absolute flex justify-center items-center">
		<!-- Branding -->
		<div class="flex flex-col justify-center items-center">
			<Spinner size="15" />
		</div>
	</div>
{ /if }