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
      <Spinner size="50" />
    </div>
  { :else }
    <slot>
    </slot>
  { /if }
</div>