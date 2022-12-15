<template>
    <div class="page-wrapper">
        <h3>
            Suppliers
        </h3>
        <div>
            <button class="card-button" @click="onCreateSupplierOpenModal">Add New Supplier</button>
        </div>
        <Teleport to="body">
            <TheModal v-if="showCreateModal" @close-modal="showCreateModal = false">
                <template #header>
                    <h2>Create New Supplier</h2>
                </template>
                <template #body>
                    <div class="form">
                        <label for="name">Name</label>
                        <input type="text" id="name" v-model="newSupplier.name">
                        <label for="address">Address</label>
                        <input type="text" id="address" v-model="newSupplier.address">
                        <label for="phone">Phone</label>
                        <input type="text" id="phone" v-model="newSupplier.phone">
                        <label for="email">Email</label>
                        <input type="text" id="email" v-model="newSupplier.email">
                    </div>
                    <button @click="onCreateSupplier">Add Supplier</button>
                </template>
            </TheModal>
        </Teleport>
        <div class='content-wrapper'>
            <div class='content' v-if="suppliers">
                <div class='content-card' v-for='(supplier,sid,index) in suppliers' :key='index'>
                    <div class="content-card-content">
                        <span class="card-info">
                            <span>
                                <h3>{{supplier.name}}</h3>
                                <h5>{{supplier.email}}</h5>
                                <h5>{{supplier.tel}}</h5>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <div class='content-wrapper' v-else>
                <h2>no suppliers</h2>
            </div>
          
        </div>
    </div>
</template>
<script>
import { useSuppliersStore } from '../../stores/suppliers';
import { ref,reactive } from 'vue';
import TheModal from '../../components/common/TheModal.vue';
export default{
    components: {
        TheModal
    },
    setup(){
        const supplierStore = useSuppliersStore();
        const showCreateModal = ref(false)
        const newSupplier = reactive({
            name: '',
            address: '',
            tel: '',
            email: '',
        })
        function onCreateSupplierOpenModal(){
            showCreateModal.value = true
        }
        function onCreateSupplier(){
            if (Object.values(newSupplier).every((value) => value !== '')) {
                const unReactiveObj = { ...newSupplier }
                supplierStore.createSupplier(unReactiveObj)
                showCreateModal.value = false
            }
        }
        return {
            suppliers: supplierStore.suppliers,
            newSupplier,
            onCreateSupplierOpenModal,
            showCreateModal,
            onCreateSupplier
        }
    }
}
</script>
<style scoped>
.form{
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>