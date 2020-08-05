import { readable } from 'svelte/store';

// @import
// Importing all providers.
import defaultProvider from "../../providers/default/index";
import discordProvider from "../../providers/discord/index";

// Providers List
const providersList = [
  {
    pId: "default",
    module: defaultProvider
  },
  {
    pId: "discord",
    module: discordProvider
  }
];

// And now we just need to return
// this store back to client.
const providers = {
  // Method, that'll find authorization provider
  // with specified id.
  getProvider: (providerId) => {
    let provider;
    
    // Let's now try to find it...
    providersList.forEach((entry) => {
      console.log(entry.pId);
      console.log(provider);
      if (entry.pId == providerId) {
        console.log(entry);
        provider = entry;
        return;
      };
    });

    // Otherwise we need to return
    // default provider.
    if (provider) {
      return provider;
    } else {
      return providersList[0];
    };
  }
};
export default providers;