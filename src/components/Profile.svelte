<script>
  // Let's now import some modules...
  import axios from "axios";
  import api from "../config/application/api.js";
  import { onMount } from "svelte";

  import Callback from "../helpers/callback.js";
  import providers from "../config/stores/providers.js";

  // Importing components
  import {
    Avatar,

    Spinner,
  } from "darkmode-components/src/index";

  // onMount event
  // Here we'll get some information
  // about this profile. (in Wavees Service)
  onMount(() => {
    // Let's get some information
    // about this user (using user token)
    axios.get(`${api.url}/${api.version}/account/${token}`)
    .then((response) => {
      let data = response.data;

      provider = providers.getProvider(data.provider).module;

      // Updating user account
      user = {
        loaded: true,

        // Account information
        username: data.username,
        email: data.email,
        avatar: data.avatar
      };
    });
  });

  // Small function, that'll
  // handle redirect process for
  // our profile.
  function choose() {
    // And now we just need to call
    // our provider method and redirect our
    // user.
    Callback(token);
  };

  let user = {};
  let provider;

  // And now let's export some variables.
  export let token;
</script>

<!-- Component Style -->
<div on:click={(e) => {
  choose();
}} style="cursor: pointer;" class="w-full my-6 bg-gray-200 hover:bg-gray-400 rounded-lg shadow-xl relative">

  {#if provider}
    <svelte:component this={provider.components.profile} user={user} />
  {/if}
</div>