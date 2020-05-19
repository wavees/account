import { writable } from "svelte/store";
import axios from "axios";

function createCallbackStore() {
  // Default object for this store
  let object = {
    loaded: false,
    error: null,

    id: null,
    url: null,
  };

  // Let's get some needed things..
  const { subscribe, update } = writable(object)

  // Creating our new store
  return {
    subscribe,

    // retrieve
    // Just get some needed information about our
    // callback.
    retrieve: (id) => {
      axios.get(`https://api.wavees.co.vu/callback/${id}`)
      .then((response) => {
        let data = response.data;

        update((object) => {
          object.loaded = true;
          
          object.id = id;
          object.url = data.url;

          return object;
        });
      })
      .catch((error) => {
        console.log("error:");
        console.log(error);

        update((object) => {
          object.loaded = false;
          object.error = error;

          return object
        });
      })
    }
  }
};

// Export
export const callback = createCallbackStore();