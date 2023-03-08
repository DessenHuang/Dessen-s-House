<template>
  <view class="container">
    <view class="top-bar">
      <view class="top-bar-left">
        <image class="back" src="/static/images/register/left.png" @tap="toBack"></image>
      </view>
      <view class="top-bar-right">
        <image class="more" src="/static/images/user-home/more.png" @tap="toUserDetail"></image>
      </view>
    </view>
    <view class="bg">
      <view class="bg-white"></view>
      <image class="bg-img" :src="`${user.iconPath}`" mode="aspectFill"></image>
    </view>
    <view class="main">
      <view class="user-head">
        <view class="icon-box">
          <image class="icon" :src="`${user.iconPath}`" mode="aspectFill" :animation="iconAnimationData"></image>
          <!-- 1是男 -->
          <view class="sex-male sex-box" :animation="sexAnimationData" v-if="user.sex === 1">
            <image class="sex" src="/static/images/user-home/man.png"></image>
          </view>
          <!--  0是女，2保密 -->
          <view class="sex-female sex-box" :animation="sexAnimationData" v-if="user.sex === 0">
            <image class="sex" src="/static/images/user-home/female.png"></image>
          </view>
        </view>
      </view>
      <view class="user-info">
        <text class="name">昵称: {{user.name}}</text>
        <text class="intro">{{user.intro}}</text>
      </view>
      <view class="bottom-box">
        <view class="add-box">
          <button class="btn add" type="primary" @tap="addFriendAnimation" v-if="isFriend == 0">加为好友</button>
          <button class="btn del" type="primary" @tap="deleteWindow" v-else-if="isFriend == 1">删除好友</button>
        </view>
      </view>

      <!-- 发送添加好友请求面板 -->
      <view class="add-msg" :style="{height: height+'px',bottom: - + height+'px'}" :animation="showAnimationData">
        <textarea class="content" v-model="msg" maxlength="120"></textarea>
      </view>
      <view class="add-bt" :animation="showAnimationData">
        <view class="cancel" @tap="addFriendAnimation">取消</view>
        <view class="send" @tap="applyFriend">发送</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 窗口弹出判断值
        isShow: false,
        // 窗口弹出动画变量
        showAnimationData: {},
        // 头像动画变量
        iconAnimationData: {},
        // 性别显示变量
        sexAnimationData: {},
        // 当前窗口高度
        height: '',
        // 用户信息
        user: {},
        // 判断是否为好友
        isFriend: 0,
        // 本地token
        token: '',
        // 好友申请输入框消息
        msg: ''
      };
    },
    onShow() {
      // 无登陆数据跳转到登陆页
      uni.$toLogin()
      
      // 获取token
      this.token = uni.getStorageSync('user').token
      // 完善好友申请发送消息
      this.msg = `${uni.getStorageSync('user').name}请求添加您为好友~`

      // 获取当前用户id
      this.getUserId()
      
      // 获取当前用户详情
      this.getUserInfo()
    },
    onReady() {
      this.getHIght()
    },
    methods: {
      // 获取当前用户id
      getUserId() {
        // 获取url路径的参数
        let curPage = getCurrentPages()

        // 挂载用户id
        this.user.id = curPage[curPage.length - 1].options.id
        // 判断当前用户是否为好友
        this.jugeFriend(this.user.id)
      },
      
      // 判断当前用户是否为好友(0不是好友, 1为好友， 2为自己)
      jugeFriend(id) {
        uni.request({
          url: `${this.serverUrl}/search/isfriend`,
          data: {
            uid: uni.getStorageSync('user').id,
            fid: id
          },
          method: 'POST',
          success: res => {
            if (res.data.status === 200) {
              this.isFriend = 1
            } else if (res.data.status === 400) {
              this.isFriend = 0
            } else {
              this.isFriend = 2
            }
          }
        })
      },
      
      // 获取用户详情
      getUserInfo() {
        uni.request({
          url: `${this.serverUrl}/user/detail`,
          data: {
            id: this.user.id,
            token: this.token
          },
          method: 'POST',
          success: (res) => {
            // token 不匹配跳转到登陆页
            if (res.data.status === 300) {
              return uni.navigateTo({
                url: '/pages/login/login'
              })
            }

            let {
              result
            } = res.data
            this.user = {
              id: result._id,
              name: result.name,
              sex: result.sex,
              iconPath: `${this.serverUrl}/user/${result.iconPath}`,
              intro: result.intro
            }
          }
        })
      },
      
      // socket发送好友请求数据到后台
      sendRequestSocket(e) {
        this.socket.emit('request', e, this.user.id)
      },
      
      // 发送好友请求
      applyFriend() {
        uni.request({
          url: `${this.serverUrl}/friend/applyfriend`,
          data: {
            uid: uni.getStorageSync('user').id,
            fid: this.user.id,
            msg: this.msg
          },
          method: 'POST',
          success: res => {
            if (res.data.status !== 200) return uni.$showMsg('发送好友请求失败')
            // 成功发送好友请求
            // 弹窗提示
            uni.$showMsg('好友请求发送成功！')

            // 关闭添加好友框
            this.addFriendAnimation()
            
            // socket发送好友请求数据到后台
            this.sendRequestSocket({
              msg: this.msg,
              time: new Date()
            })
          }
        })
      },
      
      // 删除好友提示
      deleteWindow () {
        uni.showModal({
        	title: '提示',
        	content: `是否删除好友 ${this.user.name}`,
          confirmColor: '#E1061E',
        	success: res => {
        		if (res.confirm) {
        			// 用户点击确定，删除好友
              this.deleteFriend()
              
        		} 
        	}
        })
      },
      
      // 删除好友操作
      deleteFriend () {
        uni.request({
          url: `${this.serverUrl}/friend/deletefriend`,
          data: {
            uid: uni.getStorageSync('user').id,
            fid: this.user.id
          },
          method: 'POST',
          success: res => {
            if (res.data.status !== 200) return uni.$showMsg('删除好友失败')
            
            // 删除成功，提示并跳转到上个页面
            uni.$showMsg('删除成功~')
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          }
        })
      },
      
      // 返回页面
      toBack() {
        uni.navigateBack()
      },
      
      // 跳转到用户详情页
      toUserDetail () {
        uni.navigateTo({
          url: `/pages/user-detail/user-detail?id=${this.user.id}`
        })
      },
      
      // 获取当前窗口高度
      getHIght() {
        const query = uni.createSelectorQuery().in(this);
        query.select('.bg').boundingClientRect(data => {
          this.height = data.height - 186
        }).exec();
      },

      // 点击加为好友触发动画
      addFriendAnimation() {
        this.isShow = !this.isShow
        
        // 添加窗口弹出动画
        var showAnimation = uni.createAnimation({
          duration: 500,
          timingFunction: 'ease',
        })
        // 头像动画
        var iconAnimation = uni.createAnimation({
          duration: 500,
          timingFunction: 'ease',
        })
        // 性别显示动画
        var sexAnimation = uni.createAnimation({
          duration: 0,
          timingFunction: 'linear',
        })
        // 动画开始与结束
        if (this.isShow) {
          // 开始
          showAnimation.bottom(0).step()
          sexAnimation.opacity(0).step()
          // 当前if判断设配平板
          if (this.height < 838) {
            iconAnimation.width('240rpx').height('240rpx').right('200rpx').top('120rpx').step()
          } else {
            iconAnimation.width('240rpx').height('240rpx').right('200rpx').step()
          }
        } else {
          // 结束
          showAnimation.bottom(-this.height).step()
          sexAnimation.opacity(1).step()
          iconAnimation.width('400rpx').height('400rpx').right(0).top(0).step()
        }
        this.showAnimationData = showAnimation.export()
        this.sexAnimationData = sexAnimation.export()
        this.iconAnimationData = iconAnimation.export()
      }
    }
  }
</script>

<style lang="scss">
  @import url("@/commons/css/top-bar.scss");

  .top-bar {
    border-bottom: none;
    background-color: null;

    .top-bar-left {
      .back {
        width: 48rpx;
        height: 48rpx;
      }
    }

    .top-bar-right {
      .more {
        width: 56rpx;
        height: 56rpx;
      }
    }
  }

  .bg {
    z-index: -2;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &-white {
      width: 100%;
      height: 100%;
      // background-color: #eee;
    }

    &-img {
      z-index: -1;
      opacity: .4;
      position: absolute;
      top: -20rpx;
      left: -20rpx;
      width: 110%;
      height: 110%;
      filter: blur(12px);
    }
  }

  .main {

    .user-head {
      display: flex;
      justify-content: center;

      .icon-box {
        z-index: 10;
        position: relative;

        .sex-box {
          z-index: 11;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          bottom: 24rpx;
          right: 24rpx;
          width: 32px;
          height: 32px;
          border-radius: 50%;

          .sex {
            width: 16px;
            height: 16px;
          }
        }

        .sex-male {
          background-color: rgb(87, 153, 255);
        }

        .sex-female {
          background-color: #FF5D5B;
        }

        .icon {
          margin: auto;
          width: 400rpx;
          height: 400rpx;
          border-radius: 24px;
          border: 6rpx solid #efefef;
          box-shadow: 0px 18px 20px 0px rgba(39, 40, 50, 0.1);
        }
      }
    }

    .user-info {
      margin-top: 40rpx;
      padding: 0 100rpx;
      display: flex;
      flex-direction: column;

      .name {
        text-align: center;
        font-size: 26px;
        color: #272832;
        font-weight: 400;
      }

      .intro {
        padding: 20rpx 0;
        text-align: left;
        font-size: 14px;
        color: #272832;
        font-weight: 200;
        letter-spacing: 1px;
      }
    }

    .bottom-box,
    .add-bt {
      position: fixed;
      bottom: 0;
      display: flex;
      align-items: center;
      width: 100%;
      height: 124rpx;
    }

    .add-bt {
      z-index: 100;
      bottom: -124rpx;
      justify-content: space-around;
    }

    .bottom-box {
      justify-content: center;
      // background-color: #eee;
    }

    .btn,
    .cancel,
    .send {
      background-color: #FFE431;
      width: 684rpx;
      height: 80rpx;
      text-align: center;
      line-height: 80rpx;
      font-size: 32rpx;
      color: #272832;
      font-weight: 400;
      border-radius: 10rpx;
    }
    
    .del {
      background-color: #E1061E;
      color: #ffff;
    }
    
    .cancel {
      width: 172rpx;
      background: rgba(39, 40, 50, 0.10);
    }

    .send {
      width: 480rpx;
    }

    .add-msg {
      z-index: 2;
      position: fixed;
      width: 100%;
      padding: 0 28px;
      box-sizing: border-box;
      background-color: #ffff;
      border-radius: 20px 20px 0 0;

      .content {
        margin-top: 170rpx;
        padding: 18rpx 22rpx;
        box-sizing: border-box;
        width: 100%;
        height: 56%;
        background: #F3F4F6;
        border-radius: 10px;
        font-size: 32rpx;
        color: #272832;
        font-weight: 400;
      }
    }
  }
</style>
