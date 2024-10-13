<script setup>
import { ref, onMounted, computed } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import OrderServices from '@/service/OrderServices';

const feedbacks = ref([]);
const orderService = new OrderServices();

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_RECEIPT;

const fetchFeedbacks = async () => {
    try {
        const response = await orderService.getFeedbacks();
        console.log(response.data);
        
        // Update the mapping to include a default fallback for the rating
        feedbacks.value = response.data.map(feedback => ({
            first_name: feedback.first_name ?? 'N/A',
            last_name: feedback.last_name ?? 'N/A',
            feedback: feedback.feedback ?? 'No feedback provided',
            rating: parseInt(feedback.rating) ?? 0, // Default to 0 if rating is not parseable
            avatar: 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png', // Default avatar
            feedback_photo: feedback.feedback_photo ?? null
        }));

        console.log(feedbacks.value);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
    }
};


onMounted(() => {
    fetchFeedbacks();
});


const { layoutConfig } = useLayout();
const logoUrl = computed(() => {
    return '/layout/images/logo-emap.jpg'
});


</script>

<template>
    <h3>Feedback</h3>
    <div class="card" v-if="feedbacks.length > 0">
        <Carousel :value="feedbacks" numVisible="1" numScroll="1">
        <template #item="slotProps">
            <Fieldset class="mb-3 p-3">
            <template #legend>
                <div class="flex align-items-center gap-2">
                    <Avatar :image="slotProps.data.avatar" shape="circle" />
                    <span class="font-bold">{{ slotProps.data.first_name }} {{ slotProps.data.last_name }}</span>
                </div>
            </template>
                <div class="flex flex-column">
                    <div v-if="slotProps.data.feedback_photo" class="text-center mt-2">
                        <Image :src="`${BASE_URL}/feedback/` + slotProps.data.feedback_photo"
                            alt="Feedback Photo"
                            class="w-full" width="100" />
                    </div>
                    <p v-else class="text-center mt-2 text-sm">No feedback photo available.</p>
                    <div class="flex justify-content-center my-3">
                        <div class="flex gap-2">
                            <Rating v-model="slotProps.data.rating" readonly :cancel="false" />
                        </div>
                    </div>
                    <div class="flex justify-content-center px-3">
                        <p class="m-0">{{ slotProps.data.feedback }}</p>
                    </div>
                    
                </div>
            </Fieldset>
        </template>
        </Carousel>
    </div>
    <div>
        <!-- footer starts here-->
        <div class="py-4 px-4 mx-0 lg:mx-8">
            <div class="grid justify-content-between">
                <div class="col-12 md:col-2">


                    <a @click="smoothScroll('#home')"
                        class="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">
                        <img :src="logoUrl" alt="Sakai Logo" width="50" height="50" class="mr-2" />
                        <h4 class="font-medium text-3xl text-900">MINDORO AUTO PARTS</h4>
                    </a>

                    <a @click="smoothScroll('#home')"
                        class="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">

                        <h5>FACEBOOK PAGE</h5>
                        <a href="https://www.facebook.com/profile.php?id=61566579271268"
                            target="_blank">Visit
                            Mindoro Auto Parts on Facebook</a>
                    </a>
                </div>

                <div class="col-12 md:col-10 lg:col-7">
                    <div class="flex justify-content-end flex-wrap">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.0117931978198!2d121.17418577576017!3d13.411596805077668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bce8b5d874e55d%3A0xd9fc5440e26d019d!2sMINDORO%20AUTO%20PARTS!5e0!3m2!1sen!2sph!4v1716303375965!5m2!1sen!2sph"
                            width="900" height="300" style="border-radius: 5px;" allowfullscreen="" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </div>
            <!-- footer ends here-->
        </div>
    </div>
</template>

<style scoped>
</style>