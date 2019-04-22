/**
 * @description 在此添加mock数据，对应的请求路径为"/mock/" + 键名
 * 每个mock对象有个必须要的有的属性data，data可以是函数也可以是非函数，
 * 函数的话会获得requset对象作为参数，将会返回函数的返回值，非函数则直接返回改值
 * mock对象还可以拥有一个validate对象，用于检查参数的合法性，获得request对象作为参数
 * get请求检查参数为request.query
 * post请求检查参数为request.body
 */
const mocks = {
  test: { // e.g. 此条数据的get请求路径为、/mock/test
    data: {
      statusCode: '200',
      data: {
        name: 'mock',
        date: new Date().toLocaleDateString(),
        id: parseInt((Math.random() * 10), 10)
      },
      message: 'success'
    },
    validate(req) { // 检查get请求的id参数是否为数字
      return !isNaN(parseFloat(req.query.id));
    },
  },
  test2: {
    data(req) {
      return { back: req.body.id + 1 }; // 返回一个对象
    },
    validate(req) {
      return req.body.id === 3; // 检查post请求的id参数是否等于3
    }
  }
};

module.exports = mocks;
