import { createApp } from 'vue'
import App from './App.vue'
import 'amfe-flexible'
import Vant from 'vant';
// import 'vant/lib/index.css';
import './assets/css/vant-custom-theme.css'
import './assets/css/index.less'
import router from './router/index.js'
import { filters } from './globalFilters/index.js'
import VConsole from 'vconsole';
import 'animate.css';


createApp(App)
  .use(Vant)
  .use(router)
  .use(filters)
  .mount('#app')

const isPc = () => {
  const userAgentInfo = navigator.userAgent;
  console.log(userAgentInfo);
  const Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"];
  let flag = true;
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

//如果不是生产环境并且不是pc设备那么就显示调试
if (process.env.NODE_ENV != "prod" && !isPc()) {
  console.log(process.env.NODE_ENV);
  const vConsole = new VConsole();
}

