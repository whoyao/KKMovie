// 云函数入口文件
const cloud = require('wx-server-sdk')
const string_length = 28

cloud.init()
const db = cloud.database()

function cutString(input_string) {
  if (input_string.length > string_length) {
    var newstring = input_string.substring(0, string_length - 2) + "...";
    return newstring;
  }
  return input_string;
}


async function getFavirateProfile(option) {
  let user_info = await db.collection('user').doc(option.user_id).get();
  let stars = user_info.data.stars; // 得到收藏的评论id
  let favirateComment = [];    // 得到收藏的评论
  for (let i = 0; i < stars.length; i++) {
    let oneCommentStrcut = await db.collection('comment').doc(stars[i]).get();
    let oneComment = oneCommentStrcut.data;
    let movieStruct = await db.collection('movie').doc(oneComment.movieid).get()
    let userStruct = await db.collection('user').doc(oneComment.userid).get()
    let all_comment = oneComment['comment']
    oneComment['comment'] = cutString(all_comment)
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