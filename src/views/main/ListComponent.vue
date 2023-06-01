<template>
    <v-card
        max-height="100vh"
        class="mr-0 pr-0"
        ripple
    >   
        <div v-if="loading">
            <v-progress-linear
            indeterminate
            color="cyan"
          ></v-progress-linear>
        </div>
        <div v-else>
            <v-list dense nav>
                <v-subheader>
                    <v-text-field
                    v-model="search"
                    class="mt-5"
                    dense
                    @keydown.enter="searchInArray()"
                    solo
                    label='Search'
                    prepend-inner-icon='mdi-magnify'
                  ></v-text-field>
                </v-subheader>
                <v-list-item-group
                    active-class="primary--text"
                >
                <v-list-item
                    v-for="(item, i) in searchItems.length > 0 ? searchItems : listItems"
                    :key="i"
                    @click="selectItem(item)"
                
                >
                    <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                </v-list-item-group>
            </v-list>
        </div>
        
    </v-card>
</template>

<script>
export default {
    name: 'IntercloveFrontListComponent',

    data() {
        return {
            loading:true,
            searchItems:[],
            search:''
        };
    },

    mounted() {
        
    },

    methods: {
        selectItem(item){
            this.$emit('selectedItem',item)
        },
        searchInArray(){
            let test = _.filter(this.listItems, ['name', this.search]);
            this.searchItems = test 
        }
    },
    props:[
        'listTitle','listItems'
    ],
    watch:{
        listItems(){
            this.loading = false
        }
    }
};
</script>

<style lang="scss" scoped>

</style>