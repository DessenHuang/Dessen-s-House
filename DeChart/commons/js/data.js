export default {
  // 用户列表
  users: [{
      id: 1,
      imgUrl: 'one.jpeg',
      tip: 1,
      name: '喝奶茶叫我',
      email: 'milk@163.com',
      time: Date.now(),
      news: '刚开会，手机在充电，不好意思通知晚了'
    },
    {
      id: 2,
      imgUrl: 'two.jpeg',
      tip: 2,
      name: '饿了想睡觉',
      email: 'sleep@163.com',
      time: Date.now(),
      news: '杨老师通知先看下资料，软件工程课程随后再调整，一个夜晚，一盏台灯，一位大聪明，一个奇迹'
    },
    {
      id: 3,
      imgUrl: 'three.jpeg',
      tip: 0,
      name: '绝绝子',
      email: 'juejuezi@163.com',
      time: Date.now(),
      news: '我以为这答案是对的，我在怀疑人生'
    },
    {
      id: 4,
      imgUrl: 'four.jpeg',
      tip: 999,
      name: 'yyds',
      email: 'yyds@163.com',
      time: Date.now(),
      news: '起床上课了'
    }
  ],
  // 群聊列表
  groups: [{
      id: 101,
      g_imgUrl: 'three.jpeg',
      tip: 20,
      g_name: '吹水群',
      time: Date.now(),
      news: '起床做核酸啦！！'
    },
    {
      id: 102,
      g_imgUrl: 'one.jpeg',
      tip: 20,
      g_name: '学习群',
      time: Date.now(),
      news: '作业啥时候交啊？'
    },
    {
      id: 103,
      g_imgUrl: 'two.jpeg',
      tip: 20,
      g_name: 'yyds群聊',
      time: Date.now(),
      news: '秋日第一份元麦乐鸡😋'
    }
  ],
  // 我的好友列表
  myFirends: [{
      id: 1,
      imgUrl: 'one.jpeg',
      tip: 1,
      name: '喝奶茶叫我',
      email: 'milk@163.com',
      time: Date.now(),
      news: '刚开会，手机在充电，不好意思通知晚了',
      selected: false
    },
    {
      id: 3,
      imgUrl: 'three.jpeg',
      tip: 0,
      name: '绝绝子',
      email: 'juejuezi@163.com',
      time: Date.now(),
      news: '我以为这答案是对的，我在怀疑人生',
      selected: false
    },
    {
      id: 998,
      imgUrl: 'five.jpeg',
      tip: 0,
      name: '芋圆罐子',
      email: 'yuyan@163.com',
      time: Date.now(),
      news: '时间啊会计师的痕迹就哭了',
      selected: false
    },
    {
      id: 999,
      imgUrl: 'six.jpeg',
      tip: 0,
      name: '磨磨唧唧',
      email: 'momojiji@163.com',
      time: Date.now(),
      news: '两节课刷卡机撒娇爱上了手机卡',
      selected: false
    },

  ],
  // 我的群聊列表
  myGroups: [{
    id: '102',
    g_imgUrl: 'five.jpeg',
    tip: 20,
    g_name: '学习群',
    g_intro: '时空长，星夜凉，我不畏高飞, say is new world!!!时空长，星夜凉，我不畏高飞, say is new world!!!时空长，星夜凉，我不畏高飞, say is new world!!!',
    time: Date.now(),
    news: '作业啥时候交啊？',
    members: [{
        id: 1,
        imgUrl: 'one.jpeg',
        tip: 1,
        name: '喝奶茶叫我',
        email: 'milk@163.com',
        time: Date.now(),
        news: '刚开会，手机在充电，不好意思通知晚了'
      },
      {
        id: 2,
        imgUrl: 'two.jpeg',
        tip: 2,
        name: '饿了想睡觉',
        email: 'sleep@163.com',
        time: Date.now(),
        news: '杨老师通知先看下资料，软件工程课程随后再调整，一个夜晚，一盏台灯，一位大聪明，一个奇迹'
      },
      {
        id: 3,
        imgUrl: 'three.jpeg',
        tip: 0,
        name: '绝绝子',
        email: 'juejuezi@163.com',
        time: Date.now(),
        news: '我以为这答案是对的，我在怀疑人生'
      },
      {
        id: 4,
        imgUrl: 'four.jpeg',
        tip: 999,
        name: 'yyds',
        email: 'yyds@163.com',
        time: Date.now(),
        news: '起床上课了'
      },
      {
        id: 5,
        imgUrl: 'five.jpeg',
        tip: 0,
        name: '橘子',
        email: 'origin@163.com',
        time: Date.now(),
        news: '起床上课了'
      },
      {
        id: 6,
        imgUrl: 'six.jpeg',
        tip: 0,
        name: '喝酸奶吧',
        email: 'soarmilk@163.com',
        time: Date.now(),
        news: '起床上课了'
      }
    ]
  }],

  // 当前消息列表
  // id 0是自己， 1是对方
  //type 0是文字，1是图片链接 2是定位信息
  msgList: [{
      id: 1,
      imgUrl: '/static/images/icons/one.jpeg',
      message: '这是她发的第一条消息',
      type: 0,
      time: Date.now() - 1000 * 60 * 60 * 60 * 60,
      tip: 0
    },
    {
      id: 0,
      imgUrl: '/static/images/icons/my.jpeg',
      message: '这是我发的第一条消息',
      type: 0,
      time: Date.now() - 1000 * 60 * 60 * 60 * 36,
      tip: 0
    },
    {
      id: 1,
      imgUrl: '/static/images/icons/one.jpeg',
      message: '这是她发的第二条消息',
      type: 0,
      time: Date.now() - 1000 * 60 * 60 * 60,
      tip: 0
    },
    {
      id: 1,
      imgUrl: '/static/images/icons/one.jpeg',
      message: '这是她发的第三条消息',
      type: 0,
      time: Date.now() - 1000 * 60 * 60 * 36,
      tip: 0
    },
    {
      id: 0,
      imgUrl: '/static/images/icons/my.jpeg',
      message: '这是我发的第二条消息',
      type: 0,
      time: Date.now() - 1000 * 60 * 60 * 6,
      tip: 0
    },
    {
      id: 0,
      imgUrl: '/static/images/icons/my.jpeg',
      message: '/static/images/icons/one.jpeg',
      type: 1,
      time: Date.now() - 1000 * 60 * 60,
      tip: 0
    },
    {
      id: 0,
      imgUrl: '/static/images/icons/my.jpeg',
      message: '这是我发的第四条消息',
      type: 0,
      time: Date.now() - 1000 * 60,
      tip: 0
    },
    {
      id: 1,
      imgUrl: '/static/images/icons/one.jpeg',
      message: '这是她发的第四条消息',
      type: 0,
      time: Date.now() - 1000,
      tip: 0
    },
    {
      id: 1,
      imgUrl: '/static/images/icons/one.jpeg',
      message: '/static/images/icons/three.jpeg',
      type: 1,
      time: Date.now(),
      tip: 0
    },
    {
      id: 0,
      imgUrl: '/static/images/icons/my.jpeg',
      message: {
        name: '新城水站(国贸店)',
        address: '北京市朝阳区朝阳门外大街1号正东方向93米',
        latitude: 39.92042,
        longitude: 116.459487,
      },
      type: 2,
      time: Date.now(),
      tip: 0
    },
    {
      id: 0,
      imgUrl: '/static/images/icons/my.jpeg',
      message: '这是我发的第四条消息',
      type: 0,
      time: Date.now() - 1000 * 60,
      tip: 0
    },
    {
      id: 1,
      imgUrl: '/static/images/icons/one.jpeg',
      message: '这是她发的第四条消息',
      type: 0,
      time: Date.now() - 1000,
      tip: 0
    },
    {
      id: 1,
      imgUrl: '/static/images/icons/one.jpeg',
      message: '/static/images/icons/three.jpeg',
      type: 1,
      time: Date.now(),
      tip: 0
    },
    {
      id: 0,
      imgUrl: '/static/images/icons/my.jpeg',
      message: {
        name: '新城水站(国贸店)',
        address: '北京市朝阳区朝阳门外大街1号正东方向93米',
        latitude: 39.92042,
        longitude: 116.459487,
      },
      type: 2,
      time: Date.now(),
      tip: 0
    },
  ]
}
