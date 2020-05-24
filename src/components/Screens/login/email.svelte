<script>
  // import
  import { createEventDispatcher } from "svelte";
  import validateEmail from "../../../helpers/validateEmail.js";

  import { onMount } from "svelte";
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
      dispatch("error", "authorization.errors.invalidEmail");
      dispatch("loading", false);
    }
  };

  function keyup() {
    dispatch("error", null);

    if (e.keyCode === 13) {
      e.preventDefault();
      verify();
    };
  };

  // It's very bad code, isn't it?
  onMount(() => {
    let focusElement = document.getElementById("email");
    focusElement.focus();
  });

  // Some variables;
  export let email = null;
</script>

<div class="items-center text-center">
  <div class="mb-6">
    <h1 class="text-semibold text-xl">Для продолжения</h1>
    <p>введите Вашу почту</p>
  </div>

  <input on:keyup={(e) => {keyup(e)}} bind:value={email} id="email" class="focus appearance-none w-full py-2 px-3 border border-dashed" type="text" placeholder="email">
  
  <div class="my-6 flex w-full justify-center items-center">
    <TransparentButton on:click={(e) => {
      window.location.href = "/";
    }} classes="mx-2">
      Назад
    </TransparentButton>

    <RoundedButton on:click={(e) => {
      verify();
    }} classes="mx-2">
      Продолжить 🚪
    </RoundedButton>
  </div>

  <div class="w-full text-center text-sm">
    <p>Продолжая, вы соглашаетесь с Пользовательским Соглашением.</p>
  </div>
</div>