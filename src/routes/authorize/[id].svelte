<script>
  // import
  import { _, locale } from "svelte-i18n";
  
	import { fade } from "svelte/transition";

  import axios from "axios";

  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  import { permissionsInfo as permissions } from "../../config/stores/permissions.js";
  import { user } from "../../config/stores/user.js";
  import api from "../../config/application/api.js";

  import { goto } from "@sapper/app";
  import { stores } from "@sapper/app";

  import Cookie from "cookie-universal";
  import CallbackHelper from "../../helpers/callback.js";

  // Cookies manager
  const cookies = Cookie();

  // Let's get page store
  const { page } = stores();

  // And now we need to import
  // our authorization provider.
  import providers from "../../config/stores/providers.js";
  $: provider = providers.getProvider($page.query.providerId).module;

  // Importing components
  import { 
    theme, 
    colors,
    
    Tile,

    Heading,
    Caption,
    
    Button,

    Spinner } from "darkmode-components/src/index";

  import Profile from "../../components/Profile.svelte";

  let error;
  let step = "check";
  let loading = true;
  let tileLoaded = true;

  // Function, that'll change
  // our login provider.
  function changeProvider(provider) {
    tileLoaded = false;
    
    // Let's firstly clear some variables
    error = null;

    // Let's now add some "settings" to our
    // url and then let's just reload current page.
    
    // Construct URLSearchParams object instance from current URL querystring.
    let queryParams = new URLSearchParams(window.location.search);
     
    // Set new or modify existing parameter value. 
    queryParams.set("providerId", provider);
     
    // Replace current querystring with the new one.
    goto(`${location.pathname}?${queryParams.toString()}`, true);
  };

  let currentToken;

  // Function, that'll handle
  // callback-related things.
  function callback(token) {
    // Let's firstly get our
    // callback url and check something...
    let url = $page.params.id;

    if (token == null) {
      token = cookies.get('_account_token', { path: "/" });
    };

    if ($page.query.return != null) {
      CallbackHelper(token);
    } else {
      if (url.includes('http')) {
        if (step == "approveCallback") {
          duplicate(token);
        } else {
          currentToken = token;
          step = "approveCallback";
        };
      } else {
        duplicate(token);
      };
    };
  };

  // Function to handle redirect processes
  function redirect() {
    let redirect = $page.query.return;

    // Let's firstly prepare our url.
    let uri = encodeURIComponent(redirect);
    let query = new URLSearchParams(window.location.search);

    if (uri.includes("authorize")) {
      uri = uri.replace("authorize%2F", "authorize/")
    };

    goto(`${uri}?${query}`);
  };

  // Function, that'll handle duplication
  // process for our token (and, by the way
  // it'll also handle callback process; 
  function duplicate(token) {
    step = "duplicating";

    // Let's prepare our new permissions.
    let permissions = $page.query.permissions == null ? [] : Array.from($page.query.permissions.split(','));

    axios.post(`${api.url}/${api.version}/token/${token}/duplicate`, { permissions })
    .then((response) => {
      let data = response.data;

      CallbackHelper(data.token);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
  };

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

        tileLoaded = false;
        step = "accounts"

        buttonLoading = false;

        setTimeout(() => {
          tileLoaded = true;
        }, 50);
        break;
    
      default:
        // Default:
        // let's call provider's
        // check function.

        provider.check()
        .then((state) => {
          loading = false;

          tileLoaded = false;
          step = state;

          if (state == "callback") {
            callback();
          };

          buttonLoading = false;

          setTimeout(() => {
            tileLoaded = true;
          }, 50);
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

    // By the way, let's now preload
    // information about all permissions, requested
    // by this callback.
    if ($page.query.permissions != null) {
      let permissionsArray = ["readAvatar","readUsername"];
      permissionsArray.push($page.query.permissions.split(","));

      permissions.loadPermissions(permissionsArray);
    };
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

  let buttonLoading = false;

  // Function, that'll handle correct url
  // changing process.
  function urlChange(url, newQuery) {
    let query = newQuery;
    if (query == null) {
      query = new URLSearchParams(window.location.search);
    };

    goto(`${url}?${query}`);
  };
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
    <div out:fade style="z-index: 1000;" class="absolute w-full h-screen bg-white flex justify-center items-center">
      <!-- Branding -->
      <div class="flex flex-col justify-center items-center">
        <Spinner size="15" />
      </div>
    </div>
  {/if}

  <!-- Header -->
  <div class="absolute inset-x-0 top-0 px-2 md:px-6 lg:px-8 hidden py-3 md:flex justify-between items-center">
    <!-- Logotype -->
    <h1 style="font-family: Junegull" class="text-white text-xl">wavees</h1>
  
    <!-- Header Links -->
    <div class="flex items-center px-6 bg-white rounded-lg">
      {#each headerItems as item}
        <a class="px-6 py-3 text-gray-800 hover:text-black text-xs" href="{item.link}">{item.title}</a>
      {/each}
    </div>
  </div>

  <div class="w-full lg:w-1/3 h-full md:py-8 lg:py-16 md:px-6 lg:px-8">
    <!-- 
      Wavees Authorization logotype
     -->
    
    <!-- Tile -->
    <div class="relative h-full bg-white md:rounded-lg shadow-xl">
      {#if !tileLoaded}
        <div style="z-index: 999;" out:fade class="absolute w-full h-full bg-white rounded-lg">
          <div class="absolute inset-x-0 bottom-0 pb-2 w-full text-center">
            <!-- <p class="text-extra-xs text-gray-600">Loading, please wait</p> -->
          </div>
        </div>
      {/if}

      <!-- 
        @step Duplicating
       -->
      { #if step == "duplicating" }
        <div class="w-full h-full flex flex-col justify-center text-center items-center">
          <Spinner size="15" />

          <p class="text-sm mt-4">Duplicating your token...</p>
        </div>
      <!-- 
        @step ApproveCallback
       -->
      { :else if step == "approveCallback" }
        <div class="w-full h-full px-4 md:px-8 lg:px-12 pt-6 md:pt-8 flex justify-center items-center">
          <div class="w-full h-full flex flex-col">
            <!-- Some Texts -->
            <div class="text-center">
              <h1 class="text-base font-semibold">Approve redirect</h1>
              <p class="text-xs text-gray-700">This site (<span class="border-b-2 border-dotted border-gray-700">{$page.params.id}</span>) is not registered on the Wavees network. This may mean that this site is trying to trick you into using your own data. Do you agree to grant this site access to your data?</p>
            
              <h1 class="text-base mt-4">That's all this site will have acces to do:</h1>
            </div>

            <!-- Let's now list all user accounts -->
            <div style="overflow: hidden; overflow-y: auto;" class="my-6 w-full flex-grow relative">
              <div class="absolute w-full h-full">
                {#if $permissions.loaded}
                  {#each $permissions.list as permission}
                    <div class="w-full flex items-start my-2">
                      <!-- Icon -->
                      <img style="height: 1rem;" src="./icons/checkmark.svg" alt="Checkmark">

                      <!-- Text -->
                      <p class="text-xs mx-2">{permission.title.ru}</p>
                    </div>
                  {/each}
                { :else }
                  <div class="w-full h-full flex justify-center items-center">
                    <Spinner size="12" />
                  </div>
                {/if}
              </div>
            </div>

            <!-- Buttons -->
            <div class="pb-6 w-full flex">
              <!-- Agree -->
              <button on:click={(e) => {
                let token = currentToken == null ? $user.current.token : currentToken;

                callback(token);
              }} class="w-full bg-black text-white text-sm rounded-lg h-8 { buttonLoading ? "" : "hover:bg-blue-300" }">
                {#if buttonLoading}
                  <Spinner color="#fff" size="15" />
                { :else }
                  Agree
                {/if}
              </button>

              <!-- Cancel -->
              <button type="ghost" on:click={(e) => step = "accounts"} class="w-full h-8">Cancel</button>
            </div>
          </div>
        </div>
      <!-- 
        @step Choose account
        In this step we'll ask user
        to choose one account. 
      -->
      { :else if step == "accounts" }
        <div class="w-full h-full px-4 md:px-8 pt-6 md:pt-8 flex justify-center items-center">
          <div class="flex flex-col h-full w-full">
            <!-- Text -->
            <div class="text-center">
              <h1 class="text-base font-semibold">Choose account</h1>
              <p class="text-xs text-gray-700">to continue using Wavees Services</p>
            </div>

            <!-- Let's now list all user accounts -->
            <div style="overflow: hidden; overflow-y: auto;" class="my-6 w-full flex-grow relative">
              <div class="absolute w-full h-full">
                {#each $user.tokens as token}
                  <Profile on:callback={(e) => callback(e.detail)} token={token} />
                {/each}
              </div>
            </div>

            <!-- Button: Add new account -->
            <div class="w-full flex justify-center pb-6 px-2">
              <button class="text-sm rounded-lg w-full h-8 bg-black text-white { buttonLoading ? "" : "hover:bg-blue-300"}" on:click={(e) => {
                  buttonLoading = true;

                  let query = new URLSearchParams(window.location.search);
                  query.set("return", `authorize/${$page.params.id}`);

                  urlChange("/authorize/add", query);
                }} margin="py-0">
                  {#if buttonLoading}
                    <Spinner size="12" color="#fff" />
                  { :else }
                    Add new account
                  {/if}
              </button>
            </div>
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
          on:providerChange={(e) => changeProvider(e.detail)}
          on:callback={(e) => callback(e.detail)}
          on:urlChange={(e) => urlChange(e.detail.url, e.detail.query)}
          on:redirect={() => redirect()}
          on:loaded={(e) => { tileLoaded = e.detail; }}
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
          on:check={() => check()}
          on:providerChange={(e) => changeProvider(e.detail)} 
          on:callback={(e) => callback(e.detail)}
          on:urlChange={(e) => urlChange(e.detail.url, e.detail.query)}
          on:redirect={() => redirect()}
          on:loaded={(e) => { tileLoaded = e.detail; }}
        />
      <!-- 
        @step Account Creation
        Here we'll show page, where user
        will be able to create new
        account.
      -->
      { :else if step == "create" }
        <svelte:component this={provider.pages.create}
          on:error={(e) => error = e.detail}
          on:check={() => check()}
          on:providerChange={(e) => changeProvider(e.detail)} 
          on:callback={(e) => callback(e.detail)}
          on:urlChange={(e) => urlChange(e.detail.url, e.detail.query)}
          on:redirect={() => redirect()}
          on:loaded={(e) => { tileLoaded = e.detail; }}
        />
      {/if}
    </div>
    <!-- </Tile> -->
  </div>
</main>