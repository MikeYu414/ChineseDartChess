import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

let app = createApp(App);
app.use(Antd);
app.mount('#app');
