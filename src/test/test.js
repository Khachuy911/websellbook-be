const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const fs = require('fs');

const server = require('../server');
const { DEFAULT_VALUE, HTTP_CODE, MESSAGE } = require('../helper/constant');
const { send } = require('process');

chai.use(chaiHttp);

let token;
let refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgzNTlhYzcyLTFmOTUtNDMxNy1hYWVmLWVhZTRhMzc3ZTNhYyIsImlhdCI6MTY1MjE3NjgyOCwiZXhwIjoxNjUzMDQwODI4fQ.tqXiUlY3dX8nR_m3vhoW0Cuy09crQ5wc_rf9eMUHQDE"
let idUser = "655721b8-f009-45fa-a2c7-619b182012e7";
let idPro = "3e111c84-c521-433a-8772-01ed497ed66b";
let idVou = "d4e13a05-96b3-4840-9099-6e41585ee98a";
let idOrder = "de2a1c42-61c5-4e47-9373-543f2c3669bc";
let idFlash = "2d6ca9b9-6345-4763-a20f-ab59fd45877b";
let idCate = "33b2ceee-24c6-4623-b12c-d63fa6f79b03";


//==========TEST API AUTH
{
  // describe('/POST user', () => {
  //   let user = {
  //     "username": "nkhuy1201",
  //     "password": "12345",
  //     "email": "test@gmail.com",
  //     "phone": "0987654332",
  //     "age": "20",
  //     "address": "hanoi"
  //   }
  //   it('it should register a new user', (done) => {
  //     chai.request(server)
  //       .post('/api/auth/register')
  //       .send(user)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.CREATED)
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.CREATED);
  //         done();
  //       })
  //   })
  // })

  // describe('/GET verify user', () => {
  //   let user = {
  //     token: "",
  //     id: ""
  //   }
  //   it('it should get verify a user', (done) => {
  //     chai.request(server)
  //       .get('/api/auth/verify')
  //       .send(user)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/POST login', () => {
  //   let user = {
  //     "email": "huynk@gmail.com",
  //     "password": "12345"
  //   }
  //   it('it should login', (done) => {
  //     chai.request(server)
  //       .post('/api/auth/login/')
  //       .send(user)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         res.body.data.should.have.property('token');
  //         res.body.data.should.have.property('refreshToken');
  //         token = res.body.data.token
  //         done();
  //       })
  //   })
  // })

  // describe('/POST to refresh token', () => {
  //   let user = {
  //     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgzNTlhYzcyLTFmOTUtNDMxNy1hYWVmLWVhZTRhMzc3ZTNhYyIsImlhdCI6MTY1MjE3NjgyOCwiZXhwIjoxNjUzMDQwODI4fQ.tqXiUlY3dX8nR_m3vhoW0Cuy09crQ5wc_rf9eMUHQDE"
  //   }
  //   it('it should post to refresh token', (done) => {
  //     chai.request(server)
  //       .post('/api/auth/refreshToken')
  //       .send(user)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         res.body.should.have.property('token');
  //         done();
  //       })
  //   })
  // })

  // describe('/PATCH to update PW', () => {
  // let user = {
  //   "oldPW": "12345",
  //   "newPW": "12345",
  //   "repeatNewPW": "12345"
  // }
  // it('it should patch to update PW', (done) => {
  //   chai.request(server)
  //     .patch('/api/auth/updatePW/')
  //     .set('authorization', 'Bearer ' + token)
  //     .send(user)
  //     .end((req, res) => {
  //       res.should.have.status(HTTP_CODE.SUCCESS)
  //       res.body.should.be.a('object');
  //       res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //       done();
  //     })
  // })
  // })

  // describe('/POST forgot PW', () => {
  //   let user = {
  //     "email": "khachuy469@gmail.com"
  // }
  //   it('it should post to forgot PW', (done) => {
  //     chai.request(server)
  //       .post('/api/auth/forgotPW')
  //       .send(user)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         res.body.should.have.property('check').eql(MESSAGE.SEND_MAIL);
  //         done();
  //       })
  //   })
  // })

  // describe('/PATCH to reset PW', () => {
  //   let user = {
  //     "newPassword": "1234567899",
  //     "repeatNewPassword": "1234567899"
  //   }
  //   it('it should patch to reset PW', (done) => {
  //     chai.request(server)
  //       .post('/api/auth/resetPW/' + reset)
  //       .send(user)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })
}

//===========TEST API USER
// {

// describe('/GET user', () => {
//   it('it should get all user', (done) => {
//     chai.request(server)
//       .get('/api/user/')
//       .set('authorization', 'Bearer ' + token)
//       .end((req, res) => {
//         res.should.have.status(HTTP_CODE.SUCCESS);
//         res.body.should.be.a('object');
//         res.body.should.have.property('isSuccess').eql(true);
//         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
//         done();
//       })
//   })
// })

// describe('/GET detail user', () => {
//   it('it should get detail a user', (done) => {
//     chai.request(server)
//       .get('/api/user/getme')
//       .set('authorization', 'Bearer ' + token)
//       .end((req, res) => {
//         res.should.have.status(HTTP_CODE.SUCCESS)
//         res.body.should.be.a('object');
//         res.body.should.have.property('isSuccess').eql(true);
//         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
//         res.body.data.should.be.a('object');
//         // res.body.data.user.should.have.property('id');
//         // res.body.data.user.should.have.property('data.username');
//         // res.body.data.user.should.have.property('password');
//         // res.body.data.user.should.have.property('age');
//         // res.body.data.user.should.have.property('email');
//         // res.body.data.user.should.have.property('status');
//         // res.body.data.user.should.have.property('phone');
//         // res.body.data.user.should.have.property('address');
//         done();
//       })
//   })
// })

// describe('/PATCH user', () => {
//   it('it should patch a user', (done) => {
//     const user = {
//       "address": "TP.HCM",
//       "age": "33",
//       "phone": "123456789",
//       "username": "admin"
//     }
//     chai.request(server)
//       .patch('/api/user/' + idUser)
//       .set('authorization', 'Bearer ' + token)
//       .send(user)
//       .end((req, res) => {
//         res.should.have.status(HTTP_CODE.SUCCESS)
//         res.body.should.be.a('object');
//         res.body.should.have.property('isSuccess').eql(true);
//         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
//         done();
//       })
//   })
// })

// describe('/DELETE Soft user', () => {
//   it('it should delete soft a user', (done) => {
//     chai.request(server)
//       .delete('/api/user/deletesoft/' + idUser)
//       .set('authorization', 'Bearer ' + token)
//       .end((req, res) => {
//         res.should.have.status(HTTP_CODE.SUCCESS)
//         res.body.should.be.a('object');
//         res.body.should.have.property('isSuccess').eql(true);
//         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
//         done();
//       })
//   })
// })

// describe('/DELETE hard user', () => {
//   it('it should delete hard a user', (done) => {
//     chai.request(server)
//       .delete('/api/user/' + idUser)
//       .set('authorization', 'Bearer ' + token)
//       .end((req, res) => {
//         res.should.have.status(HTTP_CODE.SUCCESS)
//         res.body.should.be.a('object');
//         res.body.should.have.property('isSuccess').eql(true);
//         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
//         done();
//       })
//   })
// })
// }

//==========TEST API PRODUCT
{
  // describe('/GET product', () => {
  //   it('it should get all product', (done) => {
  //     chai.request(server)
  //       .get('/api/product/')
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.data.should.be.a('object');
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/GET detail product', () => {
  //   it('it should get detail a product', (done) => {
  //     chai.request(server)
  //       .get('/api/product/' + idPro)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.be.a('object');
  //         res.body.data.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         // res.body.product.should.have.property('id').eql(idPro);
  //         // res.body.product.should.have.property('name');
  //         // res.body.product.should.have.property('barCode');
  //         // res.body.product.should.have.property('priceImport');
  //         // res.body.product.should.have.property('priceSelling');
  //         // res.body.product.should.have.property('weight');
  //         // res.body.product.should.have.property('quantity');
  //         // res.body.product.should.have.property('quantityDisplay');
  //         // res.body.product.should.have.property('description');
  //         // res.body.product.should.have.property('isDeleted');
  //         // res.body.product.should.have.property('categoryId');
  //         // res.body.product.should.have.property('quantityDisplay');
  //         done();
  //       })
  //   })
  // })

  // describe('/PATCH product', () => {
  //   it('it should patch a product', (done) => {
  //     chai.request(server)
  //       .patch('/api/product/' + idPro)
  //       .field("content-Type", "multipart/form-data")
  //       .field("name", "TEST11")
  //       .attach("image", fs.readFileSync("C:/Users/KhacHuy/Pictures/hinh1.jpg"), "C:\Users\KhacHuy\Pictures\hinh1.jpg")
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/DELETE Soft product', () => {
  //   let pro = {
  //     ids: [idPro]
  //   };
  //   it('it should delete soft a product', (done) => {
  //     chai.request(server)
  //       .delete('/api/product/deletesoft/')
  //       .set('authorization', 'Bearer ' + token)
  //       .send(pro)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/DELETE hard product', () => {
  //   let pro = {
  //     ids: [idPro]
  //   };
  //   it('it should delete hard a product', (done) => {
  //     chai.request(server)
  //       .delete('/api/product/')
  //       .set('authorization', 'Bearer ' + token)
  //       .send(pro)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/POST product', () => {
  //   it('it should create a new product', (done) => {
  //     chai.request(server)
  //       .post('/api/product/')
  //       .set('authorization', 'Bearer ' + token)
  //       .field('content-Type', 'multipart/form-data')
  //       .field("name", "TIVI TEST")
  //       .field("description", "new")
  //       .field("barCode", "12564")
  //       .field("priceImport", "500")
  //       .field("priceSelling", "520")
  //       .field("weight", "0.8")
  //       .field("quantity", "5")
  //       .field("categoryId", idCate)
  //       .attach("image", fs.readFileSync("C:/Users/KhacHuy/Pictures/hinh1.jpg"), "C:\Users\KhacHuy\Pictures\hinh1.jpg")
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.CREATED)
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.CREATED);
  //         done();
  //       })
  //   })
  // })

}

//==========TEST API VOUCHER
{
  // describe('/GET voucher', () => {
  //   it('it should get all voucher', (done) => {
  //     chai.request(server)
  //       .get('/api/voucher/')
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.be.a('object');
  //         res.body.data.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/GET detail voucher', () => {
  //   it('it should get detail a voucher', (done) => {
  //     chai.request(server)
  //       .get('/api/voucher/' + idVou)
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.be.a('object');
  //         res.body.data.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         // res.body.voucher.should.have.property('id').eql(idVou);
  //         // res.body.voucher.should.have.property('name');
  //         // res.body.voucher.should.have.property('voucherCode');
  //         // res.body.voucher.should.have.property('discountAmount');
  //         // res.body.voucher.should.have.property('quantity');
  //         // res.body.voucher.should.have.property('startDate');
  //         // res.body.voucher.should.have.property('expireDate');
  //         // res.body.voucher.should.have.property('isDeleted');
  //         done();
  //       })
  //   })
  // })

  // describe('/POST voucher', () => {
  //   let voucher = {
  //     "name": "New TEST",
  //     "discountAmount": "99",
  //     "expireDate": "2022-05-29 12:00:00",
  //     "quantity": "99"
  //   }
  //   it('it should create a new voucher', (done) => {
  //     chai.request(server)
  //       .post('/api/voucher/')
  //       .set('authorization', 'Bearer ' + token)
  //       .send(voucher)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.CREATED)
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.CREATED);
  //         done();
  //       })
  //   })
  // })

  // describe('/PATCH voucher', () => {
  //   let voucher = {
  //     "name": "TEST",
  //     "quantity": "99",
  //     "discountAmount": "999",
  //     "expireDate": "2022-05-29 12:00:00"
  //   }
  //   it('it should patch a voucher', (done) => {
  //     chai.request(server)
  //       .patch('/api/voucher/' + idVou)
  //       .set('authorization', 'Bearer ' + token)
  //       .send(voucher)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/DELETE Soft voucher', () => {
  //   it('it should delete soft a voucher', (done) => {
  //     chai.request(server)
  //       .delete('/api/voucher/deletesoft/' + idVou)
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.be.a('object');            
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/DELETE hard voucher', () => {
  //   it('it should delete hard a voucher', (done) => {
  //     chai.request(server)
  //       .delete('/api/voucher/' + idVou)
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.be.a('object');            
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

}

//=============TEST API ORDER
{
  // describe('/GET order', () => {
  //   it('it should get all order', (done) => {
  //     chai.request(server)
  //       .get('/api/order/')
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.data.should.be.a('object');
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/GET detail order', () => {
  //   it('it should get detail a order', (done) => {
  //     chai.request(server)
  //       .get('/api/order/' + idOrder)
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.data.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         // res.body.order.should.have.property('id').eql(idOrder);
  //         // res.body.order.should.have.property('totalPrice');
  //         // res.body.order.should.have.property('tax');
  //         // res.body.order.should.have.property('discount');
  //         // res.body.order.should.have.property('orderCode');
  //         // res.body.order.should.have.property('orderStatus');
  //         // res.body.order.should.have.property('voucherId');
  //         // res.body.order.should.have.property('userId');
  //         done();
  //       })
  //   })
  // })

  // describe('/GET your order', () => {
  //   it('it should get your order', (done) => {
  //     chai.request(server)
  //       .get('/api/order/myOrder')
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.be.a('object');
  //         res.body.data.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/POST order', () => {
  //   let order = {
  //     "product": [
  //       { "id": "ae5a39c9-f693-4ae9-a458-eb5098033680", "quantity": "10" },
  //       { "id": "6c8a83a7-270d-4e51-baea-10d20f91ac3d", "quantity": "2" }
  //     ],
  //     "voucherCode": "CODE-56678"
  //   }
  //   it('it should create a new order', (done) => {
  //     chai.request(server)
  //       .post('/api/order/')
  //       .set('authorization', 'Bearer ' + token)
  //       .send(order)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.CREATED)
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.CREATED);
  //         done();
  //       })
  //   })
  // })

  // describe('/PATCH confirm order', () => {
  //   it('it should patch to confirm a order', (done) => {
  //     chai.request(server)
  //       .patch('/api/order/confirm/' + idOrder)
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/PATCH shipping order', () => {
  //   it('it should patch to shipping a order', (done) => {
  //     chai.request(server)
  //       .patch('/api/order/shipping/' + idOrder)
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/PATCH delivere order', () => {
  //   it('it should patch to delivere a order', (done) => {
  //     chai.request(server)
  //       .patch('/api/order/delivere/' + idOrder)
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/PATCH done order', () => {
  //   it('it should patch to done a order', (done) => {
  //     chai.request(server)
  //       .patch('/api/order/done/' + idOrder)
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/DELETE cancel order', () => {
  //   it('it should patch to cancel a order', (done) => {
  //     chai.request(server)
  //       .delete('/api/order/cancel/' + idOrder)
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

}

//==========TEST API FLASHSALE
{
  // describe('/GET flashsale', () => {
  //   it('it should get all flashsale', (done) => {
  //     chai.request(server)
  //       .get('/api/flashsale/')
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS);
  //         res.body.should.be.a('object');
  //         res.body.data.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/GET detail flashsale', () => {
  //   it('it should get detail a flashsale', (done) => {
  //     chai.request(server)
  //       .get('/api/flashsale/' + idFlash)
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         res.body.data.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         // res.body.flashSale.should.have.property('id').eql(idFlash);
  //         // res.body.flashSale.should.have.property('name');
  //         // res.body.flashSale.should.have.property('description');
  //         // res.body.flashSale.should.have.property('startDate');
  //         // res.body.flashSale.should.have.property('endDate');
  //         done();
  //       })
  //   })
  // })

  // describe('/POST flashsale', () => {
  //   let flashsale = {
  //     "name": "Flash Sale TEST",
  //     "startDate": "2022-05-05 13:30:00",
  //     "endDate": "2022-05-07 13:30:00",
  //     "description": "Flash sale late day 01-05",
  //     "discountAmount": "30",
  //     "productId": ["0893ae40-71b9-4edc-b05b-31663db6e34b", "6c8a83a7-270d-4e51-baea-10d20f91ac3d"]
  // }
  //   it('it should create a new flashsale', (done) => {
  //     chai.request(server)
  //       .post('/api/flashsale/')
  //       .set('authorization', 'Bearer ' + token)
  //       .send(flashsale)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.CREATED)
  //         res.body.should.be.a('object');            
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.CREATED);
  //         done();
  //       })
  //   })
  // })

  // describe('/PATCH flashsale', () => {
  //   let flashsale = {
  //     "name": "Plus++",
  //     "startDate": "2022-04-30 15:30:00",
  //     "endDate": "2022-05-01 20:30:00",
  //     "description": "Flash sale day 01-05",
  //     "discountAmount": "100",
  //     "productId": ["0893ae40-71b9-4edc-b05b-31663db6e34b"]
  //   }
  //   it('it should patch a flashsale', (done) => {
  //     chai.request(server)
  //       .patch('/api/flashsale/' + idFlash)
  //       .set('authorization', 'Bearer ' + token)
  //       .send(flashsale)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS);
  //         res.body.should.be.a('object');            
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/DELETE Soft flashsale', () => {
  //   it('it should delete soft a flashsale', (done) => {
  //     chai.request(server)
  //       .delete('/api/flashsale/deletesoft/' + idFlash)
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         res.body.should.have.property('isSuccess').eql(true);
  //         done();
  //       })
  //   })
  // })

  // describe('/DELETE hard flashsale', () => {
  //   it('it should delete hard a flashsale', (done) => {
  //     chai.request(server)
  //       .delete('/api/flashsale/' + idFlash)
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         res.body.should.have.property('isSuccess').eql(true); 
  //         done();
  //       })
  //   })
  // })
}

//==========TEST API CATEGORY
{
  // describe('/GET category', () => {
  //   it('it should get all category', (done) => {
  //     chai.request(server)
  //       .get('/api/category/')
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.be.a('object');
  //         res.body.data.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/GET detail category', () => {
  //   it('it should get detail a category', (done) => {
  //     chai.request(server)
  //       .get('/api/category/' + idCate)
  //       .set('authorization', 'Bearer ' + token)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS);
  //         res.body.should.be.a('object');
  //         res.body.data.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         // res.body.category.should.have.property('id').eql(idCate);
  //         // res.body.category.should.have.property('name');
  //         // res.body.category.should.have.property('image');
  //         // res.body.category.should.have.property('status');
  //         // res.body.category.should.have.property('isDeleted');
  //         done();
  //       })
  //   })
  // })

  // describe('/POST category', () => {
  //   it('it should create a new category', (done) => {
  //     chai.request(server)
  //       .post('/api/category/')
  //       .set('authorization', 'Bearer ' + token)
  //       .field("content-Type", "multipart/form-data")
  //       .field("name", "TEST TEST")
  //       .attach("image", fs.readFileSync("C:/Users/KhacHuy/Pictures/hinh1.jpg"), "C:\Users\KhacHuy\Pictures\hinh1.jpg")
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.CREATED)
  //         res.body.should.be.a('object');            
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.CREATED);
  //         done();
  //       })
  //   })
  // })

  // describe('/PATCH update category', () => {
  //   it('it should patch a category', (done) => {
  //     chai.request(server)
  //       .patch('/api/category/' + idCate)
  //       .set('authorization', 'Bearer ' + token)
  //       .field("content-Type", "multipart/form-data")
  //       .field("name", "TEST++")
  //       .attach("image", fs.readFileSync("C:/Users/KhacHuy/Pictures/hinh1.jpg"), "C:\Users\KhacHuy\Pictures\hinh1.jpg")
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/DELETE Soft category', () => {
  //   let cate = {
  //     "ids": [idCate]
  //   }
  //   it('it should delete soft a category', (done) => {
  //     chai.request(server)
  //       .patch('/api/category/deletesoft/')
  //       .set('authorization', 'Bearer ' + token)
  //       .send(cate)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

  // describe('/DELETE hard category', () => {
  //   let cate = {
  //     "ids": [idCate]
  //   }
  //   it('it should delete hard a category', (done) => {
  //     chai.request(server)
  //       .delete('/api/category/')
  //       .set('authorization', 'Bearer ' + token)
  //       .send(cate)
  //       .end((req, res) => {
  //         res.should.have.status(HTTP_CODE.SUCCESS)
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('isSuccess').eql(true);
  //         res.body.should.have.property('message').eql(MESSAGE.SUCCESS);
  //         done();
  //       })
  //   })
  // })

}

