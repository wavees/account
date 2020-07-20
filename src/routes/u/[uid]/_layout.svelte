<script>
  // Let's now import some very
  // important modules and configs...
  import axios from "axios";

  import { onMount } from "svelte";

  import { current } from "../../../config/stores/user";
  import { stores } from "@sapper/app"; 

  // Page store configuration.
  const { page } = stores();

  // Importing components.
  import {
    Spinner,

    theme,
    colors
  } from "darkmode-components/src/index";

  // Let's now load information
  // about this user.
  onMount(() => {
    const uid = $page.params.uid;

    current.loadProfile(uid);
  });
</script>

<!-- Main Layout -->
<main style="min-height: 100vh;" class="bg-gray-100 w-full flex justify-center items-center relative">
  <!-- Header -->
  <div class="absolute inset-x-0 top-0 py-4 text-center flex justify-center items-center">
    <h1 on:click={(e) => {
      window.location.href = "/";
    }} style="cursor: pointer; font-family: Junegull; color: {$theme == "dark" ? $colors.light[2] : $colors.dark[1]}" class="text-1xl text-bold">account</h1>

    { #if $current.loaded }
      <span class="font-bold text-xl text-black mx-2">/</span>
      <p class="font-bold text-1xl text-gray-800">{$current.username}</p>
    { /if }
  </div>

  <slot></slot>
</main>