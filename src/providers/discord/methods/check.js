// Importing modules
import axios from "axios"
import { stores } from "@sapper/app";

import api from "../../../config/application/api";

// Cookies manager
import Cookie from "cookie-universal";
const cookies = Cookie();

// Module's main function
// and method, that'll check
// current authorization state.
const check = () => {
  // So let's now return new promise...

  // Page Store
  const { page } = stores();

  return new Promise((resolve, reject) => {
    resolve("identity");
  });
};

// And now let's export this function.
export default check;