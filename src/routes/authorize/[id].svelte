<script>
  // import
  import { _, locale } from "svelte-i18n";
  
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  import { goto } from "@sapper/app";
  import { stores } from "@sapper/app";

  import Cookie from "cookie-universal";

  // Cookies manager
  const cookies = Cookie();

  // Let's get page store
  const { page } = stores();

  // And now we need to import
  // our authorization provider.
  import providers from "../../config/stores/providers.js";
  const provider = providers.getProvider($page.query.providerId).module;

  // Importing components
  import { 
    theme, 
    colors,
    
    Tile,

    Caption,
    
    Spinner } from "darkmode-components/src/index";

  let error;
  let step = "check";
  let loading = true;

  // Small function, that'll
  // check our current state.
  function check() {
    provider.check()
    .then((state) => {
      loading = false;
      step = state;
    });
  };

  // onMount event
  // Here we'll determine which authorization step
  // we need to show. Examples: (email, pincode, user registration
  // and so on)
  onMount(() => {
    check();
  });

  // Function, that'll 
</script>

<svelte:head>
	<link rel="stylesheet" href="./fonts/Junegull/junegull.css">
  <title>Wavees Auth</title>
</svelte:head>

<main class="flex h-full items-center max-w-full">
  <!-- 
    Loading screen
  -->
  {#if step == "check" || loading}
    <div style="height: 100vh; z-index: 999; background-color: {$theme == "dark" ? $colors.dark[0] : $colors.light[4]}" class="absolute w-full flex justify-center items-center">
      <!-- Branding -->
      <div class="flex flex-col justify-center items-center">
        <div class="flex mb-6 items-center">
          <h1 style="font-family: Junegull; color: {$theme == "dark" ? $colors.light[2] : $colors.dark[2]}" class="text-3xl text-bold">wavees</h1>
        </div>

        <Spinner />
      </div>
    </div>
  {/if}

  <div style="background-color: {$theme == "dark" ? $colors.dark[0] : $colors.light[4]}" class="relative h-full w-full lg:w-2/3 flex flex-col justify-center items-center">
    <!-- 
      Wavees Authorization logotype
     -->
    <div class="text-center py-4 px-6 absolute inset-x-0 top-0">
      <h1 style="font-family: Junegull; color: {$theme == "dark" ? $colors.light[2] : $colors.dark[1]}" class="text-2xl text-bold">wavees</h1>
      <p></p>
    </div>
    
    <!-- Tile -->
      <!-- 
        @step Identity
        In this step we need to identity
        our user.
      -->
      { #if step == "identity" }
        <svelte:component this={provider.pages.identity} 
          on:error={(e) => error = e.detail}
          on:check={() => check() } 
        />
      <!-- 
        @step Authorization
        Step, in which our user needs
        to authorize using his password/pincode
        or whatever else.
       -->
      { :else if step == "authorization" }
        <svelte:component this={provider.pages.authorization}
          on:error={(e) => error = e.detail}
          on:check={() => check()} />
      <!-- 
        @step Account Creation
        Here we'll show page, where user
        will be able to create new
        account.
      -->
      { :else if step == "create" }
        <svelte:component this={provider.pages.create}
          on:error={(e) => error = e.detail}
          on:check={() => check()} />
      {/if}
    <!-- </Tile> -->

    <!-- Error status -->
    {#if error != null}
      <div transition:slide class="py-4">
        <Caption>{$_(error, { default: error })}</Caption>
      </div>
    {/if}

    <!-- Change language and copyright -->
    <div class="absolute inset-x-0 bottom-0 w-full flex justify-center items-center py-6">
      
      <!-- Smol language picker -->
      <div class="flex">
        <button on:click={(e) => {
          cookies.set("_language", "ru");
          locale.set("ru");
        }} class="mx-2 {$locale.includes("ru") ? "text-gray-800" : "text-gray-500"}">RU</button>
        
        <button on:click={(e) => {
          cookies.set("_language", "en");
          locale.set("en");
        }} class="mx-2 {$locale.includes("en") ? "text-gray-800" : "text-gray-500"}">EN</button>
      </div>
    </div>
  </div>

  <!-- 

    -->
  <div style="background-image: url('{$theme == "dark" ? "background-dark.png" : "background-light.png"}'); background-size: cover; background-position: center center; background-color: {$theme == "dark" ? $colors.dark[0] : $colors.light[2]}" class="relative h-full w-full flex flex-col justify-center items-center hidden lg:flex"></div>
</main>