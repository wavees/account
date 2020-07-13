<script>
  // Importing components
  import RoundedButton from "./RoundedButton.svelte";
  import TransparentButton from "./TransparentButton.svelte";

  import Spinner from "../Spinner.svelte";

  // Should we show accept screen?
  let confirmation = false;
</script>

<div class="flex justify-center items-center py-2 px-4 rounded-lg mx-0 { confirmation == true ? "bg-gray-200 ml-4" : "" }">
  
  {#if confirmation}

    <div class="mx-2">
      <h1 class="text-sm">Вы действительно хотите выйти?</h1>
      <p class="text-xs text-gray-700">Вы выйдите со всех аккаунтов</p>
    </div>

    <TransparentButton classes="mx-2 text-xs" on:click={(e) => {
      confirmation = false;
    }}>
      Отмена
    </TransparentButton>

    <RoundedButton classes="mx-2 text-xs">
      😔 Выйти
    </RoundedButton>  
  { :else }
    <RoundedButton classes="text-xs" on:click={(e) => {
      confirmation = true;  
    }}>
      ⚰ Выйти
    </RoundedButton>
  {/if}
</div>