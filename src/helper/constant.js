module.exports = {
  DEFAULT_VALUE: {
    // STATUS ACTIVE
    IS_ACTIVE: 1,
    IS_NOT_ACTIVE: 0,

    IS_ONLINE: 2,
    IS_OFFLINE: 1,

    // STATUS DELETE
    IS_DELETED: 1,
    IS_NOT_DELETED: 0,

    // CACULATE
    DEFAULT_DISCOUNT: 0,
    DEFAULT_QUANTITY: 1,
    DEFAULT_PERCENT: 0,
    DEFAULT_PRICE: 0,
    DEFAULT_TAX: 0,

    // STATUS ORDER
    DEFAULT_ORDER_STATUS: 1,

    // SORT
    DEFAULT_TITLE: "createdAt",
    DEFAULT_TYPE_ORDER: "DESC",

    // VERIFY ACCOUNT
    IS_VERIFY: 1,
    IS_NOT_VERIFY: 0,
    SALT_BCRYPT: 12,
    LENGTH_TOKEN_VERIFY: 6,
    MINUTE_VERIFY: 5,
    TYPE_DATE_VERIFY: "m",

    // ID CUSTOMER
    IS_CUSTOMER: "df7ccac8-7500-4695-b55d-0c4949cce586",

    // ORDER
    DEDAULT_QUANTITY: 1,
    VALUE_CREATE: 0,
    VALUE_CONFIRM: 1,
    VALUE_SHIPPING: 2,
    VALUE_DELIVERE: 3,
    VALUE_DONE: 4,
    VALUE_CANCEL: 5,

    // PERMISSIONS
    READ: "isCanRead",
    DELETE: "isCanDelete",
    EDIT: "isCanEdit",
    ADD: "isCanAdd",
  },

  HTTP_CODE: {
    SUCCESS: 200,
    CREATED: 201,
    DELETED: 204,
    BAD_REQUEST: 400,
    SERVER_ERROR: 500,
  },

  MESSAGE: {
    SUCCESS: "Thành công",
    BAD_REQUEST: "Thất bại",
    CREATED: "Tạo thành công",
    SERVER_ERROR: "Lỗi server",

    // AUTHENTICATION
    REGISTER_FAIL: "Đăng ký thất bại!",
    LOGIN_FAILED: "Đăng nhập thất bại!",
    INFOR_LACK: "Hãy điền đầy đủ thông tin!",
    VERIFY_FAIL: "Xác thực thất bại",
    CHECK_MAIL: "Kiểm tra email để xác thực tài khoản của bạn",
    IS_NOT_SAME: "Thông tin không khớp",
    NOT_LOGIN: "Bạn cần đăng nhập !",
    INFOR_WRONG: "Thông tin không chính xác",
    NOT_PERMISSTION: "Bạn không có quyền!",
    IS_NOT_VERIFY: "Bạn cần xác thực tài khoản!",

    // EMAIL
    SEND_MAIL: "Kiểm tra email để cập nhật mật khẩu",
    TITLE_FLASHSALE:
      "ALO ALO ALO, Flash sale sẽ bắt đầu sau 15 phút nữa. Bắt đầu mua sách tại KhacHuy Shop ngay !",

    // ORDER
    VOUCHER_INVALID: "Voucher không hợp lệ",
    ORDER_IS_CANCEL: "Đơn hàng này đã bị huỷ",
    IS_OUT: "Số lượng đã hết",
    NOT_CONFIRM: "Đơn đặt hàng này ở trạng thái xác nhận",
    NOT_SHIPPING: "Đơn đặt hàng này không ở trạng thái xác nhận",
    NOT_DELIVERE: "Đơn đặt hàng này không ở trạng thái chờ giao",
    NOT_DONE: "Đơn đặt hàng này không ở trạng thái đang giao hàng",
    NOT_CANCEL: "Đặt hàng không thể hủy bỏ",
    KHONG_XOA_COMMENT: "Không thể xoá nhận xét của người khác",

    DELETE_FALSE: "Không thể xoá sách này!",

  },
};
