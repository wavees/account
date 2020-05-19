<script>
  // import
  import { createEventDispatcher } from "svelte";
  import { callback } from "../../../config/callback.js";

  // Importing components

  // New event dispatcher
  const dispatch = createEventDispatcher();

  // verify
  // Called when user presses the "I agree button"
  function verify() {
    dispatch("succeed");
  };
</script>

<div class="mt-4 items-center text-center">
  <div>
    This site <a href="{$callback.url}" style="text-decoration: none; color: #FF9800; border-bottom: 1px dotted #FF5722">({$callback.url})</a> will have these permissions:

    <!-- Permissions container -->
    <div class="w-full justify-start">
      <div class="flex my-2">
        <img src="icons/check.svg" alt="Agree">
        <p class="mx-4">See your Email</p>
      </div>

      <div class="flex my-2">
        <img src="icons/check.svg" alt="Agree">
        <p class="mx-4">See your Avatar</p>
      </div>

      <div class="flex my-2">
        <img src="icons/check.svg" alt="Agree">
        <p class="mx-4">Modify Application's storage</p>
      </div>
    </div>
  </div>

  <button on:click={(e) => {
    verify();
  }} class="my-4 bg-transparent hover:bg-blue-500 hover:text-white text-dark font-semibold hover:text-white py-2 px-4 border border-dashed hover:border-transparent rounded">
    I agree
  </button>

  <div class="mt-4 w-full flex justify-between">
    <p class="text-dark mx-4" style="cursor: pointer;">Use different account</p>

    <p class="mx-4 text-dark" style="cursor: pointer;">
      Go home
    </p>
  </div>
</div>