// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

async function getCommentDetail(option) {
  let comment_id = option.comment_id;
  let commentStruct = await db.collection('comment').doc(comment_id).get();
  let comment = commentStruct.data;
  let movieStruct = await db.collection('movie').doc(comment.movieid).get();
  let movie = movieStruct.data;
  let userStruct = await db.collection('user').doc(comment.userid).get();
  let user = userStruct.data;
  comment['movie_image'] = movie.image;
  comment['movie_title'] = movie.title;
  comment['user_nickname'] = user.username;
  comment['user_avatar'] = user.avatar;
  return comment;
}

// 云函数入口函数
exports.main = async (event, context) => {
  return getCommentDetail(event);
}