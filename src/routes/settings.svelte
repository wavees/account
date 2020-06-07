<script>
  // import
  import { goto } from "@sapper/app";
  import { stores } from "@sapper/app";
  import { user } from "../config/user.js";

  import { api } from "../config/global.js";
  import { onMount } from "svelte";
  import axios from "axios";

  // Importing components
  import RoundedButton from "../components/Buttons/RoundedButton.svelte";
  import TransparentButton from "../components/Buttons/TransparentButton.svelte";
  import Spinner from "../components/Spinner.svelte";
  import Avatar from "../components/Avatar.svelte";

  import LogoutButton from "../components/Buttons/LogoutButton.svelte";

  import TokensScreen from "../components/Settings/TokensScreen.svelte";
  import ApplicationCard from "../components/Settings/ApplicationCard.svelte"
  import AvatarCard from "../components/Settings/AvatarCard.svelte";

  // Icons
  import Delete from "../components/Icons/Delete.svelte";
  import ThumbsDown from "../components/Icons/ThumbsDown.svelte";

  // Let's get page store...
  const { page } = stores();

  let fullLoading = false;

  // Variables
  let currentProfile = {
    token: null,
    approvedApplications: {
      loading: true,
      list: []
    },
    tokens: {
      loading: true,
      list: []
    }
  };
  let listEnabled = false;
  let currentToken = null;

  // loadApprovedApplications
  function loadApprovedApplications(token) {
    currentProfile.approvedApplications = {
      loading: true,
      list: []
    };

    axios.get(`${$api.url}/account/${token}/applications`)
    .then((response) => {
      currentProfile.approvedApplications.loading = false;
      currentProfile.approvedApplications.list = response.data;
    }).catch((error) => {
      currentProfile.approvedApplications.loading = false;
    });
  };

  // loadUserTokens
  function loadUserTokens(token) {
    currentProfile.tokens = {
      loading: true,
      list: {
        other: [],
        applications: []
      }
    };

    // And now let's make some request call...
    axios.get(`${$api.url}/account/${token}/tokens`)
    .then((response) => {
      let data = response.data;
      // And now we need to sort all these data...

      // Other's tokens
      let other = [];

      // Application's tokens
      let applications = {};

      data.forEach(element => {
        let registrat = element.data.registrat;
        if (registrat == null) {
          registrat = {};
        };

        if (registrat.id != null) {
          if (applications[registrat.id] == null) {
            applications[registrat.id] = [element];
          } else {
            applications[registrat.id].push(element);
          };
        } else {
          other.push(element);
        }
      });

      currentProfile.tokens.list.other = other;
      currentProfile.tokens.list.applications = Object.entries(applications);
      
      console.log("OTHER TOKENS:");
      console.log(other);

      console.log("APPLICATION TOKENS:");
      console.log(Object.entries(applications));

      currentProfile.tokens.loading = false;
    }).catch((error) => {
      currentProfile.tokens.loading = false;
    })
  }

  // findProfile
  // This function will get cached account information
  // using account token or profile name.
  function findProfile(token) {
    let profiles = $user.profiles;
    let returnProfile = {};

    profiles.forEach((profile) => {
      if (profile.token == token || profile.username == token) {
        returnProfile = profile;
        returnProfile.approvedApplications = {
          list: [],
          loading: true
        };
        returnProfile.tokens = {
          list: {
            other: [],
            applications: []
          },
          loading: true
        }

        currentToken = profile.token;

        loadApprovedApplications(profile.token);
        loadUserTokens(profile.token);
      }
    });

    return returnProfile;
  }

  if ($user.tokens.length > 1) {
    user.loadProfiles($user.tokens);
  } else {
    if ($user.current.token != null) {
      // User have only one account
      user.loadProfiles([$user.current.token]);
      currentProfile = [$user.current];
    } else {
      // User needs to be logged in.
      // console.log()
      goto('/authorize/login');
    };
  };

  // uploadAvatar
  // 
  function uploadAvatar(file) {
    fullLoading = true;

    let formData = new FormData();
    formData.append("avatar", file);

    axios.post(`${$api.url}/user/${currentProfile.token}/avatar`, formData, 
    {
      // headers: formData.getHeaders() 
    })
    .then((response) => {
      let data = response.data;

      if (data.state) {
        user.loadProfiles($user.tokens);
        fullLoading = false;
      } else {
        fullLoading = false;
      };
    }).catch((error) => {
      fullLoading = false;
    })
  };


  // Let's check if we need to choose
  // profile by default or no.

  // Example url to choose profile
  // with username {username}:

  // https://.../settings?u={username}
  user.subscribe((object) => {
    if (object.profiles.length > 1) {
      if (currentToken != null) {
        let profile = findProfile(currentToken);

        if (profile) {
          currentProfile = profile;
        };
      } else {
        if ($page.query.u != null) {
          let profile = findProfile($page.query.u);

          if (profile) {
            currentProfile = profile;
          }
        }
      }
    }
  });
</script>

<svelte:head>
  <title>Account settings</title>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.7/cropper.min.css">
  <link rel="stylesheet" href="./cropper/rounded.css">

  <link rel="stylesheet" href="./fonts/Junegull/junegull.css">
</svelte:head>

<div style="width: 100%; height: 100vh;" class="bg-gray-100 flex justify-center items-center relative md:px-16 lg:px-32 md:py-8 lg:py-16">
  { #if fullLoading }
    <div style="z-index: 999; width: 100%; height: 100vh; background-color:rgba(0, 0, 0, 0.7);" class="absolute flex justify-center items-center">
      <Spinner />
    </div>
  { /if }
  
  <!-- Header -->
  <div style="z-index: 3; height: 5rem;" class="absolute inset-x-0 top-0 w-full bg-white md:bg-gray-100 flex justify-center md:justify-between items-center px-4 md:px-16 lg:px-32">
    { #if $page.query.return != null }
      <div on:click={(e) => {
        let url = $page.query.return;

        if (url.split('').includes("@")) {
          window.location.href = `https://${url.replace('@', '')}`;
        } else {
          window.location.href = $page.query.return;
        }
      }} style="cursor: pointer;" class="flex items-center">
        <img style="width: 1.6em; height: 1.6em;" src="./icons/chevron-left.svg" alt="Return icon">

        <div class="mx-4">
          <h1>Вернуться назад</h1>
          <p class="text-sm text-gray-700">{$page.query.return.split('').includes("@") ? `https://${$page.query.return.replace("@", '')}` : `https://account.wavees.co.vu/${$page.query.return == "/" ? "" : $page.query.return}`}</p>
        </div>
      </div>

      <!-- User account -->
      <div class="hidden md:flex">
        <LogoutButton />
      </div>
    { :else }
      <h1 style="font-family: Junegull;" class="text-xl">WAVEES</h1>

      <div class="hidden md:flex items-center text-xs">
        <TransparentButton classes="mx-1">Про сервис</TransparentButton>
        <TransparentButton classes="mx-1">Компания</TransparentButton>

        <LogoutButton />
      </div>
    { /if }
  </div>
  
  <!-- Container -->
  <div class="w-full h-full bg-white rounded-lg shadow-xl flex mt-4" style="overflow: hidden;">
    <!-- User list -->

    <!-- Mobile view -->
    <div class="flex flex-col md:bg-white shadow-2xl py-2 md:py-4 md:px-6 rounded-lg">
      <div style="z-index: 4;" class="{listEnabled == true ? "hidden" : ""} px-4 md:hidden absolute inset-x-0 top-0 py-2 mb-2 justify-around items-center">
        <button on:click={(e) => {
          if (listEnabled) {
            listEnabled = false;
          } else {
            listEnabled = true;
          };
        }} class="flex">
          <img style="width: 1.6em; height: 1.6em;" src="./icons/users.svg" alt="Users icon">
          <p class="hidden md:block mx-2">Аккаунты</p>
        </button>
      </div>

      <div style="z-index: 2;" class="{listEnabled == true ? "absolute bg-white w-full h-full md:flex md:w-auto md:h-auto md:relative" : "hidden md:flex"} flex-col px-4 md:px-0 pt-8 md:pt-4">
        <div class="md:hidden w-full py-2 flex justify-center items-center">
          <button on:click={(e) => {
            if (listEnabled) {
              listEnabled = false;
            } else {
              listEnabled = true;
            };
          }} class="flex">
            <img style="width: 1.6em; height: 1.6em;" src="./icons/x.svg" alt="Users icon">
            <p class="mx-2">Закрыть</p>
          </button>
        </div>
        
        <h1 class="w-full text-center text-semibold text-xl">Выберите аккаунт:</h1>

        <div style="max-height: 45vh; overflow-y: auto;" class="relative">
          { #if $user.tokens.length > $user.profiles.length }
            <div class="rounded-lg w-full my-4 flex justify-center items-center">
              <Spinner size="25" />
              <p class="ml-4 text-xs">Загрузка профилей...</p>
            </div>
          { /if }

          <!-- Profiles list -->
          {#each $user.profiles as profile}
            <div on:click={(e) => {
              currentProfile = findProfile(profile.token);
              
              if (listEnabled) {
                listEnabled = false;
              };
            }} style="cursor: pointer" class="my-4 items-center hover:bg-gray-200 {currentProfile.token == profile.token ? "bg-gray-200 border-solid border-blue-600 border-2" : "bg-white"} border-solid border-white border-2 w-full flex justify-start py-4 px-4 md:px-8 rounded-lg">
              <div class="flex">
                <Avatar avatar={profile.avatar} username={profile.username} />
                
                <div class="ml-4">
                  <h1 class="text-semibold">{profile.username}</h1>
                  <p class="text-xs text-gray-700">{profile.email}</p>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Add new account -->
        <div on:click={(e) => {
          window.location.href = `/authorize/add?return=settings`;
        }} style="cursor: pointer" class="my-4 bg-gray-100 hover:bg-gray-300 bg-white w-full flex justify-start py-4 px-4 md:px-8 rounded-lg">
          <div class="flex">
            <img style="width: 2.5em; height: 2.5em;" class="mt-1" src="./icons/plus.svg" alt="Add icon">
            
            <div class="ml-4">
              <h1 class="text-semibold">Добавить аккаунт</h1>
              <p class="text-xs">Да-да, вы можете добавить ещё один аккаунт к данной сессии!</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full h-full bg-gray-200 pt-24 md:pt-0 {currentProfile.token != null ? "" : "flex justify-center items-center"}" style="overflow-y: auto; overflow-x: hidden;">
      { #if currentProfile.token == null }
        <div class="text-center">
          <h1 class="text-xl text-semibold text-gray-700">Выберите аккаунт</h1>
          <p class="text-sm text-gray-600">для того, что бы его настроить.</p>
        </div>
      { :else }
        <div class="flex flex-wrap">
          <!-- 
            User Profile picture
          -->
          <AvatarCard on:upload={(e) => {
            uploadAvatar(e.detail);
          }} avatar={currentProfile.avatar} username={currentProfile.username} />

          <!-- Profile name -->
          <div class="w-full md:w-1/2 px-4 my-4 relative">
            <div class="w-full h-full rounded-lg bg-white shadow-2xl px-4 py-6">
              {currentProfile.username}
            </div>
          </div>

          <!-- Approved applications -->
          <div class="w-full px-4 my-4 relative">
            <div class="w-full h-full rounded-lg bg-white shadow-2xl px-6 py-6">
              <div class="w-full mb-4 flex justify-center items-center">
                <div class="text-center">
                  <h1 class="text-xl text-semibold">Разрешенные приложения</h1>
                  <p class="text-gray-700 text-sm max-w-md">Этот список показывает те приложения, которые имеют право взаимодействовать с вашим аккаунтом как и когда они захотят.</p>
                </div>
                <!-- <p class="text-xs"></p> -->
              </div>

              <div class="relative">
                { #if currentProfile.approvedApplications.loading }
                  <div style="z-index: 2;" class="absolute inset-x-0 top-0 w-full h-full bg-white rounded-b-lg flex justify-center items-center py-6">
                    <Spinner size="35" />
                  </div>
                { /if }
                { #if currentProfile.approvedApplications.list.length <= 0 }
                  <div class="flex justify-center items-center mt-4">
                    <div class="max-w-sm text-center">
                      <h1 class="text-xl text-semibold text-gray-700">Тут пустовато</h1>
                      <p class="text-sm text-gray-600">это значит что вы ещё никому не давали доступа!</p>
                    </div>
                  </div>
                { :else }
                  {#each currentProfile.approvedApplications.list as application}
                    <ApplicationCard on:loading={(e) => {
                      currentProfile.approvedApplications.loading = e.detail;
                    }} on:update={(e) => {
                      loadApprovedApplications(currentToken);
                    }} application={application} time={application.time} currentToken={currentToken} />
                  {/each}
                { /if }
              </div>
            </div>
          </div>

          <!-- All user tokens -->
          <div class="w-full px-4 my-4 relative">
            <div class="w-full h-full rounded-lg bg-white shadow-2xl px-6 py-6">
              <div class="w-full mb-4 flex justify-center items-center">
                <div class="text-center">
                  <h1 class="text-xl text-semibold">Пользовательские токены</h1>
                  <p class="text-gray-700 text-sm max-w-md">Токены - это простой способ управления аккаунтом. Имея при себе токен пользователя человек может делать с аккаунтом всё что ему захочется.</p>
                </div>
                <!-- <p class="text-xs"></p> -->
              </div>

              <div class="relative">
                { #if currentProfile.tokens.loading }
                  <div style="z-index: 2;" class="absolute inset-x-0 top-0 w-full h-full bg-white rounded-b-lg flex justify-center items-center py-6">
                    <Spinner size="35" />
                  </div>
                { /if }
                { #if currentProfile.tokens.list.length <= 0 }
                  <div class="flex justify-center items-center mt-4">
                    <div class="max-w-sm text-center">
                      <h1 class="text-xl text-semibold text-gray-700">Тут пустовато</h1>
                      <p class="text-sm text-gray-600">это значит что вы ещё никому не давали доступа!</p>
                    </div>
                  </div>
                { :else }
                  <TokensScreen otherTokens={currentProfile.tokens.list.other} applicationTokens={currentProfile.tokens.list.applications}></TokensScreen>
                { /if }
              </div>
            </div>
          </div>
        </div>
      { /if }
    </div>
  </div>
</div>