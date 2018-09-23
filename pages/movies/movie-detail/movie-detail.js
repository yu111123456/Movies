var util = require('../../../utils/util.js');
var app =  getApp();
Page({
  data:{
    //movie:{}
  },
  onLoad:function(options){
    var movieId = options.id;
    var url = app.globalData.doubanBase + 
    "/v2/movie/subject/" + movieId;//豆瓣电影详情页url地址
    util.http(url,this.processDoubanData);
  },
  processDoubanData:function(data){//处理空值
    // if(!data){
    //   return;
    // }
    var director = {//第一部分处理director数据
      avatar: "",
      name: "",
      id: ""
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {//对绑定的movie变量做填充
      movieImg: data.images?data.images.large:"",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join("、"),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    }
    this.setData({
      movie:movie
    })
  },
  viewMoviePostImg:function(e){//详情页面图片预览
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current:src,
      urls:[src]
    })
  },
  onShareAppMessage: function (event) {
    return {
      title: "电影详情",
      desc: "最热电影",
      path: '/pages/posts/post-detail/post-detail?id=0'
    }
  }
})
