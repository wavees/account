<script>
  // import
  import { createEventDispatcher } from "svelte";
  import { callback } from "../../../config/callback.js";
  import { api } from "../../../config/global.js";

  import axios from "axios";

  import { onMount } from "svelte";
  import { stores } from "@sapper/app";

  // Importing components
  import Avatar from "../../Avatar.svelte";
  import RoundedButton from "../../Buttons/RoundedButton.svelte";
  import TransparentButton from "../../Buttons/TransparentButton.svelte";

  // Let's get id of callback
  const { page } = stores();
  const { id } = $page.params;

  // New event dispatcher
  const dispatch = createEventDispatcher();

  // verify
  // Called when user presses the "I agree button"
  function verify() {
    dispatch("succeed");
  };

  // Let's get avatar from email string.
  onMount(() => {
    let focusElement = document.getElementById("button");
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

  let avatar = null;

  // Email string
  export let email = "undefined email";
</script>

<div class="items-center text-center">
  <div class="w-full my-2 flex justify-center items-center">
    <Avatar size="4.5" avatar={avatar} username={email} />
  </div>

  <div class="mb-6">
    <h1 class="text-semibold text-xl">Подтверждение на переадресацию</h1>
    <p class="text-sm">Этот сайт <a href="{$callback.url}" style="text-decoration: none; color: #4299e1; border-bottom: 1px dotted #4299e1">({$callback.url})</a> будет иметь данные права:</p>
  </div>

  <div>
    <!-- Permissions container -->
    <div class="w-full justify-start">
      <div class="flex my-2">
        <img src="icons/check.svg" alt="Agree">
        <p class="mx-4">Видеть вашу почту</p>
      </div>

      <div class="flex my-2">
        <img src="icons/check.svg" alt="Agree">
        <p class="mx-4">Видеть ваш Аватар</p>
      </div>

      <div class="flex my-2">
        <img src="icons/check.svg" alt="Agree">
        <p class="mx-4">Готовить вкусные пироги 🥧</p>
      </div>
    </div>
  </div>

  <div class="mt-6 w-full flex justify-around">
    <RoundedButton id="button" on:click={(e) => verify()}>
      Я согласен 👌
    </RoundedButton>
  </div>

  <div class="mt-4 w-full flex justify-between">
    <TransparentButton on:click={(e) => {
      if (id != "add") {
        window.location.href = `/authorize/add?return=authorize/${id}`;
      };
    }} classes="text-sm">
      Другой аккаунт
    </TransparentButton>
 
    <TransparentButton on:click={(e) => {
      window.location.href = "/";
    }} classes="text-sm">
      Вернуться домой
    </TransparentButton>
  </div>
  
  <div class="mt-6 text-xs px-4 md:px-6">
    Вы всегда можете отключить данное приложение от вашего аккаунта на <a href="https://account.wavees.co.vu/settings?u={email}" style="text-decoration: none; color: #4299e1; border-bottom: 1px dotted #4299e1">страничке с настройками аккаунта</a>.
  </div>
</div>