<template>
    <v-app>
        <v-container fluid>
            <v-card>
                <v-tabs
                v-model="tab"
                dark
                >
                <v-tab
                    v-for="item in items"
                    :key="item"
                >
                    {{ item }}
                </v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab">
                <v-tab-item
                    v-for="item in items"
                    :key="item"
                >
                <ProductComponent></ProductComponent>
                </v-tab-item>
                </v-tabs-items>
            </v-card>
        </v-container>
    </v-app>
  
</template>

<script>
import ProductComponent from './ProductComponent.vue';
export default {
    name: 'PosLaravelVueProductComponent',

    data() {
        return {
            tab: null,
            items: [
            'All','Active', 'Inactive', 'Damage'
            ],  
        };
    },

    mounted() {
        
    },

    methods: {
        
    },

    components:{
        ProductComponent
    }
};
</script>

<style lang="scss" scoped>

</style>