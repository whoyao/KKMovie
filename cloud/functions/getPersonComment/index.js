// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

async function getPersonProfile(option) {
  let personCommentStruct = await db.collection('comment').where({
    userid: option.user_id
  }).get();
  let personComment = personCommentStruct.data;
  let commentList = [];
  // console.log(option);
  for(let i=0; i<personComment.length;i++){
    let movieStruct = await db.collection('movie').doc(personComment[i].movieid).get()
    let oneComment = personComment[i];
    oneComment['movie_title'] = movieStruct.data.title;
    oneComment['movie_image'] = movieStruct.data.image;
    oneComment['user_nickname'] = option.user_nickname;
    oneComment['user_avatar'] = option.user_avatar;
    commentList.push(oneComment);
  }
  return personComment;
}


// 云函数入口函数
exports.main = async (event, context) => {
  return getPersonProfile(event);
}
