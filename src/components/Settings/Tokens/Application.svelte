<script>
  // import
  import { onMount } from "svelte";
  import axios from "axios";

  import { api } from "../../../config/global.js";

  // Importing components
  import Avatar from "../../Avatar.svelte";
  import Entry from "./Entry.svelte";

  // Let's get application logotype and name
  onMount(() => {
    axios.get(`${$api.url}/application/${appId}`)
    .then((response) => {
      let data = response.data;

      application.name     = data.name;
      application.logotype = data.logotype;
    })
  })

  let application = {
    name: null,
    logotype: null
  };

  // Let's export some neede values.
  export let appId;

  export let tokens = [];
</script>

<div class="w-full">
  <div class="w-full flex justify-start px-6 py-4 bg-gray-200 items-center">
    <Avatar username={appId} avatar={application.logotype} />
    
    <div class="mx-4">
      <h1 class="text-xl font-semibold">{application.name}</h1>
      <p class="text-sm">Вы дали доступ данному приложению</p> 
    </div>
  </div>

  <div class="px-4">
    {#each tokens as token}
      <Entry {token}></Entry>
    {/each}
  </div>
</div>