<script setup>
import { computed, watch, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router'; // Import the useRouter function
import moment from 'moment';

const store = useStore();
const toast = useToast();
const router = useRouter(); // Access the router instance

const updateSession = (field, value) => {
    store.commit('pos/SET_START_SESSION_FIELD', { field, value });
};

const initial_cash = computed({
    get: () => store.state.pos.startSessionData.initial_cash,
    set: (value) => updateSession('initial_cash', value)
});

const notes = computed({
    get: () => store.state.pos.startSessionData.notes,
    set: (value) => updateSession('notes', value)
});

const visible = ref(false);

const startSession = async () => {
    try {
        await store.dispatch('pos/startSession');
        // After successfully starting the session, navigate to the POS route with the session ID
        const sessionId = store.state.pos.currentSessionId; // Access the current session ID from the store
        await router.push({ name: 'POS', params: { sessionId } });
    } catch (error) {

    }
};

const continueSession = async (sessionId) => {
    try {
        await store.dispatch('pos/addOrder', sessionId);
        await router.push({ name: 'POS', params: { sessionId } });
    } catch (error) {
        console.error('Error continuing session:', error);
    }
};

const sessions = computed(() => store.state.pos.sessions);
console.log(sessions.value);

watch(() => store.state.pos.successMessage, (newVal) => {
    if (newVal) {
        toast.add({ severity: 'success', summary: 'Success', detail: newVal, life: 3000 });
    }
}, { immediate: false });

watch(() => store.state.pos.errorMessage, (newVal) => {
    if (newVal) {
        toast.add({ severity: 'error', summary: 'Error', detail: newVal, life: 3000 });
    }
}, { immediate: false });

const fetchSessions = async () => {
    try {
        await store.dispatch('pos/fetchSessions');
    } catch (error) {
        console.error('Error fetching sessions:', error);
    }
};

onMounted(() => {
    fetchSessions();

});

const formatDateAndTime = (dateString) => {
    return moment(dateString).format('MMM DD, YYYY (ddd)|h:mm a').split('|');
};
</script>

<template>
    <Toast />
    <div class="flex flex-row gap-2 relative">
        <Fieldset class="flex-auto flex-row" unstyled style="height: 82vh; background-color: white;">
            <template #legend>
                <div class="flex align-items-center pl-2">
                    <span class="font-bold">Session</span>
                </div>
            </template>
            <Toolbar class="mb-3 p-1" style="background-color: inherit; border: 0px;">


                <template #start>
                    <!-- <Button icon="pi pi-cart-plus" class="p-button-success" label="New Session"
                        @click="visible = true" /> -->
                </template>
            </Toolbar>
            <div class="justify-content-start flex gap-2 flex-wrap  align-self-start">
                <Card v-for="session in sessions" :key="session.id" class="shadow-"
                    style="width: 17rem; max-width: 25rem; background-color: #f9fafb; box-shadow: none; border: 1px solid #ccc;">
                    <template #title>Session {{ session.id }}
                        <br><span style="font-size: 0.875rem;">{{ session.status }}</span>
                    </template>
                    <template #subtitle>
                        <div v-for="(part, index) in formatDateAndTime(session.start_time)" :key="index">{{ part }}
                        </div>
                        <div>
                            ₱{{ session.initial_cash }}
                        </div>
                    </template> <template #footer>
                        <div class="flex gap-3 mt-1">
                            <!-- <Button label="Close" severity="danger" outlined class="w-full" /> -->
                            <Button label="Continue" class="w-full" @click="continueSession(session.id)" />
                        </div>
                    </template>
                </Card>
            </div>
        </Fieldset>
    </div>

    <Dialog v-model:visible="visible" modal header="Session" :style="{ width: '25rem' }">
        <span class="p-text-secondary block">Cashier Name</span>
        <span class="p-text-secondary block mb-3">Time</span>
        <div class="flex flex-column gap-2 mb-3">
            <label for="posname">Opening Cash</label>
            <InputText id="posname" v-model="initial_cash" aria-describedby="posname-help" />
        </div>
        <div class="flex flex-column gap-2 mb-3">
            <label for="posname">Note</label>
            <InputText id="posname" v-model="notes" aria-describedby="posname-help" />
        </div>
        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
            <Button type="button" label="Open" @click="startSession()"></Button>
        </div>
    </Dialog>
</template>
