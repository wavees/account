<script>
  // import
  import { stores } from "@sapper/app";
  import { onMount } from "svelte";

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

  // Cookies
  const cookies = Cookie();

  // let's get callback id..
  const { page } = stores();
  const { id } = $page.params;

  // Login process step.
  
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
    if (type == "startup") {
      // Check if user is logged in. (Check for token);
      if ($user.current.token != null) {
        // Let's check if user have another accounts
        if ($user.tokens.length >= 1) {
          step = 4;
        } else {
          // Let's check if we need to instantly
          // send user to application or should
          // we show user disclaimer;
          console.log($callback.url);
          axios.get(`${$api.url}/accounts/${$user.current.token}/applications/${$callback.url.replace('http://','').replace('https://','').split(/[/?#]/)[0]}`)
          .then((response) => {
            let data = response.data;

            if (data.agreed) {
              // Let's get new user's token and then redirect
              // user to callback page...
              axios.get(`${$api.url}/callback/finish/${id}/${$user.current.token}`)
              .then((response) => {
                let data = response.data;

                window.location.href = `http://${$callback.url}/?token=${data.token}`;
              })
            } else {
              step = 5;
            }
          }).catch((error) => {
            step = 5;
          })
        }
      } else {
        // Check if user have different
        // accounts in this session.

        if ($user.error == "ChooseAccount") {
          user.loadProfiles();

          step = 4;
        } else {
          // Check for user email;
          if (cookies.get('login-email') != null) {
            // Let's check if user with this email
            // is registered or not.
            let email = cookies.get('login-email');
            tmpUser.email = email;

            axios.get(`${$api.url}/user/check/${email}`)
            .then((response) => {
              let data = response.data;
              // User exists. Le'ts send our user to
              // "pincode" page.

              step = 2;
            })
            .catch((error) => {    
              step = 1;
            });
          } else {
            step = 1;
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
          step = 2;
        // User doesn't exist:
        // show him register screen;
        } else {
          step = 3;
        }
      } else if (type.type == "login") {
        // Let's check if we need to redirect user
        // instantly or we need to show Redirect Screen.
        
      } else if (type.type == "register") {
        // Let's redirect user to pincode page.
        // User need to write his pincode to
        // continue;
        
      };

      // Hide loading screen;
      loading = false;
    }
  };

  callback.subscribe((value) => {
    if (value.url != null) { 
      defineStep("startup") 
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
    }).catch((error) => {
      console.log(error);
    })
  };

  // login
  // Login function. Hm, just logins user!
  // Nothing special
  function login() {
    // Login.
    axios.post(`${$api.url}/user/login`, {
      email: tmpUser.email,
      pincode: tmpUser.pincode
    })
    .then((response) => {
      let data = response.data;

      if (data.token != null) {
        // Procceed to login...
        loading = false;
        // Let's define users's next step...
        defineStep({ type: "login", data: data });

        cookies.set("token", data.token, {
          path: "/",
          domain: "wavees.co.vu",
          expires: moment().add("1", "y").toDate()
         });
        cookies.remove("login-email")
      }
    }).catch((error) => {
      console.log("ERROR");
      console.log(error);
    });
  }

  // Should we show loading screen or not?
  let loading = false;
  
  let error = null;

  // onMount
  // Function, that is called when our page
  // loads. Here we'll get some information
  // about our callback. 
  onMount(() => {
    callback.retrieve(id);
  });
</script>

<div style="background-image: url('background.png'); background-size: cover; background-position: center center; overflow: hidden; width: 100%; height: 100vh;" class="flex justify-center items-center relative">

  <!-- 
    @section container
   -->
  <div class="rounded-lg bg-white relative w-full md:max-w-md shadow-xl">
    { #if !$callback.loaded || loading }
      <div style="z-index: 2;" class="w-full h-full absolute flex justify-center items-center bg-white">
        <Spinner size="30" />
      </div>
    { /if }

    <!-- 
      Different screens
     -->
    <div class="w-full h-full px-4 py-6">
      
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
        }} />
      { :else if step == 2 } 
        <PincodeScreen on:changeStep={(e) => {
          step = e.detail;
        }} on:succeed={(e) => {
          tmpUser.pincode = e.detail.pincode;

          login();
        }} on:loading={(e) => {
          loading = e.detail;
        }} />
      { :else if step == 3 }
        <RegisterScreen bind:username={tmpUser.username} on:changeStep={(e) => {
          step = e.detail;
        }} on:succeed={(e) => {
          tmpUser.username = e.detail.username;

          register();
        }} on:loading={(e) => {
          loading = e.detail;
        }} />
      { /if }
    </div>
  </div>
</div>