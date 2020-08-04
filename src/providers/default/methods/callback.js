// Let's now export page sapper
// store to determine callback
// id.
import { stores } from "@sapper/app";
import global from "../../../config/application/global";

// And let's import another
// needed modules...

export default (token) => {
  const { page } = stores();

  // Firstly we need to check
  // if we have any user tokens
  // or no.
  if (!token) return;

  // And now let's check our callback
  // and let's get new user token
  // for this specific callback.
  page.subscribe((object) => {
    const id = object.params.id;
  
    // System callbacks.
    if (id == "medals@wavees") {
      // Let's now redirect user to
      // medals@wavees with our current
      // user token.
      window.location.href = `https://medals.${global.globalURL}/login/${token}`;
    } else if (id == "developer@wavees") {
      // And now let's redirect
      // user to developer@wavees
      // with his user token.
      window.location.href = `https://developer.${global.globalURL}/login/${token}`;
    } else if (id == "@wavees") {
      // And now let's just redirect our
      // user to @wavees. And, yes, we'll send
      // our current token.
      window.location.href = `https://${global.globalURL}/login/${token}`;
    } else if (id == "tunnels@wavees") {
      // And now let's just redirect our
      // user to @wavees. And, yes, we'll send
      // our current token.
      window.location.href = `https://tunnels.${global.globalURL}/login/${token}`; 
    } else {
      // Let's just redirect our user
      // to home page.
      window.location.href = "/";
    }
  });
};