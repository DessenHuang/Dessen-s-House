(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-user-home-user-home"],{"0727":function(t,i,e){"use strict";var n;e.d(i,"b",(function(){return a})),e.d(i,"c",(function(){return s})),e.d(i,"a",(function(){return n}));var a=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("v-uni-view",{staticClass:"container"},[e("v-uni-view",{staticClass:"top-bar"},[e("v-uni-view",{staticClass:"top-bar-left"},[e("v-uni-image",{staticClass:"back",attrs:{src:"/static/images/register/left.png"},on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.toBack.apply(void 0,arguments)}}})],1),e("v-uni-view",{staticClass:"top-bar-right"},[e("v-uni-image",{staticClass:"more",attrs:{src:"/static/images/user-home/more.png"},on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.toUserDetail.apply(void 0,arguments)}}})],1)],1),e("v-uni-view",{staticClass:"bg"},[e("v-uni-view",{staticClass:"bg-white"}),e("v-uni-image",{staticClass:"bg-img",attrs:{src:""+t.user.iconPath,mode:"aspectFill"}})],1),e("v-uni-view",{staticClass:"main"},[e("v-uni-view",{staticClass:"user-head"},[e("v-uni-view",{staticClass:"icon-box"},[e("v-uni-image",{staticClass:"icon",attrs:{src:""+t.user.iconPath,mode:"aspectFill",animation:t.iconAnimationData}}),1===t.user.sex?e("v-uni-view",{staticClass:"sex-male sex-box",attrs:{animation:t.sexAnimationData}},[e("v-uni-image",{staticClass:"sex",attrs:{src:"/static/images/user-home/man.png"}})],1):t._e(),0===t.user.sex?e("v-uni-view",{staticClass:"sex-female sex-box",attrs:{animation:t.sexAnimationData}},[e("v-uni-image",{staticClass:"sex",attrs:{src:"/static/images/user-home/female.png"}})],1):t._e()],1)],1),e("v-uni-view",{staticClass:"user-info"},[e("v-uni-text",{staticClass:"name"},[t._v("昵称: "+t._s(t.user.name))]),e("v-uni-text",{staticClass:"intro"},[t._v(t._s(t.user.intro))])],1),e("v-uni-view",{staticClass:"bottom-box"},[e("v-uni-view",{staticClass:"add-box"},[0==t.isFriend?e("v-uni-button",{staticClass:"btn add",attrs:{type:"primary"},on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.addFriendAnimation.apply(void 0,arguments)}}},[t._v("加为好友")]):1==t.isFriend?e("v-uni-button",{staticClass:"btn del",attrs:{type:"primary"},on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.deleteWindow.apply(void 0,arguments)}}},[t._v("删除好友")]):t._e()],1)],1),e("v-uni-view",{staticClass:"add-msg",style:{height:t.height+"px",bottom:-+t.height+"px"},attrs:{animation:t.showAnimationData}},[e("v-uni-textarea",{staticClass:"content",attrs:{maxlength:"120"},model:{value:t.msg,callback:function(i){t.msg=i},expression:"msg"}})],1),e("v-uni-view",{staticClass:"add-bt",attrs:{animation:t.showAnimationData}},[e("v-uni-view",{staticClass:"cancel",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.addFriendAnimation.apply(void 0,arguments)}}},[t._v("取消")]),e("v-uni-view",{staticClass:"send",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.applyFriend.apply(void 0,arguments)}}},[t._v("发送")])],1)],1)],1)},s=[]},"1d75":function(t,i,e){"use strict";e.r(i);var n=e("8ac8"),a=e.n(n);for(var s in n)"default"!==s&&function(t){e.d(i,t,(function(){return n[t]}))}(s);i["default"]=a.a},"66ef":function(t,i,e){"use strict";e.r(i);var n=e("0727"),a=e("1d75");for(var s in a)"default"!==s&&function(t){e.d(i,t,(function(){return a[t]}))}(s);e("d4c6");var o,r=e("f0c5"),d=Object(r["a"])(a["default"],n["b"],n["c"],!1,null,"dbefc448",null,!1,n["a"],o);i["default"]=d.exports},"8ac8":function(t,i,e){"use strict";e("99af"),e("ac1f"),Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var n={data:function(){return{isShow:!1,showAnimationData:{},iconAnimationData:{},sexAnimationData:{},height:"",user:{},isFriend:0,token:"",msg:""}},onShow:function(){uni.$toLogin(),this.token=uni.getStorageSync("user").token,this.msg="".concat(uni.getStorageSync("user").name,"请求添加您为好友~"),this.getUserId(),this.getUserInfo()},onReady:function(){this.getHIght()},methods:{getUserId:function(){var t=getCurrentPages();this.user.id=t[t.length-1].options.id,this.jugeFriend(this.user.id)},jugeFriend:function(t){var i=this;uni.request({url:"".concat(this.serverUrl,"/search/isfriend"),data:{uid:uni.getStorageSync("user").id,fid:t},method:"POST",success:function(t){200===t.data.status?i.isFriend=1:400===t.data.status?i.isFriend=0:i.isFriend=2}})},getUserInfo:function(){var t=this;uni.request({url:"".concat(this.serverUrl,"/user/detail"),data:{id:this.user.id,token:this.token},method:"POST",success:function(i){if(300===i.data.status)return uni.navigateTo({url:"/pages/login/login"});var e=i.data.result;t.user={id:e._id,name:e.name,sex:e.sex,iconPath:"".concat(t.serverUrl,"/user/").concat(e.iconPath),intro:e.intro}}})},sendRequestSocket:function(t){this.socket.emit("request",t,this.user.id)},applyFriend:function(){var t=this;uni.request({url:"".concat(this.serverUrl,"/friend/applyfriend"),data:{uid:uni.getStorageSync("user").id,fid:this.user.id,msg:this.msg},method:"POST",success:function(i){if(200!==i.data.status)return uni.$showMsg("发送好友请求失败");uni.$showMsg("好友请求发送成功！"),t.addFriendAnimation(),t.sendRequestSocket({msg:t.msg,time:new Date})}})},deleteWindow:function(){var t=this;uni.showModal({title:"提示",content:"是否删除好友 ".concat(this.user.name),confirmColor:"#E1061E",success:function(i){i.confirm&&t.deleteFriend()}})},deleteFriend:function(){uni.request({url:"".concat(this.serverUrl,"/friend/deletefriend"),data:{uid:uni.getStorageSync("user").id,fid:this.user.id},method:"POST",success:function(t){if(200!==t.data.status)return uni.$showMsg("删除好友失败");uni.$showMsg("删除成功~"),setTimeout((function(){uni.navigateBack()}),1500)}})},toBack:function(){uni.navigateBack()},toUserDetail:function(){uni.navigateTo({url:"/pages/user-detail/user-detail?id=".concat(this.user.id)})},getHIght:function(){var t=this,i=uni.createSelectorQuery().in(this);i.select(".bg").boundingClientRect((function(i){t.height=i.height-186})).exec()},addFriendAnimation:function(){this.isShow=!this.isShow;var t=uni.createAnimation({duration:500,timingFunction:"ease"}),i=uni.createAnimation({duration:500,timingFunction:"ease"}),e=uni.createAnimation({duration:0,timingFunction:"linear"});this.isShow?(t.bottom(0).step(),e.opacity(0).step(),this.height<838?i.width("240rpx").height("240rpx").right("200rpx").top("120rpx").step():i.width("240rpx").height("240rpx").right("200rpx").step()):(t.bottom(-this.height).step(),e.opacity(1).step(),i.width("400rpx").height("400rpx").right(0).top(0).step()),this.showAnimationData=t.export(),this.sexAnimationData=e.export(),this.iconAnimationData=i.export()}}};i.default=n},c545:function(t,i,e){var n=e("f557");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var a=e("4f06").default;a("2725149f",n,!0,{sourceMap:!1,shadowMode:!1})},d4c6:function(t,i,e){"use strict";var n=e("c545"),a=e.n(n);a.a},f557:function(t,i,e){var n=e("24fb");i=n(!1),i.push([t.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.container[data-v-dbefc448]{padding-top:%?88?%}.top-bar[data-v-dbefc448]{z-index:100;display:flex;justify-content:space-between;align-items:center;border-bottom:solid 1px hsla(0,0%,80%,.8);position:fixed;top:0;width:100%;height:%?88?%}.top-bar-left[data-v-dbefc448]{\r\n  /* margin-left: 20rpx;\r\n */width:15%;display:flex;justify-content:center}.top-bar-center[data-v-dbefc448]{width:70%;font-size:%?40?%;display:flex;justify-content:center}.top-bar-right[data-v-dbefc448]{\r\n   /* margin-right: 20rpx;\r\n */width:15%;display:flex;justify-content:center}.top-bar[data-v-dbefc448]{border-bottom:none;background-color:null}.top-bar .top-bar-left .back[data-v-dbefc448]{width:%?48?%;height:%?48?%}.top-bar .top-bar-right .more[data-v-dbefc448]{width:%?56?%;height:%?56?%}.bg[data-v-dbefc448]{z-index:-2;position:fixed;top:0;left:0;width:100%;height:100%}.bg-white[data-v-dbefc448]{width:100%;height:100%}.bg-img[data-v-dbefc448]{z-index:-1;opacity:.4;position:absolute;top:%?-20?%;left:%?-20?%;width:110%;height:110%;-webkit-filter:blur(12px);filter:blur(12px)}.main .user-head[data-v-dbefc448]{display:flex;justify-content:center}.main .user-head .icon-box[data-v-dbefc448]{z-index:10;position:relative}.main .user-head .icon-box .sex-box[data-v-dbefc448]{z-index:11;display:flex;align-items:center;justify-content:center;position:absolute;bottom:%?24?%;right:%?24?%;width:32px;height:32px;border-radius:50%}.main .user-head .icon-box .sex-box .sex[data-v-dbefc448]{width:16px;height:16px}.main .user-head .icon-box .sex-male[data-v-dbefc448]{background-color:#5799ff}.main .user-head .icon-box .sex-female[data-v-dbefc448]{background-color:#ff5d5b}.main .user-head .icon-box .icon[data-v-dbefc448]{margin:auto;width:%?400?%;height:%?400?%;border-radius:24px;border:%?6?% solid #efefef;box-shadow:0 18px 20px 0 rgba(39,40,50,.1)}.main .user-info[data-v-dbefc448]{margin-top:%?40?%;padding:0 %?100?%;display:flex;flex-direction:column}.main .user-info .name[data-v-dbefc448]{text-align:center;font-size:26px;color:#272832;font-weight:400}.main .user-info .intro[data-v-dbefc448]{padding:%?20?% 0;text-align:left;font-size:14px;color:#272832;font-weight:200;letter-spacing:1px}.main .bottom-box[data-v-dbefc448],\r\n.main .add-bt[data-v-dbefc448]{position:fixed;bottom:0;display:flex;align-items:center;width:100%;height:%?124?%}.main .add-bt[data-v-dbefc448]{z-index:100;bottom:%?-124?%;justify-content:space-around}.main .bottom-box[data-v-dbefc448]{justify-content:center}.main .btn[data-v-dbefc448],\r\n.main .cancel[data-v-dbefc448],\r\n.main .send[data-v-dbefc448]{background-color:#ffe431;width:%?684?%;height:%?80?%;text-align:center;line-height:%?80?%;font-size:%?32?%;color:#272832;font-weight:400;border-radius:%?10?%}.main .del[data-v-dbefc448]{background-color:#e1061e;color:#fff}.main .cancel[data-v-dbefc448]{width:%?172?%;background:rgba(39,40,50,.1)}.main .send[data-v-dbefc448]{width:%?480?%}.main .add-msg[data-v-dbefc448]{z-index:2;position:fixed;width:100%;padding:0 28px;box-sizing:border-box;background-color:#fff;border-radius:20px 20px 0 0}.main .add-msg .content[data-v-dbefc448]{margin-top:%?170?%;padding:%?18?% %?22?%;box-sizing:border-box;width:100%;height:56%;background:#f3f4f6;border-radius:10px;font-size:%?32?%;color:#272832;font-weight:400}',""]),t.exports=i}}]);