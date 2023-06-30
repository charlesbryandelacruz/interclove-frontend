<template>
    <div style="display:none">
        <table id="item_table">
            <thead>
                <tr>
                    <th>QTY</th>  
                    <th>UNIT</th>                
                    <th>ITEM</th>                
                    
                    <th>TOTAL</th>                
                </tr>
            </thead>
            <tbody>
                <tr v-for="(x,i) in invoice.invoice_items" :key="i">
                    <td>{{x.quantity}}</td> 
                    <td>{{x.uom}}</td> 
                    <td>{{x.item_name}}</td> 
                    
                    <td>{{thousandSeprator(x.total_price)}}</td>               
                </tr>
                <tr v-for="(x,i) in number_of_print_rows" :key="i">
                    <td></td> 
                    <td></td> 
                    <td></td>    
                    <td></td>   
                </tr>
                <tr>
                    <td colspan="3">Total</td> 
                    <td>{{thousandSeprator(totalAmount) }}</td> 
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import jsPDF from 'jspdf';
import 'jspdf-autotable';
export default {
    name: 'IntercloveFrontPrintInvoiceComponent',
    props:['invoice','print_financial','totalAmount'],
    data() {
        return {
            number_of_print_rows: 16,
        };
    },

    mounted() {
        
    },
    watch:{
        print_financial:{
            handler(val){
                if(val){
                    this.printFinancialReport();
                }
            },
        }
    },
    methods: {
        async printFinancialReport(){
            let doc = await new jsPDF('p', 'mm',[139.7,215.9]);
            for(let i = 0; i<4; i++){
                this.number_of_print_rows = this.number_of_print_rows - this.invoice.invoice_items.length;
                doc.setFont('Times-Roman','bold').setFontSize(16).text(48,8,'INTERCLOVE CO.')
                doc.setFont('Times-Roman','normal').setFontSize(7).text(46,11,'138A DPHP Compound, Balintawak, Caloocan City')

                doc.setFont('Times-Roman','bold').setFontSize(9).text(0,16,'DELIVERY RECEIPT')
                doc.setFont('Times-Roman','bold').setFontSize(9).text(120,14,'No. '+this.invoice.invoice_num)

                // doc.setFont('Times-Roman','normal').setFontSize(9).text(108,24,'Date:')
                // doc.line(115,25,139,25).setFontSize(9).text(116,24,this.invoice.invoice_date);

                // doc.setFont('Times-Roman','normal').setFontSize(9).text(0,30,'DELIVER TO:')
                // doc.line(20,31,139,31).setFontSize(9).text(21,30,this.invoice.customer_object.name);

                // doc.setFont('Times-Roman','normal').setFontSize(9).text(0,36,'TIN:')
                // doc.line(7,37,102,37).setFontSize(9).text(8,36,'');

                // doc.setFont('Times-Roman','normal').setFontSize(9).text(103,36,'Bus. / Style ')
                // doc.line(118,37,139,37).setFontSize(9).text(119,36,'');

                // doc.setFont('Times-Roman','normal').setFontSize(9).text(0,42,'ADDRESS:')
                // doc.line(16,43,139,43).setFontSize(9).text(17,42,this.invoice.address);

                // doc.setFont('Times-Roman','normal').setFontSize(9).text(0,48,'R.C No.')
                // doc.line(11,49,41,49).setFontSize(9).text(12,48,'');

                // doc.setFont('Times-Roman','normal').setFontSize(9).text(42,48,'Issued on')
                // doc.line(55,49,87,49).setFontSize(9).text(56,48,'');

                // doc.setFont('Times-Roman','normal').setFontSize(9).text(88,48,'Issued at')
                // doc.line(100,49,139,49).setFontSize(9).text(101,48,'');
        
                // doc.autoTable({
                //     html: '#item_table',
                //     theme: 'grid',
                //     startY:54,
                //     margin: {left: 0,},
                //     headStyles: {
                //         halign:'center',
                //         fillColor: '#ffffff',
                //         textColor: '#000000',
                //         lineWidth: .2,
                //         lineColor: '#000000',
                //     },
                //     styles: {
                //         fontSize: 8,
                //         lineWidth: .2, halign:'center',fillColor: '#ffffff',textColor: '#000000',lineColor: '#000000'
                //     },
                //     columnStyles: {
                //         0: {cellWidth: 18},
                //         1: {cellWidth: 18},
                //         2: {cellWidth: 75},
                //         3: {cellWidth: 27,halign:'right'},
                //     },
                // });
                // let y = doc.autoTable.previous.finalY + 6
                // doc.setFont('Times-Roman','normal').setFontSize(9).text(70,y,'Received the above items in good order and condition')

                // doc.setFont('Times-Roman','normal').setFontSize(9).text(77,y+11,'By:')
                // doc.line(82,y+12,139,y+12).setFontSize(9).text(83,y+11,'Charles Bryan A. Dela Cruz');

                // doc.setFont('Times-Roman','normal').setFontSize(9).text(86,y+15,'Cashier / Authorized Representative')

                // if (i < 3)doc.addPage()
            }
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
            this.$emit('resetPrint')
        },
        thousandSeprator(num){
            return new Intl.NumberFormat('en-US').format(num);
        },
    },
};
</script>

<style lang="scss" scoped>

</style>