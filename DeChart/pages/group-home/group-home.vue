<template>
  <view class="container">
    <view class="top-bar">
      <view class="top-bar-left">
        <image class="back" src="/static/images/public/left.png" @tap="toBack"></image>
      </view>
      <view class="top-bar-center"></view>
      <view class="top-bar-right">
      </view>
    </view>

    <!-- 背景图 -->
    <view class="bg">
      <image class="bg-img" :src="cropFilePath" mode="aspectFill"></image>
    </view>


    <view class="main">
      <view class="main-content">
        <view class="head">
          <view class="head-top">
            <view class="title">{{group.name}}</view>
            <view class="date">
              <uni-dateformat :date="group.time" format='yyyy/MM/dd'>
              </uni-dateformat>
            </view>
          </view>
          <view class="head-bottom">
            <view class="intro">{{group.notice}}</view>
          </view>
        </view>
        <view class="members">
          <view class="members-top">
            <view class="title">
              群成员
            </view>
            <view class="regular">
              <text class="regular-option" @tap="isDel = !isDel" v-if="isOption">成员管理</text>
              <image class="right-img" src="/static/images/public/right.png"></image>
            </view>
          </view>
          <view class="members-list">
            <view class="members-list-item" v-for="(item, index) in members" :key="index">
              <image class="del" src="/static/images/public/delete.png" @tap="moveTip(item)" v-if="isDel && item.id !== uid"></image>
              <navigator :url="`/pages/user-home/user-home?id=${item.id}`" hover-class="none">
                <image class="icon" :src="item.iconPath"></image>
                <view class="name">{{item.name}}</view>
              </navigator>
            </view>
            <!-- 邀请好友 -->
            <view class="members-list-item item-add" @tap="toGroupApply" v-if="group.userID === uid">
              <image class="icon" src="/static/images/public/add.png"></image>
              <view class="name">邀请</view>
            </view>
          </view>
        </view>
        <view class="item group-name" @tap="modifyMsg('群名称', group.name)">
          <view class="item-left">
            <text class="title">群名称</text>
            <text class="content">{{group.name}}</text>
          </view>
          <view class="item-right">
            <image class="right-img" src="/static/images/public/right.png"></image>
          </view>
        </view>
        <view class="item group-icon" v-if="this.cropFilePath">
          <view class="item-left">
            <text class="title">群头像</text>
            <image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
            <image :src="cropFilePath" @tap="upload" class="group-icon"></image>
          </view>
          <view class="item-right">
            <image class="right-img" src="/static/images/public/right.png"></image>
          </view>
        </view>
        <view class="item group-notice" @tap="modifyMsg('群公告', group.notice)">
          <view class="item-left">
            <text class="title">群公告</text>
            <text class="content">{{group.notice}}</text>
          </view>
          <view class="item-right">
            <image class="right-img" src="/static/images/public/right.png"></image>
          </view>
        </view>
        <view class="item no-disturb">
          <view class="item-left">
            <text class="title">消息免打扰</text>
          </view>
          <view class="item-right">
            <switch color="#FFCC33" style="transform:scale(0.8)" @change="switchChange" />
          </view>
        </view>
        <view class="dissolve" @tap="dissolveTip" v-if="isOption">解散群</view>
        <view class="getOut" @tap="getOutTip" v-else>退出群聊</view>
      </view>
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
      return {
        // 当前用户id
        uid: '',
        // 当前群id
        gid: '',
        // 当前群数据
        group: {},
        // 当前群成员
        members: [],
        // 消息免打扰判断值
        notice: false,
        // 头像裁剪插件图片地址变量
        tempFilePath: '',
        cropFilePath: '',
        headimg: '',
        // 弹出层判断值
        isShow: false,
        // 弹出层动画变量
        showAnimationData: {},
        // 弹出层标题
        showTitle: '',
        // 弹出层当前编辑内容
        msg: '',
        // 当前修改值类型
        type: '',
        // 判断当前页面是否具有管理员权限
        isOption: false,
        // 管理好友判断值
        isDel: false
      };
    },
    onLoad() {
      // 无登陆数据跳转到登陆页
      uni.$toLogin()
      
      // 获取群id
      this.getGroupId()

      // 获取群数据
      this.getGroupInfo()

      // 获取群成员
      this.getMembers()
    },
    methods: {
      // 获取群id和用户id
      getGroupId() {
        // 获取url路径的参数
        let curPage = getCurrentPages()

        // 挂载群id
        this.gid = curPage[curPage.length - 1].options.gid

        // 挂载用户id
        this.uid = uni.getStorageSync('user').id
      },
      
      // 判断当前页面是否具有管理员权限
      jugeOption () {
        this.isOption = this.uid === this.group.userID ? true : false
      },

      // 返回函数
      toBack() {
        uni.navigateTo({
          url: `/pages/chart-room/chart-room?gid=${this.gid}&&name=${this.group.name}`
        })
      },
      
      // 跳转到好友邀请页面
      toGroupApply () {
        uni.navigateTo({
          url: `/pages/group-apply/group-apply?gid=${this.gid}`
        })
      },

      // 获取群数据
      getGroupInfo() {
        uni.request({
          url: `${this.serverUrl}/group/detail`,
          data: {
            gid: this.gid
          },
          method: 'POST',
          success: res => {
            if (res.data.status !== 200) return console.log('获取群详情失败')
            let {
              result
            } = res.data
            // 完善头像链接
            result.iconPath = `${this.serverUrl}/group/icon/${result.iconPath}`
            // 完善背景图链接
            this.cropFilePath = result.iconPath

            this.group = res.data.result
            
           // 判断当前页面是否具有管理员权限
           this.jugeOption()
          }
        })
      },

      // 获取群成员
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
            // 完善头像链接
            result.forEach(item => {
              item.iconPath = `${this.serverUrl}/user/${item.iconPath}`
            })
            this.members = result
          }
        })
      },

      // 好友移出群聊弹窗
      moveTip(item) {
        uni.showModal({
          title: '提示',
          content: `确认将${item.name}移出群聊?`,
          confirmColor: '#E1061E',
          success: res => {
            if (res.confirm) {
              // 用户点击确定，退出登陆
              this.moveMember(item.id)
            }
          }
        })
      },

      // 好友移出群聊
      moveMember (uid) {
        uni.request({
          url: `${this.serverUrl}/group/movemember`,
          data: {
            gid: this.gid,
            uid: uid
          },
          method: 'POST',
          success: res => {
            if (res.data.status === 200) {
              // 提示
              uni.$showMsg('移出群聊成功')
              
              // 重新加载成员列表
              this.getMembers()
            }
          }
        })
      },

      // 消息免打扰状态更新
      switchChange(e) {
        this.notice = e.detail.value
      },

      // 退群弹窗提示
      getOutTip() {
        uni.showModal({
          title: '提示',
          content: '确定退出当前群聊?',
          confirmColor: '#E1061E',
          success: res => {
            if (res.confirm) {
              this.getOut()
            }
          }
        })
      },

      // 退出群聊
      getOut() {
        uni.request({
          url: `${this.serverUrl}/group/getout`,
          data: {
            gid: this.gid,
            uid: this.uid
          },
          method: 'POST',
          success: res => {
            if (res.data.status === 200) {
              // 退群提示
              uni.$showMsg('已退出该群聊')

              // 跳转到主页
              setTimeout(() => {
                uni.navigateTo({
                  url: '/pages/index/index'
                })
              }, 1500)
            }
          }
        })
      },

      // 解散群弹窗提示
      dissolveTip() {
        uni.showModal({
          title: '提示',
          content: '确定解散当前群聊?',
          confirmColor: '#E1061E',
          success: res => {
            if (res.confirm) {
              this.dissolve()
            }
          }
        })
      },

      // 解散群
      dissolve() {
        uni.request({
          url: `${this.serverUrl}/group/dissolvegroup`,
          data: {
            gid: this.gid
          },
          method: 'POST',
          success: res => {
            if (res.data.status === 200) {
              // 解散群提示
              uni.$showMsg('已解散该群聊')

              // 跳转到主页
              setTimeout(() => {
                uni.navigateTo({
                  url: '/pages/index/index'
                })
              }, 1500)
            }
          }
        })
      },

      // 窗口弹出动画
      modifyMsg(title, msg) {
        if (!this.isOption) return
        
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
        if (e.type === '群名称') {
          this.type = 'name'
        } else if (e.type === '群公告') {
          this.type = 'notice'
        }

        // 提交修改的值到服务器
        uni.request({
          url: `${this.serverUrl}/group/update`,
          data: {
            data: e.msg,
            id: this.gid,
            type: this.type
          },
          method: 'POST',
          success: res => {
            this.getGroupInfo()
          }
        })
      },

      // 头像裁剪插件所需函数
      upload() {
        if (!this.isOption) return
        
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

        uni.uploadFile({
          url: `${this.serverUrl}/files/upload`,
          filePath: this.headimg,
          name: 'file',
          fileType: 'image',
          formData: {
            url: 'group/icon',
            name: this.gid
          },
          success: (uploadFileRes) => {
            // 接收返回的文件名称
            let backstr = uploadFileRes.data

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
          url: `${this.serverUrl}/group/update`,
          data: {
            id: this.gid,
            type: 'iconPath',
            data: backstr
          },
          method: 'POST',
          success: res => {}
        })
      },
    }
  }
</script>

<style lang="scss">
  // 引入top-bar公共样式
  @import url("@/commons/css/top-bar.scss");

  .top-bar {
    border-bottom: none;

    .top-bar-left {
      .back {
        width: 48rpx;
        height: 48rpx;
      }
    }
  }

  .bg {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;

    &-img {
      width: 100%;
      height: 50%;
    }
  }

  .main {
    padding-top: 360rpx;

    &-content {
      background-color: #fff;
      border-radius: 40rpx 40rpx 0 0;
      padding: 28rpx;
      min-height: 680rpx;

      .head {
        height: 182rpx;
        border-bottom: solid 1px #ccc;

        &-top {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .title {
            width: 60%;
            font-size: 48rpx;
            color: #272832;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .date {
            font-size: 28rpx;
            color: rgba(39, 40, 50, 0.50);
          }
        }

        &-bottom {
          .intro {
            margin: 20rpx 0;
            width: 90%;
            font-size: 28rpx;
            color: #272832;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      .members {
        padding: 40rpx 0;
        border-bottom: solid 1px #ccc;

        &-top {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .title {
            font-size: 36rpx;
            color: #272832;
            font-weight: 600;
          }

          .regular {
            display: flex;
            align-items: center;

            &-option {
              font-size: 32rpx;
              color: rgba(39, 40, 50, 0.60);
              font-weight: 400;
            }

            .right-img {
              width: 48rpx;
              height: 48rpx;
            }
          }
        }

        &-list {
          display: flex;
          flex-wrap: wrap;
          width: 100%;

          &-item {
            position: relative;
            width: 20%;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 30rpx;

            .del {
              z-index: 99;
              position: absolute;
              top: -16rpx;
              right: 6rpx;
              width: 40rpx;
              height: 40rpx;
              background-color: #fff;
              border-radius: 50%;
            }

            .icon {
              width: 104rpx;
              height: 104rpx;
              border-radius: 20rpx;
            }

            .name {
              width: 104rpx;
              text-align: center;
              padding: 10rpx 0;
              font-size: 28rpx;
              color: #272832;
              font-weight: 400;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .item-add {
            .icon {
              background-color: #FFE431;
            }
          }
        }
      }

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 0;

        &-left {
          width: 85%;
          display: flex;
          align-items: center;

          .title {
            font-size: 32rpx;
            color: #272832;
            padding-right: 24rpx;
          }

          .content {
            display: block;
            width: 80%;
            font-size: 32rpx;
            color: rgba(39, 40, 50, 0.60);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .group-icon {
            width: 88rpx;
            height: 88rpx;
            border-radius: 20rpx;
          }

        }

        &-right {
          .right-img {
            width: 48rpx;
            height: 48rpx;
          }
        }
      }

      .dissolve,
      .getOut {
        margin: auto;
        margin-top: 60rpx;
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
  }
</style>
