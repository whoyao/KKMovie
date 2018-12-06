// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

async function getCommentDetail(option) {
  let userStruct = await db.collection('user').doc(option.userInfo.openId).get();
  let user = userStruct.data;
  let movie_id = option.movie_id;
  let commentStruct = await db.collection('comment').where({
    movieid: movie_id,
    userid: user._id
  }).get();
  
  if (commentStruct.data.length) {
  let comment = commentStruct.data[0];
  let movieStruct = await db.collection('movie').doc(movie_id).get();
  let movie = movieStruct.data;

  comment['movie_image'] = movie.image;
  comment['movie_title'] = movie.title;
  comment['user_nickname'] = user.username;
  comment['user_avatar'] = user.avatar;
  return comment;
  } else {
    return ''
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  return getCommentDetail(event);
}