<template>
    <v-app>
        <v-row>
           
            <v-col class="text-left px-2 mt-2" cols="12">
                <v-card-title>
                    <v-row>
                        <v-col><h2>Sales Report</h2></v-col>
                        <v-spacer></v-spacer>
                        <v-col class="text-right" cols="2">
                            <v-text-field
                            dense
                            outlined
                            hide-details
                            v-model="search"
                            class="text-right mx-2 mb-2"
                            label="Search"
                            style="border-radius:15px"
                            >
                            </v-text-field>   
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-divider></v-divider>
                    <v-card-text>
                        <v-row>
                            <v-col cols="2">
                                <v-menu
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :return-value.sync="date_from"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="date_from"
                                        dense
                                        outlined
                                        label="Date From"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                    </template>
                                    <v-date-picker
                                    v-model="date_from"
                                    no-title
                                    scrollable
                                    >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="menu = false"
                                    >
                                        Cancel
                                    </v-btn>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="$refs.menu.save(date_from)"
                                    >
                                        OK
                                    </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="2">
                                <v-menu
                                    ref="menu2"
                                    v-model="menu2"
                                    :close-on-content-click="false"
                                    :return-value.sync="date_to"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="date_to"
                                        dense
                                        outlined
                                        label="Date To"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                    </template>
                                    <v-date-picker
                                    v-model="date_to"
                                    no-title
                                    scrollable
                                    >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="menu2 = false"
                                    >
                                        Cancel
                                    </v-btn>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="$refs.menu2.save(date_to)"
                                    >
                                        OK
                                    </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="2">
                                <v-autocomplete 
                                    v-model="customer_id" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Customer" 
                                    :items="customer_selection" 
                                    item-text="name"
                                    item-value="id"
                                    > 
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="2">
                                <v-autocomplete 
                                    v-model="salesman_id" 
                                    dense 
                                    outlined 
                                    hide-details 
                                    label="Salesman" 
                                    :items="salesman_selection" 
                                    item-text="name"
                                    item-value="id"
                                    > 
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="2">
                                <v-btn color="primary" @click="getAll()">
                                    Filter
                                </v-btn>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="2" class="text-right">
                                <v-btn color="success" @click="exportToExcel()" class="ma-1">
                                    Export
                                </v-btn>
                                <v-btn color="success" @click="printToPdf()" class="ma-1">
                                    Print
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-data-table
                                :headers="headers"
                                :items="items"
                                item-key="id"
                                :search="search"
                            >
                            <template v-slot:[`item.balance_amount`]="{ item }">
                                {{ item.balance_amount | currency('₱ ',2) }}
                            </template>
                            <template v-slot:[`item.paid_amount`]="{ item }">
                                {{ item.paid_amount | currency('₱ ',2) }}
                            </template>
                            <template v-slot:[`item.total_amount`]="{ item }">
                                {{ item.total_amount | currency('₱ ',2) }}
                            </template>
                            <template v-slot:[`item.created_at`]="{ item }">
                                {{ item.created_at | formatDate }}
                            </template>
                            <!-- <template v-slot:expanded-item="{ headers, item }">
                                <td :colspan="headers.length">
                                    <v-data-table
                                    :headers="collection_header"
                                    :items="item.invoice_items"
                                    :items-per-page="10"
                                    class="w-100"
                                    dense
                                    >
                                    <template v-slot:[`item.gross_amount`]="{ item }">
                                        {{ item.gross_amount | currency('₱ ',2) }}
                                    </template>
                                    <template v-slot:[`item.remaining_amount`]="{ item }">
                                        {{ item.remaining_amount | currency('₱ ',2) }}
                                    </template>
                                    <template v-slot:[`item.action`]="{ item }">
                                        <span v-if="item.remaining_amount != 0">
                                        <v-btn fab x-small icon text color="green" @click="approvePayment(item)" v-if="userAccess.approve"><v-icon>mdi-check</v-icon></v-btn>
                                        <v-btn fab x-small icon text color="red" @click="cancelPayment(item)" v-if="userAccess.cancel"><v-icon>mdi-cancel</v-icon></v-btn>
                                        </span>
                                    </template>
                                    </v-data-table>
                                </td>
                            </template> -->

                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
            </v-col>
            <div style="display: none;">
                <table id="div_logo">
                    <tbody>
                        <tr>
                            <td><p><span style="font-size: 18px; font-weight: bold;">INTERCLOVE CO.</span></p></td>
                        </tr>
                        <tr>
                            <td>138A DPHP Compound, Balintawak, Caloocan City<br>Contact us ; Tel. No: (02) 8711-6742 / 7717-4059</td>
                        </tr>
                        <tr>
                            <td><p><span style="font-size: 18px; font-weight: bold;">SALES REPORT</span></p></td>
                        </tr>
                    </tbody>
                </table>
                <table id="item_table">
                    <thead>
                        <tr>
                            <th>Invoice Date</th>  
                            <th>Invoice #</th>                
                            <th>Customer</th>                
                            <th>Salesman</th>                
                            <th>Total Amount</th>                
                            <th>Remarks</th>                              
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(x,i) in items" :key="i">
                            <td>{{x.invoice_date}}</td> 
                            <td>{{x.invoice_num}}</td> 
                            <td>{{x.customer_text}}</td> 
                            <td>{{x.salesman_text}}</td> 
                            <td>PHP {{thousandSeprator(x.total_amount)}}</td> 
                            <td>{{x.remarks}}</td>   
                        </tr>
                    </tbody>
                </table>
            </div>
        </v-row>
    </v-app>
</template>

<script>
import AddCustomersDialog from '../../dialog/AddCustomersDialog.vue';
import ListComponentVue from '@/views/main/ListComponent.vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment'
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
export default {
    name: 'PosLaravelVueProductComponent',

    data() {
        return {
            menu:'',
            menu2:'',
            date_from:moment().format('YYYY-MM-DD'),
            date_to:moment().format('YYYY-MM-DD'),
            customer_id:null,
            customer_selection:[],
            salesman_selection:[],
            item_selection:[],
            items:[],
            headers:[
                { text: 'Date', value: 'created_at',class:'grey lighten-2' },
                { text: 'Invoice #', value: 'invoice_num',class:'grey lighten-2' },
                { text: 'Customer', value: 'customer.company_name',class:'grey lighten-2' },
                { text: 'Salesman', value: 'salesman_text',class:'grey lighten-2' },
                // { text: 'Balance Amount', value: 'balance_amount',align:'right',class:'grey lighten-2' },
                // { text: 'Paid Amount', value: 'paid_amount',align:'right',class:'grey lighten-2' },
                { text: 'Total Amount', value: 'total_amount',align:'right',class:'grey lighten-2' },
                { text: 'Remarks', value: 'remarks',align:'right',class:'grey lighten-2' },
                
            ],
            collection_header:[
                { text: 'Reference #', value: 'reference_num' },
                { text: 'Transaction #', value: 'cheque_num' },
                { text: 'Transaction Date', value: 'transaction_date' },
                { text: 'Amount', value: 'gross_amount',align:'right' },
                { text: 'Remaining Amount', value: 'remaining_amount',align:'right' },
                { text: 'Payment Date', value: 'payment_date' },
                { text: 'Action', value: 'action' },
            ],
            search:'',
            userAccess:{
                approve:false,
                view:false,
                cancel:false
            },
            salesman_id:null
        };
    },

    mounted() {
        this.getAllSalesman();
        this.getAll();
        this.getAllCustomers();
    },
    methods: {
        getAll(){
            let payload = {
                date_range:[this.date_from,this.date_to],
                customer_id:this.customer_id,
                salesman_id:this.salesman_id,
            }
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-sales-report`,payload).then(response=>{
                this.items = response.data
            })
        },
        getAllCustomers(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-customers`).then(response=>{
                this.customer_selection = response.data
            })
        },
        exportToExcel(){
            let that = this
            const ExcelJS = require('exceljs')
            const workbook = new ExcelJS.Workbook();

            that.loading = true
            const worksheet = workbook.addWorksheet('Raw Data')
            worksheet.columns = [
                { header: 'Date', key: 'invoice_date' },
                { header: 'Invoice #', key: 'invoice_num' },
                { header: 'Customer', key: 'customer_text' },
                { header: 'Salesman', key: 'salesman_text' },
                { header: 'Total Amountt',key: 'total_amount' },
                { header: 'Remarks',key: 'remarks' },
            ]
            this.items.forEach((e, i) => {
               
                worksheet.addRow(e)
             
            });
            worksheet.getRow(`0${1}`).font = { bold: true }

            let exportName = `Sales Report - ${this.date_from} to ${this.date_to}`
            that.loading = false
            workbook.xlsx.writeBuffer().then((data) => {
                const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
                saveAs(blob, `${exportName}.xlsx`);
            });
        },
        printToPdf(){
            let doc = new jsPDF('p', 'mm', 'letter');
    
                    doc.autoTable({
                        html: '#div_logo',
                        theme: 'plain',
                        margin: {top: 5, left: 6, right: 6},
                        columnStyles: {
                            0: {halign:'center'},
                        },
                        
                        didParseCell: function(cell, val) {
                            if (cell.row.index === 0 || cell.row.index === 2) {
                                if(cell.styles != null){
                                    cell.styles.fontStyle = 'bold';
                                }
                            }
                        }
                    });
                    doc.autoTable({
                        html: '#item_table',
                        theme: 'grid',
                        margin: {top: 5, left: 6, right: 6},
                        columnStyles: {
                            0: {halign:'center', lineWidth: .2,
                            lineColor: '#000000',},
                            1: {halign:'center', lineWidth: .2,
                            lineColor: '#000000',},
                            2: {halign:'center', lineWidth: .2,
                            lineColor: '#000000',},
                            3: {halign:'center', lineWidth: .2,
                            lineColor: '#000000',},
                            4: {halign:'center', lineWidth: .2,
                            lineColor: '#000000',},
                            5: {halign:'center', lineWidth: .2,
                            lineColor: '#000000',},
                        },
                        headStyles: {
                            halign:'center',
                            fillColor: '#ffffff',
                            textColor: '#000000',
                            lineWidth: .2,
                            lineColor: '#000000',
                        },
                        didParseCell: function(cell, val) {
                            if (cell.row.index === 0 || cell.row.index === 2) {
                                if(cell.styles != null){
                                    cell.styles.fontStyle = 'bold';
                                }

                            }
                        }
                    });
                    doc.setFontSize(8);
                
                let pageCount = doc.internal.getNumberOfPages();
                
                for(let i = 0; i < this.items.length; i++) {
                    doc.setPage(i);
                    let pageCurrent = doc.internal.getCurrentPageInfo().pageNumber;
                    doc.setFontSize(8).setFont(undefined, 'normal').text('NO. '+pageCurrent + '/' + pageCount, doc.internal.pageSize.width - 26,29 );
                }

                    doc.autoPrint();
                    window.open(doc.output('bloburl'), '_blank');
            
        },
        thousandSeprator(num){
            return new Intl.NumberFormat('en-US').format(num);
        },
        getAllSalesman(){
            axios.post(`${process.env.VUE_APP_HOST_API}/api/get-all-salesmans`).then(response=>{
                this.salesman_selection = response.data
            })
        },
    },  
    components:{
      
    },
};
</script>

<style lang="scss" scoped>

</style>