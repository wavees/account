<script>
  // import
  import { _ } from "svelte-i18n";
  
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  import { goto } from "@sapper/app";
  import { stores } from "@sapper/app";

  import Cookie from "cookie-universal";

  // Cookies manager
  const cookies = Cookie();

  // Let's get page store
  const { page } = stores();

  // Importing pages
  import EmailInputPage from "../../pages/authorization/EmailInput.svelte";
  import PincodeInputPage from "../../pages/authorization/PincodeInput.svelte";
  
  import RegistrationPage from "../../pages/authorization/RegistrationPage.svelte";

  // Importing components
  import { 
    theme, 
    colors,
    
    Tile,

    Caption,
    
    ProgressIndicator } from "darkmode-components/src/index";

  // Let's import some needed helpers
  import CheckEmailHelper from "../../helpers/authorization/checkEmail";
  import PlainRedirectHelper from "../../helpers/authorization/redirect";
  import CallbackRedirectHelper from "../../helpers/authorization/callback";

  const helpers = {
    check: {
      email: CheckEmailHelper
    },

    redirect: {
      plain: PlainRedirectHelper,
      callback: CallbackRedirectHelper
    }
  };

  // onMount event
  // Here we'll determine which authorization step
  // we need to show. Examples: (email, pincode, user registration
  // and so on)
  onMount(() => {
    checkStep();
  });

  function checkStep () {
    loading = true;

    let token = cookies.get('_account_token');
    let id = $page.params.id;

    if (id == "add") {
      if (step != 2) {
        token = null;
      };
    };

    if (token) {
      // Now let's check if we need to
      // just redirect user, or do we need
      // to finish callback

      // Just redirect user.
      if (id == "add" || id == "login" || id == "register") {
        helpers.redirect.plain();
      } else {
      // Finish callback and then redirect.
        helpers.redirect.callback()
      }
    } else {
      // And now we need to check if user already
      // wrote his email or no.
      let email = cookies.get('_login_email');

      if (email) {
        // Here we'll check user's email
        helpers.check.email(email)
        .then((response) => {
          // User exists, so we just need to authorize
          // user. So we let's show him pincode page
          if (response.exists) {
            step = 2;
            loading = false;
          } else {
          // User doesn't exists, so let's show him registration
          // screen.
            step = 4;
            loading = false;
          }
        }).catch((error) => {
          // Error occured, so email doesn't even exists.
          if (error == "InvalidEmail") {
            changeError(error);
          };
        })
      } else {
        // We need to show login page...
        step = 1;
        loading = false;
      }
    }
  };

  // Function, that'll help us to change
  // step and loading state directly from
  // our components.
  function changeStep(stepNumber, loadingState = false) {
    step = stepNumber;
    loading = loadingState;
  };

  // Function, that'll handle errors
  function changeError(errorMessage) {
    console.log(errorMessage);
    error = errorMessage;

    loading = false;
  };

  // Authorization steps
  let step = 0;
  let loading = true;

  // And errors
  let error = null;

  // Progress items
  let progressItems = [
    {
      title: "Ввод почты"
    },
    {
      title: "Авторизация"
    },
    {
      title: "Последний штрих!"
    }
  ];
</script>

<svelte:head>
	<link rel="stylesheet" href="./fonts/Junegull/junegull.css">
  <title>Wavees Auth</title>
</svelte:head>

<main style="background-image: url('{$theme == "dark" ? "background-dark.png" : "background-light.png"}'); background-size: cover; background-position: center center; min-height: 100vh; background-color: {$theme == "dark" ? $colors.dark[0] : $colors.light[4]}" class="w-full flex flex-col justify-center items-center">
  <!-- Company "logo" -->
  <div class="w-full flex mb-6 text-center flex justify-center items-center">
		<h1 style="font-family: Junegull; color: {$theme == "dark" ? $colors.light[2] : $colors.dark[2]}" class="text-3xl text-bold">wavees</h1>
	</div>
  
  <!-- 
    Authorization tile 
    @page EmailInput
  -->

  <Tile {loading} size="medium">
    <!-- Progress indicator -->
    <div class="mb-8 mx-4">
      <ProgressIndicator current={step == 4 ? 2 : step} items={progressItems} />
    </div>

    <!-- Tile content -->

    <!-- 
      @step Email Validation
      Here user need to write down his email,
      and then, we'll validate it.
     -->
    {#if step == 1}
      <EmailInputPage on:step={(e) => {
        changeStep(e.detail.step, e.detail.loading);
      }} on:check={(e) => {
        checkStep();
      }} on:error={(e) => {
        changeError(e.detail);
      }} />
    <!-- 
      @step Pincode Validation
      Just another screen for user validation.
      Here user just need to write down
      his pincode and login to his account.
     -->
    { :else if step == 2 }
      <PincodeInputPage on:step={(e) => {
        changeStep(e.detail.step, e.detail.loading);
      }} on:check={(e) => {
        checkStep();
      }} on:error={(e) => {
        changeError(e.detail);
      }} />
    
    <!-- 
      @step User Registration
      Just another user registration page...
      I think thah'll it be very compilcated and very good-looking
     -->
    { :else if step == 4 }
      <RegistrationPage on:step={(e) => {
        changeStep(e.detail.step, e.detail.loading);
      }} on:check={(e) => {
        checkStep();
      }} on:error={(e) => {
        changeError(e.detail);
      }} />
    {/if}
  </Tile>

  <!-- Error status -->
  {#if error != null}
    <div transition:slide class="py-4">
      <Caption>{$_(error, { default: error })}</Caption>
    </div>
  {/if}
</main>