<template>
    <v-app>
        <v-row>
            <v-col class="text-left" cols="3">
                <v-card
                class="mx-auto"
                tile
              >
              <v-list dense>
                <v-subheader>REPORTS</v-subheader>
                <v-list-item-group
                  v-model="selectedItem"
                  color="primary"
                >
                  <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
                    @click="testing(item.value)"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              </v-card>
            </v-col>
        </v-row>
  
    </v-app>
  
</template>

<script>
import Swal from 'sweetalert2';
import AddProductsDialogVue from '../../dialog/AddProductsDialog.vue';
export default {
    name: 'PosLaravelVueProductComponent',

    data() {
        return {
            items:[
                {text:'POLYCARBONATE (100M)',value:1},
                {text:'STAINLESS SCREW',value:2},
                {text:'Laser Type Welding Machine',value:3},
                {text:'Polycarbonate Shutter',value:4},
                {text:'PLASTIC ENDCAP',value:5},
            ],
            headers: [
                { text: 'Name', value: 'a' },
                { text: 'UOM', value: 'b' },
                { text: 'SI PRICE', value: 'c' },
                { text: 'SI PRICE (10%)', value: 'd' },
                { text: 'DR PRICE', value: 'e' },
                { text: 'DR PRICE (10%)', value: 'f' },
                { text: 'DR PRICE (15%)', value: 'g' },
                { text: 'DR PRICE (20%)', value: 'h' },
                { text: 'SP PRICE 1', value: 'i' },
                { text: 'SP PRICE 2', value: 'j' },
                { text: 'Action', value: 'action' },
            ],
            unit_of_measures:[
                {text:'PCS',value:1},
                {text:'M',value:2},
                {text:'SET',value:3},
                {text:'BOX',value:4},
                {text:'KG',value:5},
                {text:'ROLLS',value:6},
            ],
            table_items:[
                { a: 'Laser Type Welding Machin', 
                    b: 159,
                    c: 6.0,
                    d: 24, 
                    e: 4.0, 
                    f: '1%',
                    g: 4.0, 
                    h: '1%',
                    i: 4.0, 
                    j: '1%',
                },
                { a: 'ALUMINUM CONNECTOR (6.0M)', 
                    b: 159,
                    c: 6.0,
                    d: 24, 
                    e: 4.0, 
                    f: '1%',
                    g: 4.0, 
                    h: '1%',
                    i: 4.0, 
                    j: '1%',
                },
                { a: 'RUBBER STRIP (1M)', 
                    b: 159,
                    c: 6.0,
                    d: 24, 
                    e: 4.0, 
                    f: '1%',
                    g: 4.0, 
                    h: '1%',
                    i: 4.0, 
                    j: '1%',
                },
                { a: 'SPRING', 
                    b: 159,
                    c: 6.0,
                    d: 24, 
                    e: 4.0, 
                    f: '1%',
                    g: 4.0, 
                    h: '1%',
                    i: 4.0, 
                    j: '1%',
                },
                { a: 'WINDING WHEEL', 
                    b: 159,
                    c: 6.0,
                    d: 24, 
                    e: 4.0, 
                    f: '1%',
                    g: 4.0, 
                    h: '1%',
                    i: 4.0, 
                    j: '1%',
                },
            ],
            addDialog:false
        };
    },

    mounted() {
        
    },

    methods: {
        testing(id){
            alert('Hello'+id)
        },
        closeDialog(){
            this.addDialog = false
        },
        showAddEditDialog(){
            this.addDialog = true
        },
        cancelItem(){
            Swal.fire({
            icon: 'warning',
            title: 'Are you sure you want to disable item?.',
            text: '',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,
            reverseButtons:true
            })
            .then((result) => {
                if (result.isConfirmed) {
                // Retry logic goes here
                }
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
        }
    },
    components:{
        AddProductsDialogVue
    }
};
</script>

<style lang="scss" scoped>

</style>