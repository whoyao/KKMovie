// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

async function getStatus(option) {
  let userStruct = await db.collection('user').doc(option.userInfo.openId).get();
  let user = userStruct.data;

  let thisCommentStruct = await db.collection('comment').doc(option.comment_id).get();
  let thisComment = thisCommentStruct.data;

  let commentsStruct = await db.collection('comment').where({
    userid: option.userInfo.openId
  }).get();
  let comments = commentsStruct.data;
  let my_comment_movies = comments.map((comments) => {return comments.movieid});
  let stars_comments = user.stars;
  let res_status = {
    show_star : false,
    show_add : false
  };
  if (stars_comments.indexOf(option.comment_id) < 0){
    res_status.show_star = true;
  }
  console.log(my_comment_movies)
  console.log(thisComment)
  if (my_comment_movies.indexOf(thisComment.movieid) < 0) {
    res_status.show_add = true;
  }
  return res_status;
}

// 云函数入口函数
exports.main = async (event, context) => {
  return getStatus(event);
}