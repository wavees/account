<script>
  // import
  import { _ } from "svelte-i18n";

  import { createEventDispatcher } from "svelte";
  import Cookie from "cookie-universal";

  import { onMount } from "svelte";

  // Cookie manager
  const cookies = Cookie();

  // Event dispatcher
  const dispatch = createEventDispatcher();

  let loading = false;
  // Importing components
  import {
    Spinner} from "darkmode-components/src/index"

  // Function, that'll process given information
  function process() {
  };
</script>

<!-- 
  Layout
 -->
<main class="flex h-full w-full items-center justify-center">
  <div class="px-4 md:px-16">
    <div class="w-full text-center">
      <h1 class="text-base font-semibold">{$_("authorization.disabled.title", { default: "Registrations disabled" })}</h1>
      <p class="text-sm text-gray-700">{$_("authorization.disabled.subtitle", { default: "Uh-oh! That's bad, very bad... Currently, we do not support the registration of new users. Still in development, yeah!" })}</p>
    </div>
    
    <div class="mt-8 w-full flex justify-center items-center px-2 md:px-8">
      <!-- Go back button -->
      <button on:click={(e) => {
        cookies.remove('_login_email');
        loading = true;

        dispatch("check");
      }} class="w-full h-8 flex justify-center text-white items-center bg-black rounded-lg { loading ? "" : "hover:bg-blue-300" }" type="ghost">
        {#if loading}
          <Spinner size="12" color="#fff" />
        {:else}
          {$_("global.back", { default: "Back" })}
        {/if}
      </button>

      <!-- #Agree button
      <Button on:click={(e) => {
        process();
      }} fullWidth={true}>{$_("global.proceed", { default: "Proceed" })}</Button> -->
    </div>
  </div>
</main>