<script>
  // import
  import { _ } from "svelte-i18n";

  import { onMount } from 'svelte';

  import { createEventDispatcher } from "svelte";
  import Cookie from "cookie-universal";

  // Let's import some helpers
  import validateEmailRegex from "../helpers/validateEmail";
  import validateEmailExternal from "../helpers/checkEmail";

  // Not-so-complex function, that'll help us
  // to validate user emails.
  function validateEmail(checkEmail) {
    checkEmail = checkEmail.toLowerCase();
    emailValidating = true;

    // Let's check if our email changed or no.
    if (previousEmail == checkEmail) {
      // So, we don't need to check this email
      // anymore.
      // console.log("Fuck no");
      emailValidating = false;
    } else {
      previousEmail = checkEmail;
      
      if (validateEmailRegex(checkEmail)) {
        // Let's now validate email using checkEmail
        // function (external email validation)
        // console.log("regex okay");
        validateEmailExternal(checkEmail)
        .then((response) => {
          // Let's now check something...
          if (checkEmail == email.toLowerCase()) {
            emailValidating = false;

            if (response.exists) {
              emailInvalid = false;
            } else {
              emailInvalid = !response.validEmail;
            }
          }
        }).catch((error) => {
          // And here we also need to check something..
          if (checkEmail == email.toLowerCase()) {
            emailValidating = false;
            emailInvalid = true;
          }
        })
      } else {
        emailValidating = false;
        emailInvalid = true;
      }
    }
  };

  // Cookie manager
  const cookies = Cookie();

  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Importing components
  import { 
    TextInput, 
    
    Button, 
    
    Heading, 
    Caption, 
    
    Spinner } from "darkmode-components/src/index"

  // onMount function
  onMount(() => {
    // Let's focus user to email input.
    let focusElement = document.getElementById("email");
    focusElement.focus();
  });

  // Function, that'll process given information
  function process() {
    // Let's create event, that'll change our tile
    // to loading state.
    dispatch('step', { step: 1, loading: true });

    // Let's validate user's email.
    if (!emailInvalid) {
      emailValidating = true;
      
      // Email is valid, so let's just create a new cookie
      // with this email (cookie name: _login_email) and
      // ask our "engine" to reload this page.
      cookies.set('_login_email', email.toLowerCase());

      dispatch("check");
    } else {
      // Let's send error to user...
      error = "authorization.errors.invalidEmail";
      dispatch("error", "authorization.errors.invalidEmail");
    }
  };

  // Function, that'll validate our email.
  function input(e) {
    validateEmail(e.srcElement.value);
  };

  // Oh yeah
  function keyup(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      process();
    }
  };

  // Variable, that'll show if the email is valid or
  // no.
  let emailValidating = false;
  let emailInvalid;

  let error;

  let previousEmail = null;
  
  // Let's export and determine one needed variable.
  export let email = null;
</script>

<!-- 
  Layout
 -->
<main class="px-4 md:px-8 lg:px-12 w-full h-full py-6 md:py-12">
  <div class="w-full text-center">
    <h1 class="text-xl font-semibold">{$_("authorize.emailScreen.header", { default: "Let's login" })}</h1>
    <p class="text-sm text-gray-700">{$_("authorize.emailScreen.subheader", { default: "to continue using Wavees Services" })}</p>
  </div>

  <div class="mt-12 w-full flex flex-col justify-center items-center">
    <!-- Email input -->
    <div class="w-full">
      <TextInput on:keyup={(e) => {
        error = null;
        dispatch("error", null);
      }} id="email" bind:value={email} on:keyup={(e) => keyup(e)} on:input={(e) => input(e)} fullWidth={true} type="email" title={$_("authorization.emailScreen.emailInput", { default: "Your email" })} placeholder="*******@user.com">
      </TextInput>
    </div>
    
    <!-- Buttons -->
    <div class="mt-8 w-full px-4 md:px-6 flex flex-col justify-center">
      <Button on:click={(e) => {
        process();
      }} fullWidth={true} roundedCorners="tl,bl,br">
        { #if emailValidating }
          <Spinner size="15" color="#fff" />
        { :else }
          {#if error != null}
            <!-- Icon -->
            <img style="width: 1.2rem;" src="./icons/alert-circle.svg" alt="Error Icon">

            <p class="mx-4">{$_(error, { default: "Unknown Error" })}</p>
          { :else }
            {$_("global.proceed", { default: "Proceed" })}          
          {/if}
        { /if }
      </Button>

      <Button on:click={() => dispatch("providerChange")} fullWidth={true} type="ghost" margin="mt-4">
        Use another method
      </Button> 
    </div>

    <!-- Disclaimer -->
    <div class="mt-4 w-full text-center">
      <Caption>{$_("authorize.dislaimer", { default: "By continuing, you agree to our terms of use." })}</Caption>
    </div>
  </div>
</main>