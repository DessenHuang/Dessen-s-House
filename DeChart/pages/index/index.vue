<template>
  <view class="container">
    <view class="top-bar">
      <navigator class="top-bar-left" :url="`/pages/user-home/user-home?id=${id}`" hover-class="none">
        <image class="myIcon" :src="iconPath"></image>
      </navigator>
      <view class="top-bar-right">
        <image class="search" src="/static/images/index/search.png" @tap="toSearch"></image>
        <image class="add" src="/static/images/index/add.png" @tap="toBuildGroup"></image>
      </view>
    </view>
    <view class="list">
      <view class="apply" @tap="toFriendQuest">
        <view class="apply-left">
          <text class="tips" v-if="requests.tip !== 0">{{requests.tip}}</text>
          <image src="/static/images/index/add-friend.png"></image>
        </view>
        <view class="apply-right">
          <view class="info-box">
            <text class="nickname">好友请求</text>
            <view class="date">
              <uni-dateformat :date="requests.time" :threshold="[60000, 3600000]" format='yyyy/MM/dd hh:mm:ss'>
              </uni-dateformat>
            </view>
          </view>
          <view class="content">{{requests.msg}}</view>
        </view>
      </view>
      <block>
        <view class="list-item" v-for="(item, index) in friendList" :key="item.id" @tap="toChart(item)">
          <view class="list-item-left">
            <text class="tips" v-if="item.tip > 0">{{item.tip}}</text>
            <image :src="`${item.iconPath}`"></image>
          </view>
          <view class="list-item-right">
            <view class="info-box">
              <view class="nickname">{{item.name}}</view>
              <view class="date">
                <uni-dateformat :date="item.lastTime" :threshold="[60000, 3600000]" format='yyyy/MM/dd hh:mm:ss'>
                </uni-dateformat>
              </view>
            </view>
            <view class="content">{{item.msg}}</view>
          </view>
        </view>
      </block>
    </view>
  </view>
  </view>

</template>

<script>
  export default {
    data() {
      return {
        id: '',
        iconPath: '',
        token: '',
        // 好友列表
        friendList: [],
        // 好友请求
        requests: {},
      }
    },
    computed: {
      isEmperty() {
        return this.friendList.length === 0 ? true : false
      }
    },
    onLoad() {
      // 获取本地登陆数据
      this.getStorage()

      // 获取好友请求数据
      this.getFriendQuest()


      // socket注册
      this.join(this.id)

      // socket 接收聊天信息
      this.receiveSocket()

      // socket 接收群聊天信息
      this.receiveGroupSocket()

      // socket 接收好友请求信息
      this.receiveRequestSocket()

    },
    onShow() {
      // 获取本地登陆数据
      this.getStorage()

      // 获取好友列表
      this.getFriends()
    
      // 获取好友请求数据
      this.getFriendQuest()

    },
    methods: {
      // 获取本地登陆数据
      getStorage() {
        try {
          if (uni.getStorageSync('user')) {
            let userData = uni.getStorageSync('user')
            this.id = userData.id
            this.iconPath = `${this.serverUrl}/user/${userData.iconPath}`
            this.token = userData.token
          } else {
            // 无登陆数据跳转到登录页
            uni.navigateTo({
              url: '/pages/login/login'
            })
          }
        } catch (err) {
          console.log(err)
        }
      },

      // socket模块
      // 用户登陆socket注册
      join(uid) {
        this.socket.emit('login', uid)
      },

      // socket聊天数据接收
      receiveSocket() {
        this.socket.on('msg', msg => {
          // 更新所在群消息
          this.friendList.some(item => {
            if (item.id === msg.fromId) {
              // 重置列表顺序
              this.listSort(item, msg)
            }
          })
        })
      },

      // socket群消息接收
      receiveGroupSocket() {
        this.socket.on('groupMsg', (msg, gid) => {
          // 更新所在群消息
          this.friendList.some(item => {
            if (item.gid === gid) {
              // 更新消息提示
              this.updateGroupTip(item, 1)
              
              // 重置列表顺序
              this.listSort(item, msg)
            }
          })
        })
      },

      // socket好友请求数据接收
      receiveRequestSocket() {
        this.socket.on('request', msg => {
          this.getFriendQuest()
        })
      },
      
      // 重置列表顺序
      listSort (item, msg) {
        let data = {
          id: item.id,
          gid: item.gid,
          iconPath: item.iconPath,
          lastTime: msg.time,
          msg: msg.message,
          name: item.name,
          tip: item.tip+1,
          type: msg.types
        }
        if (data.type === 1) {
          data.msg = '[图片]'
        } else if (data.type === 2) {
          data.msg = '[位置]'
        }
        this.friendList.splice(this.friendList.indexOf(item), 1)
        this.friendList.unshift(data)
      },
      
      // 跳转到搜索页面
      toSearch() {
        uni.navigateTo({
          url: '/pages/search/search'
        })
      },

      // 跳转到新建群聊页面
      toBuildGroup() {
        uni.navigateTo({
          url: '/pages/build-group/build-group'
        })
      },

      // 跳转到好友请求页面
      toFriendQuest() {
        uni.navigateTo({
          url: '/pages/friend-request/friend-request'
        })
      },

      // 跳转到聊天窗口界面
      toChart(item) {
        // 判断当前跳转为好友聊天窗口或群聊窗口
        if (item.gid) {
          // 未读消息标记已读
          if (item.tip !== 0) this.updateGroupTip(item, 0)

          // 群聊窗口跳转
          uni.navigateTo({
            url: `/pages/chart-room/chart-room?gid=${item.gid}&&name=${item.name}`
          })
        } else {
          // 未读消息标记已读
          if (item.tip !== 0) this.updateTip(item.id)

          // 好友窗口跳转
          uni.navigateTo({
            url: `/pages/chart-room/chart-room?fid=${item.id}&&name=${item.name}`
          })
        }
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

            // 无好友请求消息
            if (res.data.result.length === 0) return this.requests.tip = 0

            this.requests = {
              msg: res.data.result[0].msg,
              tip: res.data.result.length,
              time: res.data.result[0].lastTime
            }
          }
        })
      },

      // 获取好友列表
      getFriends() {
        uni.request({
          url: `${this.serverUrl}/index/getfriend`,
          data: {
            uid: this.id,
            state: 0
          },
          method: 'POST',
          success: res => {
            try {
              let {
                result
              } = res.data
              // 列表置空
              this.friendList = []

              result.forEach(item => {
                // 完善头像链接
                item.iconPath = `${this.serverUrl}/user/${item.iconPath}`
                // 日期转化为时间戳
                item.lastTime = Date.parse(item.lastTime)
              })
              this.friendList = result

              // 获取群列表
              this.getGroups()
            } catch (e) {
              console.log(e)
            }
          }
        })
      },

      // 获取群聊列表
      getGroups() {
        uni.request({
          url: `${this.serverUrl}/index/getgroup`,
          data: {
            uid: this.id,
          },
          method: 'POST',
          success: res => {
            if (res.data.status !== 200 || res.data.result.length === 0) return

            let {
              result
            } = res.data

            result.forEach(item => {
              // 完善头像链接
              item.iconPath = `${this.serverUrl}/group/icon/${item.iconPath}`
              // 日期转化为时间戳
              item.lastTime = Date.parse(item.lastTime)

              // socket发送加入群请求
              this.socket.emit('group', item.gid)
            })

            this.friendList = [...this.friendList, ...result]

            // 好友列表按日期进行降序排序
             this.friendList.sort(this.compare('lastTime'))
          }
        })
      },

      // 好友列表排序
      compare(prop) {
        return (a, b) => {
          return b[prop] - a[prop] // 降序
        }
      },

      // 未读消息标记为已读
      updateTip(fid) {
        uni.request({
          url: `${this.serverUrl}/index/updateunreadmsg`,
          data: {
            uid: this.id,
            fid: fid,
            state: 1
          },
          method: 'POST',
          success: res => {
          }
        })
      },

      // 更新群的未读消息数提示
      updateGroupTip(item, type) {
        uni.request({
          url: `${this.serverUrl}/index/updategrouptip`,
          data: {
            uid: this.id,
            gid: item.gid,
            tip: type === 1 ? item.tip + 1 : 0
          },
          method: 'POST',
          success: res => {
            if (res.data.status === 200) this.getFriends()
          }
        })
      },
    }
  }
</script>

<style lang="scss">
  // 引入top-bar公共样式
  @import url("@/commons/css/top-bar.scss");

  // top-bar补充样式
  .top-bar {
    background-color: #fff;

    &-right {
      width: 24%;
    }

    .myIcon {
      width: 68rpx;
      height: 68rpx;
      border-radius: 10px;
      display: block;
    }

    .search {
      width: 60rpx;
      height: 60rpx;
      padding: 0 10rpx;
    }

    .add {
      width: 60rpx;
      height: 60rpx;
      padding: 0 10rpx;
    }

  }

  .list {
    margin-top: 10px;

    .apply {
      display: flex;
      align-items: center;
      padding: 20rpx;

      &-left {
        border-radius: 20rpx;
        background-color: #FFE431;
        margin-right: 10px;
        position: relative;

        .tips {
          position: absolute;
          top: -6rpx;
          left: 68rpx;
          z-index: 10;
          min-width: 20rpx;
          height: 36rpx;
          padding: 0 8rpx;
          background-color: $uni-color-warning;
          border-radius: $uni-border-radius-circle;
          font-size: $uni-font-size-sm;
          color: $uni-text-color-inverse;
          line-height: 36rpx;
          text-align: center;
        }

        image {
          width: 96rpx;
          height: 96rpx;
        }
      }

      &-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 80%;

        .info-box {
          display: flex;
          justify-content: space-between;

          .nickname {
            font-size: 36rpx;
            color: rgba(39, 40, 50, 1);
            margin-bottom: 5px;
          }

          .date {
            font-size: 24rpx;
            color: rgba(39, 40, 50, 0.4);
          }
        }

        .content {
          font-size: 28rpx;
          color: rgba(39, 40, 50, 0.6);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }

    &-item {
      display: flex;
      align-items: center;
      padding: 20rpx;

      &-left {
        margin-right: 10px;
        position: relative;

        .tips {
          position: absolute;
          top: -6rpx;
          left: 68rpx;
          z-index: 10;
          min-width: 36rpx;
          height: 36rpx;
          background-color: $uni-color-warning;
          border-radius: $uni-border-radius-circle;
          font-size: $uni-font-size-sm;
          color: $uni-text-color-inverse;
          line-height: 36rpx;
          text-align: center;
        }

        image {
          width: 96rpx;
          height: 96rpx;
          border-radius: 20rpx;
          // 当头像加载失败时显示该背景颜色
          background-color: $uni-bg-color;
        }
      }

      &-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 80%;

        .info-box {
          display: flex;
          justify-content: space-between;

          .nickname {
            font-size: 32rpx;
            color: rgba(39, 40, 50, 1);
            margin-bottom: 5px;
          }

          .date {
            font-size: 24rpx;
            color: rgba(39, 40, 50, 0.4);
          }
        }

        .content {
          font-size: 28rpx;
          color: rgba(39, 40, 50, 0.6);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
</style>
