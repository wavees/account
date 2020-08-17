<script>
  // Importing components
  import {
    Avatar,
  } from "darkmode-components/src/index";

  import { slide } from "svelte/transition";

  // And now let's export some variables.
  export let user;
</script>

<!-- Component Style -->
<div transition:slide class="px-6 py-4 w-full flex justify-between">
  <div class="flex items-center">
    <div class="relative">
      <Avatar type="image" size="2.5" avatar="{user.avatar}" />
      <!-- Badge to show type of provider (Wavees) -->
      <span style="z-index: 1000; margin: -9px;" class="absolute rounded-full w-6 h-6 flex justify-center items-center text-center bg-black top-0 right-0">
        <p style="font-family: Junegull; font-size: 0.6rem;" class="text-white">w</p>
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