<script>
  // import
  import { goto } from "@sapper/app";
  import { stores } from "@sapper/app";
  import { onMount } from "svelte";
  
  import { _ } from "svelte-i18n";

  import { slide } from "svelte/transition";

  import axios from "axios";
  import Cookie from "cookie-universal";
  import moment from "moment";

  // Importing some stores.
  import { api } from "../../config/global.js";
  import { user } from "../../config/user.js";
  import { callback } from "../../config/callback.js";

  // Importing components
  import RoundedButton from "../../components/Buttons/RoundedButton.svelte";
  import Spinner from "../../components/Spinner.svelte";

  // Importing app screens
  import EmailScreen from "../../components/Screens/login/email.svelte";
  import PincodeScreen from "../../components/Screens/login/pincode.svelte";
  import RegisterScreen from "../../components/Screens/login/register.svelte";
  import DisclaimerScreen from "../../components/Screens/login/disclaimer.svelte";
  import ChooserScreen from "../../components/Screens/login/chooser.svelte";

  // Cookies
  const cookies = Cookie();

  // let's get callback id..
  const { page } = stores();
  const { id } = $page.params;

  // Login process step.
    
  // Should we show loading screen or not?
  let loading = true;
  let currentToken = null;
  let error = {
    text: null
  };

  // Values:
  // 0 - null
  // 1 - Email validation
  // 2 - Pincode (User is registered) 
  // 3 - Username (User is not registered)
  // 4 - Choose account (There are more then one active account
  //     in this session)
  // 5 - Callback page;
  let step = 0;

  // defineStep
  // Function that will define step.
  // (Yeah, logic)
  function defineStep(type) {
    loading = true;

    if (type == "startup") {
      console.log("STARTUP");
      // Check if user have another accounts in current session
      if ($user.tokens.length > 1) {
        console.log("MORE THAN ONE");
        // User have more than one account in this session,
        // so let's show him account chooser screen. (dumb name, I know)
        user.loadProfiles($user.tokens);

        error.text = null;

        step = 4;
        loading = false;
      } else {
        console.log("NO #1");
        // Check if user is logged in. (Check for token);
        if ($user.current.token != null) {
          console.log("#1");
          // Let's check if we need to instantly
          // send user to application or should
          // we show user disclaimer;
          if (id == "add") return;

          axios.get(`${$api.url}/account/${$user.current.token}/applications/${$callback.appId}`)
          .then((response) => {
            let data = response.data;

            if (data.agreed) {
              // Let's get new user's token and then redirect
              // user to callback page...
              console.log("#8");
              redirect($user.current.token);
            } else {
              error.text = null;

              console.log("#7");
              step = 5;
              loading = false;
            }
          }).catch(() => {
            error.text = null;

            console.log("#6");
            step = 5;
            loading = false;
          })
        } else {
          console.log("#2");
          // Check for user email;
          if (cookies.get('login-email') != null) {
            // Let's check if user with this email
            // is registered or not.
            let email = cookies.get('login-email');
            tmpUser.email = email;

            axios.get(`${$api.url}/user/check/${email}`)
            .then((response) => {
              let data = response.data;
              // User exists. Let's send our user to
              // "pincode" page.
              error.text = null;

              console.log("#3");
              step = 2;
              loading = false;
            })
            .catch(() => {  
              error.text = null;
              console.log("#4");

              step = 1;
              loading = false;
            });
          } else {
            error.text = null;
            
            console.log("#5");
            step = 1;
            loading = false;
          };
        }
      }
    } else {
      // Defining user's next step...
      if (type.type == "emailChanged") {
        let data = type.data;

        // User is registered:
        // show him pincode screen;
        if (data.userExists == true) {
          error.text = null;

          step = 2;
          loading = false;
        // User doesn't exist:
        // show him register screen;
        } else {
          error.text = null;

          step = 3;
          loading = false;
        }
      } else if (type.type == "login") {
        console.log("LOGIN DEFINED");
        // Let's check if we need to redirect user
        // instantly or we need to show Redirect Screen.
        currentToken = type.data.token;

        console.log(currentToken);

        axios.get(`${$api.url}/account/${type.data.token}/applications/${$callback.appId}}`)
        .then((response) => {
          let data = response.data;
          console.log(data);
          
          if (data.agreed) {
            console.log("REDIRECT");
            redirect(type.data.token);
          } else {
            error.text = null;

            step = 5;
            loading = false;
          }
        }).catch(() => {
          error.text = null;

          step = 5;
          loading = false;
        })
      } else if (type.type == "register") {
        // Let's redirect user to pincode page.
        // User need to write his pincode to
        // continue;
        error.text = null;

        step = 2;
        loading = false;
      };

      // Hide loading screen;
    }
  };

  callback.subscribe((value) => {
    if (value.url != null || id == "add") {
      loading = false;

      defineStep("startup");
    }});

  // User object (Saves temporary user data (Applies in registration step))

  let tmpUser = {
    email: null,
    username: null,

    pincode: null
  };

  // register
  // Register function. Just registers our user!
  // It's so easy, yeah
  function register() {
    // Register user...
    axios.post(`${$api.url}/user/register`, {
      email: tmpUser.email,
      username: tmpUser.email
    })
    .then((response) => {
      let data = response.data;

      if (data.error == null) {
        // User registered...
        loading = false;
        // Let's define user's next step
        defineStep({ type: "register", data: data });
      };
    }).catch(() => {
      loading = false;
      error.text = "authorization.errors.unableToRegister";
    })
  };

  // login
  // Login function. Hm, just logins user!
  // Nothing special
  function login() {
    console.log("LOGIN STAGE");
    console.log(tmpUser.email);
    console.log(tmpUser.pincode);

    // Login.
    axios.post(`${$api.url}/user/login`, {
      email: tmpUser.email,
      pincode: tmpUser.pincode
    })
    .then((response) => {
      let data = response.data;

      if (data.token != null) {
        // Let's check if user want to add another account
        // to this session or if he want to login.

        if (id == "add") {
          // Let's check if current token is session token
          // or if it's an user token.
          let token = cookies.get('_account_token', { domain: "wavees.co.vu" });

          if (token != null) {
            // Checking
            axios.get(`${$api.url}/account/${token}`)
            .then((response) => {
              // It's a session token, so let's just add new
              // profile to this session.
              axios.put(`${$api.url}/account/${token}`, { token: data.token })
              .then((response) => {
                let data = response.data;

                // Check if we need to return user to
                // some callback

                if ($page.query.return != null) {
                  window.location.href = `/${$page.query.return}`;
                } else {
                  window.location.href = "/";
                }
              }).catch(() => {
                loading = false;
                error.text = "authorization.errors.unableToAddAccount";
              });
            }).catch(() => {
              // It's an user token, so let's create new session
              let query = {
                profiles: [
                  token,
                  data.token
                ]
              };
              
              axios.post(`${$api.url}/account`, query)
              .then((response) => {
                let data = response.data;

                // Check if we need to return user to
                // some callback
                
                if ($page.query.return != null) {
                  window.location.href = `/${$page.query.return}`;
                } else {
                  window.location.href = "/";
                }

                if (data.token != null) {
                  cookies.set("_account_token", data.token, {
                    path: "/",
                    domain: "wavees.co.vu",
                    expires: moment().add("1", "y").toDate()
                  });

                  cookies.remove('login-email');
                };
              }).catch(() => {
                loading = false;
                error.text = "authorization.errors.unableToRegisterSession";
              });
            });
          } else {
            // Procceed to login...
            error.text = null;

            loading = false;
            user.setToken(data.token);

            // Let's define users's next step...
            defineStep({ type: "login", data: data });

            cookies.set("_account_token", data.token, {
              path: "/",
              domain: "wavees.co.vu",
              expires: moment().add("1", "y").toDate()
            });
            cookies.remove("login-email");
          }
          // axios.put(`${$api.url}/accounts/${cookie}`)
        } else {
          // Procceed to login...
          console.log("LOGIND USER");
          error.text = null;

          loading = false;
          user.setToken(data.token);

          // Let's define users's next step...
          defineStep({ type: "login", data: data });

          cookies.set("_account_token", data.token, {
            path: "/",
            // domain: "wavees.co.vu",
            expires: moment().add("1", "y").toDate()
          });
          cookies.remove("login-email");
        }
      }
    }).catch((err) => {
      loading = false;
      console.log("UNABLE TO LOGIN");
      console.log(err);

      error.text = "authorization.errors.unableToLogin";
    });
  };

  // redirect 
  // Fired when user presses the "I agree" button
  // on redirect screen. It'll get new user token
  // and then redirect user to application.
  function redirect(token) {
    console.log("REDIRECT");
    loading = true;

    console.log($api.url);
    console.log(id);
    console.log(token);

    axios.get(`${$api.url}/callback/finish/${id}/${token}`)
    .then((response) => {
      let data = response.data;

      window.location.href = `http://${$callback.url}/?token=${data.token}`;
    }).catch((error) => {
      console.log("ERROR");
      console.log(error);
      loading = false;
      error.text = "authorization.errors.unableToFinishCallback";
    })
  };

  // onMount
  // Function, that is called when our page
  // loads. Here we'll get some information
  // about our callback. 
  onMount(() => {
    if (id == "add") {
      user.clearStore();
      callback.setLoaded(true);
    } else {
      callback.retrieve(id);
    }
  });
</script>

<!-- 
  Header
 -->

<svelte:head>
  <title>Wavees Authorization</title>
</svelte:head>

<div style="background-image: url('background.png'); background-size: cover; background-position: center center; overflow: hidden; width: 100%; height: 100vh;" class="flex flex-col justify-center items-center relative">

  <!-- 
    @section container
   -->
  <div class="{ error.text != null ? "rounded-t-lg" : "rounded-lg"} bg-white relative mx-4 md:mx-0 w-full md:max-w-md shadow-xl">
    { #if loading }
      <div style="z-index: 3;" class="w-full h-full absolute flex justify-center items-center bg-white">
        <Spinner size="30" />
      </div>
    { /if }

    <!-- 
      Header
     -->
    <div class="w-full py-4 flex justify-around items-center bg-gray-100">
      <!-- 1: email
        IDS: 1 -->
      <div class="flex items-center {step == 1 ? "font-semibold" : ""}">
        <div style="width: 1.8em; height: 1.8em;" class="flex justify-center text-center items-center text-sm rounded-full {step == 1 ? "bg-blue-600 text-white" : "bg-gray-300"}">
          { #if step > 1 }
            <div>
              <img style="width: 1.3em; height: 1.3em;" src="./icons/check.svg" alt="Checkmark">
            </div>
          { :else }
            1.
          { /if }
        </div>
        <p class="mx-2 text-xs">Ввод почты</p>
      </div>

      <!-- 2: pincode vs register
        IDS: 2,3 -->
      <div class="flex items-center {step == 2 || step == 3 || step == 4 ? "font-semibold" : ""}">
        <div style="width: 1.8em; height: 1.8em;" class="flex justify-center text-center items-center text-sm rounded-full {step == 2 || step == 3 || step == 4 ? "bg-blue-600 text-white" : "bg-gray-300"}">
          { #if step > 4 }
            <div>
              <img style="width: 1.3em; height: 1.3em;" src="./icons/check.svg" alt="Checkmark">
            </div>
          { :else }
            2.
          { /if }
        </div>
        <p class="mx-2 text-xs">{ step == 4 ? "Выбор аккаунта" : step == 3 ? "Регистрация" : "Авторизация" }</p>
      </div>

      <!-- 3: redirect
        IDS:  -->
      <div class="flex items-center {step == 5 ? "font-semibold" : ""}">
        <div style="width: 1.8em; height: 1.8em;" class="flex justify-center text-center items-center text-sm rounded-full {step == 5 ? "bg-blue-600 text-white" : "bg-gray-300"}">
          3.
        </div>
        <p class="mx-2 text-xs">Последний штрих!</p>
      </div>
    </div>

    <!-- 
      Different screens
     -->
    <div class="w-full h-full px-4 py-4">

      { #if step == 0 }
        <div class="text-center">
          <h1 class="text-xl">We're trying to identify you.</h1>
          <p class="text-sm">If you still see this message - try refreshing your page.</p>

          <RoundedButton on:click={(e) => { location.reload() }} classes="mt-6">
            👌 Ok, refresh it for me 
          </RoundedButton>
        </div>
      { :else if step == 1 }
        <EmailScreen bind:email={tmpUser.email} on:changeStep={(e) => {
          step = e.detail;
        }} on:loading={(e) => {
          loading = e.detail;
        }} on:succeed={(e) => {
          tmpUser.email = e.detail.email;

          defineStep({ type: "emailChanged", data: e.detail });
        }} on:error={(e) => {
          error.text = e.detail;
        }} />
      { :else if step == 2 } 
        <PincodeScreen email={tmpUser.email} on:changeStep={(e) => {
          step = e.detail;
        }} on:succeed={(e) => {
          tmpUser.pincode = e.detail.pincode;

          console.log("LOGIN #1");
          login();
        }} on:loading={(e) => {
          loading = e.detail;
        }} on:error={(e) => {
          error.text = e.detail;
        }} />
      { :else if step == 3 }
        <RegisterScreen bind:username={tmpUser.username} on:changeStep={(e) => {
          step = e.detail;
        }} on:succeed={(e) => {
          tmpUser.username = e.detail.username;

          register();
        }} on:loading={(e) => {
          loading = e.detail;
        }} on:error={(e) => {
          error.text = e.detail;
        }} />
      { :else if step == 4 }
        <ChooserScreen on:succeed={(e) => {
          defineStep({ type: "login", data: e.detail });
        }} on:error={(e) => {
          error.text = e.detail;
        }} />
      { :else if step == 5 }
        <DisclaimerScreen on:succeed={(e) => {
          if (currentToken == null) {
            currentToken = cookies.get("_account_token", { domain: "wavees.co.vu" });
          };
          redirect(currentToken);
        }} on:error={(e) => {
          error.text = e.detail;
        }} email={tmpUser.email} />
      { /if }
    </div>
  </div>

  <!-- 
    Error box
    Appears when error is occured and
    disappers somehow..
  -->

  { #if error.text != null }
    <div in:slide out:slide class="rounded-b-lg mx-4 w-full md:max-w-md bg-gray-200 flex justify-start items-center px-2 md:px-6 py-4 md:py-6">
      <!-- 
        Icon here
      -->
      <img style="width: 1.8em; height: 1.8em;" src="./icons/alert-triangle.svg" alt="Alert icon">

      <!-- 
        And text here 
      -->
      <div class="mx-4">
        <h1 class="text-xl text-semibold">Произошла ошибка</h1>
        <p class="text-gray-700">{$_(error.text, { default: "Unrecognized error message" })}</p>
      </div>
    </div>
  { /if }
</div>