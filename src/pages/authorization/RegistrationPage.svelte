<script>
  // import
  import { _ } from "svelte-i18n";

  import { createEventDispatcher } from "svelte";
  import Cookie from "cookie-universal";

  // Cookie manager
  const cookies = Cookie();

  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Importing components
  import { 
    TextInput, 
    
    Button, 
    
    Heading, 
    Caption } from "darkmode-components/src/index"

  // Function, that'll process given information
  function process() {
    // Let's create event, that'll change our tile
    // to loading state.
    dispatch('step', { step: 4, loading: true });

    // And now let's register our user and redirect 
    // him to 
  };
</script>

<!-- 
  Layout
 -->
<main class="px-4 md:px-16">
  <div class="w-full text-center">
    <Heading>{$_("authorization.disabled.title", { default: "Registrations disabled" })}</Heading>
    <Caption>{$_("authorization.disabled.subtitle", { default: "Uh-oh! That's bad, very bad... Currently, we do not support the registration of new users at this time. Still in development, yeah!" })}</Caption>
  </div>
  
  
  <div class="mt-12 w-full flex justify-center items-center px-2 md:px-8">
    <!-- Go back button -->
    <Button on:click={(e) => {
      cookies.remove('_login_email');
      dispatch("step", { step: 1, loading: false });
    }} fullWidth={true} type="ghost">{$_("global.back", { default: "Back" })}</Button>

    <!-- #Agree button
    <Button on:click={(e) => {
      process();
    }} fullWidth={true}>{$_("global.proceed", { default: "Proceed" })}</Button> -->
  </div>
</main>