import { readable, writable } from 'svelte/store';

const general =
readable({
  // Site url
  // Hmm, just site url, isn't it?
  url: "wavees.co.vu"
});

export { general };

//
// @explanation
// Config object, that consists url's and keys to access
// private API, that was made especially for this site.
const api = 
readable({
  // I dunno what is this thing doing here.
  // I think that I should delete this... But...
  defaultAvatar: "https://cdn.dribbble.com/users/45488/screenshots/9084073/media/f889543c2e901048f8da2d9915d0bf37.jpg",

  // API URL and version parameters
  url: "https://api.wavees.co.vu", 
  version: 1
});

export { api };