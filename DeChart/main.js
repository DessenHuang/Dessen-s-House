import App from './App'
//引入socket模块
import io from './components/socket/weapp.socket.io'


// 封装加载错误提示框方法
uni.$showMsg = function(title, icon = 'none') {
  uni.showToast({
    title: title,
    icon: icon,
    duration: 1000
  })
}

// 封装未登录时自动跳转到登陆页方法
uni.$toLogin = () => {
  if (!uni.getStorageSync('user')) {
    return uni.navigateTo({
      url: '/pages/login/login'
    })
  }
}

  // 服务器地址
  Vue.prototype.serverUrl = 'http://127.0.0.1:3000'
// socket服务地址
Vue.prototype.socket = io('http://127.0.0.1:8082')

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
