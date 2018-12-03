// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

async function getFavirateProfile(option) {
  let user_info = await db.collection('user').doc(option.user_id).get();
  let stars = user_info.data.stars; // 得到收藏的评论id
  let favirateComment = [];    // 得到收藏的评论
  for (let i = 0; i < stars.length; i++) {
    let oneCommentStrcut = await db.collection('comment').doc(stars[i]).get();
    let oneComment = oneCommentStrcut.data;
    let movieStruct = await db.collection('movie').doc(oneComment.movieid).get()
    let userStruct = await db.collection('user').doc(oneComment.userid).get()
    oneComment['movie_title'] = movieStruct.data.title;
    oneComment['movie_image'] = movieStruct.data.image;
    oneComment['user_nickname'] = userStruct.data.username;
    oneComment['user_avatar'] = userStruct.data.avatar;
    favirateComment.push(oneComment);
  }
  // console.log(favirateComment);
  return favirateComment;
}

// 云函数入口函数
exports.main = async (event, context) => {
  return getFavirateProfile(event);
}