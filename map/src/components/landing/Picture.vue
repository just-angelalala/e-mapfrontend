 <script setup>
import { ref } from "vue";

const responsiveOptions = ref([
  {
    breakpoint: '1400px',
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: '1199px',
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: '767px',
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: '575px',
    numVisible: 1,
    numScroll: 1,
  },
]);
</script>

<template>
  <div
    id="hero"
    class="flex flex-column justify-center items-center w-screen"
    style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%); height: 500px; width: 100vw;"
  >
    <div class="image-container flex justify-content-center w-full h-full bg-transparent">
      <img
        :src="'/layout/images/emap-landing.jpg'"
        class="image-content"
        style="width: 100%; height: 100%; object-fit: cover; display: block;"
      />
    </div>
  </div>
</template>

<style scoped>
#hero {
  position: relative;
  height: 500px; /* Set the height to ensure consistency */
  width: 100vw; /* Full width of the viewport */
}

.image-container {
  height: 100%; /* Match the height of the #hero container */
  width: 100%; /* Match the width of the #hero container */
}

.image-content {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cover the entire container without losing aspect ratio */
}

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.justify-center {
  justify-content: center;
}

.items-center {
  align-items: center;
}

.w-screen {
  width: 100vw; /* Full screen width */
}

.w-full {
  width: 100%; /* Full container width */
}

.h-full {
  height: 100%; /* Full container height */
}

.bg-transparent {
  background-color: transparent; /* Transparent background to avoid conflicts */
}
</style>
