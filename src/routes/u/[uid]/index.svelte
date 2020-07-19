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

  // Let's now import other components...
  import MedalsWrapper from "../../../components/medals/Wrapper.svelte";
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

            <!-- Some profile information -->
            <div class="mt-2 md:mt-4 w-full flex justify-center items-center">
              <!-- Coins -->
              <div class="text-gray-800 flex items-center">
                <img class="mx-2" style="width: 1.2em;" src="./icons/triangle.svg" alt="Coins">
                {$user.current.coins}
              </div>
            </div>
          </div>

          <!-- 
            Let's now check if this is our
            currently logged in user or no. -->

          { #if $user.current.id == $current.id }
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
    <div class="h-full w-full flex flex-col { !$current.loaded ? "justify-center items-center" : "" } rounded-lg bg-white shadow-2xl">

      { #if $current.loaded }
        <!-- Some user information -->

        <!-- User's cards list -->
        <div class="w-full px-2 md:px-6 pt-4 md:pt-6">
          <Heading>User medals</Heading>
          <Caption>All user's medals and cards from <span style="cursor: pointer" on:click={(e) => window.location.href = "https://medals.wavees.co.vu/" } class="text-gray-800">medals.wavees.co.vu</span></Caption>
          
          <div class="w-full flex mt-4">
            <MedalsWrapper cardsNumber={4} />

            <!-- Show all button -->
            <!-- <div style="width: 8rem; height: 10rem;" class="bg-white rounded-lg mx-4 mt-6 lg:mt-6 flex justify-center items-center shadow-2xl text-white relative">
  
              # Heading and icon
              <div class="px-2 flex flex-col justify-center items-center text-black text-base text-center">
                # Icon
                <img style="width: 1.6em;" src="./icons/layers.svg" alt="All cards">

                # Heading itself
                <h1 class="mt-2">Show all cards</h1>
              </div>
            </div> -->
          </div>
        </div>
      { :else }
        <Spinner />
      { /if }
    </div>
  </div>
</div>