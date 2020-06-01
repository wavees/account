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
  console.log(token);
  if (token != null) {
		user.setToken(token);
  } else {
    user.setLoaded(true);
  }
</script>


{ #if !$user.loaded }
	<div style="width: 100%; height: 100vh;" class="bg-white flex justify-center items-center">
		<Spinner />
    { $user.error }
	</div>
{ :else }
	<main>
		<slot></slot>
	</main>
{ /if }