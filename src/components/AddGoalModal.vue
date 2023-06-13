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
                <ion-title class="ion-text-center">Create New Goal</ion-title>
                <ion-buttons slot="end">
                    <ion-button color="success" @click="doSave">
                        Save
                        <ion-icon slot="end" :icon="checkmark"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>

        </ion-header>

        <ion-content :fullscreen="true">
            <ion-item>
                <ion-label position="stacked">Goal:</ion-label>
                <ion-input aria-label="Goal" ref="goalRef" type="text" placeholder="Goal"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="stacked">Description</ion-label>
                <ion-input aria-label="Description" ref="descriptionRef" type="text" placeholder="Description"></ion-input>
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
    IonIcon
} from "@ionic/vue";
import { ref } from 'vue';
import { checkmark, close } from 'ionicons/icons';

const props = defineProps<{ isVisible: boolean }>();
const emit = defineEmits<{
    (event: "onClose", payload: any): void;
}>();

const goalRef = ref();
const descriptionRef = ref();

const doSave = () => {
    emit("onClose", {
        goal: goalRef.value.$el.value,
        description: descriptionRef.value.$el.value,
    });
};

</script>