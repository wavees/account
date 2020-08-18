// Importing modules
import axios from "axios"
import { stores } from "@sapper/app";

import api from "../../../config/application/api";
import Callback from "../../../helpers/callback.js";

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
    
    // And now let's check if we need to
    // 
    page.subscribe((object) => {
      const id = object.params.id;

      console.log("SUBSCRIBED");
      // Let's firstly get user's current
      // token and page id.
      let token;
      console.log(id);

      if (id != "add") {
        token = cookies.get("_account_token", { path: "/" });
      } else {
        if (cookies.get("_logged_in", { path: "/" }) == true) {
          // Let's just redirect our user to
          // needed url.
          cookies.remove("_logged_in", { path: "/" });
          resolve("callback");

          return;
        };
      };

      console.log("TOKEN:");
      console.log(token);

      let email = cookies.get("_login_email", { path: "/" });
      
      console.log("Email:");
      console.log(email);
      // Let's now check this player's
      // token.
      axios.get(`${api.url}/${api.version}/account/${token}`)
      .then((response) => {
        let data = response.data;
        console.log(data);
        console.log("CALLBACK");

        // Okay, so our user is logged in.
        // And now we just need to redirect him.
        resolve("callback");
      }).catch(() => {
        console.log("NOT CALLBACK");
        // This token doesn't exist,
        // so now we need to check user's
        // email.
        axios.get(`${api.url}/${api.version}/user/check/${email}`)
        .then((response) => {
          let data = response.data;
          console.log("AUTHORIZE");
          console.log(data);

          // So this user exists. And now
          // we need to ask this user to
          // authorize.
          resolve("authorization");
        }).catch(() => {
          console.log("NOT AUTHORIZE");
          // And now let's check if this email
          // exists at all.
          axios.get(`${api.url}/${api.version}/user/validate/${email}`)
          .then((response) => {
            let data = response.data;
            console.log(data);

            // Email exists - show register screen
            if (data.valid) {
              console.log("CREATE");
              resolve("create");
            // Email doesn't exists - show identity screen
            } else {
              console.log("Identity");
              resolve("identity");
            };
          }).catch((error) => {
            console.log("Error");
            console.log(error);
            resolve("identity");
          });
        });
      });
    });
  });
};

// And now let's export this function.
export default check;