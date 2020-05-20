<script>
  // Export some button configurations and variables
  export let classes = "";
</script>

<button on:click class="{classes} px-6 py-2 hover:text-gray-300">
  <slot></slot>
</button>