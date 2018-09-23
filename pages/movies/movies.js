var util = require('../../utils/util.js')
var app = getApp();
Page({
  // RESTFul API JSON
  // SOAP XML
  //粒度 不是 力度
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,//电影页面
    searchPanelShow: false,//搜索页面
  },

  onLoad: function (event) {
    var inTheatersUrl = app.globalData.doubanBase +
      "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase +
      "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase +
      "/v2/movie/top250" + "?start=0&count=3";

    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },

  onMoreTap: function (event) {//更多的页面跳转
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category
    })
  },

  onMovieTap: function (event) {//电影详情的页面跳转
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "movie-detail/movie-detail?id=" + movieId
    })
  },

  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function (error) {
        // fail
        console.log(error)
      }
    })
  },

  onCancelImgTap: function (event) {//关闭搜索页面
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},//搜索结果置空
    }
    )
  },

  onBindFocus: function (event) {//显示搜索页面
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onBindBlur: function (event) {//获取搜索的数据
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + 
    "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, "searchResult", "");
  },

  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
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
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);
  }
})