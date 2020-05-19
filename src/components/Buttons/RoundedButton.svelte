<script>
  // import events module
  import { createEventDispatcher } from 'svelte';

  // Create dispatcher
	const dispatch = createEventDispatcher();

  // 

  // Export some button configurations and variables
  export let backgroundColor;

  export let classes = "";
</script>

<button on:click class="{classes} px-6 py-2 rounded-full bg-blue-600 text-white shadow-xl hover:bg-white hover:text-black hover:shadow-2xl">
  <slot></slot>
</button>