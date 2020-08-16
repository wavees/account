<script>
  // Let's import some modules
  import axios from "axios";
  import { onMount } from "svelte";

  // Event Dispatcher
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import moment from "moment";
  import api from "../../../config/application/api.js";
  import authorizeUser from "../methods/login.js";

 
  // Let's get page store
  import { stores } from "@sapper/app";
  const { page } = stores();

  // Cookie Manager
  import Cookie from "cookie-universal";
  const cookies = Cookie();

  // And here let's import components
  import {
    Button,

    Spinner
  } from "darkmode-components/src/index";

  // Small Variable, that'll show our current
  // authorization step.
  let step = "Preparing things";

  // Function, that'll handle all
  // discord-login related things
  function login() {
    // Let's firstly delete all Discord-related
    // cookies.
    cookies.remove('_discord_code');

    // And now let's open new window
    // with discord authorization page.
    let discordURI = "https://discord.com/api/oauth2/authorize?client_id=740588352117538848&redirect_uri=https%3A%2F%2Fapi.wavees.ml%2Fprovider%2Fdiscord&response_type=code&scope=identify%20email";
    // https://discord.com/api/oauth2/authorize?client_id=740588352117538848&redirect_uri=https%3A%2F%2Faccount.wavees.ml%2Fauthorize%2Fprovider%2Fdiscord&response_type=code&scope=email%20identify
    
    // Let's firstly prepare our popup window
    let height = screen.height;
    let width = screen.width / 3;

    let left = (screen.width - width) / 2;
    let top = (screen.height - height) / 4;
    window.open(discordURI, "Wavees Authorization using Discord Account", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
  
    step = "Waiting for you to Login";
    let authorizationProcess;

    // Here we'll wait for user login
    // credentials
    setInterval(() => {
      // Function, that'll check our current
      // state.
      if (cookies.get('_discord_code')) {
        // Okay, so now we just need to
        // get token for this account
        // and then we need to proceed
        // with login procedure.
        let code = cookies.get('_discord_code');

        // Let's now get user token for this
        // account.
        if (!authorizationProcess) {
          step = "Checking for Discord Account";

          authorizationProcess = true;

          // And now let's authorize our
          // user.
          let type;
          let session;

          // Now let's determine type of
          // our action.
          if ($page.params.id == "add") {
            type = "sessionAdd";
            session = cookies.get('_account_token');
          };

          authorizeUser(code, type, session)
          .then((response) => {
            if (response.token != null) {
              cookies.set('_account_token', response.token, { 
                path: "/",
                expires: moment().add('1', 'year').toDate()
              });
              // And let's delete _login_email cookie
              cookies.remove('_login_email');

              dispatch("callback");
            } else {
              loading = false;
              dispatch("error", "authorization.errors.invalidPincode");
            }
          }).catch((error) => {
            console.log("ERROR");
            console.log(error);
            // Error Handling
          });
        };
      };
    }, 100);
  }

  function goBack() {
    // Construct URLSearchParams object instance from current URL querystring.
    let queryParams = new URLSearchParams(window.location.search);
    
    // Set new or modify existing parameter value. 
    queryParams.delete("providerId");
    
    // Replace current querystring with the new one.
    history.replaceState(null, null, `${location.pathname}?${queryParams.toString()}`);
  
    location.reload();
  };

  let authorizing = false;
  let backLoading;
</script>

<!-- 
  Layout
 -->
<main class="relative h-full flex justify-center items-center">
  <div class="flex flex-col justify-center text-center px-4 md:px-6 lg:px-12">
    <!-- Text and Spinner -->
    {#if authorizing}
      <div>
        <span>
          <Spinner size="15" />
        </span>
        
        <p class="text-gray-700 text-sm mt-6">{step}</p>

        <!-- Buttons -->
        <div class="mt-4">
          <button on:click={(e) => {
            backLoading = true;
            goBack();
          }} class="w-full text-white text-sm rounded-lg bg-black h-8 { backLoading ? "" : "hover:bg-blue-300" }">
            {#if backLoading}
              <Spinner size="12" color="#fff" />
            { :else }
              Cancel
            {/if}
          </button>
        </div>
      </div>
    { :else }
      <!-- Log in information -->
      <h1 class="text-base font-semibold">Log in using <span class="border-b-1 border-dotted border-gray-800">Discord.com</span></h1>
      <p class="text-sm text-gray-700 mt-4">Before you go any further, you should know about what we will do with your Discord account.</p>

      <!-- List of things we will do with the user account -->
      <div class="my-8">
        <!-- Retrieve user Email and Information -->
        <div class="w-full flex items-center">
          <!-- Icon -->
          <img style="height: 1rem;" src="./icons/checkmark.svg" alt="Checkmark">

          <!-- Text -->
          <p class="text-xs mx-2">Retrieve your Email and other information</p>
        </div>

        <!-- Retrieve user Server List -->
        <div class="w-full flex items-center">
          <!-- Icon -->
          <img style="height: 1rem;" src="./icons/checkmark.svg" alt="Checkmark">

          <!-- Text -->
          <p class="text-xs mx-2">Get your servers list</p>
        </div>

        <!-- See Messages -->
        <div class="w-full flex items-center">
          <!-- Icon -->
          <img style="height: 1rem;" src="./icons/x.svg" alt="x">

          <!-- Text -->
          <p class="text-xs mx-2">See messages</p>
        </div>

        <!-- Join/Leave Discord servers -->
        <div class="w-full flex items-center">
          <!-- Icon -->
          <img style="height: 1rem;" src="./icons/x.svg" alt="x">

          <!-- Text -->
          <p class="text-xs mx-2">Join/Leave from Discord servers</p>
        </div>

        <!-- Any other evil things -->
        <div class="w-full flex items-center">
          <!-- Icon -->
          <img style="height: 1rem;" src="./icons/x.svg" alt="x">

          <!-- Text -->
          <p class="text-xs mx-2">Any other evil things</p>
        </div>
      </div>

      <!-- Buttons --> 
      <div class="w-full flex items-center text-sm">
        <!-- Agree -->
        <button on:click={(e) => {
          authorizing = true;
          step = "Waiting for you to log in";

          login();
        }} class="w-full rounded-lg bg-black text-white h-8 flex items-center justify-center">
          I agree
        </button>

        <!-- Cancel -->
        <button on:click={(e) => {
          backLoading = true;
          goBack();
        }} class="w-full h-8">
          {#if backLoading}
            <Spinner size="12" />
          { :else }
            Cancel
          {/if}
        </button>
      </div>
    {/if}
  </div>

  <!-- Small Footer -->
  <div class="absolute inset-x-0 bottom-0 py-4 w-full text-center">
    <p class="text-gray-700 text-extra-xs">Please, don't close this window</p>
  </div>
</main>