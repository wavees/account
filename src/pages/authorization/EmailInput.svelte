<script>
  // import
  import { _ } from "svelte-i18n";

  import { onMount } from 'svelte';

  import { createEventDispatcher } from "svelte";
  import Cookie from "cookie-universal";

  // Let's import some helpers
  import validateEmailRegex from "../../helpers/validateEmail";
  import validateEmailExternal from "../../helpers/authorization/checkEmail";

  // Not-so-complex function, that'll help us
  // to validate user emails.
  function validateEmail(checkEmail) {
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
          if (checkEmail == email) {
            emailValidating = false;

            if (response.exists) {
              emailInvalid = false;
            } else {
              emailInvalid = !response.validEmail;
            }
          }
        }).catch((error) => {
          // And here we also need to check something..
          if (checkEmail == email) {
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
      // Email is valid, so let's just create a new cookie
      // with this email (cookie name: _login_email) and
      // ask our "engine" to reload this page.
      cookies.set('_login_email', email);

      dispatch("check");
    } else {
      // Let's send error to user...
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

  let previousEmail = null;
  
  // Let's export and determine one needed variable.
  export let email = null;
</script>

<!-- 
  Layout
 -->
<main>
  <div class="w-full text-center">
    <Heading>Введите почту</Heading>
    <Caption>для того, что бы войти в аккаунт</Caption>
  </div>

  <div class="mt-12 w-full flex flex-col justify-center items-center px-2 md:px-8 lg:px-16">
    <!-- Email input -->
    <div class="flex">
      <TextInput on:keyup={(e) => {
        dispatch("error", null);
      }} id="email" bind:value={email} on:keyup={(e) => keyup(e)} on:input={(e) => input(e)} fullWidth={true} type="email" title="Ваша почта" placeholder="*******@user.com">
        
        <!-- Icon, that'll show if our email 
        is valid or not -->
        <div slot="icon-right" class="mx-4">
          { #if emailValidating }
            <Spinner size="25" />
          { :else }
            { #if emailInvalid == true }
              <img src="./icons/error.svg" alt="Error Icon">
            { :else if emailInvalid == false }
              <img src="./icons/checkmark.svg" alt="Valid Icon">
            { /if }
          { /if }
        </div>
      </TextInput>
    </div>

    <!-- Buttons -->
    <div class="mt-16 flex">
      <Button type="ghost">{ $_("global.back", { default: "Back" }) }</Button>
      <Button on:click={(e) => {
        process();
      }}>{$_("global.proceed", { default: "Proceed" })}</Button>
    </div>
  </div>
</main>