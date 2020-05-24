<script>
  // import
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";

  import axios from "axios";
  import { api } from "../../../config/global.js";

  import Cookie from "cookie-universal";

  // Importing components
  import RoundedButton from "../../Buttons/RoundedButton.svelte";
  import TransparentButton from "../../Buttons/TransparentButton.svelte";
  import Avatar from "../../Avatar.svelte";

  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Cookies manager
  const cookies = Cookie();

  function verify() {
    let inputs = document.getElementsByClassName("pincode");
    let pincode = [];

    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].value != "") pincode.push(inputs[i].value);
    };

    pincode = pincode.join("");

    // Checking pincode size;
    if (pincode.split("").length != 4) {
      dispatch("error", "authorization.errors.pincodeLength");
    } else {
      // Let's login our user!
      dispatch("loading", true);
      dispatch("succeed", { pincode: pincode });
    }
  };

  // Let's get avatar from email string.
  onMount(() => {
    let focusElement = document.getElementById("pincode-start");
    focusElement.focus();

    axios.get(`${$api.url}/user/check/${email}`)
    .then((response) => {
      let data = response.data;

      if (data.avatar != null) {
        avatar = data.avatar;
      };

      if (data.username != null) {
        username = data.username;
      }
    }).catch((error) => {
      dispatch("error", "authorization.errors.unableToGetAvatar");
    });
  });

  function keyup(e) {
    dispatch("error", null);

    if (e.keyCode === 13) {
      e.preventDefault();
      verify();
    }
  };

  let avatar = null;

  // Email string
  export let email = "undefined email";
  let username = email;
</script>

<style>
  .pincode {
    width: 35px; 
    text-align: center; 
    height: 50px; 
    border: 0; 
    border-bottom: 2px solid rgba(0,0,0,0.3); 
    border-radius: 2px 2px 0 0; 
    font-size: 2em; 
    transition: background-color 0.3s, color 0.3s, opacity 0.3s; 
    cursor: default; 
    user-select: none;
  }
</style>

<div class="items-center text-center">
  <div class="mb-6 flex flex-col justify-center items-center">
    <Avatar size="4.5" avatar={avatar} username={username} />

    <div class="mt-2">
      <p class="font-semibold text-xl">Введите пинкод от аккаунта:</p>
      <p class="text-sm text-semibold">{email}</p>
    </div>
  </div>

  <div class="items-center text-center">
    <input id="pincode-start" type="text" class="m-2 pincode" on:keyup={(e) => keyup(e)}>
    <input type="text" class="m-2 pincode" on:keyup={(e) => keyup(e)}>
    <input type="text" class="m-2 pincode" on:keyup={(e) => keyup(e)}>
    <input type="text" class="m-2 pincode" on:keyup={(e) => keyup(e)}>
  </div>

  <RoundedButton classes="mt-4" on:click={(e) => verify()}>
    Войти 🔑
  </RoundedButton>

  <div class="w-full mt-4 flex justify-between">
    <TransparentButton on:click={(e) => {
      cookies.remove('login-email');

      dispatch("error", null);
      dispatch("changeStep", 1);
    }} classes="text-sm" on:click={(e) => {}}>
      Другой аккаунт
    </TransparentButton>

    <TransparentButton classes="text-sm" on:click={(e) =>{}}>
      Забыли пинкод?
    </TransparentButton>
  </div>
</div>