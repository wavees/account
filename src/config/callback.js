import { writable } from "svelte/store";
import axios from "axios";

function createCallbackStore() {
  // Default object for this store
  let object = {
    loaded: false,
    error: null,

    id: null,
    url: null,

    appId: null
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
          object.appId = data.registrat.id;

          return object;
        });
      })
      .catch((error) => {
        update((object) => {
          object.loaded = false;
          object.error = error;

          return object
        });
      })
    },

    // setLoaded
    setLoaded: (state) => {
      update((object) => {
        object.loaded = state;

        return object;
      });
    }
  }
};

// Export
export const callback = createCallbackStore();