<template>
  <view class="container">
    <view class="top-bar">
      <view class="top-bar-left" @tap="toLogin">
        <image src="/static/images/register/left.png"></image>
      </view>
      <view class="top-bar-right"></view>
    </view>
    <view class="content">
      <view class="logo">
        <image src="/static/images/public/logo.png"></image>
      </view>
      <view class="info">
        <text class="title">注册</text>
      </view>
      <view class="input-box">
        <view class="input-container">
          <input type="text" class="username" placeholder="请取个名字" v-model="userInfo.username" />
          <text class="tips" v-if="isUsedSaved">用户名已存在</text>
        </view>
        <view class="input-container">
          <input type="text" class="e-mail" placeholder="请输入邮箱" v-model="userInfo.email" @blur="isEmailValid" />
          <text class="tips" v-if="isEmailSaved">邮箱格式有误 </text>
        </view>
        <view class="input-container">
          <input type="text" class="password" :password="!isClear" placeholder="请输入密码" v-model="userInfo.password" />
          <image class="view" src="/static/images/register/show.png" @click="tabPwdShow" v-if="isClear"></image>
          <image class="view" src="/static/images/register/hide.png" @click="tabPwdShow" v-else></image>
        </view>
      </view>
      <view class="register-btn">
        <button class="register" type="primary" :class="{submit: registerOk }" @tap="submit">注册</button>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        type: 'password',
        // 用户名是否可用
        isUsedSaved: false,
        // 邮箱是否可用
        isEmailSaved: false,
        // 密码显示隐藏
        isClear: false,
        // 用户注册信息
        userInfo: {
          username: '',
          email: '',
          password: ''
        }
      };
    },
    computed: {
      // 判断是否符合注册情况
      registerOk() {
        return this.userInfo.username.length > 0 && this.userInfo.email.length > 0 && this.userInfo.password.length >
          0 && !this.isUsedSaved && !this.isEmailSaved ? true : false
      }
    },
    methods: {
      // 密码显示隐藏
      tabPwdShow() {
        this.isClear = !this.isClear
        if (this.isClear) {
          this.type = 'text'
        } else {
          this.type = 'password'
        }
      },
      // 邮箱格式验证
      isEmailValid(e) {
        // 邮箱格式正则表达式
        let reg = /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/
        if (e.detail.value.length <= 0 || reg.test(e.detail.value)) {
          this.isEmailSaved = false
        } else {
          this.isEmailSaved = true
        }
      },
      // 跳转到登录页
      toLogin() {
        uni.navigateTo({
          url: '/pages/login/login'
        })
      },
      // 提交注册信息
      submit() {
        if (!this.registerOk) return
        // 先判断用户名或邮箱是否已被注册
        // 判断用户名是否已被注册
        uni.request({
          url: 'http://127.0.0.1:3000/signup/judge',
          data: {
            data: this.userInfo.username,
            type: 'name'
          },
          method: 'POST',
          success: (res) => {
            // 用户名已被注册
            if (res.data.result !== 0)  return uni.$showMsg('该用户名已注册', 'error')

            // 判断该邮箱是否已被注册
            uni.request({
              url: 'http://127.0.0.1:3000/signup/judge',
              data: {
                data: this.userInfo.email,
                type: 'email'
              },
              method: 'POST',
              success: (res) => {
                // 邮箱已被注册
                if (res.data.result !== 0) return uni.$showMsg('该邮箱已注册', 'error')

                // 注册账户
                uni.request({
                  url: 'http://127.0.0.1:3000/signup/add',
                  data: {
                    name: this.userInfo.username,
                    mail: this.userInfo.email,
                    pwd: this.userInfo.password
                  },
                  method: 'POST',
                  success: res => {
                    // 发送邮箱信息
                    uni.request({
                      url: 'http://127.0.0.1:3000/mail',
                      data: {
                        mail: this.userInfo.email,
                      },
                      method: 'POST'
                    })
                    
                    // 弹窗提示
                    uni.$showMsg('注册成功', 'success')
  
                    // 两秒后跳转到登录页
                    setTimeout(() => {
                      // 跳转到登录页
                      uni.navigateTo({
                        url: '/pages/login/login'
                      })
                    }, 2000)
                  }
                })
              }
            })
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

      .top-bar-left {
        image {
          width: 48rpx;
          height: 48rpx;
        }
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

      }

      .input-box {
        margin: 20rpx 0;

        .input-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: solid 1px #ccc;
        }

        input {
          padding: 10px 0;
          font-size: 28rpx;
          color: #272832;
          margin: 10rpx 0;
        }

        .tips {
          color: rgb(255, 93, 91);
          font-size: 28rpx;
          font-weight: 500;
        }

        .group {
          width: 42rpx;
          height: 32rpx;
        }

        .view {
          width: 40rpx;
          height: 40rpx;
        }
      }

      .register-btn {
        margin-top: 60rpx;

        .register {
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
