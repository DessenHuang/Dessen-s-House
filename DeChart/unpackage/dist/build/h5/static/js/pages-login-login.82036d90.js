(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-login-login"],{"10eb":function(t,n,e){var i=e("5a7e");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var a=e("4f06").default;a("fc3027d8",i,!0,{sourceMap:!1,shadowMode:!1})},"15d8":function(t,n,e){"use strict";var i;e.d(n,"b",(function(){return a})),e.d(n,"c",(function(){return o})),e.d(n,"a",(function(){return i}));var a=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("v-uni-view",{staticClass:"container"},[e("v-uni-view",{staticClass:"top-bar"},[e("v-uni-view",{staticClass:"top-bar-left"}),e("v-uni-view",{staticClass:"top-bar-right",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.toRegister.apply(void 0,arguments)}}},[t._v("注册")])],1),e("v-uni-view",{staticClass:"content"},[e("v-uni-view",{staticClass:"logo"},[e("v-uni-image",{attrs:{src:"/static/images/public/logo.png"}})],1),e("v-uni-view",{staticClass:"info"},[e("v-uni-text",{staticClass:"title"},[t._v("登陆")]),e("v-uni-text",{staticClass:"intro"},[t._v("您好，欢迎来到DeChart!")])],1),e("v-uni-view",{staticClass:"input-box"},[e("v-uni-input",{staticClass:"username",attrs:{type:"text",placeholder:"用户名/邮箱"},model:{value:t.username,callback:function(n){t.username=n},expression:"username"}}),e("v-uni-input",{staticClass:"password",attrs:{type:"password",placeholder:"密码"},model:{value:t.password,callback:function(n){t.password=n},expression:"password"}}),t.loginError?e("v-uni-text",{staticClass:"tips"},[t._v("输入用户名或密码错误")]):t._e()],1),e("v-uni-view",{staticClass:"login-btn"},[e("v-uni-button",{staticClass:"login",class:{submit:t.loginOk},attrs:{type:"primary"},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.submit.apply(void 0,arguments)}}},[t._v("登陆")])],1)],1),t._l(t.imgList,(function(t,n){return e("v-uni-image",{key:n,attrs:{src:t}})}))],2)},o=[]},"584a":function(t,n,e){"use strict";var i=e("10eb"),a=e.n(i);a.a},"5a7e":function(t,n,e){var i=e("24fb");n=i(!1),n.push([t.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.container[data-v-4746d2bf]{display:flex;flex-direction:column;align-items:center}.container .top-bar[data-v-4746d2bf]{width:80%;height:10vh;display:flex;justify-content:space-between;align-items:center;padding:10px 0}.container .top-bar .top-bar-right[data-v-4746d2bf]{font-size:%?36?%;color:#333;font-weight:500}.container .content[data-v-4746d2bf]{width:80%}.container .content .logo[data-v-4746d2bf]{display:flex;justify-content:center;align-items:center;height:%?300?%}.container .content .logo uni-image[data-v-4746d2bf]{width:%?192?%;height:%?192?%}.container .content .info[data-v-4746d2bf]{display:flex;flex-direction:column}.container .content .info .title[data-v-4746d2bf]{font-size:%?56?%;color:#272832;font-weight:500;font-family:PingFangSC-Medium;margin-bottom:%?14?%}.container .content .info .intro[data-v-4746d2bf]{font-size:%?40?%;color:rgba(39,40,50,.5);font-weight:400}.container .content .input-box[data-v-4746d2bf]{margin:%?20?% 0}.container .content .input-box uni-input[data-v-4746d2bf]{padding:%?40?% 0;border-bottom:solid 1px #ccc;font-size:%?36?%;color:#272832;margin:%?10?% 0}.container .content .input-box .tips[data-v-4746d2bf]{color:#ff5d5b}.container .content .login-btn[data-v-4746d2bf]{margin-top:%?60?%}.container .content .login-btn .login[data-v-4746d2bf]{width:%?520?%;height:%?96?%;font-size:%?32?%;color:#272832;line-height:%?96?%;font-weight:500;border-radius:%?48?%;background-color:#d4d4d6}.container .content .login-btn .submit[data-v-4746d2bf]{color:#333;background-color:#ffe431}',""]),t.exports=n},"65fe":function(t,n,e){"use strict";e.r(n);var i=e("ceba"),a=e.n(i);for(var o in i)"default"!==o&&function(t){e.d(n,t,(function(){return i[t]}))}(o);n["default"]=a.a},ceba:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i={data:function(){return{username:"",password:"",loginError:!1,imgList:[]}},computed:{loginOk:function(){return this.username.length>0&&this.password.length>0}},methods:{now:function(){uni.request({url:"http://127.0.0.1:3000/friend/updatefriendstate",data:{fid:"633d6cb3b38b534f38c746b0",uid:"63357d24f27bb9b695da2c4e"},method:"POST",success:function(t){console.log(t)}})},testFun:function(){uni.request({url:"http://127.0.0.1:3000/friend/applyfriend",data:{uid:"63357d24f27bb9b695da2c4e",fid:"63343f2bdee225b907285fc9",msg:"好友请求2"},method:"POST",success:function(t){console.log(t)}}),uni.request({url:"http://127.0.0.1:3000/friend/updatefriendstate",data:{uid:"63357d24f27bb9b695da2c4e",fid:"633d6cb3b38b534f38c746b0"},method:"POST",success:function(t){console.log(t)}}),uni.request({url:"http://127.0.0.1:3000/friend/deletefriend",data:{uid:"63357d24f27bb9b695da2c4e",fid:"633d6cb3b38b534f38c746b0"},method:"POST",success:function(t){console.log(t)}}),uni.request({url:"http://127.0.0.1:3000/index/getfriend",data:{uid:"63357d24f27bb9b695da2c4e",state:0},method:"POST",success:function(t){console.log(t)}}),uni.request({url:"http://127.0.0.1:3000/index/getlastmsg",data:{uid:"63357d24f27bb9b695da2c4e",fid:"63383423852ecf498314ab73"},method:"POST",success:function(t){console.log(t)}}),uni.request({url:"http://127.0.0.1:3000/index/updateunreadmsg",data:{uid:"63357d24f27bb9b695da2c4e",fid:"63383423852ecf498314ab73"},method:"POST",success:function(t){console.log(t)}}),uni.request({url:"http://127.0.0.1:3000/group/creategroup",data:{uid:"63357d24f27bb9b695da2c4e",name:"groupTest",iconPath:"user.png",users:["63357d24f27bb9b695da2c4e","63383423852ecf498314ab73","633d6cb3b38b534f38c746b0"]},method:"POST",success:function(t){console.log(t)}})},toRegister:function(){uni.navigateTo({url:"/pages/register/register"})},submit:function(){var t=this;this.loginOk&&uni.request({url:"http://127.0.0.1:3000/signIn/match",data:{data:this.username,pwd:this.password},method:"POST",success:function(n){if(300===n.data.status)return uni.$showMsg("该用户未注册","error");if(400===n.data.status)return uni.$showMsg("用户名或密码错误","error"),t.password="";var e=n.data.backData;try{uni.setStorageSync("user",{id:e.id,name:e.name,iconPath:e.iconPath,token:e.token})}catch(i){console.log("数据存储发生错误!")}setTimeout((function(){uni.navigateTo({url:"/pages/index/index"})}),1500)}})}}};n.default=i},fadf:function(t,n,e){"use strict";e.r(n);var i=e("15d8"),a=e("65fe");for(var o in a)"default"!==o&&function(t){e.d(n,t,(function(){return a[t]}))}(o);e("584a");var s,r=e("f0c5"),c=Object(r["a"])(a["default"],i["b"],i["c"],!1,null,"4746d2bf",null,!1,i["a"],s);n["default"]=c.exports}}]);