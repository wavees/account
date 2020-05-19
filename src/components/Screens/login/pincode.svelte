<script>
  // import
  import { createEventDispatcher } from "svelte";

  // Importing components


  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Error variable
  // With this variable we can show
  // error messages.

  // Error codes:
  // 1 - Invalid pincode 
  let error = null;
  
  function verify() {
    let inputs = document.getElementsByClassName("pincode");
    let pincode = [];

    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].value != "") pincode.push(inputs[i].value);
    };

    pincode = pincode.join("");
    console.log(pincode);

    console.log(pincode.split("").length);
    // Checking pincode size;
    if (pincode.split("").length < 4) {
      error = 1;
    } else {
      // Let's login our user!
      dispatch("succeed", { pincode: pincode });
    }
  }
</script>

<style>
  .pincode {
    width: 35px; 
    text-align: center; 
    height: 50px; 
    border: 0; 
    border-bottom: 2px solid rgba(0,0,0,0.3); 
    border-radius: 2px 2px 0 0; 
    font-size: 2em; 
    transition: background-color 0.3s, color 0.3s, opacity 0.3s; 
    cursor: default; 
    user-select: none;
  }
</style>

<div class="items-center text-center">
  <div class="items-center text-center">
    <input type="text" class="m-2 pincode">
    <input type="text" class="m-2 pincode">
    <input type="text" class="m-2 pincode">
    <input type="text" class="m-2 pincode">
  </div>

  <button on:click={(e) => {
    verify();
  }} class="my-4 w-full bg-transparent hover:bg-gray-900 text-dark font-semibold hover:text-white py-2 px-4 border border-dashed hover:border-transparent rounded">
    Login
  </button>

  <div class="w-full flex justify-between">
    <p class="text-dark" style="cursor: pointer;">Use different account</p>

    <p class="text-dark" style="cursor: pointer;">
      Forgot pincode?
    </p>
  </div>
</div>