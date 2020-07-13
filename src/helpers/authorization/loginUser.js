// Import
import axios from "axios"
import { api, version } from "./config.js";

export default (email, pincode, type = "ordinary", session) => {
  return new Promise((resolve, reject) => {
    // Let's try to login our user...
    axios.post(`${api}/${version}/user/login`,
    {
      email: email,
      pincode: pincode
    })
    .then((response) => {
      let data = response.data;

      if (data.token != null) {
        // And now let's check what type of login is it...

        // @type ordinary
        // Let's just return current user's
        // token.
        if (type == "ordinary") {
          resolve({ token: data.token });

        // @type sessionAdd
        // We need to create or to add
        // this token to a session
        } else if (type == "sessionAdd") {
          // Let's firstly check our session token...
          if (session == null) {
            reject({ error: "InvalidSession" });
          } else {
            axios.get(`${api}/${version}/account/${session}`)
            .then((response) => {
              let account = response.data;

              // Here we just need to add new token
              // to existing session.
              if (account.type == "session") {
                axios.put(`${api}/${version}/account/${session}/${data.token}`)
                .then((response) => {
                  let session = response.data;

                  if (session.token != null) {
                    resolve({ token: session.token })
                  } else {
                    reject({ error: "UnableToAddToSession" });
                  };
                }).catch(() => {
                  reject({ error: "UnableToAddToSession" });
                });

              // And here we just need to create new
              // session with this two tokens.
              } else if (account.type == "user") {
                axios.post(`${api}/${version}/account`, {
                  profiles: [
                    session,
                    data.token
                  ]
                }).then((response) => {
                  let session = response.data;

                  if (session.token != null) {
                    resolve({ token: session.token })
                  } else {
                    reject({ error: "UnableToRegisterSession" });
                  }
                }).catch((error) => {
                  reject({ error: "UnableToRegisterSession" });
                });
              } else {
                reject({ error: "InvalidToken" });
              }
            }).catch(() => {
              reject({ error: "InvalidToken" });
            })
          }
        }
      } else {
        // Error occured
        reject({ error: "UnableToLogin" });
      }
    }).catch(() => {
      reject({ error: "UnableToLogin" });
    })
  })
};