// 云函数入口文件
// 获得 movie-detail 的按钮状态
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

async function getStatus(option) {

  let commentsStruct = await db.collection('comment').where({
    userid: option.userInfo.openId
  }).get();
  let comments = commentsStruct.data;
  let my_comment_movies = comments.map((comments) => { return comments.movieid });

  let res_status = {
    show_add: false
  };

  if (my_comment_movies.indexOf(option.movieid) < 0) {
    res_status.show_add = true;
  }
  return res_status;
}

// 云函数入口函数
exports.main = async (event, context) => {
  return getStatus(event);
}

