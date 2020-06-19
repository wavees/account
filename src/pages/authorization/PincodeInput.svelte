<script>
  // import
  import { _ } from "svelte-i18n";
  import { api } from "../../config/global.js";

  import axios from "axios";

  import { stores } from "@sapper/app";

  // Let's get page store
  const { page } = stores();

  import { createEventDispatcher, onMount } from "svelte";
  import Cookie from "cookie-universal";

  // Let's import some helpers
  import authorizeUser from "../../helpers/authorization/loginUser";

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
    
    Avatar, 
    theme } from "darkmode-components/src/index"

  // Function, that'll process given information
  function process() {
    // Let's create event, that'll change our tile
    // to loading state.
    dispatch('step', { step: 2, loading: true });

    // Let's now get user's email from cookie manager
    let email = cookies.get('_login_email');

    // And now we need to check if we need to:
    // 1. Add this account to existing session
    // 2. Create new session

    let type;
    let session;
    if ($page.params.id == "add") {
      type = "sessionAdd";
      session = cookies.get('_account_token');
    };

    // By the way, we need to get our user's pincode
    // input...
    let inputs = document.getElementsByClassName("pincode");
    let pincode = [];

    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].value != "") pincode.push(inputs[i].value);
    };

    pincode = pincode.join("");

    if (pincode.split('').length != 4) {
      dispatch("error", "authorization.errors.invalidPincode");
    } else {
      // Let's try to login our user;
      authorizeUser(email, pincode, type, session)
      .then((response) => {
        // Now let's write down user's token to cookie
        // file and proceed with checkup 
        if (response.token != null) {
          cookies.set('_account_token', response.token, { 
            path: "/"
          });
          // And let's delete _login_email cookie
          cookies.remove('_login_email');

          dispatch("check");
        } else {
          dispatch("error", "authorization.errors.invalidPincode");
        }
      }).catch(() => {
        dispatch("error", "authorization.errors.unableToLogin");
      });
    }
  };

  // Let's get avatar from email string.
  onMount(() => {
    let focusElement = document.getElementById("pincode-start");
    focusElement.focus();

    // Let's get user's email...
    let email = cookies.get('_login_email');

    axios.get(`${$api.url}/user/check/${email}`)
    .then((response) => {
      let data = response.data;

      if (data.avatar != null) {
        avatarImage = data.avatar;
      };
    }).catch((error) => {
      dispatch("error", "authorization.errors.unableToGetAvatar");
    });
  });

  let avatarImage;
  let pincode;

  // Function, thah'll help us to check user's input
  function keyup(e) {
    dispatch("error", null);

    if (e.keyCode === 13) {
      e.preventDefault();
      process();
    }
  };
</script>

<style>
  .pincode {
    width: 35px; 
    text-align: center; 
    height: 50px; 
    border: 0; 
    border-bottom: 2px solid #555770; 
    border-radius: 2px 2px 0 0; 
    font-size: 2em; 
    background-color: transparent;
    cursor: default; 
    user-select: none;
  }
</style>

<!-- 
  Layout
 -->
<main>
  <div class="w-full text-center flex flex-col justify-center items-center">
    <Avatar type="image" {avatarImage} size={4.5} />

    <div class="mt-4">
      <Heading>Введите пинкод</Heading>
      <Caption>который вы получили по время регистрации</Caption>
    </div>
  </div>

  <div class="mt-12 w-full flex flex-col justify-center items-center px-2 md:px-8 lg:px-16">
    <div style="{$theme == "light" ? "color: #000;" : "color: #fff;"}" class="items-center text-center">
      <input id="pincode-start" type="text" class="m-2 pincode" on:keyup={(e) => keyup(e)}>
      <input type="text" class="m-2 pincode" on:keyup={(e) => keyup(e)}>
      <input type="text" class="m-2 pincode" on:keyup={(e) => keyup(e)}>
      <input type="text" class="m-2 pincode" on:keyup={(e) => keyup(e)}>
    </div>

    <!-- Buttons -->
    <div class="mt-16 flex">
      <Button on:click={(e) => {
        cookies.remove('_login_email');
        dispatch('step', { step: 1, loading: false });
      }} type="ghost">{ $_("global.back", { default: "Back" }) }</Button>
      <Button on:click={(e) => {
        process();
      }}>{$_("global.proceed", { default: "Proceed" })}</Button>
    </div>
  </div>
</main>