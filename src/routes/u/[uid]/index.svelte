<script>
  // Let's now import some needed
  // stores (current user store) and
  // other things. (like components)
  import { user, current } from "../../../config/stores/user";

  import { _ } from "svelte-i18n";

  // Let's configure coolkie manager.
  import Cookie from "cookie-universal"
  const cookies = Cookie();

  // Let's now import some components.
  import {
    Spinner,

    Text,
    Caption,
    Heading,

    Button,

    Avatar
  } from "darkmode-components/src/index";
</script>

<!-- 
  Svelte header
-->
<svelte:head>
  <title>User account</title>
  <script src="js/cardTilt.js"></script>
</svelte:head>

<!-- 
  Some styles 
-->
<style>

/* Mobile (no tilt) */
@media only screen 
   and (min-width : 320px) {
  /* Styles here */
  .wrapper {
     padding: 0 0;
   }
}

/* Tablet */
@media only screen 
   and (min-width : 768px) {
   /* Styles here */
   .wrapper {
     padding: 0 5%;
   }
}

/* Laptop */
@media only screen 
   and (min-width : 1200px) {
   /* Styles here */
  .wrapper {
    padding: 0 5%;
  }
}

.wrapper {
  -moz-box-align: center;
  -moz-box-pack: center;
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
}

.panel {
  height: 466px;
  position: relative;
  width: 100%;
}

.panel__img-col {
  box-shadow: 0 20px 100.28px 8.72px rgba(0, 0, 0, 0.35);
  /* flex-basis: 70%; */
}
</style>

<!-- 
       Main card
  Here we'll show some
  information about this
  user. We'll use
  card-stylized system
  for this.
-->
<div class="bg-gray-100 w-full h-full py-24 lg:py-0 lg:pt-0 flex flex-col lg:flex-row justify-center items-center relative">
  
  <!-- User Card -->
  <div class="wrapper w-full lg:w-2/4">
    <div class="panel">
      <div style="background-image: url('background-light.png'); background-size: cover; background-position: center center;" class="panel__img-col w-full h-full bg-white rounded-lg flex flex-col justify-center items-center">
        <!-- Loading state... -->
        { #if !$current.loaded }
          <div>
            <Spinner />
          </div>
        { :else }
          <!-- User Avatar and Username (and fucking email)... -->
          <Avatar type="image" avatar={$current.avatar} size={6.5} />
        
          <div class="text-center">
            <Heading>{$current.username}</Heading>
            <Caption>{$current.email}</Caption>  
          </div>

          <!-- 
            Let's now check if this is our
            currently logged in user or no. -->

          { #if $user.current.id == $current.uid }
            <!-- Log out/Settings Buttons -->
            <div class="w-full px-8 md:px-16 lg:px-4 pt-12 flex flex-col justify-center">
              <!-- Settings button -->
              <Button type="ghost">
                {$_("global.settings", { default: "Settings" })}
              </Button>
              
              <!-- Log out button -->
              <Button on:click={(e) => {
                cookies.remove('_account_token');

                window.location.href = "/";
              }} fullWidth={true}>
                {$_("global.logout", { default: "Log out" })}
              </Button>
            </div>
          { /if }
        { /if }
      </div>
    </div>
  </div>

  <!-- User information Card -->
  <div class="panel pt-16 lg:pt-0 px-4 md:pr-16 lg:pr-24">
    <div class="h-full w-full flex justify-center items-center rounded-lg bg-white shadow-2xl">
      <div class="flex flex-col justify-center items-center text-center">
        <!-- Image -->
        <img style="width: 6.5rem;" src="./illustrations/no_data.svg" alt="No Data Illustration">

        <!-- Some text -->
        <div class="mt-6">
          <Heading>Empty account</Heading>
          <Caption>This account doesn't have any public information</Caption>
        </div>
      </div>
    </div>
  </div>
</div>