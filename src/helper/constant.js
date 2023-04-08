module.exports = {
  DEFAULT_VALUE: {

    // STATUS ACTIVE
    IS_ACTIVE: 1,
    IS_NOT_ACTIVE: 0,

    // STATUS DELETE
    IS_DELETED: 1,
    IS_NOT_DELETED: 0,

    // CACULATE
    DEFAULT_DISCOUNT: 0,
    DEFAULT_QUANTITY: 1,
    DEFAULT_PERCENT: 0,
    DEFAULT_PRICE: 0,
    DEFAULT_TAX: 1 / 10,

    // STATUS ORDER
    DEFAULT_ORDER_STATUS: 1,

    // SORT
    DEFAULT_TITLE: 'createdAt',
    DEFAULT_TYPE_ORDER: 'DESC',


    // VERIFY ACCOUNT
    IS_VERIFY: 1,
    IS_NOT_VERIFY: 0,
    SALT_BCRYPT: 12,
    LENGTH_TOKEN_VERIFY: 6,
    MINUTE_VERIFY: 5,
    TYPE_DATE_VERIFY: 'm',

    // ID CUSTOMER
    IS_CUSTOMER: 'df7ccac8-7500-4695-b55d-0c4949cce586',

    // ORDER
    DEDAULT_QUANTITY: 1,
    VALUE_CREATE: 0,
    VALUE_CONFIRM: 1,
    VALUE_SHIPPING: 2,
    VALUE_DELIVERE: 3,
    VALUE_DONE: 4,

    // PERMISSIONS
    READ: 'isCanRead',
    DELETE: 'isCanDelete',
    EDIT: 'isCanEdit',
    ADD: 'isCanAdd',

  },

  HTTP_CODE: {
    SUCCESS: 200,
    CREATED: 201,
    DELETED: 204,
    BAD_REQUEST: 400,
    SERVER_ERROR: 500,
  },

  MESSAGE: {
    SUCCESS: 'Success',
    BAD_REQUEST: 'Bad request',
    CREATED: 'Created successfully',
    SERVER_ERROR: 'Server error',

    // AUTHENTICATION
    REGISTER_FAIL: 'Registration failed',
    LOGIN_FAILED: 'Login failed',
    INFOR_LACK: 'Fill all information',
    VERIFY_FAIL: 'Verify failed',
    CHECK_MAIL: 'Check mail to verify your account',
    IS_NOT_SAME: 'Information is not the same',
    NOT_LOGIN: 'You need login !',
    INFOR_WRONG: 'Information wrong',
    NOT_PERMISSTION: 'You are not permission',
    IS_NOT_VERIFY: 'You need verify account',

    // EMAIL
    SEND_MAIL: 'Check mail to update password',
    TITLE_FLASHSALE: 'ALO ALO ALO, Flash sale will start after 15 minute. Buy now !',

    // ORDER
    VOUCHER_INVALID: 'Voucher invalid',
    ORDER_IS_CANCEL: 'This order is canceled or not confirm',
    IS_OUT: 'Quantity is out',
    NOT_CONFIRM: 'This order is at confirmed status',
    NOT_SHIPPING: 'This order is not at confirm status',
    NOT_DELIVERE: 'This order is not at shipping status',
    NOT_DONE: 'This order is not at delivere status',
    NOT_CANCEL: 'Order can not cancel',
    KHONG_XOA_COMMENT: 'Không thể xoá nhận xét của người khác'
  }
}