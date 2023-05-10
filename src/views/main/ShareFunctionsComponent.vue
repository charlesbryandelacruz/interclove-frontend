<script>
  import moment from 'moment'
    export default {
        methods: {
            // checkAccess (dep, mod, axn) {
            //     axios.get('checkAccess',{
            //         params: {
            //             department_code: dep,
            //             module: mod,
            //             action: axn,
            //         }
            //     }).then(response => {
            //         this.userAccess[axn] =  response.data;
            //     });
            // },
            decimalOnly ($event) {
                let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
                if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
                    $event.preventDefault();
                }
            },
            numberOnly ($event) {
                let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
                if (keyCode < 48 || keyCode > 57) {
                    $event.preventDefault();
                }
            },
            thousandSeprator (amount) {
                if (amount !== '' || amount !== undefined || amount !== 0 || amount !== '0' || amount !== null) {
                    return amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
                } else {
                    return amount;
                }
            },
            round(value, decimals) {
                return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals).toFixed(decimals).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            },
            getTwoDecimals (amount, places = 2) {
                var formatted_amount = ''
                if(isNaN(amount)){
                    if(amount != null && amount != ''){
                        formatted_amount = parseFloat(amount.replace(/,/g, ''))
                        formatted_amount = Math.trunc(formatted_amount * Math.pow(10, places)) / Math.pow(10, places)
                    }
                }else{
                    formatted_amount = Math.trunc(amount * Math.pow(10, places)) / Math.pow(10, places)
                }

                if (formatted_amount == '') {
                    return 0.00
                }
                return this.thousandSeprator(formatted_amount.toFixed(places))
            },
            getDatesFromRange(startDate, endDate, return_type = 'array') {
                var dates = []
                var currDate = moment(startDate).startOf('day')
                var lastDate = moment(endDate).startOf('day')

                while(currDate.diff(lastDate) <= 0) {
                    switch (return_type) {
                        case 'array':
                            dates.push(currDate.clone().format('YYYY-MM-DD'))
                            break
                        case 'object':
                            dates.push(Object.assign({},{
                                value: currDate.clone().format('YYYY-MM-DD'),
                                text: currDate.clone().format('YYYY-MM-DD (dddd)')
                            }))
                            break
                        default:
                    }
                    currDate = currDate.add(1, 'days')
                }
                return dates
            },
            upperCaseFirstLetter(str){
                const arr = str.split(" ");
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
                }
                str = arr.join(" ");
                return str
            },
            ConverToExcelJsColumns(data){
              if(!data.length > 0){
                  return []
              }
                let headers = data[0]
                return Object.keys(headers).map(e => {
                        return { header: this.upperCaseFirstLetter(e.replaceAll('_',' ')),key: e }
                    })
            },
            leadingZeros(number = 0,count = 4){

                let digitCount = number.toString().length
                let stringedNumber = number.toString()

                if(digitCount > count){
                    return 0
                }

                while(digitCount != count){
                    stringedNumber = '0' + stringedNumber
                    digitCount++
                }

                return stringedNumber;
            },

            arraySlice(array,count = 10){
                return array.reduce((resultArray, item, index) => {
                    const chunkIndex = Math.floor(index/count)

                    if(!resultArray[chunkIndex]) {
                        resultArray[chunkIndex] = [] // start a new chunk
                    }

                    resultArray[chunkIndex].push(item)

                    return resultArray
                    }, [])
            },

            formatCurrencyPHP(amount) {
                return parseFloat(amount).toLocaleString('en-PH', {style: 'currency', currency: 'PHP'});
            },

            sliceIntoChunks(arr, chunkSize) {
                const res = [];
                for (let i = 0; i < arr.length; i += chunkSize) {
                    const chunk = arr.slice(i, i + chunkSize);
                    res.push(chunk);
                }
                return res;
            },
            errorObjects(type){
                switch(type){
                    case 1:
                        return {
                            title:'Warehouse Not Found',
                            color:'#8271FA'
                        }
                    case 2:
                        return {
                            title:'Item Not Found',
                            color:'#71ADFA'
                        }
                    case 3:
                        return {
                            title:'Can\'t request at the sames warehouse',
                            color:'#FA7192'
                        }
                }
            },

            formatDate(value) {
                if (!value) {
                    return ''
                }
                return value.indexOf(":") != -1
                    ? new Date(Date.parse(value.replace(" ", "T") + ".000Z"))
                    : new Date(value);
            },
            formatDateandTime(value) {
                if (!value) {
                    return ''
                }
                return moment(String(value)).format('MM/DD/YYYY hh:mm A')
            },
        }
    }
</script>

