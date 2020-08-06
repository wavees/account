<script>
  // Let's import some modules
  import axios from "axios";
  import { onMount } from "svelte";

  import api from "../../../config/application/api.js";

  import authorizeUser from "../methods/login.js";

  import { stores } from "@sapper/app";

  // Let's get page store
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

  // onMount event
  // Here we'll redirect
  // our user to Discord Login
  // page and we'll monitor
  // current authorization state.
  onMount(() => {
    // Let's just call
    login();
  });

  // Function, that'll handle all
  // discord-login related things
  function login() {
    // Let's firstly delete all Discord-related
    // cookies.
    cookies.remove('_discord_code');

    // And now let's open new window
    // with discord authorization page.
    let discordURI = "https://discord.com/api/oauth2/authorize?client_id=740588352117538848&redirect_uri=https%3A%2F%2Faccount.wavees.ml%2Fauthorize%2Fprovider%2Fdiscord&response_type=code&scope=email%20identify";

    // Let's firstly prepare our popup window
    let height = screen.height;
    let width = 500;

    let left = (screen.width - width) / 2;
    let top = (screen.height - height) / 4;
    window.open(discordURI, "Wavees Authorization using Discord Account", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
  
    step = "Waiting for you to Login";
    let authorizing = false;

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
        step = "Checking for Discord Account";

        let code = cookies.get('_discord_code');

        // Let's now get user token for this
        // account.
        if (!authorizing) {
          authorizing = true;

          // And now let's authorize our
          // user.
          let type;
          let session;

          // Now let's determine type of
          // our action.
          if ($page.paradms.id == "add") {
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

              dispatch("check");
            } else {
              loading = false;
              dispatch("error", "authorization.errors.invalidPincode");
            }
          }).catch((error) => {
            // Error Handling
          });
        };
      };
    }, 100);
  }
</script>

<!-- 
  Layout
 -->
<main class="px-4 md:px-16 lg:px-24 flex justify-center items-center">
  <div class="flex flex-col justify-center text-center w-full h-full">
    <!-- Text and Spinner -->
    <div>
      <span>
        <Spinner />
      </span>
      
      <p class="text-gray-700 text-sm mt-6">{step}</p>
    </div>

    <!-- Some buttons -->
    <div class="mt-6">
      <Button on:click={(e) => {
        login();
      }} type="ghost" fullWidth={true}>
        Reload
      </Button>
    </div>
  </div>

  <!-- Small Footer -->
  <div class="absolute inset-x-0 bottom-0 py-4 w-full text-center">
    <p class="text-gray-700 text-xs">Please, don't close this window</p>
  </div>
</main>