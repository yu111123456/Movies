var app = getApp()
var util = require('../../../utils/util.js')
Page({
  data:{
    movies:{},
    navigateTitle:"",
    requestUrl:"",
    totalCount:0,
    isEmpty:true,
  },
  onLoad:function(option){
    var category = option.category;
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch(category){
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;//requestUrl
    util.http(dataUrl, this.processDoubanData)
  },

  onReachBottom:function(event){//导航区域下拉刷新
    var nextUrl = this.data.requestUrl + 
    "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()//刷新图标显示
  },

  onPullDownRefresh: function (event) {//头部区域下拉刷新
    var refreshUrl = this.data.requestUrl + 
    "?star=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    util.http(refreshUrl,this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  processDoubanData: function (moviesDouban){
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // [1,1,1,1,1] [1,1,1,0,0]
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id//movieId跳转到电影详情页
      }
      movies.push(temp)
    }
    var totalMovies = {}
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies);
    }
    else{
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();//导航区域刷新图标消失
    wx.stopPullDownRefresh();//头部区域刷新图标消失

  },
  onReady:function(event){
    wx.setNavigationBarTitle({
      title:this.data.navigateTitle,
    })
  },

  onMovieTap: function (event) {//更多里面的电影详情跳转
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url:"../movie-detail/movie-detail?id=" + movieId
    })
  }
})