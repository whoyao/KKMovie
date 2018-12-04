// 云函数入口文件
const cloud = require('wx-server-sdk')

const string_length = 28

cloud.init()
const db = cloud.database()

function cutString(input_string) {
  if (input_string.length > string_length) {
    var newstring = input_string.substring(0, string_length-2) + "...";
    return newstring;
  }
  return input_string;
}

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
    let all_comment = oneComment['comment']
    oneComment['comment'] = cutString(all_comment)
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
