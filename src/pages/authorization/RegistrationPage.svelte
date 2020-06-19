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
<main>
  <div class="w-full text-center">
    <Heading>Создать аккаунт?</Heading>
    <Caption>Эта почта ещё не занята в нашей системе, и именно вы можете это исправить!</Caption>
  </div>

  <div class="mt-12 w-full flex flex-col justify-center items-center px-2 md:px-8 lg:px-16">
    <div>
      <!-- Go back button -->
      <Button on:click={(e) => {
        cookies.remove('_login_email');
        dispatch("step", { step: 1, loading: false });
      }} type="ghost">{$_("global.back", { default: "Back" })}</Button>

      <!-- Agree button -->
      <Button on:click={(e) => {
        process();
      }}>{$_("global.proceed", { default: "Proceed" })}</Button>
    </div>
  </div>
</main>