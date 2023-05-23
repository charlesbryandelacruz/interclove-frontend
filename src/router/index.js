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
Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
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
    component: Products
  },
  {
    path: '/price-list',
    name: 'price-list',
    component: PriceListComponent
  },
  {
    path: '/customers',
    name: 'customers',
    component: CustomerComponent
  },
  {
    path: '/suppliers',
    name: 'suppliers',
    component: SupplierComponent
  },
  {
    path: '/add-invoice',
    name: 'add-invoice',
    component: AddInvoiceDialog,
    props: { dialog: true }
  },
  {
    path: '/invoice-list',
    name: 'invoice-list',
    component: InvoiceListComponent,
  },
  {
    path: '/users-list',
    name: 'users-list',
    component: UserListComponent,
  },
  {
    path: '/salesmans',
    name: 'salesmans',
    component: SalesmanComponent,
  },
  {
    path: '/collection-list',
    name: 'collection-list',
    component: CollectionListComponent,
  },
  {
    path: '/add-collection',
    name: 'add-collection',
    component: AddCollectionDialog,
    props: { dialog: true }
  },
  {
    path: '/petty-cash',
    name: 'petty-cash',
    component: PettyCashComponent,
    props: { dialog: true }
  },
  {
    path: '/quotation-list',
    name: 'quotation-list',
    component: QuotationListComponent,
    props: { dialog: true }
  },
  {
    path: '/add-purchase',
    name: 'add-purchase',
    component: AddPurchaseDialog,
    props: { dialog: true }
  },
  {
    path: '/purchase-list',
    name: 'purchase-list',
    component: PurchaseListComponent,
  },
  {
    path: '/payment-list',
    name: 'payment-list',
    component: PaymentListComponent,
  },
]

const router = new VueRouter({routes, mode: 'history'});

export default router
