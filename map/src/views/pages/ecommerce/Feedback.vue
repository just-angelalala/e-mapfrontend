<script setup>
import { ref } from 'vue';



const value = ref('3');

const valuefeedback = ref('');

</script>


<template>
  <div class="card">
    
    <div class="flex justify-content-center">
        <Textarea v-model="valuefeddback" rows="5" cols="30" />
      
    </div>

    
    <div class=" flex justify-content-center" style="margin-top: 15px;">
        <Rating v-model="value" :cancel="false"  />
    </div>

    <div class=" flex justify-content-center" style="margin-top: 15px;">
        <Button label="Submit" />
    </div>
    
  </div>
  
</template>



<style scoped>

</style>
