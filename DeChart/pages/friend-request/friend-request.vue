<template>
  <view class="container">
    <view class="top-bar">
      <view class="top-bar-left">
        <image class="back" src="/static/images/public/left.png" @tap="toBack"></image>
      </view>
      <view class="top-bar-center">好友请求</view>
      <view class="top-bar-right"></view>
    </view>

    <view class="emprtyTip" v-if="emprtyRequest">暂无好友请求</view>

    <view class="request-list" v-else>
      <view class="item" v-for="(item, index) in requestList" :key="index">
        <view class="item-left">
          <image class="icon" :src="item.iconPath" @tap="toDetail(item.id)"></image>
        </view>
        <view class="item-right">
          <view class="item-right-top">
            <text class="name">{{item.name}}</text>
            <view class="option">
              <image class="refuse" src="/static/images/public/false.png" @tap="refuseTip(item.id, index)"></image>
              <image class="ok" src="/static/images/public/true.png" @tap="addFriend(item.id, index)"></image>
            </view>
          </view>
          <view class="item-right-bottom">
            <view class="msg">{{item.msg}}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 好友请求列表
        requestList: []
      }
    },
    computed: {
      // 判断是否存在好友请求
      emprtyRequest() {
        return this.requestList.length ? false : true
      }
    },
    onLoad() {
      // 判断是否已登陆
      uni.$toLogin()

      // 获取好友请求数据
      this.getFriendQuest()
    },
    methods: {
      // 返回跳转
      toBack() {
        uni.navigateBack()
      },
      
      // 跳转到用户详情页
      toDetail (id) {
        uni.navigateTo({
          url: `/pages/user-detail/user-detail?id=${id}`
        })
      },

      // 获取好友请求数据
      getFriendQuest() {
        uni.request({
          url: `${this.serverUrl}/index/getfriend`,
          data: {
            uid: uni.getStorageSync('user').id,
            state: 1
          },
          method: 'POST',
          success: res => {
            if (res.data.status !== 200) return res.data.err

            res.data.result.forEach(item => {
              let userDate = {
                id: item.id,
                name: item.name,
                iconPath: `${this.serverUrl}/user/${item.iconPath}`,
                msg: item.msg,
                time: item.lastTime
              }
              this.requestList = [...this.requestList, userDate]
            })
          }
        })
      },

      // 同意请求
      addFriend(id, index) {
        // 弹窗提示
        uni.$showMsg('已通过该好友请求~')

        // 删除对应请求项
        this.requestList.splice(index, 1)

        // 同步后台请求
        uni.request({
          url: `${this.serverUrl}/friend/updatefriendstate`,
          data: {
            uid: uni.getStorageSync('user').id,
            fid: id
          },
          method: 'POST',
          success: res => {
            console.log(res)
          }
        })
        
        // 向对方发送同意好友申请信息
        uni.request({
          url: `${this.serverUrl}/chart/insertmsg`,
          data: {
            uid: uni.getStorageSync('user').id,
            fid: id,
            msg: '已和对方成为好友，现在可以开始聊天啦~',
            type: 0
          },
          method: 'POST',
          success: res => {
          }
        })
      },

      // 拒绝请求弹窗提示
      refuseTip(id, index) {
        uni.showModal({
          title: '提示',
          content: `确定拒绝该好友请求？`,
          confirmColor: '#E1061E',
          success: res => {
            if (res.confirm) {
              // 用户点击确定，拒绝好友请求
              this.refuseQuest(id, index)
            }
          }
        })
      },

      // 拒绝请求
      refuseQuest(id, index) {
        // 删除对应请求项
        this.requestList.splice(index, 1)

        // 同步后台请求
        uni.request({
          url: `${this.serverUrl}/friend/deletefriend`,
          data: {
            uid: uni.getStorageSync('user').id,
            fid: id
          },
          method: 'POST',
          success: res => {
          }
        })
      }
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

  .emprtyTip {
    text-align: center;
    font-size: 38rpx;
    color: #cfcfcf;
    padding-top: 100rpx;
  }

  .request-list {
    padding: 20rpx 40rpx;
    width: 100%;
    box-sizing: border-box;

    .item {
      display: flex;
      width: 100%;
      height: 360rpx;
      border-radius: 36rpx;
      padding: 20rpx;
      margin: 32rpx 0;
      box-sizing: border-box;
      background-color: #FFE431;
      box-shadow: 0px 18px 20px 0px rgba(39, 40, 50, 0.1);

      &-left {
        width: 18%;

        .icon {
          width: 96rpx;
          height: 96rpx;
          border-radius: 50%;
        }
      }

      &-right {
        width: 82%;
        height: 100%;
        display: flex;
        flex-direction: column;

        &-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 48rpx;

          .name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 50%;
            font-size: 42rpx;
            font-weight: 400;
            color: #fff;
          }

          .option {
            image {
              width: 56rpx;
              height: 56rpx;
            }

            .refuse {
              padding: 0 20rpx;
            }
          }
        }

        &-bottom {
          display: flex;
          align-items: center;
          height: 100%;

          .msg {
            width: 100%;
            height: 100%;
            padding: 20rpx;
            color: rgba(255, 255, 255, .8);
            background-color: #009289;
            border-radius: 20rpx;
            box-sizing: border-box;
            font-size: 32rpx;
            font-weight: 400;
          }
        }
      }
    }
  }
</style>
