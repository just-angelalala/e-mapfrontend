<template>
    <div>
        <!-- footer starts here-->
        <div class="py-4 px-4 mx-0 mt-8 lg:mx-8">
                <div class="grid justify-content-between">
                    <div class="col-12 md:col-2" style="margin-top: -1.5rem">
                        <a @click="smoothScroll('#home')"
                            class="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">
                            <img :src="logoUrl" alt="Sakai Logo" width="50" height="50" class="mr-2" />
                            <h4 class="font-medium text-3xl text-900">MINDORO AUTO PARTS</h4>
                        </a>
                    </div>
                </div>
            </div>
<!-- footer ends here-->
    </div>
</template>


<script setup>

const smoothScroll = (id) => {
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
};
</script>