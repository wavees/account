// 
// @provider Default
// @description This is default
// authorization provider. It uses
// Wavees API Backend Services
// to store all user data, to
// authorize them, etc.

// @import
// Importing and requiring
// provider-related modules,
// pages and so on.
import EmailInputPage from "./pages/EmailInput.svelte";
import PincodeInputPage from "./pages/PincodeInput.svelte";
import RegistrationPage from "./pages/RegistrationPage.svelte";

import CheckMethod from "./methods/check.js";

// @config
// Configuration of this
// provider
const provider = {
  check: CheckMethod,
  pages: {
    identity: EmailInputPage,
    authorization: PincodeInputPage,

    create: RegistrationPage
  }
};

export default provider;