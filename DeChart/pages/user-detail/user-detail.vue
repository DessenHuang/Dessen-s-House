<template>
  <view class="container">
    <view class="top-bar">
      <view class="top-bar-left">
        <image class="back" src="/static/images/public/left.png" @tap="toBack"></image>
      </view>
      <view class="top-bar-center">详情</view>
      <view class="top-bar-right"></view>
    </view>

    <view class="user-info">
      <view class="user-info-top">
        <view class="item icon-item">
          <view class="item-left">
            <text class="title">头像</text>
          </view>
          <view class="item-right">
            <!-- 头像裁剪插件 -->
            <image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
            <image :src="cropFilePath" @tap="upload" class="icon"></image>

            <image class="forward" src="/static/images/public/right.png"></image>
          </view>
        </view>

        <view class="item">
          <view class="item-left">
            <text class="title">注册</text>
          </view>
          <view class="item-right">
            <view class="content">
              <uni-dateformat :date="user.time"></uni-dateformat>
            </view>
          </view>
        </view>
      </view>
      <view class="user-info-bottom">
        <view class="item" @tap="modifyMsg('昵称', user.name)">
          <view class="item-left">
            <text class="title">昵称</text>
          </view>
          <view class="item-right">
            <text class="content">{{user.name}}</text>
            <image class="forward" src="/static/images/public/right.png"></image>
          </view>
        </view>

        <view class="item" @tap="modifyMsg('签名', user.intro)">
          <view class="item-left">
            <text class="title">签名</text>
          </view>
          <view class="item-right">
            <text class="content">{{user.intro}}</text>
            <image class="forward" src="/static/images/public/right.png"></image>
          </view>
        </view>

        <view class="item">
          <view class="item-left">
            <text class="title">性别</text>
          </view>
          <!-- 登陆用户 -->
          <view class="item-right" v-if="isLoginUser">
            <!-- 性别选择器 -->
            <picker style="width: 100%;" @change="bindPickerChange" :value="index" :range="array">
              <view class="uni-input">{{array[index]}}</view>
            </picker>
            <image class="forward" src="/static/images/public/right.png"></image>
          </view>

          <!-- 访问其他用户 -->
          <block v-else>
            <view class="item-right" v-if="user.sex === 0">女</view>
            <view class="item-right" v-else-if="user.sex === 1">男</view>
            <view class="item-right" v-else>保密</view>
          </block>

        </view>

        <view class="item">
          <view class="item-left">
            <text class="title">生日</text>
          </view>
          <view class="item-right">
            <!-- 当前登陆用户 -->
            <!-- 日期选择器 -->
            <picker style="width: 100%;" mode="date" :value="user.birth" :start="startDate" :end="endDate"
              @change="bindDateChange" v-if="isLoginUser">
              <uni-dateformat :date="user.birth" format='yyyy/MM/dd'></uni-dateformat>
            </picker>

            <!-- 其他用户 -->
            <uni-dateformat :date="user.birth" format='yyyy/MM/dd' v-else></uni-dateformat>
            <image class="forward" src="/static/images/public/right.png"></image>
          </view>
        </view>

        <view class="item" @tap="modifyMsg('电话', user.phone)">
          <view class="item-left">
            <text class="title">电话</text>
          </view>
          <view class="item-right">
            <text class="content">{{user.phone}}</text>
            <image class="forward" src="/static/images/public/right.png"></image>
          </view>
        </view>

        <view class="item" @tap="modifyMsg('邮箱', user.email)">
          <view class="item-left">
            <text class="title">邮箱</text>
          </view>
          <view class="item-right">
            <text class="content">{{user.email}}</text>
            <image class="forward" src="/static/images/public/right.png"></image>
          </view>
        </view>

        <view class="item" @tap="modifyMsg('修改密码')" v-if="isLoginUser">
          <view class="item-left">
            <text class="title">密码</text>
          </view>
          <view class="item-right">
            <text class="content">******</text>
            <image class="forward" src="/static/images/public/right.png"></image>
          </view>
        </view>
      </view>
      <view class="logout-btn" @tap="logOutTip" v-if="isLoginUser">退出登陆</view>
    </view>

    <!-- 引入信息修改弹出层组件 -->
    <modify :showTitle="showTitle" :msg="msg" :showAnimationData="showAnimationData" @windowOff="windowOff"></modify>
  </view>
</template>

<script>
  // 导入头像裁剪插件库文件
  import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
  export default {
    components: {
      // 引入头像裁剪插件
      ImageCropper,
    },
    data() {
      // 日期选择器所需变量
      const currentDate = this.getDate({
        format: true
      })
      return {
        token: '',
        // 所访问用户数据对象
        user: {},
        // 弹出层判断值
        isShow: false,
        // 弹出层动画变量
        showAnimationData: {},
        // 弹出层标题
        showTitle: '',
        // 性别选择器存储数组
        array: ['女', '男', '保密'],
        // 当前性别索引
        index: 2,
        // 日期选择器所需变量
        date: currentDate,
        // 头像裁剪插件图片地址变量
        tempFilePath: '',
        cropFilePath: '', // 当前头像
        headimg: '',
        // 弹出层当前编辑内容
        msg: '',
        // 当前修改值类型
        type: '',
        // 当前登陆id
        currentId: ''
      }
    },
    computed: {
      // 日期选择器所需计算属性
      startDate() {
        return this.getDate('start');
      },
      endDate() {
        return this.getDate('end');
      },

      // 判断当前详情页用户是否为登陆用户
      isLoginUser() {
        return this.currentId === uni.getStorageSync('user').id ? true : false
      }
    },
    onLoad() {
      // 判断是否登陆
      uni.$toLogin()

      // 获取token
      this.token = uni.getStorageSync('user').token

      // 获取当前用户
      this.getUserId()

      // 获取用户数据
      this.getUserDetail()

    },
    methods: {
      // 返回函数
      toBack() {
        uni.navigateBack()
      },
      
      // 性别选择器函数
      bindPickerChange: function(e) {
        if (!this.isLoginUser) return

        // 更新性别
        uni.request({
          url: 'http://127.0.0.1:3000/user/update',
          data: {
            data: e.detail.value,
            id: this.user._id,
            type: 'sex'
          },
          method: 'POST',
          success: res => {
            this.getUserDetail()
          }
        })
      },
      // 日期选择器所需函数
      bindDateChange: function(e) {
        if (!this.isLoginUser) return

        // 更新生日
        uni.request({
          url: 'http://127.0.0.1:3000/user/update',
          data: {
            data: e.detail.value,
            id: this.user._id,
            type: 'birth'
          },
          method: 'POST',
          success: res => {
            console.log(res);
            this.getUserDetail()
          }
        })
      },
      getDate(type) {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (type === 'start') {
          year = year - 60;
        } else if (type === 'end') {
          year = year + 2;
        }
        month = month > 9 ? month : '0' + month;
        day = day > 9 ? day : '0' + day;
        return `${year}-${month}-${day}`;
      },

      // 头像裁剪插件所需函数
      upload() {
        if (!this.isLoginUser) return

        uni.chooseImage({
          count: 1, //默认9
          sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album", "camera"], //从相册选择
          success: (res) => {
            this.tempFilePath = res.tempFilePaths.shift();
          },
        });
      },
      confirm(e) {
        this.tempFilePath = "";
        this.cropFilePath = e.detail.tempFilePath;
        this.headimg = e.detail.tempFilePath
        
        // 上传图片到后台
        uni.uploadFile({
          url: `${this.serverUrl}/files/upload`,
          filePath: this.headimg,
          name: 'file',
          fileType: 'image',
          formData: {
            url: 'user',
            name: this.user._id
          },
          success: (uploadFileRes) => {
            // 接收返回的文件名称
            let backstr = uploadFileRes.data
            // 更新本地存储
            try {
              uni.setStorageSync('user', {
                'id': this.user._id,
                'name': this.user.name,
                'iconPath': backstr,
                'token': this.user.token
              })
            } catch (e) {
              console.log('数据存储发生错误!')
            }

            // 更新头像信息到后台
            this.updateIcon(backstr)

          },

          fail(e) {
            console.log("this is errormes " + e.message);
          },
        });

      },
      cancel() {
        console.log("canceled");
        this.tempFilePath = "";
      },

      // 更新头像信息到后台
      updateIcon(backstr) {
        uni.request({
          url: `${this.serverUrl}/user/update`,
          data: {
            id: this.user._id,
            type: 'iconPath',
            data: backstr
          },
          method: 'POST',
          success: res => {
            console.log(res)
          }
        })
      },

      // 窗口弹出动画
      modifyMsg(title, msg) {
        if (!this.isLoginUser) return

        this.isShow = !this.isShow
        this.showTitle = title
        this.msg = msg
        // 添加窗口弹出动画
        var showAnimation = uni.createAnimation({
          duration: 500,
          timingFunction: 'ease',
        })
        // 动画开始与结束
        if (this.isShow) {
          // 开始
          showAnimation.bottom(0).step()

          this.showTitle = title // 更新弹出层标题
        } else {
          // 结束
          showAnimation.bottom('-100%').step()
        }
        this.showAnimationData = showAnimation.export()
      },

      // 关闭弹窗
      windowOff(e) {
        this.modifyMsg()
        // 点击了取消
        if (!e) return

        // 点击了确定
        // 判断修改值类型
        if (e.type === '昵称') {
          this.type = 'name'
        } else if (e.type === '签名') {
          this.type = 'intro'
        } else if (e.type === '电话') {
          this.type = 'phone'
        } else if (e.type === '邮箱') {
          this.type = 'email'
        } else if (e.type === '修改密码') {
          this.type = 'password'
        }

        // 提交修改的值到服务器
        uni.request({
          url: `${this.serverUrl}/user/update`,
          data: {
            data: e.msg,
            id: this.user._id,
            type: this.type
          },
          method: 'POST',
          success: res => {
            this.getUserDetail()
          }
        })
      },

      // 获取当前用户id
      getUserId() {
        // 获取url路径的参数
        let curPage = getCurrentPages()

        // 挂载用户id, 优先获取url路径id值
        this.currentId = curPage[curPage.length - 1].options.id ? curPage[curPage.length - 1].options.id : uni
          .getStorageSync('user').id
      },

      // 获取当前用户数据
      getUserDetail() {
        // 无登陆数据跳转到登陆页
        if (!uni.getStorageSync('user')) {
          return uni.navigateTo({
            url: '/pages/login/login'
          })
        }

        uni.request({
          url: `${this.serverUrl}/user/detail`,
          data: {
            id: this.currentId,
            token: this.token
          },
          method: 'POST',
          success: res => {
            // 完善用户数据对象
            this.user = res.data.result

            // 完善头像链接
            this.cropFilePath = `${this.serverUrl}/user/${this.user.iconPath}`
            // 完善性别索引
            this.index = this.user.sex
          }
        })
      },
      
      // 退出登陆提示
      logOutTip () {
        uni.showModal({
        	title: '提示',
        	content: '确认退出登陆?',
          confirmColor: '#E1061E',
        	success: res => {
        		if (res.confirm) {
        			// 用户点击确定，退出登陆
              this.logOut()
        		} 
        	}
        })
      },
      
      // 退出登陆
      logOut () {    
        // 清除本地存储
        uni.clearStorageSync('user')
        
        uni.$showMsg('正在退出...')
        
        setTimeout(() => {
          // 跳转到登陆页面
          uni.navigateTo({
            url: '/pages/login/login'
          })
        }, 1000)
      },
    }
  }
</script>

<style lang="scss">
  // 引入top-bar公共样式
  @import url("@/commons/css/top-bar.scss");

  .top-bar {
    background-color: #fff;

    .top-bar-left {
      .back {
        width: 48rpx;
        height: 48rpx;
      }
    }
  }

  .user-info {
    padding-top: 32rpx;

    &-top,
    &-bottom {
      padding: 0 20rpx;

      .item {
        height: 56px;
        display: flex;
        align-items: center;

        &-left {
          width: 10%;
          margin-right: 5%;

          .title {
            text-align: center;
            font-size: 16px;
            color: #272832;
            font-weight: 400;
          }
        }

        &-right {
          width: 85%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .icon {
            width: 54px;
            height: 54px;
            border-radius: 10px;
          }

          .forward {
            width: 24px;
            height: 24px;
            opacity: 0.3;
          }

          .content {
            width: 80%;
            font-size: 16px;
            color: rgba(39, 40, 50, 0.60);
            font-weight: 400;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      .icon-item {
        height: 74px;
      }
    }

    .logout-btn {
      margin: auto;
      margin-top: 160rpx;
      width: 684rpx;
      height: 80rpx;
      border-radius: 10rpx;
      text-align: center;
      line-height: 80rpx;
      font-size: 32rpx;
      color: #FF5D5B;
      font-weight: 400;
    }
  }

  // .modify {
  //   z-index: 1000;
  //   position: fixed;
  //   bottom: -100%;
  //   width: 100%;
  //   height: 100%;
  //   background-color: #fff;

  //   &-header {
  //     display: flex;
  //     justify-content: space-between;
  //     align-items: center;
  //     padding: 0 24rpx;
  //     height: 88rpx;
  //     box-shadow: 0px 0.5px 0px 0px rgba(0,0,0,0.1);
  //     .cancel {
  //       font-size: 32rpx;
  //       color: #272832;
  //       font-weight: 400;
  //     }
  //     .title {
  //       font-size: 40rpx;
  //       color: #272832;
  //       font-weight: 400;
  //     }
  //     .confirm {
  //       font-size: 32rpx;
  //       color: #4AAAFF;
  //       font-weight: 400;
  //     }
  //   }

  //   &-main {
  //     margin-top: 24rpx;
  //     .content, .pwd {
  //       width: 90%;
  //       height: 386rpx;
  //       background: #F3F4F6;
  //       font-size: 32rpx;
  //       color: #272832;
  //       font-weight: 400;
  //       border-radius: 20rpx;
  //       margin: auto;
  //       padding: 20rpx;
  //     }
  //     .pwd {
  //       height: 48rpx;
  //       margin-bottom: 24rpx;
  //     }
  //   }
  // }
</style>
