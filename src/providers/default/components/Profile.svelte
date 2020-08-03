<script>
  // Let's now import some modules...
  import axios from "axios";
  import api from "../../../config/application/api.js";
  import { onMount } from "svelte";

  import callback from "../methods/callback.js";

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
    callback(token);
  };

  let user = {};

  // And now let's export some variables.
  export let token;
</script>

<!-- Component Style -->
<div on:click={(e) => {
  choose();
}} style="cursor: pointer;" class="w-full my-6 bg-gray-200 hover:bg-gray-400 rounded-lg shadow-xl relative">
  {#if !user.loaded}

    <div style="z-index: 998;" class="absolute w-full h-full bg-gray-200 hover:bg-gray-400 flex justify-center items-center rounded-lg">
      <Spinner size="20" /> 
    </div>

  {/if}
  
  <div class="px-6 py-4 w-full flex justify-between">
    <div class="flex items-center">
      <div class="relative">
        <Avatar type="image" size="2.5" avatar="{user.avatar}" />
        <!-- Badge to show type of provider (Wavees) -->
        <span style="z-index: 1000;" class="absolute rounded-full w-4 h-4 flex justify-center items-center text-center bg-black top-0 right-0">
          <p style="font-family: Junegull; font-size: .50rem;" class="text-white">w</p>
        </span>
      </div>

      <!-- Texts -->
      <div class="mx-4">
        <h1 class="text-sm font-semibold">{user.username}</h1>
        <p class="text-gray-700 text-xs">{user.email}</p>
      </div>
    </div>

    <!-- Icon -->
    <div class="flex items-center">
      <img style="width: 1.6rem;" src="./icons/chevron-right.svg" alt="Choose Account Icon">
    </div>
  </div>
</div>