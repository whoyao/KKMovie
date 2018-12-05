// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()


async function getCommentDetail() {
  let commentStruct = await db.collection('comment').orderBy('create_time', 'desc').limit(10).get();

  let comment = commentStruct.data[Math.round(Math.random() * (commentStruct.data.length - 1))];
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