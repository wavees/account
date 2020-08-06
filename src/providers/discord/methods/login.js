// Import
import axios from "axios";

// Importing config, yeah.
import api from "../../../config/application/api";

export default (code, type = "ordinary", session) => {
  return new Promise((resolve, reject) => {
    // Let's try to login our user...
    if (type == "ordinary") {
      resolve({ token: code });

    // @type sessionAdd
    // We need to create or to add
    // this token to a session
    } else if (type == "sessionAdd") {
      // Let's firstly check our session token...
      if (session == null) {
        reject({ error: "InvalidSession" });
      } else {
        axios.get(`${api.url}/${api.version}/account/${session}`)
        .then((response) => {
          let account = response.data;

          // Here we just need to add new token
          // to existing session.
          if (account.type == "session") {
            axios.put(`${api.url}/${api.version}/account/${session}/${code}`)
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
            axios.post(`${api.url}/${api.version}/account`, {
              profiles: [
                session,
                code
              ]
            }).then((response) => {
              let session = response.data;

              if (session.token != null) {
                resolve({ token: session.token })
              } else {
                reject({ error: "UnableToRegisterSession" });
              }
            }).catch(() => {
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
  })
};