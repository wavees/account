<script>
  // Importing components
  import {
    Avatar,
  } from "darkmode-components/src/index";

  import { slide } from "svelte/transition";

  // Small function, that'll
  // handle redirect process for
  // our profile.
  function choose() {
    // And now we just need to call
    // our provider method and redirect our
    // user.
  };

  // And now let's export some variables.
  export let user;
</script>

<!-- Component Style -->

<div transition:slide class="px-6 py-4 w-full flex justify-between">
  <div class="flex items-center">
    <div class="relative">
      <Avatar type="image" size="2.5" avatar="{user.avatar}" />
      <!-- Badge to show type of provider (Wavees) -->
      <span style="z-index: 1000; margin: -9px;" class="absolute rounded-full flex justify-center items-center w-6 h-6 bg-blue-500 top-0 right-0">
        <img style="width: 1rem;" src="./logotypes/discord.svg" alt="Discord Logotype">
      </span>
    </div>

    <!-- Texts -->
    <div class="mx-4">
      <h1 class="text-sm font-semibold">{user.username}</h1>
      <p class="text-gray-700 text-xs">Logged in using <span class="border-b-2 border-dotted border-gray-700">Discord</span></p>
    </div>
  </div>

  <!-- Icon -->
  <div class="flex items-center">
    <img style="width: 1.6rem;" src="./icons/chevron-right.svg" alt="Choose Account Icon">
  </div>
</div>