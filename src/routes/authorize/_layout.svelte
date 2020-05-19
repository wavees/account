<script>
  // import
  import { user } from "../../config/user.js";
  import { goto } from "@sapper/app";
  
  import Spinner from "../../components/Spinner.svelte";
  import RoundedButton from "../../components/Buttons/RoundedButton.svelte";
  import TransparentButton from "../../components/Buttons/TransparentButton.svelte"

  import Cookie from "cookie-universal";

  // Cookies instance
  const cookies = Cookie();

  // Let's get user token and then
  // let's do something very interesting...
  const token = cookies.get('token');
  if (token != null) {
    user.setToken(token);
  } else {
    user.setLoaded(true);
  }
</script>

<div style="width: 100%; height: 100vh; z-index: 1">
  { #if !$user.loaded }
    <div style="width: 100%; height: 100vh; z-index: 2" class="bg-white flex justify-center items-center absolute">
      
      <!--  -->
      { #if $user.error != null }
        <div class="flex flex-col justify-center text-center">
          <h1 class="text-2xl text-semibold">Error occured</h1>
          <p>We've had problems that we can't solve yet. Try again.</p>

          <div class="w-full text-center my-6 bg-gray-200 rounded-lg py-4">
            <p>{$user.error}</p>
          </div>

          <div class="flex w-full justify-center">
            <RoundedButton classes="mx-2" on:click={(e) => { goto('/') }}>
              😥 Go home
            </RoundedButton>

            <TransparentButton classes="mx-2" on:click={(e) => { location.reload() }}>
              Retry
            </TransparentButton>
          </div>
        </div>
      { :else }
        <Spinner size="50" />
      { /if }
    </div>
  { :else }
    <slot>
    </slot>
  { /if }
</div>