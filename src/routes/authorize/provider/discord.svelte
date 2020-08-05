<script>
  // Importing modules
  import { stores } from "@sapper/app";
  import { onMount } from "svelte";

  // Cookie manager
  import Cookie from "cookie-universal";
  const cookies = Cookie();

  // Importing components
  import {
    Spinner
  } from "darkmode-components/src/index";

  // Page store
  const { page } = stores();

  // onMount event 
  // Here we'll just create our Discord Code
  // token and close our current window.
  onMount(() => {
    let code = $page.query.code;

    cookies.set("_discord_code", code);

    // And now let's close this window.
    window.close();
  })

</script>

<!-- Page's Main Layout -->
<main style="height: 100vh;" class="w-full flex flex-col justify-center items-center">
  <Spinner />
  <p class="text-gray-700 text-sm">You can now close this window</p>
</main>