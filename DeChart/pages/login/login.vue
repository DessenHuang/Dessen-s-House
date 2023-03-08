<template>
  <view class="container">
    <view class="top-bar">
      <view class="top-bar-left"></view>
      <view class="top-bar-right" @tap="toRegister">注册</view>
    </view>
    <view class="content">
      <view class="logo">
        <image src="/static/images/public/logo.png"></image>
      </view>
      <view class="info">
        <text class="title">登陆</text>
        <text class="intro">您好，欢迎来到DeChart!</text>
      </view>
      <view class="input-box">
        <input type="text" class="username" placeholder="用户名/邮箱" v-model="username" />
        <input type="password" class="password" placeholder="密码" v-model="password" />
        <text class="tips" v-if="loginError">输入用户名或密码错误 </text>
      </view>
      <view class="login-btn">
        <button class="login" type="primary" :class="{submit: loginOk}" @tap="submit">登陆</button>
      </view>
    </view>
    <!-- 测试 -->
    <image v-for="(item, index) in imgList" :key="index" :src="item"></image>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 用户名
        username: '',
        // 密码
        password: '',
        // 登陆错误
        loginError: false,
        // 图片列表（测试用）
        imgList: []
      };
    },
    computed: {
      // 判断是否符合登陆情况
      loginOk() {
        return this.username.length > 0 && this.password.length > 0 ? true : false
      }
    },
    methods: {
      // 跳转到注册页
      toRegister() {
        uni.navigateTo({
          url: '/pages/register/register'
        })
      },
      // 登陆
      submit() {
        if (!this.loginOk) return
        uni.request({
          url: 'http://127.0.0.1:3000/signIn/match',
          data: {
            data: this.username,
            pwd: this.password,
          },
          method: 'POST',
          success: res => {
            // 用户名或账户未注册
            if (res.data.status === 300) return uni.$showMsg('该用户未注册', 'error')
            // 密码错误
            if (res.data.status === 400) {
              uni.$showMsg('用户名或密码错误', 'error')
              // 密码置空
              return this.password = ''
            }

            // 存储用户信息到本地
            let {
              backData
            } = res.data
            try {
              uni.setStorageSync('user', {
                'id': backData.id,
                'name': backData.name,
                'iconPath': backData.iconPath,
                'token': backData.token
              })
            } catch (e) {
              console.log('数据存储发生错误!')
            }

            // 登陆成功，1.5秒后跳转到主页
            setTimeout(() => {
              uni.navigateTo({
                url: '/pages/index/index'
              })
            }, 1500)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .top-bar {
      width: 80%;
      height: 10vh;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;

      .top-bar-right {
        font-size: 36rpx;
        color: #333333;
        font-weight: 500;
      }
    }

    .content {
      width: 80%;

      .logo {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 300rpx;

        image {
          width: 192rpx;
          height: 192rpx;
        }
      }

      .info {
        display: flex;
        flex-direction: column;

        .title {
          font-size: 56rpx;
          color: #272832;
          font-weight: 500;
          font-family: PingFangSC-Medium;
          margin-bottom: 14rpx;
        }

        .intro {
          font-size: 40rpx;
          color: rgba(39, 40, 50, 0.50);
          font-weight: 400;
        }
      }

      .input-box {
        margin: 20rpx 0;

        input {
          padding: 40rpx 0;
          border-bottom: solid 1px #ccc;
          font-size: 36rpx;
          color: #272832;
          margin: 10rpx 0;
        }

        .tips {
          color: rgb(255, 93, 91);
        }
      }

      .login-btn {
        margin-top: 60rpx;

        .login {
          width: 520rpx;
          height: 96rpx;
          font-size: 32rpx;
          color: #272832;
          line-height: 96rpx;
          font-weight: 500;
          border-radius: 48rpx;
          background-color: #D4D4D6;
        }

        .submit {
          color: #333333;
          background-color: #FFE431;
        }
      }
    }
  }
</style>
