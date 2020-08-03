<script>
  // import
  import { _, locale } from "svelte-i18n";
  
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  import { user } from "../../config/stores/user.js";

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

    Heading,
    Caption,
    
    Button,

    Spinner } from "darkmode-components/src/index";

  let error;
  let step = "check";
  let loading = true;

  // Small function, that'll
  // check our current state.
  function check() {

    // And now we need to check
    // a lot of different things...

    // Variable (Action Type) to determine
    // our next steps (Show Accounts page or
    // check for provider)
    let type = "provider";

    if ($page.params.id == "login") {
      type = "provider";
    } else {
      if ($page.params.id == "add") {
        type = "provider";
      } else {
        if ($page.query.providerId == null) {
          if ($user.tokens.length >= 1) {
            // So now let's show all user
            // accounts ane etc.
            type = "accounts";
          } else {
            // And now we need just to proceed
            // with our current provider.
            type = "provider";
          }
        } else {
          // We don't even need
          // to check for user accounts,
          // let's just proceed with our
          // provider.
          type = "provider";
        };
      };
    };

    // And now let's do some actions
    // depending on this "Action Type"
    switch (type) {
      case "accounts":
        // Here we'll show accounts
        // page to our user.
        loading = false;
        step = "accounts"
        break;
    
      default:
        // Default:
        // let's call provider's
        // check function.
        provider.check()
        .then((state) => {
          loading = false;
          step = state;
        });

        break;
    }
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
    }
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
    <div class="flex items-center px-6 bg-white rounded-lg">
      {#each headerItems as item}
        <a class="px-6 py-4 text-gray-800 hover:text-black text-xs" href="{item.link}">{item.title}</a>
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
        @step Choose account
        In this step we'll ask user
        to choose one account. 
      -->
      { #if step == "accounts" }

        <div class="w-full h-full px-4 md:px-8 py-6 flex flex-col">
          <!-- Text -->
          <div class="text-center">
            <Heading>Choose account</Heading>
            <Caption>to continue using Wavees Services</Caption>
          </div>

          <!-- Let's now list all user accounts -->
          <div style="overflow-y: scroll;" class="my-6 w-full flex-grow relative">
            <div style="overflow-y: scroll;" class="absolute pl-4 w-full h-full">
              {#each $user.tokens as token}
                <svelte:component this={provider.components.profile} token="{token}" />
              {/each}
            </div>
          </div>

          <!-- Button: Add new account -->
          <div class="w-full flex justify-center pb-2">
            <Button margin="py-0">
              Add new account
            </Button>
          </div>
        </div>

      <!-- 
        @step Identity
        In this step we need to identity
        our user.
      -->
      { :else if step == "identity" }
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