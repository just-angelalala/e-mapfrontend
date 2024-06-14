<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import AppConfig from '@/layout/AppConfig.vue';
import EmailAndPassword from '@/components/auth/EmailAndPassword.vue';
import BasicInformation from '@/components/auth/BasicInformation.vue';
import PersonalDetails from '@/components/auth/PersonalDetails.vue';
import Address from '@/components/auth/Address.vue';

const { layoutConfig } = useLayout();
const store = useStore();
const currentStep = computed(() => store.state.auth.currentStep);

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div>
                        <EmailAndPassword v-if="currentStep === 1" />
                        <BasicInformation v-if="currentStep === 2" />
                        <PersonalDetails v-if="currentStep === 3" />
                        <Address v-if="currentStep === 4" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>