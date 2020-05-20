// import
import { writable } from "svelte/store";
import axios from "axios";

const api = "https://api.wavees.co.vu"

// 
// func createUserStore()
// This function will create
// user store, that we'll use
// later in application.
// 
function createUserStore() {
  // Default object for the store
  let object = {
    loaded: false,
    error: null,

    current: {
      token: null,
      email: null,
      username: null,
      avatar: null
    },

    tokens: [],

    profiles: []
  };

  // Get some functions from writable store...
  const { subscribe, set, update } = writable(object);

  // Return subscribe function and some other
  // functions to manipulate this store.
  return {
    subscribe,

    // setToken
    // Set session/user token (We'll get user information
    // and store it in current object)
    setToken: (token) => {
      // Let's check for type of this token..
      // 
      // TYPES: session, user token
      axios.get(`${api}/user/${token}`)
      .then((response) => {
        let data = response.data;

        if (!data.error) {
          // It's an user token!
          update((object) => {
            object.loaded = true;
            object.error = null;

            object.current.token = token;
            object.current.email = data.email;
            object.current.username = data.username
            object.current.avatar = data.avatar

            return object;
          });
        }
      }).catch((error) => {
        // Let's check for session token...
        axios.get(`${api}/accounts/${token}`)
        .then((response) => {
          let session = response.data;

          if (session.error) {
            // User not found
            update((object) => {
              object.loaded = true;
              object.error = null;

              return object;
            })
          } else {
            // User found! Let's get current user object
            // and then save it's data.
            let current = session.current;
            if (current.token == null) {
              update((object) => {
                object.loaded = true;
                object.tokens = session.profiles;
                object.error = "ChooseAccount";

                return object;
              });
            } else {
              axios.get(`${api}/user/${current.token}`)
              .then((response) => {
                let data = response.data;

                if (data.error) {
                  update((object) => {
                    object.loaded = true;
                    object.error = "ChooseAccount";
                    object.tokens = session.profiles;

                    return object;
                  })
                } else {
                  update((object) => {
                    object.loaded = true;
                    object.error = null;
                    
                    object.current.token = current.token;
                    object.current.email = data.email;
                    object.current.username = data.username;
                    object.current.avatar = data.avatar;

                    object.tokens = session.profiles;

                    return object;
                  })
                }
              })
              .catch((error) => {
                update((object) => {
                  object.loaded = null;
                  object.error = error;

                  return object;
                })
              })
            }
          }
        })
        .catch((error) => {
          update((object) => {
            object.loaded = null;
            object.error = error;

            return object;
          });
        });
      });
    },

    // setLoaded
    // Changes object.loaded state to { state }.
    setLoaded: (state) => {
      update((object) => {
        object.loaded = state;

        return object;
      });
    },

    // loadProfiles
    // Load profiles (their avatars, emails and so on) to
    // local storage.
    loadProfiles: (tokens) => {
      tokens.forEach((token) => {
        loadProfile(token);
      });
    },

    addProfile: (data) => {
      update((object) => {
        object.profiles.push(data);

        return object;
      });
    }

    // setCurrent
    // Set current token. This function will check
    // for token usability and then it'll set it
    // as current token.

    // Don't need it anymore.
  }
};

const user = createUserStore();

async function loadProfile(token) {
  axios.get(`${api}/user/${token}`)
  .then((response) => {
    let data = response.data;

    if (data.error == null) {
      let account = {
        id: data._id,

        email: data.email,
        username: data.username,

        avatar: data.avatar,
        token: token
      };

      user.addProfile(account);
    };
  }).catch((error) => {
    console.log(error);
    console.log(error.data);

    if (error.data.error != "UserNotFound") {
      loadProfile(token);
    }
  });
};

export { user };