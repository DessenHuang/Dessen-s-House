<template>
  <view class="container">
    <view class="top-bar">
      <view class="top-bar-left">
        <image class="back" src="/static/images/public/left.png" @tap="toBack"></image>
      </view>
      <view class="top-bar-center">邀请好友</view>
      <view class="top-bar-right"></view>
    </view>

    <view class="head">
      <image :src="gIcon" class="g-icon"></image>
      <view class="group-name">{{gName}}</view>
      <view class="title">用户</view>
    </view>

    <view class="users" scroll-y="true">
      <view class="users-list">
        <view class="users-list-item" v-for="(item, index) in applyUsers" :key="index">
          <view class="tag">
            <!-- 选中 -->
            <image src="/static/images/public/selected.png" @tap="tabSelect(item, index)" v-if="item.selected"></image>
            <!-- 未选中 -->
            <image src="/static/images/public/select.png" @tap="tabSelect(item, index)" v-else></image>
          </view>
          <view class="user-info">
            <image class="icon" :src="item.iconPath"></image>
            <text class="name">{{item.name}}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom">
      <!-- 未勾选状态 -->
      <view class="button" v-if="selectedTotal === 0">邀请</view>
      <!-- 已勾选状态 -->
      <view class="button btn-selected" @tap="apply" v-else>邀请({{selectedTotal}})</view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 群主id
        id: '',
        // 群id
        gid: '',
        // 群头像
        gIcon: '',
        // 群名
        gName: '',
        // 我的好友列表
        myFriends: [],
        // 可邀请好友列表
        applyUsers: [],
        // 已选中好友列表
        selectedFriends: [],
        // 群昵称
        groupName: '',
      }
    },
    onLoad() {
      // 无登陆数据跳转到登陆页
      uni.$toLogin()
      
      // 获取群主id
      this.getId()

      // 获取群详情
      this.getGroupInfo()
      
      // 获取好友列表
      this.getFriends()
    },
    
    computed: {
      selectedTotal() {
        let count = 0
        this.applyUsers.forEach(item => {
          if (item.selected) count += 1
        })
        return count
      }
    },
    
    watch: {
      myFriends: {
        handler: function () {
          this.$forceUpdate()
        },
        immediate: true
      }
    },
    
    methods: {
      // 获取id
      getId() {
        // 挂载用户id
        this.id = uni.getStorageSync('user').id

        // 获取url路径的参数
        let curPage = getCurrentPages()

        // 挂载群id
        this.gid = curPage[curPage.length - 1].options.gid
      },

      // 返回
      toBack() {
        uni.navigateBack()
      },

      // 获取群详情
      getGroupInfo() {
        uni.request({
          url: `${this.serverUrl}/group/detail`,
          data: {
            gid: this.gid
          },
          method: 'POST',
          success: res => {
            if (res.data.status === 200) {
              let {
                result
              } = res.data
              this.gIcon = `${this.serverUrl}/group/icon/${result.iconPath}`
              this.gName = result.name
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
            if (res.data.status !== 200) return console.log('获取好友列表失败')
            let {
              result
            } = res.data
            
           result.forEach(item => {
             let user = {
               id: item.id,
               name: item.name,
               iconPath: `${this.serverUrl}/user/${item.iconPath}`,
               selected: false
             }
             this.myFriends.push(user)
           })
            
            // 获取可邀请好友列表
            this.getMembers()
          }
        })
      },

      // 获取当前群好友
      getMembers() {
        uni.request({
          url: `${this.serverUrl}/group/members`,
          data: {
            gid: this.gid
          },
          method: 'POST',
          success: res => {
            if (res.data.status !== 200) return console.log('获取群成员失败')
            let {
              result
            } = res.data
            
            // 筛选未入群好友列表
            this.applyUsers = this.myFriends.filter(v => {
              return result.every(e => e.id != v.id)
            })
          }
        })
      },
    
      // 切换选中状态
      tabSelect(item) {
        item.selected = !item.selected
        if (item.selected) {
          // 插入选中好友列表
          this.selectedFriends.push(item.id)
        } else {
          // 从选中好友列表中移除
          this.selectedFriends.splice(this.selectedFriends.indexOf(item.id), 1)
        }
      },

      // 邀请好友入群
      apply() {
        uni.request({
          url: `${this.serverUrl}/group/applymember`,
          data: {
            gid: this.gid,
            users: this.selectedFriends
          },
          method: 'POST',
          success: res => {
            // 弹窗提示
            uni.$showMsg('邀请好友成功', 'success')

            // 跳转到群聊页面
            setTimeout(() => {
              uni.navigateTo({
                url: `/pages/group-home/group-home?gid=${this.gid}`
              })
            }, 1500)
          }
        })
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

  .head {
    z-index: 100;
    width: 100%;
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 46rpx;
    background-color: #fff;

    .g-icon {
      width: 196rpx;
      height: 196rpx;
      box-shadow: 0px 18px 20px 0px rgba(39, 40, 50, 0.1);
      border-radius: 40rpx;
      margin-bottom: 40rpx;
    }

    .group-name {
      width: 360rpx;
      padding: 28rpx;
      text-align: center;
      font-size: 38rpx;
      color: #272832;
      font-weight: 400;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .title {
      width: 90%;
      text-align: left;
      font-size: 44rpx;
      color: #272832;
      font-weight: 600;
      margin-top: 40rpx;
    }
  }

  .users {
    padding: 0 28rpx;
    padding-top: 490rpx;
    padding-bottom: 170rpx;
    box-sizing: border-box;

    &-list {
      &-item {
        padding: 24rpx 0;
        display: flex;
        align-items: center;

        .tag {
          image {
            width: 54rpx;
            height: 54rpx;
          }
        }

        .user-info {
          width: 100%;
          margin-left: 40rpx;
          display: flex;
          align-items: center;

          .icon {
            width: 88rpx;
            height: 88rpx;
            border-radius: 20rpx;
          }

          .name {
            width: 60%;
            padding-left: 28rpx;
            font-size: 36rpx;
            color: #272832;
            font-weight: 400;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }

  .bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 168rpx;
    display: flex;
    justify-content: center;
    background: #FAFAFA;
    box-shadow: inset 0px 0.5px 0px 0px rgba(0, 0, 0, 0.1);
    padding-top: 20rpx;
    box-sizing: border-box;

    .button {
      width: 686rpx;
      height: 80rpx;
      text-align: center;
      line-height: 80rpx;
      background: #ccc;
      border-radius: 10rpx;
      font-size: 32rpx;
      color: #FAFAFA;
      font-weight: 400;
    }

    .btn-selected {
      background: #FFE431;
      color: #272832;
    }
  }
</style>
