<template>
    <ion-modal :is-open="isVisible" @willDismiss="emit('onClose', null)">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button color="danger" @click="emit('onClose', null)">
                        <ion-icon slot="start" :icon="close"></ion-icon>
                        Cancel
                    </ion-button>
                </ion-buttons>
                <ion-title class="ion-text-center">Login</ion-title>
                <ion-buttons slot="end">
                    <ion-button color="success" @click="doSave">
                        Login
                        <ion-icon slot="end" :icon="checkmark"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>

        </ion-header>

        <ion-content :fullscreen="true">
            <ion-item>
                <ion-label position="stacked">E-Mail:</ion-label>
                <ion-input aria-label="E-Mail" ref="emailRef" type="email" placeholder="E-Mail"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="stacked">Password:</ion-label>
                <ion-input aria-label="Password" ref="passwordRef" type="password" placeholder="password"></ion-input>
            </ion-item>
        </ion-content>
    </ion-modal>
</template>

<script setup lang="ts">
import {
    IonContent,
    IonModal,
    IonButton,
    IonButtons,
    IonToolbar,
    IonTitle,
    IonHeader,
    IonItem,
    IonLabel,
    IonInput,
    IonIcon,
} from "@ionic/vue";
import { ref } from 'vue';
import { checkmark, close } from 'ionicons/icons';

const props = defineProps<{ isVisible: boolean }>();
const emit = defineEmits<{
    (event: "onClose", payload: any): void;
}>();

const emailRef = ref();
const passwordRef = ref();

const doSave = () => {
    emit("onClose", {
        email: emailRef.value.$el.value,
        password: passwordRef.value.$el.value,
    });
};

</script>