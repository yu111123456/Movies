var postsData = require('../../data/posts-data.js')
/*Page({
  data: {
    //小程序总是会读取data对象来做数据绑定，这个动作我们称为动作A
    // 而这个动作A的执行，是在onLoad函数执行之后发生的
  },
  onLoad: function () {
    // this.data.postList = postsData.postList
    this.setData({
      postList: postsData.postList
    });
  },
onSwiperTap
  

  
})*/


Page({
  data:{
  },
  onLoad:function(options){
     //页面初始化options为页面跳转所带来的参数
  this.setData({
    posts_key:postsData.postList
    });
  },
  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    //event事件对象,currentTarget当前鼠标点击的主键对应的是post.wxml里的<view>,dataset自定义数据的集合<view>data-postId;postId变量值
    wx.navigateTo({//点击轮播图下的图片跳转到子页面
      url: "post-detail/post-detail?id=" + postId
    })
  },
 
  onSwiperItemTap: function (event) {
    // target 和currentTarget
    // target指的是当前点击的组件 和currentTarget 指的是事件捕获的组件
    // target这里指的是image，而currentTarget指的是swiper
    //点击当前轮播图跳转到相应页面
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  }
})