<script setup>

</script>

<template>
    <div class="flex flex-row gap-2 relative">
        <Fieldset class="flex-grow-0 relative" style="height: 82vh; background-color: white;" unstyled>
            <template #legend>
                <div class="flex align-items-center pl-2">
                    <span class="font-bold">Receipt</span>
                </div>
            </template>
            Order no: 00000
            <DataTable :value="prodsucts" stripedRows tableStyle="">
                <Column field="name" header="Name"></Column>
                <Column field="quantity" header="Quantity"></Column>
                <Column field="subtotal" header="Subtotal"></Column>
                <Column field="action" header="Action"></Column>
            </DataTable>

        </Fieldset>

        <Fieldset class="flex-auto flex-row relative" unstyled style="background-color: white;">
            <template #legend>
                <div class="flex align-items-center pl-2">
                    <span class="font-bold">Payment</span>
                </div>
            </template>
            <!-- Numpad -->
            <div class="numpad absolute bottom-0 left-0 w-full p-1">
                <div class="flex flex-row gap-1 mb-1 ">
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        Visa</Button>
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        Gcash</Button>
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        Cash</Button>
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        Debit</Button>
                </div>
                <div class="flex flex-row gap-1 mb-1 ">
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        7</Button>
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        8</Button>
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        9</Button>
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        +10</Button>
                </div>
                <div class="flex flex-row gap-1 mb-1 ">
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        4</Button>
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        5</Button>
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        6</Button>
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        +20</Button>
                </div>
                <div class="flex flex-row gap-1 mb-1 ">
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        1</Button>
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        2</Button>
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        3</Button>
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        +50</Button>
                </div>
                
                <div class="flex flex-row gap-1 mb-1 ">
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        0</Button>
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        00</Button>
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">.
                    </Button>
                    <Button
                        class="flex-1 align-items-center justify-content-center p-button-success  h-5rem  font-bold border-round ">ewan
                    </Button>
                </div>
                <div class="flex flex-row gap-1 ">
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round p-button-plain">
                        <i class="pi pi-delete-left" style="font-size: 1.5rem"></i></Button>
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        Clear</Button>
                    <Button outlined
                        class="p-button-plain flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        Exact</Button>
                    <Button
                        class="p-button-success flex-1 align-items-center justify-content-center  h-5rem  font-bold border-round ">
                        Validate</Button>
                </div>
            </div>
        </Fieldset>
    </div>
</template>
