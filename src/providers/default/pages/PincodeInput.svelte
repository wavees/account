<script>
  // import
  import { _ } from "svelte-i18n";
  import api from "../../../config/application/api";

  import moment from "moment";

  import axios from "axios";

  import { fade } from "svelte/transition";
  import { stores } from "@sapper/app";

  import { user } from "../../../config/stores/user.js";

  // Let's get page store
  const { page } = stores();

  import { createEventDispatcher, onMount } from "svelte";
  import Cookie from "cookie-universal";

  // Let's import some helpers
  import authorizeUser from "../methods/login";

  // Cookie manager
  const cookies = Cookie();

  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Importing components
  import { 
    TextInput, 
    
    Button,

    Spinner, 
    
    Heading, 
    Caption,
    Text,
    
    Avatar, 
    theme } from "darkmode-components/src/index"

  // Function, that'll process given information
  function process() {
    loading = true;

    // Let's create event, that'll change our tile
    // to loading state.
    dispatch('step', { step: 2, loading: true });

    // Let's now get user's email from cookie manager
    let email = cookies.get('_login_email');

    // And now we need to check if we need to:
    // 1. Add this account to existing session
    // 2. Create new session

    let type;
    let session;
    if ($page.params.id == "add") {
      type = "sessionAdd";
      session = cookies.get('_account_token');
    };

    // By the way, we need to get our user's pincode
    // input...
    let inputs = document.getElementsByClassName("pincode");
    let pincode = [];

    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].value != "") pincode.push(inputs[i].value);
    };

    pincode = pincode.join("");

    // And now let's authorize our user.
    if (pincode.split('').length != 4) {
      dispatch("error", "authorization.errors.invalidPincode");
    } else {
      // Let's try to login our user;
      authorizeUser(email, pincode, type, session)
      .then((response) => {
        // Now let's write down user's token to cookie
        // file and proceed with checkup 
        if (response.token != null) {
          cookies.set('_account_token', response.token, { 
            path: "/",
            expires: moment().add('1', 'year').toDate()
          });
          
          // cookies.set('_logged_in', true, {
          //   path: "/",
          //   expires: moment().add('5', "seconds").toDate()
          // });
          // And let's delete _login_email cookie
          cookies.remove('_login_email');

          // By the way, we need to update
          // our user store.
          user.setToken(response.token);

          user.setToken(response.token);
          let query = new URLSearchParams(window.location.search);
          query.delete("providerId");

          let redirect = $page.query.return;
          if (redirect == null) {
            redirect = `authorize/${$page.params.id}`;
          };

          dispatch("urlChange", { url: `${redirect}`, query: query, replaceState: true, encode: true });

          // And now we need to call check
          // function.
          setTimeout(() => {
            dispatch("check");
          }, 150);
        } else {
          loading = false;
          dispatch("error", "authorization.errors.invalidPincode");
        }
      }).catch((error) => {
        console.log(error);

        loading = false;
        dispatch("error", "authorization.errors.unableToLogin");
      });
    }
  };

  // Let's now load some user informaton.
  onMount(() => {
    // Let's focus on pincode input.
    let focusElement = document.getElementById("pincode-start");
    focusElement.focus();

    // Let's get user's email...
    email = cookies.get('_login_email');

    axios.get(`${api.url}/${api.version}/user/check/${email}`)
    .then((response) => {
      let data = response.data;
      loaded = true;

      // User Avatar
      if (data.avatar != null) {
        avatarImage = data.avatar;
      };

      // Username
      if (data.username != null) {
        username = data.username;
      };
    }).catch((error) => {
      loaded = true;
      dispatch("error", "authorization.errors.unableToGetAvatar");
    });
  });

  let loaded = false;

  let loading = false;
  let backLoading = false;

  let email;
  let username;
  let avatarImage;
  
  let pincode;

  // Function, thah'll help us to check user's input
  function keyup(e) {
    dispatch("error", null);

    // And now let's focus on second/third/(and so on)
    // pincode input.

    // @warning! This is very dumb realization,
    // but it works! And it works perfectly!
    // Somehow.
    let currentID = e.target.id;

    // Let's now determine the type of
    // this keypress.

    let type;

    // Firstly we need to check all keycodes
    let blockedKeys = [
      27,
      192,
      9,
      20,
      16,
      17,
      38,
      39
    ];
    
    if (!blockedKeys.includes(e.keyCode)) {
      if (e.keyCode === 37) {
        type = "backspace";
      } else if (e.keyCode === 8) {
        type = "nothing";
      } else {
        type = "normal" 
      };
    }

    // And now let's determine our next
    // input...
    let focus;

    switch (currentID) {
      case "pincode-start":
        if (type == "normal") {
          focus = document.getElementById('pincode-2');
        };
        break;
    
      case "pincode-2":
        if (type == "backspace") {
          focus = document.getElementById('pincode-start');
        } else if (type == "normal") {
          focus = document.getElementById('pincode-3');
        };
        break;

      case "pincode-3":
        if (type == "backspace") {
          focus = document.getElementById('pincode-2');
        } else if (type == "normal") {
          focus = document.getElementById('pincode-4');
        };
        break;

      case "pincode-4":
        if (type == "backspace") {
          focus = document.getElementById('pincode-3');
        };
        break;

      default:
        break;
    };

    // And now let's just focus on
    // new pincode input.
    if (focus) {
      focus.focus();
      moveCursorToEnd(focus);
    };

    // Let's check if user pressed ENTER
    // button or no.
    if (e.keyCode === 13) {
      e.preventDefault();
      process();
    };
  };

  // Small helper function, that'll move user's
  // cursor to the end of input.
  function moveCursorToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
  }
</script>

<style>
  .pincode {
    width: 35px; 
    text-align: center; 
    height: 50px; 
    border: 0; 
    border-bottom: 2px solid #555770; 
    border-radius: 2px 2px 0 0; 
    font-size: 2em; 
    background-color: transparent;
    cursor: default; 
    user-select: none;
  }
</style>

<!-- 
  Layout
 -->

<!-- 
  Let's check if we have loaded
  our user information or no. -->
{ #if !loaded }
  <div out:fade style="z-index: 999;" class="absolute h-full w-full px-4 md:px-6">
    <div class="w-full h-full flex items-center justify-center bg-white">
      <Spinner size="15" />
    </div>
  </div>
{ /if }

<main class="relative px-4 md:px-8 h-full flex justify-center items-center">
  <div>
    <!-- 
      Header
    -->
    <div class="w-full">
      <!-- Some text -->
      <div class="w-full text-center">
        <h1 class="text-base font-semibold">{$_("authorize.pincodeScreen.header", { default: "Write pincode" })}</h1>
        <p class="text-xs text-gray-700">{$_("authorize.pincodeScreen.subheader", { default: "you received when you registered to log in" })}</p>
      </div>

      <!-- User Profile card -->
      <div class="mt-6 flex justify-center items-center">
        <Avatar type="image" avatar={avatarImage} size={2.5} />
      
        <div class="mx-4">
          <h1 class="font-semibold text-base">{username == null ? $_("global.unknownUsername", { default: "Unknown user" }) : username}</h1>
          <p class="text-gray-700 text-xs">{email}</p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="mt-8 w-full flex flex-col justify-center items-center px-2 md:px-8">
      <div style="{$theme == "light" ? "color: #000;" : "color: #fff;"}" class="items-center text-center">
        <input id="pincode-start" type="text" maxlength="1" class="m-2 pincode" on:keyup={(e) => keyup(e)}>
        <input id="pincode-2" maxlength="1" type="text" class="m-2 pincode" on:keyup={(e) => keyup(e)}>
        <input id="pincode-3" maxlength="1" type="text" class="m-2 pincode" on:keyup={(e) => keyup(e)}>
        <input id="pincode-4" maxlength="1" type="text" class="m-2 pincode" on:keyup={(e) => keyup(e)}>
      </div>

      <!-- Buttons -->
      <div class="mt-8 w-full flex justify-between">
        <!-- Login button -->
        <button class="flex w-full items-center text-sm rounded-lg h-8 bg-black text-white flex justify-center items-center text-center { loading ? "" : "hover:bg-blue-300" }" on:click={(e) => {
          process();
        }}>
          { #if loading }
            <Spinner size="12" color="#fff" />
          { :else }
            {$_("global.login", { default: "Login" })}
          { /if }
        </button>
        
        <!-- Back Button -->
        <button class="h-8 flex items-center justify-center w-full" on:click={(e) => {
          cookies.remove('_login_email');
          backLoading = true;

          dispatch("error", null);
          dispatch("check");
        }}>
          {#if backLoading}
            <Spinner size="12" />
          { :else }
            { $_("global.back", { default: "Back" }) }
          {/if}
        </button>
      </div>
    </div>
  </div>
</main>