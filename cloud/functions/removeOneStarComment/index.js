// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

function removeElementFromArray(list, ele) {
  let i = list.indexOf(ele);
  while( i>= 0 ) {
    list.splice(i, 1);
    i = list.indexOf(ele);
  }
  return list;
}

async function removeStar(option) {
  let userStruct = await db.collection('user').doc(option.userInfo.openId).get();
  let user = userStruct.data;
  let stars_comments = user.stars;
  let res_comments = removeElementFromArray(stars_comments, option.comment_id)
  let res = await db.collection('user').doc(option.userInfo.openId).update({
    data: {
      stars: res_comments
    }
  });

  return res;
}

// 云函数入口函数
exports.main = async (event, context) => {
  return removeStar(event);
}