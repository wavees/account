<script>
  // import
  import { createEventDispatcher } from "svelte"

  // Importing components
  import RoundedButton from "../Buttons/RoundedButton.svelte";

  // Now we are going to create new event dispatcher
  const dispatch = createEventDispatcher();

  export let username;
</script>

<div class="w-full md:w-1/2 px-4 my-4">
  <div class="w-full h-full rounded-lg bg-white shadow-2xl px-4 py-6">
    <h1 class="text-xl text-semibold w-full text-center">Имя профиля</h1>

    <div class="mt-2 w-full px-6">
      <input bind:value={username} id="username" class="appearance-none w-full py-2 px-3 border border-dashed" type="text" placeholder="Username">
      <RoundedButton classes="w-full mt-4">
        💾 Сохранить
      </RoundedButton>
    </div>
  </div>
</div>