<script>
  // import
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import moment from "moment";
  import axios from "axios";

  import { api } from "../../config/global.js";

  // Importing components
  import Spinner from "../Spinner.svelte";
  import WordAvatar from "../WordAvatar.svelte";
  import RoundedButton from "../Buttons/RoundedButton.svelte";
  import TransparentButton from "../Buttons/TransparentButton.svelte";

  // Icons
  import DeleteIcon from "../Icons/Delete.svelte";
  import ThumbsDownIcon from "../Icons/ThumbsDown.svelte";

  // Creating event dispatcher
  const dispatch = createEventDispatcher();

  let loading = false;
  let error = null;

  // Action
  // We need this variable to determine
  // what action we need to do right now
  
  // Example: delete
  let action = null;

  // deleteApplication
  // This function will delete this application and then
  // it will reload applications list.
  function deleteApplication() {
    loading = true;

    if (currentToken != null) {
      axios.delete(`${$api.url}/accounts/${currentToken}/application/${application.registrat.url}`)
      .then((response) => {
        dispatch("update");
      }).catch((error) => {
        loading = false;
        error = "ServerError";
      })
    }
  };

  // Let's export some needed variables
  export let application = {
    registrat: {
      time: null,
      url: "Unknown Application"
    }
  };

  export let currentToken = null;
</script>

<div class="w-full rounded-lg hover:bg-gray-200 relative">
  <!-- Application name -->
  { #if loading }
    <div style="z-index: 5;" class="absolute bg-gray-200 w-full h-full flex justify-center items-center">
      <Spinner size="25" />
    </div>
  { /if }

  { #if action == "delete" }
    <div in:fade out:fade style="z-index: 4;" class="absolute rounded-lg w-full h-full bg-gray-200 flex justify-center items-center">
      <div class="flex items-center">
        <WordAvatar word={application.registrat.url} />
        
        <div class="mx-4">
          <h1 class="text-semibold">Удалить приложение?</h1>
          <p class="text-sm text-gray-700">{application.registrat.url}</p>
        </div>
      </div>

      <div class="mx-2">
        <TransparentButton on:click={(e) => {
          action = null;
        }} classes="mx-2">
          Отмена
        </TransparentButton>

        <RoundedButton on:click={(e) => {
          deleteApplication();
        }} classes="mx-2">
          Да, удалить
        </RoundedButton>
      </div>  
    </div>
  { /if }

  <div class="w-full h-full py-4 px-4 flex justify-between">
    <div class="flex items-center">
      <WordAvatar word={application.registrat.url} />

      <!-- Mobile vs Desktop view -->
      <div class="mx-4 hidden md:flex flex-col">
        <h1 class="text-xl text-semibold">Приложение:</h1>
        <p class="text-gray-700 text-sm">{application.registrat.url}</p>
      </div>

      <!-- Mobile view -->
      <div class="md:hidden mx-2">
        <h1 class="text-sm text-semibold">{application.registrat.url}</h1>
        { #if application.registrat.time == null }
          <p class="text-gray-700 text-xs">Неизвестно</p>
        { :else }
          <p class="text-gray-700 text-xs">{moment(application.registrat.time).locale('ru').format("dddd, MMMM Do YYYY, h:mm")}</p>
        { /if }
      </div>
    </div>

    <!-- Actions and time -->
    <div class="flex items-center">
      <div class="h-full mx-2 flex">
        <button class="mx-2">
          <ThumbsDownIcon color="#ed8936" />
        </button>

        <button on:click={(e) =>{
          action = "delete";
        }} class="mx-2">
          <DeleteIcon color="#e53e3e" />
        </button>
      </div>

      <div class="max-w-sm hidden md:flex flex-col">
        { #if application.registrat.time == null }
          <p class="text-gray-700 text-sm">Неизвестно</p>
        { :else }
          <p class="text-sm text-gray-700">{moment(application.registrat.time).locale('ru').format("dddd, MMMM Do YYYY, h:mm")}</p>
        { /if }

        <p class="text-xs text-gray-700">Вы дали доступ данному приложению.</p>
      </div>
    </div>
  </div>
</div>