<script>
  // import
  import { _ } from "svelte-i18n";

  import { createEventDispatcher } from "svelte";
  import Cookie from "cookie-universal";

  // Cookie manager
  const cookies = Cookie();

  // Event dispatcher
  const dispatch = createEventDispatcher();

  let loading = false;

  // Importing components
  import { 
    TextInput, 
    
    Button, 
    
    Heading, 
    Caption,
    
    Spinner} from "darkmode-components/src/index"

  // Function, that'll process given information
  function process() {
  };
</script>

<!-- 
  Layout
 -->
<main class="px-4 md:px-16">
  <div class="w-full text-center">
    <Heading>{$_("authorization.disabled.title", { default: "Registrations disabled" })}</Heading>
    <Caption>{$_("authorization.disabled.subtitle", { default: "Uh-oh! That's bad, very bad... Currently, we do not support the registration of new users. Still in development, yeah!" })}</Caption>
  </div>
  
  
  <div class="mt-12 w-full flex justify-center items-center px-2 md:px-8">
    <!-- Go back button -->
    <Button on:click={(e) => {
      cookies.remove('_login_email');
      loading = true;

      dispatch("check");
    }} fullWidth={true} type="ghost">
      {#if loading}
        <Spinner size="15" />
      {:else}
        {$_("global.back", { default: "Back" })}
      {/if}
    </Button>

    <!-- #Agree button
    <Button on:click={(e) => {
      process();
    }} fullWidth={true}>{$_("global.proceed", { default: "Proceed" })}</Button> -->
  </div>
</main>