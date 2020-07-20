import { readable } from 'svelte/store';

// @import
// Importing all providers.
import defaultProvider from "../../providers/default/index";

// Providers List
const providersList = [
  {
    id: "default",
    module: defaultProvider
  }
];

// And now we just need to return
// this store back to client.
const providers = {
  // Method, that'll find authorization provider
  // with specified id.
  getProvider: (provider) => {
    // Let's now try to find it...
    providersList.forEach((entry) => {
      if (entry.id == provider) {
        return entry;
      };
    });

    // Otherwise we need to return
    // default provider.
    return providersList[0];
  }
};
export default providers;