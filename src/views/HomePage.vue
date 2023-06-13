<template>
  <ion-page class="flex ion-justify-content-center ion-align-items-center">
    <ion-header :translucent="true">
      <ion-toolbar>
        <template v-if="!currentUser">
          <ion-title class="ion-text-center">Goal Tracker</ion-title>
        </template>
        <template v-else>
          <ion-title class="ion-text-center"> Goals from: {{ currentUser?.name }}</ion-title>
        </template>
      </ion-toolbar>
    </ion-header>


    <ion-content class="container ion-padding" :fullscreen="true">
      <template v-if="!currentUser">
        <div>
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
        </div>
      </template>

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
        <div>
          <ion-button class="ion-float-left" @click="addItemIsOpen = true">Add Goal</ion-button>
          <ion-button class="ion-float-right" @click="doLogout">Logout</ion-button>
        </div>
        <div style="clear: both">
          <div style="margin-top: 4.75rem">
            <div v-for="item in documents">
              <p>{{ item }}</p>
            </div>
          </div>
        </div>
      </template>

      <!-- CREATE ACCOUNT MODAL  -->
      <create-account-modal :isVisible="createAcctIsOpen" @onClose="doCreateAccount"></create-account-modal>

      <!-- CREATE GOAL MODAL  -->
      <add-goal-modal :isVisible="addItemIsOpen" @onClose="doAddItem"></add-goal-modal>

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
  onIonViewWillEnter
} from "@ionic/vue";
import { ref } from "vue";
import { close, logoIonic } from 'ionicons/icons';

import { useAppwriteAccount } from "../composables/useAppwriteAccount";
import { useAppwriteDB } from "../composables/useAppwriteDB";

import CreateAccountModal from "../components/CreateAccountModal.vue";
import AddGoalModal from "../components/AddGoalModal.vue";
import LoginModal from "../components/LoginModal.vue"

const { createAccount, getCurrentUser, login, logout } = useAppwriteAccount();
const { doCreateDocument, doListDocuments, documents } = useAppwriteDB();
const currentUser = ref();

const createAcctIsOpen = ref(false);
const loginIsOpen = ref(false);
const addItemIsOpen = ref(false);


onIonViewWillEnter(async () => {
  if (currentUser.value) {
    await doListDocuments();
  }

})

// check for user at startup
getCurrentUser().then(
  async (user) => {
    currentUser.value = user;
    await doListDocuments();
  },
  (error) => { }
);

const doAddItem = async (payload: null | { goal: string; description?: string }) => {
  addItemIsOpen.value = false;
  if (payload) {
    try {
      const resp = await doCreateDocument(payload, currentUser?.value.$id);
      if (resp.error) throw (resp.error);
      console.log(resp.data);
    } catch (error) {
      errorAlert("Error Creating New Goal", (error as Error).message);
    }
  }

};

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
