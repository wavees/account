<script>
  // import
  import { goto } from "@sapper/app";
  import { stores } from "@sapper/app";

  import { createEventDispatcher } from "svelte";
  import { user } from "../../../config/user.js";
  
  // Importing components
  import Spinner from "../../Spinner.svelte";

  const { page } = stores();
  const { id } = $page.params;

  // verify
  function verify(token) {
    console.log("VERIFY TOKEN:");
    console.log(token);
    dispatch("succeed", { token });
  };

  // Create event dipatcher
  const dispatch = createEventDispatcher();
</script>

<div class="px-4">
  { #if $user.tokens.length > $user.profiles.length }
    <div class="w-full mb-6 flex justify-center items-center">
      <Spinner size="25" />
      <p class="ml-4 text-xs">Загрузка профилей...</p>
    </div>
  { /if }

  <div style="max-height: 45vh; overflow-y: scroll;">
    {#each $user.profiles as profile}
      <div on:click={(e) => {
        verify(profile.token);
      }} style="cursor: pointer" class="my-4 hover:bg-gray-200 bg-white w-full flex justify-start py-4 px-4 md:px-8 rounded-lg">
        <div class="flex">
          <div class="rounded-full" style="background-image: url({profile.avatar == null ? "https://cdn.dribbble.com/users/45488/screenshots/9084073/media/f889543c2e901048f8da2d9915d0bf37.jpg" : profile.avatar}); background-size: cover; background-position: center center; width: 3em; height: 3em;" alt="Avatar"></div>
          
          <div class="ml-4">
            <h1 class="text-semibold text-xl">{profile.username}</h1>
            <p class="text-sm">{profile.email}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Add new account -->
  <div on:click={(e) => {
    window.location.href = `/authorize/add?return=authorize/${id}`;
  }} style="cursor: pointer" class="my-4 bg-gray-100 hover:bg-gray-300 bg-white w-full flex justify-start py-4 px-4 md:px-8 rounded-lg">
    <div class="flex">
      <img style="width: 1.6em; height: 1.6em;" class="mt-2" src="./icons/plus.svg" alt="Add icon">
      
      <div class="ml-4">
        <h1 class="text-semibold text-xl">Добавить аккаунт</h1>
        <p class="text-xs">Да-да, вы можете добавить ещё один аккаунт к данной сессии!</p>
      </div>
    </div>
  </div>
</div>