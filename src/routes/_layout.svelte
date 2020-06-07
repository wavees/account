<script>
  // Let's import application's styles
  import Tailwind from "../styles/tailwind.svelte";

  // import
	import { user } from "../config/user.js";
	
	import Spinner from "../components/Spinner.svelte";
  import Cookie from "cookie-universal";

  // Cookies instance
  const cookies = Cookie();

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
	<div style="height: 100vh;" class="w-full flex justify-center items-center">
		<!-- Branding -->
		<div class="flex flex-col justify-center items-center">
			<div class="flex mb-6 items-center">
				<h1 style="font-family: Junegull" class="text-2xl text-bold">wavees</h1>
			</div>

			<Spinner size="25" />
		</div>
	</div>
{ /if }