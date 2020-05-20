<script>
  // import
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";

  import axios from "axios";
  import { api } from "../../../config/global.js";

  // Importing components
  import RoundedButton from "../../Buttons/RoundedButton.svelte";
  import TransparentButton from "../../Buttons/TransparentButton.svelte";

  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Error variable
  // With this variable we can show
  // error messages.

  // Error codes:
  // 1 - Invalid pincode 
  let error = null;
  
  function verify() {
    let inputs = document.getElementsByClassName("pincode");
    let pincode = [];

    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].value != "") pincode.push(inputs[i].value);
    };

    pincode = pincode.join("");

    // Checking pincode size;
    if (pincode.split("").length < 4) {
      error = 1;
    } else {
      // Let's login our user!
      dispatch("succeed", { pincode: pincode });
    }
  };

  // Let's get avatar from email string.
  onMount(() => {
    axios.get(`${$api.url}/user/check/${email}`)
    .then((response) => {
      let data = response.data;
      console.log(data);

      if (data.avatar != null) {
        avatar = data.avatar;
      };
    })
  });

  let avatar = null;

  // Email string
  export let email = "undefined email";
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
    <div class="rounded-full" style="background-image: url({avatar == null ? "https://cdn.dribbble.com/users/45488/screenshots/9084073/media/f889543c2e901048f8da2d9915d0bf37.jpg" : avatar}); background-size: cover; background-position: center center; width: 6em; height: 6em;" alt="Avatar"></div>
    <div class="mt-2">
      <p class="font-semibold text-xl">Введите пинкод от аккаунта:</p>
      <p class="text-sm text-semibold">{email}</p>
    </div>
  </div>

  <div class="items-center text-center">
    <input type="text" class="m-2 pincode">
    <input type="text" class="m-2 pincode">
    <input type="text" class="m-2 pincode">
    <input type="text" class="m-2 pincode">
  </div>

  <RoundedButton classes="mt-4" on:click={(e) => verify()}>
    Войти 🔑
  </RoundedButton>

  <div class="w-full mt-4 flex justify-between">
    <TransparentButton classes="text-sm" on:click={(e) => {}}>
      Другой аккаунт
    </TransparentButton>

    <TransparentButton classes="text-sm" on:click={(e) =>{}}>
      Забыли пинкод?
    </TransparentButton>
  </div>
</div>