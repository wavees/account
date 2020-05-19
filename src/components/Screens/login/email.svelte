<script>
  // import
  import { createEventDispatcher } from "svelte";
  import validateEmail from "../../../helpers/validateEmail.js";

  import axios from "axios";
  import Cookie from "cookie-universal";

  import { api } from "../../../config/global.js";

  // Importing components
  import RoundedButton from "../../Buttons/RoundedButton.svelte";
  import TransparentButton from "../../Buttons/TransparentButton.svelte";

  // Cookies
  const cookies = Cookie();

  // Create event dispatcher
  const dispatch = createEventDispatcher();

  // verify function.
  // Fired when user presses "Continue" button.
  // This function will check for user existance 
  // in our system, and if user doesn't exist - 
  // this function will check if email is valid.

  // Then this function will fire an SUCCEED or ERROR event.
  function verify() {
    dispatch("loading", true);

    if (validateEmail(email)) {
      // Let's check if user with this email is
      // registered on Wavees Services
      axios.get(`${$api.url}/user/check/${email}`)
      .then((response) => {
        let data = response.data;
        // User exists. Let's continue...
        cookies.set('login-email', email);

        dispatch("succeed", { 
          email: email, 
          userExists: true });
      })
      .catch((error) => {
        // User doesn't exist. Ok, so now we need
        // to check if this email is valid.
        axios.get(`${$api.url}/user/validate/${email}`)
        .then((response) => {
          let data = response.data;

          if (data.valid) {
            // Email is valid.
            // Let's continue to registration step.
            cookies.set('login-email', email);

            dispatch("succeed", {
              email: email,
              userExists: false,
            });
          } else {
            // Email is invalid.
            error = 1;
          };

          dispatch("loading", false);
        }).catch((error) => {
          // Server Error;
          error = 2;

          dispatch("loading", false);
        });
      });
    } else {
      error = 1;

      dispatch("loading", false);
    }
  };

  // Error variable (It will contain error message, yes)
  
  // Error codes:
  // 1 - Invalid email
  // 2 - Server Error

  let error = null;

  // Some variables;
  export let email = null;
</script>

<div class="items-center text-center">
  <input bind:value={email} id="email" class="appearance-none w-full py-2 px-3 border border-dashed" type="text" placeholder="email">
  
  <div class="my-6 flex w-full justify-center items-center">
    <TransparentButton classes="mx-2">
      Home
    </TransparentButton>

    <RoundedButton on:click={(e) => {
      verify();
    }} classes="mx-2">
      Continue 🚪
    </RoundedButton>
  </div>

  <div class="w-full text-center text-sm">
    <p>By continuing, you agreeing to the User Agreement.</p>
  </div>
</div>