<script>
  // import
  import { createEventDispatcher } from "svelte";
  import Cropper from "cropperjs";

  // Importing components
  import Avatar from "../Avatar.svelte";
  import RoundedButton from "../Buttons/RoundedButton.svelte";
  import TransparentButton from "../Buttons/TransparentButton.svelte";

  // Create event dispatcher
  const dispatch = createEventDispatcher();

  let loading = false;

  // Should we crop this file or not.
  let cropFile = {};
  let cropping = false;
  let cropper = {};

  function enableCrop(file) {
    cropFile = file;
    cropping = true;

    let img = document.createElement("img");
    img.src = URL.createObjectURL(cropFile);

    let ctx = document.getElementById('cropper').getContext('2d');
    
    img.onload = function() {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.canvas.width = img.width;
      ctx.canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      let element = document.getElementById("cropper");

      cropper = new Cropper(element, {
        aspectRatio: 1,
        dragMode: 'move',
        restore: false,
        guides: false,
        center: false,
        highlight: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: true
      });
    };
  };

  function crop() {
    cropper.getCroppedCanvas().toBlob((blob) => {
      dispatch("upload", blob);
    });

    clear();
  }

  function clear() {
    cropping = false;
    cropFile = {};

    cropper.destroy();
  }

  // Export some variables.
  export let avatar = null;
  export let username = "UN";
</script>

<div class="w-full md:w-1/2 px-4 my-4">
  <div class="w-full h-full rounded-lg bg-white shadow-2xl px-4 py-6">
    <!-- # EDIT AVATAR -->
     
    <div style="z-index: 997; overflow: hidden; height: 100vh;" class="inset-x-0 top-0 absolute w-full bg-gray-200 { cropping ? "flex" : "hidden" } justify-center items-center">
      <canvas id="cropper">
    </div>

    <!-- # Accept -->
    <div style="z-index: 998;" class="{ cropping ? "flex" : "hidden" } absolute inset-x-0 bottom-0 w-full justify-center pb-2">
      <TransparentButton on:click={(e) => {
        clear();
      }} classes="mx-2 text-white">
        Отмена
      </TransparentButton>
    
      <!-- Here we'll get cropped
      image and then send it somewhere -->
      <RoundedButton on:click={(e) => {
        crop();
      }} classes="mx-2 hover:text-white">
        Принять
      </RoundedButton>
    </div>

    <h1 class="text-xl text-semibold w-full text-center">Аватарка профиля</h1>

    <div class="flex mt-4">
      <Avatar size="5.5" avatar={avatar} username={username} />
      
      <div class="mx-4">
        <input class="hidden" id="avatar" name="avatar" type="file" accept=".png, .jpg, .jpeg" on:change={(e) => {
          enableCrop(document.getElementById('avatar').files[0])
        }}>
        
        <RoundedButton on:click={(e) => {
          document.getElementById('avatar').click();
        }} classes="text-sm">
          🖼️ Загрузить новую
        </RoundedButton>

        <div class="flex my-4 text-xs">
          <TransparentButton>
            Отчистить
          </TransparentButton>
        </div>
      </div>
    </div>
  </div>
</div>