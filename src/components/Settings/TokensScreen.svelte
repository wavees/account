<script>
  // import
  import { onMount } from "svelte";
  import moment from "moment";

  // Importing components
  import Spinner from "../Spinner.svelte";

  import RoundedButton from "../Buttons/RoundedButton.svelte";
  import TransparentButton from "../Buttons/TransparentButton.svelte";

  import Application from "./Tokens/Application.svelte";
  import Entry from "./Tokens/Entry.svelte";

  // Let's export some useful information
  export let otherTokens = [];

  export let applicationTokens = [];
</script>

<!-- 
  APPLICATION TOKENS
 -->

{#each applicationTokens as item}
  <Application appId={item[0]} tokens={item[1]} ></Application>
{/each}

<!-- 
  OTHER TOKENS
 -->
<div class="w-full">
  <!-- Other's header -->
  <div class="w-full flex justify-start px-6 py-4 bg-gray-200">
    <h1 class="text-xl font-semibold">Другие:</h1>
  </div>

  <div class="px-4">
    {#each otherTokens as token}
      <Entry {token}></Entry>
    {/each}
  </div>
</div>