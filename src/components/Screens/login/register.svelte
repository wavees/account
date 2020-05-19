<script>
  // import
  import { createEventDispatcher } from "svelte";

  import axios from "axios";
  import Cookie from "cookie-universal";

  // Importing components
  import RoundedButton from "../../Buttons/RoundedButton.svelte";
  import TransparentButton from "../../Buttons/TransparentButton.svelte";

  // Cookies
  const cookies = Cookie();

  // Create event dispatcher
  const dispatch = createEventDispatcher();

  // verify
  // Fired when user presses "Register" button.
  // This button will register our user and
  // then do some cool stuff :thumbsup:
  function verify() {
    dispatch("loading", true);
    dispatch("succeed", { username: username });
  };

  export let username;
</script>

<div class="items-center text-center">
  <input bind:value={username} id="username" class="appearance-none w-full py-2 px-3 border border-dashed" type="text" placeholder="username">
  
  <div class="my-6 w-full flex justify-center items-center">
    <TransparentButton on:click={(e) => {
      dispatch("changeStep", 1);
    }} classes="mx-2">
      Go back
    </TransparentButton>

    <RoundedButton on:click={(e) => {
      verify();
    }} classes="mx-2">
      Register 🤗
    </RoundedButton>
  </div>

  <div class="w-full text-center text-sm">
    <p class="mt-2 md:mt-6">By continuing, you agreeing to the User Agreement.</p>
  </div>
</div>