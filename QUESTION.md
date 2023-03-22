- với nhg API truyền parameter thì phải kiểm tra ntn với roleModule (url === api) vì có /:id   :ok
=> mỗi lần gọi api thì sẽ tạo 1 url chung nhất: (ví dụ với api sửa /api/product/1232435464565 thì chỉ đính kèm thêm 1 url mẫu là /api/product/:id để so sánh trong db, và trong db cũng chỉ cần) : ok

CÓ thể truyền vào tham sô của middleware permission(..., '/api/user/:id'): ok

- avatar và ảnh chi tiết của product  => Bỏ avatar của product : ok

? 2
- update lại xoá mềm:
  + Khi xoá category thì các sản phẩm có bị xoá cùng không: check xem category đó có sản phẩm không, nếu có thì không cho xoá, không có thì cho xoá: ok
  
- order: dùng với cron job

- thay bcryptjs bằng md5: ok

- delete cho xoá nhiều sản phẩm: ok



? 3
- Tại model để unique kèm với message thì làm sao để bắt được message đó: ok (để là msg)

- Làm sao để bắt lỗi khi 1 token bị nhập sai (ở refresh token và reset Token)

- Khi lấy all, thì nếu không có bản ghi nào thì trả về gì: mảng rỗng

- md5: khi người dùng đặt pw giống nhau thì hash cx sẽ giống nhau ???


? 4

- với cronjob thì có cần check xem flashSale hay voucher nào đã hết time và xoá đi k: ok

- khi  cancel thì cần có điều kiện j: đã giao xong thì k đc huỷ... : ok

- sửa lại title cho send mail: ok

- get order not confirm: ok

- phân trang và sắp xếp: ok

- update quantity voucher khi bị cancel order: ok




- validate: age: ok
- add api resendEmail: ok
- pageSize, pageIndex, totalSize, Totalpage: ok
- deletesoft => delete: ok
- filter: get product by category : ok




- validate page