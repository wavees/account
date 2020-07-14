<script>
  // Let's now import some very
  // important modules and configs...
  import axios from "axios";

  import { onMount } from "svelte";

  import { api } from "../../../config/stores/global";
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
  <div class="absolute inset-x-0 top-0 py-4 text-center">
    <h1 style="font-family: Junegull; color: {$theme == "dark" ? $colors.light[2] : $colors.dark[1]}" class="text-1xl text-bold">account</h1>
  </div>

  <slot></slot>
</main>