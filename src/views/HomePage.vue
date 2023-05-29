<template>
  <ion-page class="flex ion-justify-content-center ion-align-items-center">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title class="ion-text-center">Goal Tracker</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="container ion-padding" :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col size="12">
            <a target="_blank" href="https://appwrite.io/">
              <img src="@/assets/images/appwrite.png" />
            </a>
          </ion-col>
          <ion-col class="ion-text-center" size="12">
            <ion-icon :icon="close"></ion-icon>
          </ion-col>
          <ion-col class="ion-text-center" size="12">
            <a target="_blank" href="https://hashnode.com/">
              <img src="@/assets/images/hashnode.svg" />
            </a>
          </ion-col>
        </ion-row>
      </ion-grid>
      <p class="flex ion-text-center ion-justify-content-center ion-align-items-center">
        Simple Goal-Tracker built with Appwrite
        <img width="40" height="40" src="@/assets/images/appwrite.svg" />, Vue <img width="30" height="30"
          src="@/assets/images/vue.svg" /> and ionic<span><ion-icon size="large" :icon="logoIonic"></ion-icon></span>
      </p>
      <template v-if="!currentUser">
        <ion-grid>
          <ion-row>
            <ion-col><ion-button expand="full" color="primary" @click="loginIsOpen = true">Login</ion-button></ion-col>
            <ion-col><ion-button expand="full" color="medium"
                @click="createAcctIsOpen = true">Register</ion-button></ion-col>
          </ion-row>
        </ion-grid>
      </template>
      <template v-else>
        {{ currentUser }}
        <ion-button @click="doLogout">Logout</ion-button>
      </template>

      <!-- CREATE ACCOUNT MODAL  -->
      <create-account-modal :isVisible="createAcctIsOpen" @onClose="doCreateAccount"></create-account-modal>

      <!-- LOGIN MODAL  -->
      <login-modal :isVisible="loginIsOpen" @onClose="doLogin"></login-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  alertController,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
} from "@ionic/vue";
import { ref } from "vue";
import { close, logoIonic } from 'ionicons/icons';

import { useAppwriteAccount } from "../composables/useAppwriteAccount";
import CreateAccountModal from "../components/CreateAccountModal.vue";
import LoginModal from "../components/LoginModal.vue"

const { createAccount, getCurrentUser, login, logout } = useAppwriteAccount();
const currentUser = ref(null);

const createAcctIsOpen = ref(false);
const loginIsOpen = ref(false);

// check for user at startup
getCurrentUser().then(
  (user) => (currentUser.value = user),
  (error) => { }
);

const doLogin = async (payload: null | { email: string; password: string }) => {
  loginIsOpen.value = false;
  debugger;
  if (payload) {
    try {
      const { email, password } = payload;

      const loginResp = await login(email, password);
      if (loginResp?.error) throw loginResp.error;

      currentUser.value = loginResp?.data;
    } catch (error) {
      errorAlert("Error Creating Account", (error as Error).message);
    }
  }
};

const doLogout = async () => {
  try {
    const response = await logout();
    if (response?.error) throw response.error;
    currentUser.value = null;
  } catch (error) {
    errorAlert("Error Logging Out", (error as Error).message);
  }
};

const doCreateAccount = async (
  payload: null | { email: string; password: string; name: string }
) => {
  createAcctIsOpen.value = false;
  debugger;
  if (payload) {
    try {
      const { email, password, name } = payload;
      const createAccountResp = await createAccount(email, password, name);
      if (createAccountResp?.error) throw createAccountResp.error;

      const loginResp = await login(email, password);
      if (loginResp?.error) throw loginResp.error;

      currentUser.value = loginResp?.data;
    } catch (error) {
      errorAlert("Error Creating Account", (error as Error).message);
    }
  }
};

const errorAlert = async (title: string, message: string) => {
  const alert = await alertController.create({
    header: title,
    message: message,
    buttons: ["Ok"],
  });
  await alert.present();
};
</script>

<style scoped>
@media screen and (min-width: 576px) {
  .flex {
    display: flex;
  }
}

.container {
  max-width: 768px;
}

ion-icon {
  font-size: 80px;
}

img,
span {
  margin-left: 5px;
  vertical-align: middle;
}
</style>
