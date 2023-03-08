<template>
  <view class="container">
    <view class="top-bar">
      <view class="top-bar-left">
        <image class="back" src="/static/images/public/left.png" @tap="toBack"></image>
      </view>
      <view class="top-bar-center">创建群聊</view>
      <view class="top-bar-right"></view>
    </view>

    <view class="head">
      <!-- 头像裁剪插件 -->
      <image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
      <image :src="cropFilePath" @tap="upload" class="g-icon"></image>
      <input class="group-name" placeholder="群名称" v-model="groupName" />
      <view class="title">用户</view>
    </view>

    <view class="users" scroll-y="true">
      <view class="users-list">
        <view class="users-list-item" v-for="(item, index) in myFriends" :key="index">
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
      <view class="button" v-if="selectedTotal === 0 || groupName.trim() === ''">创建</view>
      <!-- 已勾选状态 -->
      <view class="button btn-selected" @tap="createGroup" v-else>创建({{selectedTotal}})</view>
    </view>
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
      return {
        // 头像裁剪插件图片地址变量
        tempFilePath: '',
        cropFilePath: `${this.serverUrl}/user/group.png`,
        headimg: 'group.png',
        // 群主id
        id: '',
        // 我的好友列表
        myFriends: [],
        // 已选中好友列表
        selectedFriends: [],
        // 群昵称
        groupName: '',
        // 判断头像是否更改
        iconChanged: false
      };
    },
    onLoad() {
      // 无登陆数据跳转到登陆页
      uni.$toLogin()
      
      // 获取群主id
      this.getId()

      // 获取好友列表
      this.getFriends()
    },
    computed: {
      selectedTotal() {
        let count = 0
        this.myFriends.forEach(item => {
          if (item.selected) count += 1
        })
        return count
      }
    },
    methods: {
      // 获取用户id
      getId() {
        this.id = uni.getStorageSync('user').id

        // 群主id插入已选中的好友列表
        this.selectedFriends.push(this.id)
      },

      // 返回首页
      toBack() {
        uni.navigateTo({
          url: '/pages/index/index'
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
            res.data.result.forEach(item => {
              // 生成用户数据
              let userData = {
                id: item.id,
                name: item.name,
                iconPath: `${this.serverUrl}/user/${item.iconPath}`,
                selected: false
              }
              // 插入好友列表
              this.myFriends.push(userData)
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

      // 创建群聊
      createGroup() {
        // 限制群成员不超过10人
        if (this.selectedFriends.length > 10) return uni.$showMsg('当前群成员不得超过10人')
        
        uni.request({
          url: `${this.serverUrl}/group/creategroup`,
          data: {
            uid: this.id,
            name: this.groupName,
            iconPath: 'group.png',
            users: this.selectedFriends
          },
          method: 'POST',
          success: res => {
            if (res.data.status !== 200) console.log('创建群聊失败')
            
            let {
              result
            } = res.data.value
            
            // 上传群头像到后台
            if (this.iconChanged) this.upLoadIcon(result._id)
            
            // 生成群消息
            this.initMsg(result)
            
            // 弹窗提示
            uni.$showMsg('创建成功', 'success')

            // 跳转到群聊页面
            setTimeout(() => {
              uni.navigateTo({
                url: `/pages/chart-room/chart-room?gid=${result._id}&&name=${result.name}`
              })
            }, 1500)
          }
        })
      },



      // 头像裁剪插件所需函数
      upload() {
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
        this.iconChanged = true
      },
      cancel() {
        console.log("canceled");
        this.tempFilePath = "";
      },
      
      // 上传群头像到后台
      upLoadIcon (gid) {
        uni.uploadFile({
          url: `${this.serverUrl}/files/upload`,
          filePath: this.headimg,
          name: "file",
          fileType: "image",
          formData: {
            url: 'group/icon',
            name: gid
          },
          success: (uploadFileRes) => {
            // 接收返回的文件名称
            let backstr = uploadFileRes.data
            
            // 更新头像信息到后台
            this.updateIcon(backstr, gid)
          },
        
          fail(e) {
            console.log("this is errormes " + e.message);
          },
        });
      },
      
      // 更新头像信息到后台
      updateIcon(backstr, gid) {
        uni.request({
          url: `${this.serverUrl}/group/update`,
          data: {
            id: gid,
            type: 'iconPath',
            data: backstr
          },
          method: 'POST',
          success: res => {
          }
        })
      },
      
      // 生成群消息
      initMsg (e) {
        uni.request({
          url: `${this.serverUrl}/chart/insertgroupmsg`,
          data: {
            uid: this.id,
            gid: e._id,
            msg: `${e.name} 创建成功`,
            type: 0
          },
          method: 'POST',
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
      width: 626rpx;
      height: 32rpx;
      background: #F3F4F6;
      border-radius: 46rpx;
      padding: 28rpx;
      text-align: center;
      font-size: 32rpx;
      color: #272832;
      font-weight: 400;
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
