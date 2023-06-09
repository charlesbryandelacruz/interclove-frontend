import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/main/Login.vue'
import Products from '../views/modules/products/ProductComponent.vue'
import HelloWorld from '../components/HelloWorld.vue'
import PriceListComponent from '../views/modules/products/PriceListComponent.vue'
import CustomerComponent from '../views/modules/partners/CustomerComponent.vue'
import SupplierComponent from '../views/modules/partners/SupplierComponent.vue'
import SalesmanComponent from '../views/modules/partners/SalesmanComponent.vue'
import AddInvoiceDialog from '../views/dialog/AddInvoiceDialog.vue'
import InvoiceListComponent from '../views/modules/receivables/InvoiceListComponent.vue'
import PurchaseListComponent from '../views/modules/receivables/PurchaseListComponent.vue'
import UserListComponent from '../views/modules/system/UserListComponent.vue'
import CollectionListComponent from '../views/modules/receivables/CollectionListComponent.vue'
import AddCollectionDialog from '../views/dialog/AddCollectionDialog.vue'
import PettyCashComponent from '../views/modules/payables/PettyCashComponent.vue'
import QuotationListComponent from '../views/modules/receivables/QuotationListComponent.vue'
import AddPurchaseDialog from '../views/dialog/AddPurchaseDialog.vue'
import PaymentListComponent from '../views/modules/receivables/PaymentListComponent.vue'
import PurchaseOrderListComponent from '../views/modules/receivables/PurchaseOrderListComponent.vue'
import ExpenseListComponent from '../views/modules/payables/ExpenseListComponent.vue'
import InventoryAdjustmentComponent from '../views/modules/products/InventoryAdjustmentComponent.vue'
import SalesReportComponent from '../views/modules/reports/SalesReportComponent.vue'
import CollectionReportComponent from '../views/modules/reports/CollectionReportComponent.vue'
import PurchaseReportComponent from '../views/modules/reports/PurchaseReportComponent.vue'
import PaymentReportComponent from '../views/modules/reports/PaymentReportComponent.vue'
import ExpenseReportComponent from '../views/modules/reports/ExpenseReportComponent.vue'
import InventoryReportComponent from '../views/modules/reports/InventoryReportComponent.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: HelloWorld
  },
  {
    path: '/login',
    name: 'login',

    component: Login
  },
  {
    path: '/products',
    name: 'products',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: Products
  },
  {
    path: '/price-list',
    name: 'price-list',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: PriceListComponent
  },
  {
    path: '/customers',
    name: 'customers',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: CustomerComponent
  },
  {
    path: '/suppliers',
    name: 'suppliers',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: SupplierComponent
  },
  {
    path: '/add-invoice',
    name: 'add-invoice',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: AddInvoiceDialog,
    props: { dialog: true }
  },
  {
    path: '/invoice-list',
    name: 'invoice-list',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: InvoiceListComponent,
  },
  {
    path: '/users-list',
    name: 'users-list',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: UserListComponent,
  },
  {
    path: '/salesmans',
    name: 'salesmans',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: SalesmanComponent,
  },
  {
    path: '/collection-list',
    name: 'collection-list',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: CollectionListComponent,
  },
  {
    path: '/add-collection',
    name: 'add-collection',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: AddCollectionDialog,
    props: { dialog: true }
  },
  {
    path: '/petty-cash',
    name: 'petty-cash',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: PettyCashComponent,
    props: { dialog: true }
  },
  {
    path: '/quotation-list',
    name: 'quotation-list',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: QuotationListComponent,
    props: { dialog: true }
  },
  {
    path: '/add-purchase',
    name: 'add-purchase',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: AddPurchaseDialog,
    props: { dialog: true }
  },
  {
    path: '/purchase-list',
    name: 'purchase-list',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: PurchaseListComponent,
  },
  {
    path: '/payment-list',
    name: 'payment-list',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: PaymentListComponent,
  },
  {
    path: '/purchase-order-list',
    name: 'purchase-order-list',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: PurchaseOrderListComponent,
  },
  {
    path: '/expense-list',
    name: 'expense-list',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },

    component: ExpenseListComponent,
  },
  {
    path: '/inventory-adjustment',
    name: 'inventory-adjustment',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },
    component: InventoryAdjustmentComponent,
  },
  {
    path: '/sales-report',
    name: 'sales-report',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },
    component: SalesReportComponent,
  },
  {
    path: '/collection-report',
    name: 'collection-report',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },
    component: CollectionReportComponent,
  },
  {
    path: '/purchase-report',
    name: 'purchase-report',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },
    component: PurchaseReportComponent,
  },
  {
    path: '/payment-report',
    name: 'payment-report',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },
    component: PaymentReportComponent,
  },
  {
    path: '/expense-report',
    name: 'expense-report',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },
    component: ExpenseReportComponent,
  },
  {
    path: '/inventory-report',
    name: 'inventory-report',
    beforeEnter: (to, from, next) => {
      if(!!localStorage.getItem('user_info')){
        next();
      }
      else{
        return next({ name: "login" });
      }
  },
    component: InventoryReportComponent,
  },
]
const router = new VueRouter({routes, mode: 'history'});

export default router
