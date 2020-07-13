<script>
  // Let's now import some useful things...
  import { goto } from "@sapper/app";
  import { user } from "../config/stores/user.js";

  if ($user.tokens.length >= 1) {
    // Let's now check if we have
    // current user or no.

    if ($user.current.token != null) {
      // And, as for now, let's just redirect our
      // user to his account page. (Settings page in
      // future) 
      goto(`/u/${$user.current.id}`);
    } else {
      goto('/choose');
    };
  } else {
    goto('/authorize/login');
  };
</script>