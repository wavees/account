<script>
  // Import lozalization library
  import { _ } from "svelte-i18n";

  // Import some components
  // import LanguagePicker from "./Pickers/LanguagePicker.svelte";

  // Import general config.
  import { general } from "../config/global.js";
</script>

<div class="w-full flex justify-between px-4 absolute inset-x-0 bottom-0">
  <div class="flex items-center justify-center">
    <a href="https://{$general.url}" class="logotype text-xl" style="font-weight: 600;">Wavees</a>
    <div class="mx-6 text-sm">
      <!-- <LanguagePicker color="#000" position="right" /> -->
    </div>
  </div>

  <div class="flex items-center text-sm text-dark">
    <a href="https://{$general.url}/" class="mx-2">{$_("landing.header.projects", { default: "Projects" })}</a>
    <!-- <a href="https://{$general.url}/" class="mx-2">{$_("landing.header.about", { default: "About" })}</a> -->
    <a href="https://company.{$general.url}/" class="mx-2">{$_("landing.header.contact", { default: "Contact" })}</a>
  </div>

</div>