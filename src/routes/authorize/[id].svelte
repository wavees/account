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

  // Header Items
  let headerItems = [
    {
      title: "Our Services",
      link: "https://wavees.ml"
    },
    {
      title: "Wavees Company",
      link: "https://company.wavees.ml"
    },
    // {
    //   title: "Wavees Company",
    //   link: "https://company.wavees.ml"
    // },
  ];

</script>

<svelte:head>
	<link rel="stylesheet" href="./fonts/Junegull/junegull.css">
  <title>Wavees Auth</title>
</svelte:head>

<main style="background-image: url('https://source.unsplash.com/random/1600x900'); background-size: cover; background-position: center center;" class="flex h-full items-center w-full relative">
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

  <!-- Header -->
  <div class="absolute inset-x-0 top-0 px-2 md:px-6 lg:px-8 hidden py-6 lg:py-8 md:flex justify-between">
    <!-- Logotype -->
    <h1 style="font-family: Junegull" class="text-white text-xl">wavees</h1>
  
    <!-- Header Links -->
    <div class="flex items-center">
      {#each headerItems as item}
        <a class="mx-6 text-gray-200 text-xs" href="{item.link}">{item.title}</a>
      {/each}
    </div>
  </div>

  <div class="w-full lg:w-1/3 h-full py-4 md:py-8 lg:py-24 px-2 md:px-6 lg:px-8">
    <!-- 
      Wavees Authorization logotype
     -->
    
    <!-- Tile -->
    <div class="relative h-full flex flex-col justify-center items-center bg-white rounded-lg shadow-xl">
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

      <!-- Error status -->
      {#if error != null}
        <div transition:slide class="py-4">
          <Caption>{$_(error, { default: error })}</Caption>
        </div>
      {/if}
    </div>
    <!-- </Tile> -->
  </div>

  <!-- Change language and copyright -->
  <!-- <div class="absolute inset-x-0 bottom-0 w-full flex justify-center items-center py-6">
    
    #Smol language picker
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
  </div> -->
</main>