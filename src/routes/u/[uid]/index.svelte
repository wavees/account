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
     padding: 1.5rem 0;
   }
}

/* Tablet */
@media only screen 
   and (min-width : 768px) {
   /* Styles here */
   .wrapper {
     padding: 1.5rem 15%;
   }
}

/* Laptop */
@media only screen 
   and (min-width : 1200px) {
   /* Styles here */
  .wrapper {
    padding: 1.5rem 35%;
  }
}

.wrapper {
  -moz-box-align: center;
  -moz-box-pack: center;
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
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
<div class="w-full h-full flex justify-center items-center relative">
  <div class="wrapper">
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
            <div class="w-full px-8 md:px-16 lg:px-4 pt-12 flex flex-col lg:flex-row justify-center">
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
</div>