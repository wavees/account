// 
// @provider Discord
// @description Do I need
// to tell something about
// this authorization method?
// Yes, I need. But I'll do
// it later.

// @import
// Importing and requiring
// provider-related modules,
// pages and so on.
import MainPage from "./pages/MainPage.svelte";

import CheckMethod from "./methods/check.js";
import ProfileComponent from "./components/Profile.svelte";

// @config
// Configuration of this
// provider
const provider = {
  id: "discord",
  
  check: CheckMethod,
  pages: {
    identity: MainPage
  },

  components: {
    profile: ProfileComponent
  }
};

export default provider;