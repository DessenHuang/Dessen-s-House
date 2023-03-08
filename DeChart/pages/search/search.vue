<template>
  <view class="container">
    <view class="top-bar">
      <view class="top-bar-left">
        <image src="/static/images/register/left.png" @tap="toBack"></image>
      </view>
      <view class="top-bar-center">
        <view class="search-container">
          <uni-search-bar placeholder="搜索用户/群" radius=10 @input="search"></uni-search-bar>
        </view>
      </view>
      <view class="top-bar-right"></view>
    </view>
    <view class="searchRes" v-if="kw.length !== 0">
      <!-- 用户列表 -->
      <view class="user-list" v-if="userResult.length !== 0">
        <view class="title">用户</view>
        <view class="user-list-item" v-for="item in userResult" :key="item._id">
          <view class="user-list-item-left">
            <navigator :url="`/pages/user-home/user-home?id=${item._id}&isfriend=${item.isAdd}`" hover-class="none">
              <image class="icon" :src="`${item.iconPath}`"></image>
            </navigator>
            <view class="userInfo">
              <text class="nickname">{{item.name}}<span v-if="item.isMy">(我)</span></text>
              <text class="mail">{{item.email}}</text>
            </view>
          </view>
          <view class="user-list-item-right">
            <navigator :url="`/pages/chart-room/chart-room?fid=${item._id}&&name=${item.name}`" hover-class="none" v-if="item.isAdd">
              <text class="send">发消息</text>
            </navigator>
            <navigator :url="`/pages/user-home/user-home?id=${item._id}&isfriend=${item.isAdd}`" hover-class="none" v-else>
              <text class="add">加好友</text>
            </navigator>
          </view>
        </view>
      </view>
      <!-- 群列表 -->
      <view class="group-list" v-if="groupResult.length !== 0">
        <view class="title">群聊</view>
        <view class="group-list-item" v-for="item in groupResult" :key="item._id">
          <view class="group-list-item-left">
            <!-- <navigator :url="`/pages/group-home/group-home?gid=${item._id}`" hover-class="none">
              <image class="icon" :src="`${item.iconPath}`"></image>
            </navigator> -->
            <image class="icon" :src="`${item.iconPath}`"></image>
            <text class="nickname">{{item.name}}</text>
          </view>
          <view class="group-list-item-right">
            <navigator :url="`/pages/chart-room/chart-room?gid=${item._id}&&name=${item.name}`" hover-class="none" v-if="item.isAdd">
              <text class="send">发消息</text>
            </navigator>
           <!-- <navigator :url="`/pages/user-home/user-home?id=${item._id}&isfriend=${item.isAdd}`" hover-class="none" v-else>
              <text class="add">加群聊</text>
            </navigator> -->
          </view>
        </view>
      </view>
      <text class="emptyTip" v-if="isEmpty">无匹配信息</text>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 当前用户id
        uid: '',
        token: '',
        // 定时器变量
        timer: '',
        // 搜索匹配用户列表
        userResult: [],
        // 搜索匹配群聊列表
        groupResult: [],
        // 当前关键字
        kw: '',
        // 是否存在匹配用户
        isUser: false,
        // 是否存在匹配群聊
        isGroup: false
      };
    },
    computed: {
      isEmpty() {
        return this.userResult.length !== 0 || this.groupResult.length !== 0 ? false : true
      }
    },
    onShow() {
      // 无登陆数据跳转到登陆页
      uni.$toLogin()
      
      // 获取当前用户id
      this.uid = uni.getStorageSync('user').id
      this.token = uni.getStorageSync('user').token
    },
    methods: {
      // 返回页面
      toBack() {
        uni.navigateTo({
          url: '/pages/index/index'
        })
      },

      // 获取当前关键字进行查找匹配
      search(e) {
        clearTimeout(this.timer)
        // 防抖搜索
        this.timer = setTimeout(() => {
          // 重置用户列表
          this.userResult = []
          // 重置群聊列表
          this.groupResult = []
          // 存储关键字
          this.kw = e
          // 获取关键字进行匹配
          this.searchUser(this.kw)
          this.searchGroup(this.kw)
        }, 1000)
      },

      // 关键字查找匹配用户
      searchUser(kw) {
        if (kw.length === 0) return

        // 获取用户搜索列表
        uni.request({
          url: `${this.serverUrl}/search/user`,
          data: {
            data: kw,
            token: this.token
          },
          method: 'POST',
          success: (res) => {
            // 判断token是否匹配
            if (res.data.status === 300) {
              // token不匹配返回到登陆页面
              return uni.navigateTo({
                url: '/pages/login/login'
              })
            }

            // 解构搜索到的用户数组
            let {
              result
            } = res.data

            // 完善用户搜索列表
            result.forEach(item => {
              this.isFriend(item)
            })
            // 挂载到用户搜索列表
            this.userResult = result
          }
        })
      },

      // 判断当前用户是否为好友
      isFriend(item) {
        uni.request({
          url: `${this.serverUrl}/search/isfriend`,
          data: {
            uid: this.uid,
            fid: item._id
          },
          method: 'POST',
          success: res => {
            // 完善头像链接
            item.iconPath = this.serverUrl + '/user/' + item.iconPath

            // 完善用户搜索列表对象
            if (res.data.status === 200) {
              // status为200则为好友关系
              item.isAdd = 1
            } else if (res.data.status === 300) {
              // 该用户为自己时
              // 添加isMy属性
              item.isMy = 1
              item.isAdd = 2
            } else {
              // 0 不是好友, 1为好友，2为自己
              item.isAdd = 0
            }
          }
        })
      },

      // 关键字查找匹配群聊
      searchGroup(kw) {
        if (kw.length === 0) return

        // 获取群搜索列表
        uni.request({
          url: `${this.serverUrl}/search/group`,
          data: {
            data: kw,
            token: this.token
          },
          method: 'POST',
          success: (res) => {
            // 判断token是否匹配
            if (res.data.status === 300) {
              // token不匹配返回到登陆页面
              return uni.navigateTo({
                url: '/pages/login/login'
              })
            }
            // 解构搜索到的群数组
            let {
              result
            } = res.data

            // 完善群搜索列表
            result.forEach(item => {
              this.isInGroup(item)
            })
            // 挂载到用户搜索列表
            this.groupResult = result
          }
        })
      },

      // 判断当前用户是在群内
      isInGroup(item) {
        uni.request({
          url: `${this.serverUrl}/search/isingroup`,
          data: {
            uid: this.uid,
            gid: item._id
          },
          method: 'POST',
          success: res => {
            // 完善头像链接
            item.iconPath = this.serverUrl + '/group/icon/' + item.iconPath

            // 完善用户搜索列表对象
            if (res.data.status === 200) {
              // status为200则在群内
              item.isAdd = true
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import url("@/commons/css/top-bar.scss");

  .top-bar {
    .top-bar-left {
      image {
        width: 36rpx;
        height: 36rpx;
      }
    }

    .top-bar-center {
      width: 85%;

      .search-container {
        width: 100%;

        uni-search-bar {
          height: 120rpx;
        }
      }
    }

    .top-bar-right {
      width: 0;
    }
  }

  .searchRes {

    .user-list,
    .group-list {
      padding: 20rpx;

      .title {
        font-size: 44rpx;
        // color: #272832;
        font-weight: 600;
        padding-bottom: 20rpx;
      }

      &-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 0;

        &-left {
          display: flex;
          align-items: center;

          .icon {
            width: 80rpx;
            height: 80rpx;
            border-radius: 20rpx;
            margin-right: 28rpx;
          }
          
          .userInfo {
            
            display: flex;
            flex-direction: column;
            
            .nickname {
              font-size: 36rpx;
              color: #272832;
              font-weight: 400;
              padding: 6rpx 0;
            }
            
            .mail {
              color: #666;
              font-size: 28rpx;
            }
          }        
        }

        &-right {
          text {
            display: block;
            width: 120rpx;
            height: 48rpx;
            text-align: center;
            line-height: 48rpx;
            border-radius: 24rpx;
            font-size: 24rpx;
            font-weight: 400;
          }

          .add {
            background-color: rgba(74, 170, 255, 0.10);
            color: #4AAAFF;
          }

          .send {
            background-color: #FFE431;
            color: #272832;
          }
        }
      }
    }

    .emptyTip {
      display: block;
      text-align: center;
      color: #cfcfcf;
      font-size: 36rpx;
      margin-top: 160rpx;
    }
  }
</style>
