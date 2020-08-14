<script>
  // import
  import { _ } from "svelte-i18n";

  import { onMount } from 'svelte';

  import { stores } from "@sapper/app";
  // Page store
  const { page } = stores();

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
    Spinner 
  } from "darkmode-components/src/index"

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
    emailValidating = true;

    // Let's validate user's email.
    if (!emailInvalid) {
      // Email is valid, so let's just create a new cookie
      // with this email (cookie name: _login_email) and
      // ask our "engine" to reload this page.
      cookies.set('_login_email', email.toLowerCase());

      dispatch("check");
    } else {
      emailValidating = false;

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
    error = null;

    if (e.keyCode === 13) {
      e.preventDefault();

      if (!emailInvalid) process();
    };
  };

  // Variable, that'll show if the email is valid or
  // no.
  let emailValidating = false;
  let emailInvalid = true;

  let error;

  let previousEmail = null;
  
  let backButtonLoading = false;

  // Let's export and determine one needed variable.
  let email = null;
</script>

<!-- 
  Layout
 -->
<main class="px-4 md:px-8 lg:px-12 w-full h-full flex justify-center items-center">
  <div>
    <div class="w-full text-center">
      <h1 class="text-base font-semibold">{$_("authorize.emailScreen.header", { default: "Let's login" })}</h1>
      <p class="text-xs text-gray-700">{$_("authorize.emailScreen.subheader", { default: "to continue using Wavees Services" })}</p>
    </div>

    <div class="mt-12 w-full relative flex flex-col justify-center items-center">
      <!-- Error Message (or something like this) -->
      {#if error != null}
        <div class="absolute w-full rounded-lg px-4 py-2 bg-black text-white">
          <!-- Let's just show error message -->
          {error}
        </div>
      {/if}
      
      <!-- Email input -->
      <div class="w-full relative flex items-center">
        <!-- Input Icon -->
        {#if email != null ? email.split('').length < 19 : true}
          <div class="absolute inset-y-0 left-0 h-full flex items-center">
            <img class="h-4" src="./icons/at-sign.svg" alt="Email Icon">
          </div>
        {/if}

        <!-- Input itself -->
        <input id="email" class="text-center" bind:value={email} on:keyup={(e) => keyup(e)} on:input={(e) => input(e)} type="email" placeholder="your email">
      </div>
      
      <!-- Buttons -->
      <div class="mt-12 w-full flex { $page.params.id == "add" ? "justify-between" : "justify-center px-4 md:px-6"}">
        <button class="{ emailInvalid ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-300" } w-full text-sm rounded-lg h-8 bg-black text-white flex justify-center text-center items-center" on:click={(e) => {
          process();
        }}>
          { #if emailValidating }
            <Spinner size="12" color="#fff" />
          { :else }
            {$_("global.proceed", { default: "Proceed" })}
          { /if }
        </button>

        {#if $page.params.id == "add"}
          <!-- Go Back button -->
          <button on:click={(e) => {
            backButtonLoading = true;

            let redirect = $page.query.return;
            let uri = encodeURIComponent(redirect);

            if (uri.includes("authorize")) {
              uri = uri.replace("authorize%2F", "authorize/")
            };

            window.location.href = `${uri}`;
          }} class="h-8 w-full text-center flex justify-center items-center">
            {#if backButtonLoading}
              <Spinner size="12" />
            { :else }
              Back
            {/if}
          </button>
        {/if}
      </div>
    </div>

    <!-- Another authorization methods -->
    <div class="mt-12 w-full">
    
      <!-- Divider -->
      <div class="flex items-center">
        <div class="w-full border-b-1 border-solid border-gray-800"></div>

        <img style="height: 1.1rem;" class="mx-4" src="./icons/cloud.svg" alt="Cloud Icon">

        <div class="w-full border-b-1 border-solid border-gray-800"></div>
      </div>

      <!-- List -->
      <div class="mt-8">
        <!-- Discord -->
        <button on:click={(e) => {
          dispatch("providerChange", "discord");
        }} class="my-4 w-full flex items-center px-4 border-1 rounded-lg h-8">
          <!-- Icon -->
          <span>
            <svg style="height: 1rem;" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 245 240"><style>.st0{fill:#000;}</style><path class="st0" d="M104.4 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1.1-6.1-4.5-11.1-10.2-11.1zM140.9 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1s-4.5-11.1-10.2-11.1z"/><path class="st0" d="M189.5 20h-134C44.2 20 35 29.2 35 40.6v135.2c0 11.4 9.2 20.6 20.5 20.6h113.4l-5.3-18.5 12.8 11.9 12.1 11.2 21.5 19V40.6c0-11.4-9.2-20.6-20.5-20.6zm-38.6 130.6s-3.6-4.3-6.6-8.1c13.1-3.7 18.1-11.9 18.1-11.9-4.1 2.7-8 4.6-11.5 5.9-5 2.1-9.8 3.5-14.5 4.3-9.6 1.8-18.4 1.3-25.9-.1-5.7-1.1-10.6-2.7-14.7-4.3-2.3-.9-4.8-2-7.3-3.4-.3-.2-.6-.3-.9-.5-.2-.1-.3-.2-.4-.3-1.8-1-2.8-1.7-2.8-1.7s4.8 8 17.5 11.8c-3 3.8-6.7 8.3-6.7 8.3-22.1-.7-30.5-15.2-30.5-15.2 0-32.2 14.4-58.3 14.4-58.3 14.4-10.8 28.1-10.5 28.1-10.5l1 1.2c-18 5.2-26.3 13.1-26.3 13.1s2.2-1.2 5.9-2.9c10.7-4.7 19.2-6 22.7-6.3.6-.1 1.1-.2 1.7-.2 6.1-.8 13-1 20.2-.2 9.5 1.1 19.7 3.9 30.1 9.6 0 0-7.9-7.5-24.9-12.7l1.4-1.6s13.7-.3 28.1 10.5c0 0 14.4 26.1 14.4 58.3 0 0-8.5 14.5-30.6 15.2z"/></svg>
          </span>

          <!-- Text -->
          <p class="text-xs ml-2">Log in using <span class="border-b-1 border-dotted border-gray-800">Discord.com</span></p>
        </button>

        <!-- Google -->
        <button class="opacity-75 cursor-not-allowed my-4 w-full flex items-center px-4 border-1 rounded-lg h-8">
          <!-- Icon -->
          <span>
            <svg style="height: 0.8rem;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>
          </span>

          <!-- Text -->
          <p class="text-xs ml-3">Log in using <span class="border-b-1 border-dotted border-gray-800">Google.com</span></p>
        </button>
      </div>

    </div>

    <!-- Disclaimer -->
    <div class="absolute inset-x-0 bottom-0 py-4 w-full text-center">
      <p class="text-gray-700 text-extra-xs">{$_("authorize.dislaimer", { default: "By continuing, you agree to our terms of use." })}</p>
    </div>
  </div>
</main>