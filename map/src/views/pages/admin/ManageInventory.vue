<script setup>
import { onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
// Components
import Toolbar from '@/components/admin/inventory/Toolbar.vue';
import AddProduct from '@/components/admin/inventory/AddProduct.vue';
import UpdateQuantity from '@/components/admin/inventory/UpdateQuantity.vue';

const store = useStore();


onBeforeUnmount(() => {
  // Your cleanup or code to run before the component is unmounted
    store.dispatch('toggleProductDialog', false);
    store.dispatch('updateQuantityDialog', false);
  
    
});

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar/>
                <AddProduct/>
                <UpdateQuantity/>
        
            </div>
        </div>
    </div>
</template>

<style scoped>
    /* Your scoped styles here */
</style>