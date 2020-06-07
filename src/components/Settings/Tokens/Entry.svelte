<script>
  // import
  import { onMount } from "svelte";
  import moment from "moment";

  // Importing components
  import Avatar from "../../Avatar.svelte";

  // Icons
  import DeleteIcon from "../../Icons/Delete.svelte";

  // Current action
  let action = null;

  // Token's permissions
  let permissions = null;

  onMount(() => {
    // Here we'll get this token's permissions
    
  });

  // Here we'll export token variable
  export let token = {};
</script>

<div class="w-full rounded-lg hover:bg-gray-200 relative flex justify-between px-4 py-2 my-2 items-center">
  <!-- Center information -->
  <div class="w-full">
    <!-- Token time (if exists) -->
    { #if token.data.registrat != null }
      <p class="text-gray-700">{moment(token.data.registrat.time).locale('ru').format("dddd, MMMM Do YYYY, h:mm")}</p>
    { :else }
      <p class="text-gray-700">Неизвестное время</p>
    { /if }
    <!-- 
      And now we need to check if it's an
      system token or not. 
    -->
    { #if permissions == null }
      <!-- Check: if it's an application token or not -->
      { #if token.data.registrat == null ? true : token.data.registrat.id == null }
        <p>Системный токен</p>
      { :else }
        <p>Токен приложения, нету прав</p>
      { /if }
    { /if }
  </div>

  <!-- Delete token -->
  <div>
    <button on:click={(e) =>{
      action = "delete";
    }} class="mx-2">
      <DeleteIcon color="#e53e3e" />
    </button>
  </div>
</div>