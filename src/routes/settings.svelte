<script>
  // import
  import { goto } from "@sapper/app";
  import { user } from "../config/user.js";

  // Importing components
  import RoundedButton from "../components/Buttons/RoundedButton.svelte";
  import TransparentButton from "../components/Buttons/TransparentButton.svelte";
  import Spinner from "../components/Spinner.svelte";

  // Variables
  let currentProfile = {
    token: null
  };
  let listEnabled = false;

  // findProfile
  // This function will get cached account information
  // using account token.
  function findProfile(token) {
    let profiles = $user.profiles;
    let returnProfile = {};

    profiles.forEach((profile) => {
      if (profile.token == token) {
        returnProfile = profile;
      }
    });

    return returnProfile;
  }

  if ($user.tokens.length > 1) {
    user.loadProfiles($user.tokens);
  } else {
    if ($user.current.token != null) {
      // User have only one account
      user.loadProfiles([$user.current.token]);
      currentProfile = [$user.current];
    } else {
      // User needs to be logged in.
      goto('/');
    };
  };
</script>

<div style="width: 100%; height: 100vh;" class="bg-gray-100 flex justify-center items-center relative md:px-16 lg:px-32 md:py-8 lg:py-16">
  <!-- Header -->
  <div style="z-index: 3;" class="absolute inset-x-0 top-0 w-full bg-white md:bg-gray-100 py-2 md:py-4 flex justify-center md:justify-between items-center px-4 md:px-16 lg:px-32">
    <h1 class="text-semibold text-xl">WAVEES</h1>

    <div class="hidden md:flex items-center text-xs">
      <TransparentButton classes="mx-1">Про сервис</TransparentButton>
      <TransparentButton classes="mx-1">Компания</TransparentButton>
      <RoundedButton classes="ml-1 text-sm">🚀 Space</RoundedButton>
    </div>
  </div>
  
  <!-- Container -->
  <div class="w-full h-full bg-white rounded-lg shadow-xl flex" style="overflow: hidden;">
    <!-- User list -->

    <!-- Mobile view -->
    <div class="flex flex-col md:bg-white shadow-2xl py-2 md:py-4 md:px-6 rounded-lg">
      <div style="z-index: 4;" class="{listEnabled == true ? "hidden" : ""} px-4 md:hidden absolute inset-x-0 top-0 py-2 mb-2 justify-around items-center">
        <button on:click={(e) => {
          if (listEnabled) {
            listEnabled = false;
          } else {
            listEnabled = true;
          };
        }} class="flex">
          <img style="width: 1.6em; height: 1.6em;" src="./icons/users.svg" alt="Users icon">
          <p class="hidden md:block mx-2">Аккаунты</p>
        </button>
      </div>

      <div style="z-index: 2;" class="{listEnabled == true ? "absolute bg-white w-full h-full md:flex md:w-auto md:h-auto md:relative" : "hidden md:flex"} flex-col px-4 md:px-0 pt-8 md:pt-4">
        <div class="md:hidden w-full py-2 flex justify-center items-center">
          <button on:click={(e) => {
            if (listEnabled) {
              listEnabled = false;
            } else {
              listEnabled = true;
            };
          }} class="flex">
            <img style="width: 1.6em; height: 1.6em;" src="./icons/x.svg" alt="Users icon">
            <p class="mx-2">Закрыть</p>
          </button>
        </div>
        
        <h1 class="w-full text-center text-semibold text-xl">Выберите аккаунт:</h1>

        <div style="max-height: 45vh; overflow-y: auto;" class="relative">
          { #if $user.tokens.length > $user.profiles.length }
            <div class="rounded-lg w-full my-4 flex justify-center items-center">
              <Spinner size="25" />
              <p class="ml-4 text-xs">Загрузка профилей...</p>
            </div>
          { /if }

          <!-- Profiles list -->
          {#each $user.profiles as profile}
            <div on:click={(e) => {
              currentProfile = findProfile(profile.token);
              
              if (listEnabled) {
                listEnabled = false;
              };
            }} style="cursor: pointer" class="my-4 items-center hover:bg-gray-200 {currentProfile.token == profile.token ? "bg-gray-200 border-solid border-blue-600 border-2" : "bg-white"} w-full flex justify-start py-4 px-4 md:px-8 rounded-lg">
              <div class="flex">
                <div class="rounded-full" style="background-image: url({profile.avatar == null ? "https://cdn.dribbble.com/users/45488/screenshots/9084073/media/f889543c2e901048f8da2d9915d0bf37.jpg" : profile.avatar}); background-size: cover; background-position: center center; width: 2.3em; height: 2.3em;" alt="Avatar"></div>
                
                <div class="ml-4">
                  <h1 class="text-semibold">{profile.username}</h1>
                  <p class="text-xs">{profile.email}</p>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Add new account -->
        <div on:click={(e) => {
          window.location.href = `/authorize/add?return=settings`;
        }} style="cursor: pointer" class="my-4 bg-gray-100 hover:bg-gray-300 bg-white w-full flex justify-start py-4 px-4 md:px-8 rounded-lg">
          <div class="flex">
            <img style="width: 2.5em; height: 2.5em;" class="mt-1" src="./icons/plus.svg" alt="Add icon">
            
            <div class="ml-4">
              <h1 class="text-semibold">Добавить аккаунт</h1>
              <p class="text-xs">Да-да, вы можете добавить ещё один аккаунт к данной сессии!</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full h-full bg-gray-200 pt-12 md:pt-0 {currentProfile.token != null ? "" : "flex justify-center items-center"}" style="overflow-y: auto; overflow-x: hidden; z-index: 1;">
      { #if currentProfile.token == null }
        <div class="text-center">
          <h1 class="text-xl text-semibold text-gray-700">Выберите аккаунт</h1>
          <p class="text-sm text-gray-600">для того, что бы его настроить.</p>
        </div>
      { :else }
        <div class="flex flex-wrap">
          <!-- 
            User Profile picture
          -->
          <div class="w-full md:w-1/2 px-4 my-4 relative">
            <div class="w-full h-full rounded-lg bg-white shadow-2xl px-4 py-6">
              <h1 class="text-xl text-semibold w-full text-center">Аватарка профиля</h1>

              <div class="flex mt-4">
                <div class="rounded-full" style="background-image: url({currentProfile.avatar == null ? "https://cdn.dribbble.com/users/45488/screenshots/9084073/media/f889543c2e901048f8da2d9915d0bf37.jpg" : currentProfile.avatar}); background-size: cover; background-position: center center; width: 5.5em; height: 5.5em;" alt="Avatar"></div>
                <div class="mx-4">
                  <RoundedButton classes="text-sm">
                    🖼️ Загрузить новую
                  </RoundedButton>

                  <div class="flex my-4 text-xs">
                    <TransparentButton>
                      Отчистить
                    </TransparentButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile name -->
          <div class="w-full md:w-1/2 px-4 my-4 relative">
            <div class="w-full h-full rounded-lg bg-white shadow-2xl px-4 py-6">
              {currentProfile.username}
            </div>
          </div>
        </div>
      { /if }
    </div>
  </div>
</div>