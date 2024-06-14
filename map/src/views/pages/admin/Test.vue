<template>
    <div>
      <h1>Barcode Scanner Integration</h1>
      <p>Last Scanned Code: {{ lastScannedCode }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const lastScannedCode = ref('');
  const barcodeInput = ref('');
  let inputActiveTime = ref(Date.now());
  
  const handleKeyup = (e) => {
    // Check for Enter key
    if (e.keyCode === 13) {
      lastScannedCode.value = barcodeInput.value;
      console.log('Barcode processed:', lastScannedCode.value);
      // Process the barcode here, e.g., search in database, update state, etc.
      barcodeInput.value = ''; // Reset after processing
      inputActiveTime.value = Date.now(); // Reset the timer
    } else {
      // Only add to input if within a short time frame, typical of scanners
      if (Date.now() - inputActiveTime.value < 50) {
        barcodeInput.value += String.fromCharCode(e.keyCode);
      } else {
        barcodeInput.value = String.fromCharCode(e.keyCode);
      }
      inputActiveTime.value = Date.now();
    }
  };
  
  onMounted(() => {
    window.addEventListener('keyup', handleKeyup);
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('keyup', handleKeyup);
  });
  </script>
  