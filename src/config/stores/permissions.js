// import
import { writable } from "svelte/store";
import axios from "axios";

import api from "../application/api";

// 
// func createPermissionsInfoStore()
function createPermissionsInfoStore() {
  // Main store structure
  let store = {
    loaded: false,
    list: []
  };

  // Let's now get some 
  const { subscribe, set, update } = writable(store);

  return {
    subscribe,

    // loadPermissions
    // This function will load all
    // information about specified permissions.
    loadPermissions: (permissions) => {
      // And now let's try to fetch some information
      // about this account...
      permissions = permissions.map((perm) => {
        return encodeURIComponent(perm);
      });

      axios.get(`${api.url}/${api.version}/permissions/${permissions.join(',')}`)
      .then((response) => {
        let data = response.data;
        
        update((object) => {
          object.loaded = true;
          object.list = data;

          return object;
        });
      }).catch(() => {
        update((object) => {
          object.loaded = true;

          return object;
        })
      });
    }
  }
};

const permissionsInfo = createPermissionsInfoStore();

export { permissionsInfo };