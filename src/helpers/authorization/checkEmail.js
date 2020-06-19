// Import
import axios from "axios";
// import { api } from "../../config/global.js";

// Let's export a function that'll
// handle email checking.
export default (email) => {
  return new Promise((resolve, reject) => {
    console.log("CHECKING...");
    axios.get(`https://api.wavees.co.vu/user/check/${email}`)
    .then(() => {
      // User exists, so we just need
      // to login.
      resolve({ exists: true });
    }).catch(() => {
      // Ok, so, probably, this user doesn't
      // exists. So now we need to check if 
      // this email address is correct.
      axios.get(`https://api.wavees.co.vu/user/validate/${email}`)
      .then((response) => {
        // Let's return a response;
        resolve({ exists: false, validEmail: response.data.valid });
      }).catch(() => {
        // Invalid email
        reject("InvalidEmail");
      });
    })
  });
};