const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
function formatTimeD(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

function getNo(name){

  switch (name) {
    case "0":
      return "";
      break;
    case "1":
      return "02";
      break;
    case "2":
      return "03";
      break;
    case "3":
      return "04";
      break;
    case "4":
      return "05";
      break;
    case "5":
      return "06";
      break;
    case "6":
      return "07";
      break;
    case "7":
      return "08";
      break;
    case "8":
      return "09";
      break;
    case "9":
      return "10";
      break;
    case "10":
      return "11";
      break;
    case "11":
      return "12";
      break;
    case "12":
      return "13";
      break;
    case "13":
      return "14";
      break;
    default:
      return "";
  }

}

module.exports = {
  formatTime: formatTime,
  formatTimeD: formatTimeD,
  getNo: getNo
}
