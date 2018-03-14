webpackJsonp([7],{

/***/ 1009:
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(629);
var stash = __webpack_require__(689);
var md5 = __webpack_require__(1349);

var collection = {
  seperator: '###',
  limit: 1,
  report_url: 'https://statistics.pingxx.com/one_stats',
  timeout: 100
};
var getParam = function(str, param) {
  var reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)', 'i');
  var r = str.substr(0).match(reg);
  if (r !== null) return unescape(r[2]);
  return null;
};
var getUserAgent = function() {
  return navigator.userAgent;
};
var getHost = function() {
  return window.location.host;
};

collection.store = function(obj) {
  if (typeof localStorage === 'undefined' || localStorage === null) return;
  var _this = this;
  var reportData = {};
  reportData.app_id = obj.app_id || stash.app_id || 'app_not_defined';
  reportData.ch_id = obj.ch_id || '';
  reportData.channel = obj.channel || '';
  reportData.type = obj.type || '';
  reportData.user_agent = getUserAgent();
  reportData.host = getHost();
  reportData.time = new Date().getTime();
  reportData.puid = stash.puid;

  var reportStr = 'app_id=' + reportData.app_id +
    '&channel=' + reportData.channel + '&ch_id=' + reportData.ch_id +
    '&host=' + reportData.host + '&time=' + reportData.time +
    '&type=' + reportData.type + '&user_agent=' + reportData.user_agent +
    '&puid=' + reportData.puid;

  var statsToSave = reportStr;
  if (localStorage.getItem('PPP_ONE_STATS') !== null &&
    localStorage.getItem('PPP_ONE_STATS').length !== 0
  ) {
    statsToSave = localStorage.getItem('PPP_ONE_STATS') +
      _this.seperator + reportStr;
  }
  try {
    localStorage.setItem('PPP_ONE_STATS', statsToSave);
  } catch (e) {
    /* empty */
  }
};

collection.send = function() {
  if (typeof localStorage === 'undefined' || localStorage === null) return;
  var _this = this;
  var pppOneStats = localStorage.getItem('PPP_ONE_STATS');
  if (pppOneStats === null ||
    pppOneStats.split(_this.seperator).length < _this.limit) {
    return;
  }
  try {
    var data = [];
    var origin = pppOneStats.split(_this.seperator);
    var token = md5(origin.join('&'));

    for (var i = 0; i < origin.length; i++) {
      data.push({
        app_id: getParam(origin[i], 'app_id'),
        channel: getParam(origin[i], 'channel'),
        ch_id: getParam(origin[i], 'ch_id'),
        host: getParam(origin[i], 'host'),
        time: getParam(origin[i], 'time'),
        type: getParam(origin[i], 'type'),
        user_agent: getParam(origin[i], 'user_agent'),
        puid: getParam(origin[i], 'puid')
      });
    }

    utils.request(_this.report_url, 'POST', data, function(data, status) {
      if (status == 200) {
        localStorage.removeItem('PPP_ONE_STATS');
      }
    }, undefined, {
      'X-Pingpp-Report-Token': token
    });
  } catch (e) {
    /* empty */
  }
};

collection.report = function(obj) {
  var _this = this;
  _this.store(obj);
  setTimeout(function(){
    _this.send();
  }, _this.timeout);
};

module.exports = collection;


/***/ }),

/***/ 1010:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by dong on 2016/12/30.
 */

var callbacks = __webpack_require__(646);
var hasOwn = {}.hasOwnProperty;

module.exports = {
  id: null,
  or_id: null,
  channel: null,
  app: null,
  credential: {},
  extra: null,
  livemode: null,
  order_no: null,
  time_expire: null,

  init: function (charge_or_order) {
    var charge;
    if (typeof charge_or_order === 'string') {
      try {
        charge = JSON.parse(charge_or_order);
      } catch (err) {
        callbacks.innerCallback('fail',
          callbacks.error('json_decode_fail', err));
        return;
      }
    } else {
      charge = charge_or_order;
    }

    if (typeof charge === 'undefined') {
      callbacks.innerCallback('fail', callbacks.error('json_decode_fail'));
      return;
    }

    if (hasOwn.call(charge, 'object') && charge.object == 'order') {
      charge.or_id = charge.id;
      charge.order_no = charge.merchant_order_no;
      var charge_essentials = charge.charge_essentials;
      charge.channel = charge_essentials.channel;
      charge.credential = charge_essentials.credential;
      charge.extra = charge_essentials.extra;
      if(hasOwn.call(charge, 'charge') && charge.charge != null) {
        charge.id = charge.charge;
      } else if(hasOwn.call(charge_essentials, 'id')
        && charge_essentials.id != null) {
        charge.id = charge_essentials.id;
      } else if(hasOwn.call(charge, 'charges')) {
        for(var i = 0; i < charge.charges.data.length; i++){
          if(charge.charges.data[i].channel === charge_essentials.channel) {
            charge.id = charge.charges.data[i].id;
            break;
          }
        }
      }
    } else if(hasOwn.call(charge, 'object') && charge.object == 'recharge') {
      charge = charge.charge;
    }

    for (var key in this) {
      if (hasOwn.call(charge, key)) {
        this[key] = charge[key];
      }
    }
    return this;
  },

  clear: function () {
    for (var key in this) {
      if (typeof this[key] !== 'function') {
        this[key] = null;
      }
    }
  }
};

/***/ }),

/***/ 1058:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = __webpack_require__(35);

var _resource = __webpack_require__(31);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var allChannel = {
  alipay: '支付宝App支付',
  alipay_wap: '支付宝手机网页支付',
  alipay_qr: '支付宝扫码支付',
  alipay_scan: '支付宝条码支付',
  alipay_pc_direct: '支付宝电脑网站支付',
  bfb: '百度钱包App支付',
  bfb_wap: '百度手机网页支付',
  wx: '微信App支付',
  wx_pub: '微信公众号支付',
  wx_wap: '微信H5支付',
  wx_lite: '微信小程序支付',
  wx_pub_qr: '微信公众号扫码支付',
  wx_pub_scan: '微信公众号刷卡支付',
  qpay: 'QQ钱包支付',
  applepay_upacp: 'Apple Pay'
};

var defaultAvatar = (0, _resource.resolveImage)(__webpack_require__(75));

var Account = {
  props: {
    detail: Object
  },

  data: function data() {
    return {
      allChannel: allChannel
    };
  },

  methods: {
    getAvatar: function getAvatar(avatar) {
      if (avatar) return avatar;

      return defaultAvatar;
    },
    jumpToUserFeeds: function jumpToUserFeeds() {
      var _detail$account = this.detail.account,
          account = _detail$account === undefined ? '' : _detail$account;

      this.$router.push('/users/feeds/' + account);
    }
  },

  computed: {
    link: function link() {
      var _detail$channel = this.detail.channel,
          channel = _detail$channel === undefined ? '' : _detail$channel;


      return channel === 'user';
    },
    user: function user() {
      var _detail = this.detail,
          _detail$account2 = _detail.account,
          account = _detail$account2 === undefined ? '' : _detail$account2,
          _detail$channel2 = _detail.channel,
          channel = _detail$channel2 === undefined ? '' : _detail$channel2;


      if (!account && !channel) return {};

      var user = {};
      if (channel === 'user') {
        user = this.$storeLocal.get('user_' + account);
      }

      if (_.keys(user).length > 0) return user;

      (0, _user.getUserInfo)(account).then(function (user) {
        return user;
      });
    }
  }
};

exports.default = Account;

/***/ }),

/***/ 1059:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = __webpack_require__(3);

var _assign2 = _interopRequireDefault(_assign);

var _extends = _assign2.default || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var _pingppJs = __webpack_require__(1350);

var _pingppJs2 = _interopRequireDefault(_pingppJs);

var _request = __webpack_require__(8);

var _Back = __webpack_require__(44);

var _Back2 = _interopRequireDefault(_Back);

var _RightArrow = __webpack_require__(204);

var _RightArrow2 = _interopRequireDefault(_RightArrow);

var _lodash = __webpack_require__(9);

var _lodash2 = _interopRequireDefault(_lodash);

var _es = __webpack_require__(59);

var _es2 = _interopRequireDefault(_es);

var _balance = __webpack_require__(77);

var _vuex = __webpack_require__(18);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Balance = {
  components: {
    BackIcon: _Back2.default,
    RightArrowIcon: _RightArrow2.default
  },
  data: function data() {
    return {
      goldName: window.TS_WEB.goldName,
      isWeixin: window.TS_WEB.isWeiXin, // 微信客户端
      showSpinner: false, // 加载动画开关
      system: {
        ratio: 100, // 显示比例
        recharge_type: [], // 充值方式
        cash: [], // 提现方式
        rule: '', // 提现/充值规则
        case_min_amount: 1, // 最低提现真实金额
        labels: [] // 充值选项
      },
      rechargeOpen: false, // 开启充值modal
      customRecharge: '', // 自定义充值金额
      balance: 0, // 账户余额
      rechargeNum: 0, // 充值金额
      withdrawNum: '', // 提现金额
      records: [], // 细明记录
      withdrawRecords: [], // 提现细明
      modal_loading: false,
      rechargeType: '', // 充值方式
      withdrawOpen: false, // 提现modal开关
      withdrawType: '', // 提现账号类型 支付宝/微信
      account: '' // 提现账户
    };
  },

  mounted: function mounted() {
    var _this = this;

    var _user$wallet$balance = this.user.wallet.balance,
        balance = _user$wallet$balance === undefined ? 0 : _user$wallet$balance;

    this.balance = balance;

    this.wallet(); // 获取钱包配置

    var charge = this.$storeLocal.get('chargeId');
    if (charge) {
      (0, _request.addAccessToken)().get((0, _request.createAPI)('wallet/charges/' + charge + '?mode=retrieve'), {
        validataStatus: function validataStatus(status) {
          return status === 200;
        }
      }).then(function (_ref) {
        var _ref$data = _ref.data;
        _ref$data = _ref$data === undefined ? {} : _ref$data;
        var _ref$data$status = _ref$data.status,
            status = _ref$data$status === undefined ? 0 : _ref$data$status,
            _ref$data$amount = _ref$data.amount,
            amount = _ref$data$amount === undefined ? 1 : _ref$data$amount,
            _ref$data$action = _ref$data.action,
            action = _ref$data$action === undefined ? 1 : _ref$data$action;

        _this.$storeLocal.remove('chargeId');
        if (!status) {
          _this.$Message.warning({
            content: '充值未成功,请稍后在细明中查询',
            duration: 3
          });
          return;
        }
        if (status) {
          if (action === 1) {
            _this.balance = _this.balance += amount;
            _this.$Message.success({
              content: '充值成功',
              duration: 3
            });
            return;
          }

          if (action === 2) {
            _this.$Message.success({
              content: '操作成功',
              duration: 3
            });
            return;
          }
        }
      });
      // 正常逻辑
    }
  },


  watch: {
    customRecharge: function customRecharge(newcustomRecharge) {
      if (newcustomRecharge !== '') {
        this.resetRecharge();
      }
    }
  },

  methods: {
    showAmount: _balance.showAmount,
    /**
     * 充值操作
     * @return {[type]} [description]
     */
    doRecharge: function doRecharge() {
      var _this2 = this;

      var customRecharge = this.customRecharge,
          rechargeNum = this.rechargeNum,
          balance = this.balance,
          rechargeType = this.rechargeType;

      if (!customRecharge && !rechargeNum || !rechargeType) {
        return;
      }

      var data = {};
      if (customRecharge) data.amount = (0, _balance.trueAmount)(customRecharge);
      if (rechargeNum) data.amount = rechargeNum;

      data.type = rechargeType;

      if (rechargeType === 'alipay_wap') {
        data = _extends({}, data, {
          extra: {
            success_url: (0, _request.createRequestURI)('h5/balance')
          }
        });
      }

      (0, _request.addAccessToken)().post((0, _request.createAPI)('wallet/recharge'), _extends({}, data), {
        validataStatus: function validataStatus(status) {
          return status === 201;
        }
      }).then(function (_ref2) {
        var _ref2$data = _ref2.data,
            _ref2$data$charge = _ref2$data.charge,
            charge = _ref2$data$charge === undefined ? {} : _ref2$data$charge,
            id = _ref2$data.id;

        _this2.$storeLocal.set('chargeId', id);
        _pingppJs2.default.createPayment(charge, function (result, err) {
          if (result == "success") {
            // payment succeeded
          } else {
            console.log(result + " " + err.msg + " " + err.extra);
          }
        });
      });
    },

    /**
     * 提现申请操作
     * @return {[type]} [description]
     */
    doWithdraw: function doWithdraw() {
      var _this3 = this;

      var account = this.account,
          withdrawNum = this.withdrawNum,
          withdrawType = this.withdrawType;

      if (!account || !withdrawNum || !withdrawType) {
        return;
      }

      (0, _request.addAccessToken)().post((0, _request.createAPI)('wallet/cashes'), {
        account: account,
        type: withdrawType,
        value: (0, _balance.trueAmount)(withdrawNum)
      }, {
        validataStatus: function validataStatus(status) {
          return status === 201;
        }
      }).then(function () {
        _this3.$Message.info({
          content: '提交成功,等待审核',
          duration: 3
        });
        _this3.withdrawOpen = false;
        _this3.resetAllWithdraw();
      }).catch(function (_ref3) {
        var data = _ref3.response.data;

        _this3.$Message.error({
          content: (0, _es2.default)(data).getMessage(),
          duration: 3
        });
      });
    },

    /**
     * 开启充值modal
     * @return {[type]} [description]
     */
    openRecharge: function openRecharge() {
      this.rechargeOpen = true;
    },

    /**
     * 开启提现modal
     * @return {[type]} [description]
     */
    openWithdraw: function openWithdraw() {
      this.withdrawOpen = true;
    },

    /**
     * 获取钱包配置
     * @return {[type]} [description]
     */
    wallet: function wallet() {
      var _this4 = this;

      (0, _request.addAccessToken)().get((0, _request.createAPI)('wallet'), {
        validataStatus: function validataStatus(status) {
          return status === 200;
        }
      }).then(function (_ref4) {
        var _ref4$data = _ref4.data,
            data = _ref4$data === undefined ? {} : _ref4$data;

        _this4.system = _extends({}, _this4.system, data);
        _this4.$storeLocal.set('ratio', data.ratio);
        if (!_this4.$storeLocal.get('showChargeRule')) {
          _this4.showRule();
          _this4.$storeLocal.set('showChargeRule', 1);
        }
      });
    },


    /**
     * 重置充值金额
     * @return {[type]} [description]
     */
    resetAllRecharge: function resetAllRecharge() {
      this.customRecharge = '';
      this.rechargeNum = 0;
      this.rechargeType = '';
    },


    /**
     * 重置提现选项
     * @return {[type]} [description]
     */
    resetAllWithdraw: function resetAllWithdraw() {
      this.withdrawNum = '';
      this.withdrawType = '';
      this.account = '';
    },

    /**
     * 自定义金额时将选项置空
     * @return {[type]} [description]
     */
    resetRecharge: function resetRecharge() {
      this.rechargeNum = 0;
    },
    setRecharge: function setRecharge(num) {
      this.rechargeNum = num;
      this.customRecharge = '';
    },
    showRule: function showRule() {
      var _system$rule = this.system.rule,
          rule = _system$rule === undefined ? '' : _system$rule;

      this.$Modal.info({
        title: '充值/提现规则',
        content: rule,
        okText: '朕知道了'
      });
    }
  },

  computed: _extends({}, (0, _vuex.mapState)({
    user: function user(state) {
      return state.users.mine;
    }
  }), {
    rechargeTypes: function rechargeTypes() {
      var rechargeTypes = [];
      var _system = this.system;
      _system = _system === undefined ? {} : _system;
      var _system$recharge_type = _system.recharge_type,
          types = _system$recharge_type === undefined ? [] : _system$recharge_type;

      if (_lodash2.default.indexOf(types, 'alipay_wap') !== -1 && !this.isWeixin) {
        rechargeTypes.push({
          value: 'alipay_wap',
          label: '支付宝'
        });
      }

      if (_lodash2.default.indexOf(types, 'wx_wap') !== -1 && this.isWeixin) {
        rechargeTypes.push({
          value: 'wx_wap',
          label: '微信'
        });
      }

      return rechargeTypes || [];
    },
    withdrawTypes: function withdrawTypes() {
      var withdrawTypes = [];
      var _system$cash = this.system.cash,
          cash = _system$cash === undefined ? [] : _system$cash;

      if (_lodash2.default.indexOf(cash, 'alipay') !== -1) {
        withdrawTypes.push({
          label: '支付宝',
          value: 'alipay'
        });
      }

      if (_lodash2.default.indexOf(cash, "wechat") !== -1) {
        withdrawTypes.push({
          label: '微信',
          value: 'wechat'
        });
      }

      return withdrawTypes || [];
    }
  })
};

exports.default = Balance;

/***/ }),

/***/ 1060:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = __webpack_require__(12);

var _from2 = _interopRequireDefault(_from);

var _assign = __webpack_require__(3);

var _assign2 = _interopRequireDefault(_assign);

var _extends = _assign2.default || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var _Back = __webpack_require__(44);

var _Back2 = _interopRequireDefault(_Back);

var _request = __webpack_require__(8);

var _Account = __webpack_require__(1380);

var _Account2 = _interopRequireDefault(_Account);

var _resource = __webpack_require__(31);

var _balance = __webpack_require__(77);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return (0, _from2.default)(arr); } }

var nothingImg = (0, _resource.resolveImage)(__webpack_require__(201));

var BalanceRecords = {
  components: {
    BackIcon: _Back2.default,
    AccountComponent: _Account2.default
  },
  data: function data() {
    return {
      detailOpen: false,
      detailIndex: -1,
      showSpinner: false,
      isWeixin: window.TS_WEB.isWeiXin,
      records: [],
      action: '',
      limit: 20, // 单页数量
      after: 0, // 分页节点
      bottomAllLoaded: false,
      topAllLoaded: false,
      bottomStatus: '',
      topStatus: '',
      wrapperHeight: 0
    };
  },

  created: function created() {
    this.getRecords();
  },


  methods: {
    showAmount: _balance.showAmount,
    /**
     * 底部加载更多
     * @return {[type]} [description]
     */
    loadBottom: function loadBottom() {
      this.getRecords('loadMore');
    },

    /**
     * 加载新的记录
     * @return {[type]} [description]
     */
    loadTop: function loadTop() {
      this.getRecords('loadNew');
    },

    /**
     * 底部状态改变
     * @param  {[type]} status [description]
     * @return {[type]}        [description]
     */
    bottomStatusChange: function bottomStatusChange(status) {
      this.bottomStatus = status;
    },

    /**
     * 开启modal
     * @param  {[type]} index 列表的index
     * @return {[type]} null
     */
    showDetail: function showDetail(index) {
      this.$refs.wrapper.style.overflowY = 'hidden';
      this.detailOpen = true;
      this.detailIndex = index;
    },

    /**
     * 关闭modal
     * @return {[type]} [description]
     */
    closeModal: function closeModal() {
      var _this = this;

      setTimeout(function () {
        _this.detailIndex = -1;
        _this.$refs.wrapper.style.overflow = 'scroll';
      }, 500);
    },

    /**
     * 回到上一页
     * @return {[type]} [description]
     */
    goBack: function goBack() {
      if (window.history.length < 2) {
        this.$router.push('/balance');
        return;
      }
      this.$router.back();
    },

    /**
     * 设置细明类型
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    recordsType: function recordsType(name) {
      this.after = 0;
      this.bottomAllLoaded = false;
      this.topAllLoaded = false;
      if (name === 'in') this.action = 1;
      if (name === 'out') this.action = 0;
      if (name === 'all') this.action = '';
    },
    localDateTime: function localDateTime(time) {
      var date = new Date(time.replace(/-/g, '/'));
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var h = date.getHours();
      var i = date.getMinutes();
      var d = date.getDate();

      var s = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");

      var w = s[date.getDay()];

      if (m >= 1 && m <= 9) m = "0" + m;
      if (d >= 1 && d <= 9) d = "0" + d;
      if (h >= 0 && h <= 9) h = "0" + h;
      if (i >= 0 && i <= 9) i = "0" + i;

      return y + '-' + m + '-' + d + ' ' + w + ' ' + h + ':' + i;
    },
    localTime: function localTime(dateString) {
      var newDate = new Date(dateString.replace(/-/g, '/'));
      var today = new Date().toLocaleDateString();
      var yesterday = new Date(new Date() - 86400000).toLocaleDateString();
      var createdString = newDate.toLocaleDateString();
      var week = '';
      var weekDay = '';
      var date = '';
      if (createdString !== today && createdString !== yesterday) {
        week = newDate.getDay();
        switch (week) {
          case 1:
            weekDay = '周一';
            break;
          case 2:
            weekDay = '周二';
            break;
          case 3:
            weekDay = '周三';
            break;
          case 4:
            weekDay = '周四';
            break;
          case 5:
            weekDay = '周五';
            break;
          case 6:
            weekDay = '周六';
            break;
          case 0:
            weekDay = '周日';
            break;
        };
      }

      if (createdString === today) {
        weekDay = '今天';
      }
      if (createdString === yesterday) {
        weekDay = '昨天';
      }
      return {
        weekDay: weekDay,
        date: newDate.getMonth() + 1 + '-' + newDate.getDate()
      };
    },

    /**
     * 获取记录列表
     * @param  {String} type [description]
     * @return {[type]}      [description]
     */
    getRecords: function getRecords() {
      var _this2 = this;

      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'new';

      if (type === 'new') this.showSpinner = true;
      var after = this.after,
          limit = this.limit,
          action = this.action;

      var data = {};
      data.limit = limit;
      if (after && type === 'loadMore') data.after = after;
      if (action !== '') data.action = action;

      (0, _request.addAccessToken)().get((0, _request.createAPI)('wallet/charges'), {
        params: _extends({}, data)
      }, {
        validataStatus: function validataStatus(status) {
          return status === 200;
        }
      }).then(function (_ref) {
        var data = _ref.data;

        if (data.length < _this2.limit) _this2.bottomAllLoaded = true; // 底部加载完毕

        if (type === 'new') _this2.showSpinner = false;

        if (type === 'new') {
          _this2.records = data;
          _this2.after = _.last(data)['id'];

          return;
        }

        if (type === 'loadMore') {
          _this2.records = [].concat(_toConsumableArray(_this2.records), _toConsumableArray(data));
          _this2.after = _.last(data)['id'];
          setTimeout(function () {
            _this2.$refs.loadmore.onBottomLoaded();
          }, 800);

          return;
        }

        if (type === 'loadNew') {
          _this2.records = _.uniqBy([].concat(_toConsumableArray(data), _toConsumableArray(_this2.records)), 'id');
          setTimeout(function () {
            _this2.$refs.loadmore.onTopLoaded();
          }, 800);

          return;
        }
      });
    }
  },

  watch: {
    action: function action(newAction) {
      this.getRecords();
    }
  },

  computed: {
    nothing: function nothing() {
      return this.records.length == 0 ? nothingImg : 0;
    },
    detail: function detail() {
      var detailIndex = this.detailIndex;

      if (detailIndex === -1) return {};
      var detail = this.records[detailIndex] || {};

      return detail;
    },
    time: function time() {
      return this.detail.created_at;
    },

    /**
     * 下拉菜单文字
     * @return {[type]} [description]
     */
    menuText: function menuText() {
      var action = this.action;

      if (action === 1) return '收入';
      if (action === 0) return '支出';

      return '全部';
    }
  },
  mounted: function mounted() {
    this.wrapperHeight = document.documentElement.clientHeight - 46;
  }
};

exports.default = BalanceRecords;

/***/ }),

/***/ 1061:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = __webpack_require__(12);

var _from2 = _interopRequireDefault(_from);

var _request = __webpack_require__(8);

var _resource = __webpack_require__(31);

var _Back = __webpack_require__(44);

var _Back2 = _interopRequireDefault(_Back);

var _lodash = __webpack_require__(9);

var _lodash2 = _interopRequireDefault(_lodash);

var _balance = __webpack_require__(77);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return (0, _from2.default)(arr); } } //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var nothingImg = (0, _resource.resolveImage)(__webpack_require__(201));

var BalanceWithdraw = {
  components: {
    BackIcon: _Back2.default
  },
  data: function data() {
    return {
      showSpinner: false,
      isWeixin: window.TS_WEB.isWeiXin,
      withdrawRecords: [],
      limit: 20,
      after: 0,
      detailOpen: false,
      detailIndex: -1,
      bottomAllLoaded: true,
      topAllLoaded: false,
      bottomStatus: '',
      topStatus: '',
      wrapperHeight: 0
    };
  },

  created: function created() {
    this.getWithdraws();
  },


  methods: {
    showAmount: _balance.showAmount,
    getWithdraws: function getWithdraws() {
      var _this = this;

      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'new';

      if (type === 'new') this.showSpinner = true;
      var limit = this.limit,
          after = this.after;

      var params = {
        limit: limit
      };

      if (type === 'loadMore') params.after = after;

      (0, _request.addAccessToken)().get((0, _request.createAPI)('wallet/cashes'), {
        params: params
      }, {
        validataStatus: function validataStatus(status) {
          return status === 200;
        }
      }).then(function (_ref) {
        var _ref$data = _ref.data,
            data = _ref$data === undefined ? [] : _ref$data;

        _this.bottomAllLoaded = true;
        var length = data.length;

        if (length == _this.limit && type !== 'loadNew') _this.bottomAllLoaded = false; // 底部加载完毕

        if (type === 'new') {
          _this.withdrawRecords = data;
          _this.showSpinner = false;
          _this.after = _lodash2.default.last(data)['id'];
          data = [];

          return;
        }

        if (type === 'loadMore') {
          _this.after = _lodash2.default.last(data)['id'];
          _this.withdrawRecords = _lodash2.default.uniqBy([].concat(_toConsumableArray(_this.withdrawRecords), _toConsumableArray(data)), 'id');
          setTimeout(function () {
            _this.$refs.loadmore.onBottomLoaded();
          }, 800);
          data = [];

          return;
        }

        if (type === 'loadNew') {
          _this.withdrawRecords = _lodash2.default.uniqBy([].concat(_toConsumableArray(data), _toConsumableArray(_this.withdrawRecords)), 'id');
          setTimeout(function () {
            _this.$refs.loadmore.onTopLoaded();
          }, 800);
          data = [];

          return;
        }
      });
      // .catch(({ response: { data } }) => {
      //   console.log(data);
      // })
    },

    /**
     * 底部加载更多
     * @return {[type]} [description]
     */
    loadBottom: function loadBottom() {
      this.getWithdraws('loadMore');
    },

    /**
     * 加载新的记录
     * @return {[type]} [description]
     */
    loadTop: function loadTop() {
      this.getWithdraws('loadNew');
    },

    /**
     * 底部状态改变
     * @param  {[type]} status [description]
     * @return {[type]}        [description]
     */
    bottomStatusChange: function bottomStatusChange(status) {
      this.bottomStatus = status;
    },

    /**
     * 开启modal
     * @param  {[type]} index 列表的index
     * @return {[type]} null
     */
    showDetail: function showDetail(index) {
      this.$refs.wrapper.style.overflowY = 'hidden';
      this.detailOpen = true;
      this.detailIndex = index;
    },

    /**
     * 关闭modal
     * @return {[type]} [description]
     */
    closeModal: function closeModal() {
      var _this2 = this;

      setTimeout(function () {
        _this2.detailIndex = -1;
        _this2.$refs.wrapper.style.overflow = 'scroll';
      }, 500);
    },

    /**
     * 回到上一页
     * @return {[type]} [description]
     */
    goBack: function goBack() {
      if (window.history.length < 2) {
        this.$router.push('/balance');
        return;
      }
      this.$router.back();
    },
    localDateTime: function localDateTime(time) {
      return new Date(time + 'Z').toLocaleString();
    },
    localTime: function localTime(dateString) {
      dateString = dateString + 'Z';
      var newDate = new Date(dateString);
      var today = new Date().toLocaleDateString();
      var yesterday = new Date(new Date() - 86400000).toLocaleDateString();
      var createdString = newDate.toLocaleDateString();
      var week = '';
      var weekDay = '';
      var date = '';
      if (createdString !== today && createdString !== yesterday) {
        week = newDate.getDay();
        switch (week) {
          case 1:
            weekDay = '周一';
            break;
          case 2:
            weekDay = '周二';
            break;
          case 3:
            weekDay = '周三';
            break;
          case 4:
            weekDay = '周四';
            break;
          case 5:
            weekDay = '周五';
            break;
          case 6:
            weekDay = '周六';
            break;
          case 0:
            weekDay = '周日';
            break;
        };
      }

      if (createdString === today) {
        weekDay = '今天';
      }
      if (createdString === yesterday) {
        weekDay = '昨天';
      }
      return {
        weekDay: weekDay,
        date: newDate.getMonth() + 1 + '-' + newDate.getDate()
      };
    }
  },

  computed: {
    nothing: function nothing() {
      return this.withdrawRecords.length == 0 ? nothingImg : 0;
    },
    detail: function detail() {
      var detailIndex = this.detailIndex;

      if (detailIndex === -1) return {};
      var detail = this.withdrawRecords[detailIndex] || {};

      return detail;
    }
  },
  mounted: function mounted() {
    this.wrapperHeight = document.documentElement.clientHeight - 46;
  }
};

exports.default = BalanceWithdraw;

/***/ }),

/***/ 1109:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(569)(true);
// imports


// module
exports.push([module.i, "\n._3uig0dMW_ZNGQ3TbgeOdBw_0 {\n  color: #fff!important;\n  background-color: #e20000!important;\n  border-bottom: none!important;\n}\n._3uig0dMW_ZNGQ3TbgeOdBw_0 ._2NO30BXdtkkBTN1qhWBTHM_0 {\n  color: #fff;\n}\n._3PHkIQbriTOXxs4V7UzCEP_0 {\n  background-color: #e20000;\n}\n._3PHkIQbriTOXxs4V7UzCEP_0 p,\n._3PHkIQbriTOXxs4V7UzCEP_0 h1 {\n  color: #fff;\n  text-align: left;\n}\n._3PHkIQbriTOXxs4V7UzCEP_0 p {\n  font-size: 12px;\n  padding-top: 24px;\n}\n._3PHkIQbriTOXxs4V7UzCEP_0 h1 {\n  padding-top: 36px;\n  padding-bottom: 12px;\n  font-weight: 400;\n  font-size: 40px;\n}\n.P3v-Q-c53Kbhx_0lvc31I_0 {\n  background-color: #fff;\n}\n.P3v-Q-c53Kbhx_0lvc31I_0 .Xr4tYdG13XTB5Y_jGz_i6_0 {\n  padding: 12px 0;\n  border-bottom: 1px solid #efefef;\n}\n.P3v-Q-c53Kbhx_0lvc31I_0 .Xr4tYdG13XTB5Y_jGz_i6_0:last-child {\n  border-bottom: none;\n}\n._2rpSlmxzQ02UYeXwOTiww2_0 {\n  text-align: left;\n}\n._6vLVH8ZTigbaqSlep3d4_0 {\n  text-align: right;\n}\n._6vLVH8ZTigbaqSlep3d4_0 .XbEGZp1ICoqUnm8ia10vc_0 {\n  width: 100%;\n}\n", "", {"version":3,"sources":["/www/wwwroot/piaobo/packages/thinksns-plus-authorization-pb-h5/src/views/balance/Balance.vue","/www/wwwroot/piaobo/packages/thinksns-plus-authorization-pb-h5/src/views/balance/Balance.vue"],"names":[],"mappings":";AA4IA;EACE,sBAAA;EACA,oCAAA;EACA,8BAAA;CC3ID;ADwID;EAKI,YAAA;CC1IH;AD6ID;EACE,0BAAA;CC3ID;AD0ID;;EAGI,YAAA;EACA,iBAAA;CCzIH;ADqID;EAOI,gBAAA;EACA,kBAAA;CCzIH;ADiID;EAWI,kBAAA;EACA,qBAAA;EACA,iBAAA;EACA,gBAAA;CCzIH;AD4ID;EACE,uBAAA;CC1ID;ADyID;EAGI,gBAAA;EACA,iCAAA;CCzIH;AD0IG;EACE,oBAAA;CCxIL;AD4ID;EACE,iBAAA;CC1ID;AD4ID;EACE,kBAAA;CC1ID;ADyID;EAGI,YAAA;CCzIH","file":"Balance.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.commonHeader {\n  color: #fff!important;\n  background-color: #e20000!important;\n  border-bottom: none!important;\n  .toRecords {\n    color: #fff;\n  }\n}\n.balanceContent {\n  background-color: #e20000;\n  p, h1 {\n    color: #fff;\n    text-align: left;\n  }\n  p {\n    font-size: 12px;\n    padding-top: 24px;\n  }\n  h1 {\n    padding-top: 36px;\n    padding-bottom: 12px;\n    font-weight: 400;\n    font-size: 40px;\n  }\n}\n.operations {\n  background-color: #fff;\n  .operation {\n    padding: 12px 0;\n    border-bottom: 1px solid #efefef;\n    &:last-child {\n      border-bottom: none;\n    }\n  }\n}\n.textAlignLeft {\n  text-align: left;\n}\n.textAlignRight {\n  text-align: right;\n  .balanceInput {\n    width: 100%;\n  }\n}\n",".commonHeader {\n  color: #fff!important;\n  background-color: #e20000!important;\n  border-bottom: none!important;\n}\n.commonHeader .toRecords {\n  color: #fff;\n}\n.balanceContent {\n  background-color: #e20000;\n}\n.balanceContent p,\n.balanceContent h1 {\n  color: #fff;\n  text-align: left;\n}\n.balanceContent p {\n  font-size: 12px;\n  padding-top: 24px;\n}\n.balanceContent h1 {\n  padding-top: 36px;\n  padding-bottom: 12px;\n  font-weight: 400;\n  font-size: 40px;\n}\n.operations {\n  background-color: #fff;\n}\n.operations .operation {\n  padding: 12px 0;\n  border-bottom: 1px solid #efefef;\n}\n.operations .operation:last-child {\n  border-bottom: none;\n}\n.textAlignLeft {\n  text-align: left;\n}\n.textAlignRight {\n  text-align: right;\n}\n.textAlignRight .balanceInput {\n  width: 100%;\n}\n"],"sourceRoot":""}]);

// exports
exports.locals = {
	"commonHeader": "_3uig0dMW_ZNGQ3TbgeOdBw_0",
	"toRecords": "_2NO30BXdtkkBTN1qhWBTHM_0",
	"balanceContent": "_3PHkIQbriTOXxs4V7UzCEP_0",
	"operations": "P3v-Q-c53Kbhx_0lvc31I_0",
	"operation": "Xr4tYdG13XTB5Y_jGz_i6_0",
	"textAlignLeft": "_2rpSlmxzQ02UYeXwOTiww2_0",
	"textAlignRight": "_6vLVH8ZTigbaqSlep3d4_0",
	"balanceInput": "XbEGZp1ICoqUnm8ia10vc_0"
};

/***/ }),

/***/ 1118:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(569)(true);
// imports


// module
exports.push([module.i, "\n._2Ae-algIRp2NJJA65dlTwN_0 {\n  position: fixed!important;\n  top: 0;\n  width: 100vw;\n}\n.xkZBVQMnVBUc-gFgIUGvN_0 {\n  overflow: scroll;\n  top: 46px;\n  width: 100%;\n  position: fixed;\n  -webkit-overflow-scrolling: touch;\n}\n.xkZBVQMnVBUc-gFgIUGvN_0 ._3YWO4BLhIhsZ0qfOE-UmQA_0 .XP3zeKk0Y9JJrm5-zRnVf_0 {\n  margin-bottom: -50px;\n}\n._2zf1seQ-12mYB1f6OQ4TOe_0 {\n  border-bottom: 1px solid #ededed;\n  font-size: 14px;\n  padding: 8px 0;\n}\n._2zf1seQ-12mYB1f6OQ4TOe_0:last-child {\n  border-bottom: none;\n}\n._2zf1seQ-12mYB1f6OQ4TOe_0 .QdMtn9VfnnQG3Aa8IZ68k_0 {\n  color: #bfbfbf;\n}\n._3PmbThg0IgHpUvtk4Rc77a_0 {\n  text-align: left;\n}\n._1WZ5jE3--gYsOjnmlFfgo0_0 {\n  text-align: right;\n}\n._1BRAYrgkVEVc3a6Ibaqa34_0 span {\n  font-size: 12px;\n  color: #bfbfbf;\n  display: block;\n  text-align: center;\n}\n.Y6IE8dVW2ZJg42Zwv4SSr_0 {\n  background-color: #fff;\n  padding-top: 8px;\n  padding-bottom: 8px;\n  border-bottom: 1px solid #efefef;\n}\n.Y6IE8dVW2ZJg42Zwv4SSr_0:last-child {\n  border-bottom: none;\n}\n.Y6IE8dVW2ZJg42Zwv4SSr_0 .Lb6OiG7mvdrOCrD5rr8Fn_0 {\n  text-align: initial;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  word-break: break-all;\n}\n", "", {"version":3,"sources":["/www/wwwroot/piaobo/packages/thinksns-plus-authorization-pb-h5/src/views/balance/BalanceRecords.vue","/www/wwwroot/piaobo/packages/thinksns-plus-authorization-pb-h5/src/views/balance/BalanceRecords.vue"],"names":[],"mappings":";AAuHA;EACE,0BAAA;EACA,OAAA;EACA,aAAA;CCtHD;ADwHD;EACE,iBAAA;EACA,UAAA;EACA,YAAA;EACA,gBAAA;EACA,kCAAA;CCtHD;ADiHD;EAQM,qBAAA;CCtHL;AD2HD;EACE,iCAAA;EACA,gBAAA;EACA,eAAA;CCzHD;AD0HC;EACE,oBAAA;CCxHH;ADmHD;EAQI,eAAA;CCxHH;AD2HD;EACE,iBAAA;CCzHD;AD2HD;EACE,kBAAA;CCzHD;AD2HD;EAEI,gBAAA;EACA,eAAA;EACA,eAAA;EACA,mBAAA;CC1HH;AD6HD;EACE,uBAAA;EACA,iBAAA;EACA,oBAAA;EACA,iCAAA;CC3HD;AD4HC;EACE,oBAAA;CC1HH;ADoHD;EASI,oBAAA;EACA,iBAAA;EACA,wBAAA;EACA,qBAAA;EACA,sBAAA;EACA,6BAAA;EACA,sBAAA;CC1HH","file":"BalanceRecords.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.commonHeader {\n  position: fixed!important;\n  top: 0;\n  width: 100vw;\n}\n.pageLoadmoreWrapper {\n  overflow: scroll;\n  top: 46px;\n  width: 100%;\n  position: fixed;\n  -webkit-overflow-scrolling: touch;\n  .recordLoadMore {\n    .mintLoadmoreBottom {\n      margin-bottom: -50px;\n    }\n  }  \n}\n\n.recordDetail {\n  border-bottom: 1px solid #ededed;\n  font-size: 14px;\n  padding: 8px 0;\n  &:last-child {\n    border-bottom: none;\n  }\n  .detailLabel {\n    color: #bfbfbf;\n  }\n}\n.textAlignLeft {\n  text-align: left;\n}\n.textAlignRight {\n  text-align: right;\n}\n.time {\n  span {\n    font-size: 12px;\n    color: #bfbfbf;\n    display: block;\n    text-align: center;\n  }\n}\n.recordList {\n  background-color: #fff;\n  padding-top: 8px;\n  padding-bottom: 8px;\n  border-bottom: 1px solid #efefef;\n  &:last-child {\n    border-bottom: none;\n  }\n  .recordBody {\n    text-align: initial;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    display: -webkit-box;\n    -webkit-line-clamp: 1;\n    -webkit-box-orient: vertical;\n    word-break: break-all;\n  }\n}\n",".commonHeader {\n  position: fixed!important;\n  top: 0;\n  width: 100vw;\n}\n.pageLoadmoreWrapper {\n  overflow: scroll;\n  top: 46px;\n  width: 100%;\n  position: fixed;\n  -webkit-overflow-scrolling: touch;\n}\n.pageLoadmoreWrapper .recordLoadMore .mintLoadmoreBottom {\n  margin-bottom: -50px;\n}\n.recordDetail {\n  border-bottom: 1px solid #ededed;\n  font-size: 14px;\n  padding: 8px 0;\n}\n.recordDetail:last-child {\n  border-bottom: none;\n}\n.recordDetail .detailLabel {\n  color: #bfbfbf;\n}\n.textAlignLeft {\n  text-align: left;\n}\n.textAlignRight {\n  text-align: right;\n}\n.time span {\n  font-size: 12px;\n  color: #bfbfbf;\n  display: block;\n  text-align: center;\n}\n.recordList {\n  background-color: #fff;\n  padding-top: 8px;\n  padding-bottom: 8px;\n  border-bottom: 1px solid #efefef;\n}\n.recordList:last-child {\n  border-bottom: none;\n}\n.recordList .recordBody {\n  text-align: initial;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  word-break: break-all;\n}\n"],"sourceRoot":""}]);

// exports
exports.locals = {
	"commonHeader": "_2Ae-algIRp2NJJA65dlTwN_0",
	"pageLoadmoreWrapper": "xkZBVQMnVBUc-gFgIUGvN_0",
	"recordLoadMore": "_3YWO4BLhIhsZ0qfOE-UmQA_0",
	"mintLoadmoreBottom": "XP3zeKk0Y9JJrm5-zRnVf_0",
	"recordDetail": "_2zf1seQ-12mYB1f6OQ4TOe_0",
	"detailLabel": "QdMtn9VfnnQG3Aa8IZ68k_0",
	"textAlignLeft": "_3PmbThg0IgHpUvtk4Rc77a_0",
	"textAlignRight": "_1WZ5jE3--gYsOjnmlFfgo0_0",
	"time": "_1BRAYrgkVEVc3a6Ibaqa34_0",
	"recordList": "Y6IE8dVW2ZJg42Zwv4SSr_0",
	"recordBody": "Lb6OiG7mvdrOCrD5rr8Fn_0"
};

/***/ }),

/***/ 1125:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(569)(true);
// imports


// module
exports.push([module.i, "\n._3l51dRnDxuPwhdgwRumNgc_0 {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n", "", {"version":3,"sources":["/www/wwwroot/piaobo/packages/thinksns-plus-authorization-pb-h5/src/views/balance/Account.vue","/www/wwwroot/piaobo/packages/thinksns-plus-authorization-pb-h5/src/views/balance/Account.vue"],"names":[],"mappings":";AAuBA;EACE,qBAAA;EAAA,sBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,0BAAA;EAAA,4BAAA;MAAA,uBAAA;UAAA,oBAAA;CCtBD","file":"Account.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.root {\n  display: flex;\n  align-items: center;\n}\n",".root {\n  display: flex;\n  align-items: center;\n}\n"],"sourceRoot":""}]);

// exports
exports.locals = {
	"root": "_3l51dRnDxuPwhdgwRumNgc_0"
};

/***/ }),

/***/ 1138:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(569)(true);
// imports


// module
exports.push([module.i, "\n._1YigXKzoQEEp_ZF5wHtzQB_0 {\n  position: fixed!important;\n  top: 0;\n  width: 100vw;\n}\n._2sslkKbqD2XhEXkTHaWL8u_0 {\n  overflow: scroll;\n  top: 46px;\n  width: 100%;\n  position: fixed;\n  -webkit-overflow-scrolling: touch;\n}\n._2sslkKbqD2XhEXkTHaWL8u_0 ._10k6eunMeyhYe3QsGDshDn_0 ._2lDEIDA25mT-ywg3kTcOj9_0 {\n  margin-bottom: -50px;\n}\n._1ARPY-iO50QK4vWzgr9prt_0 {\n  border-bottom: 1px solid #ededed;\n  font-size: 14px;\n  padding: 8px 0;\n}\n._1ARPY-iO50QK4vWzgr9prt_0:last-child {\n  border-bottom: none;\n}\n._1ARPY-iO50QK4vWzgr9prt_0 ._1WvbZeM4GO3XjFOvABMmff_0 {\n  color: #bfbfbf;\n}\n._1A81ytvyEeebQFzmfZHiqB_0 {\n  text-align: left;\n}\n.FuwlQe8-LZ5Bxa2pKCba0_0 {\n  text-align: right;\n}\n.l9zULt9ZdqK4otTWKJP37_0 span {\n  font-size: 12px;\n  color: #bfbfbf;\n  display: block;\n  text-align: center;\n}\n._3aBf0lu90WZTnInSuUd01p_0 {\n  background-color: #fff;\n  padding-top: 8px;\n  padding-bottom: 8px;\n  border-bottom: 1px solid #efefef;\n}\n._3aBf0lu90WZTnInSuUd01p_0:last-child {\n  border-bottom: none;\n}\n._3aBf0lu90WZTnInSuUd01p_0 ._64KBygsNLrG8FoYOt6dYl_0 {\n  text-align: initial;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  word-break: break-all;\n}\n", "", {"version":3,"sources":["/www/wwwroot/piaobo/packages/thinksns-plus-authorization-pb-h5/src/views/balance/BalanceWithdraw.vue","/www/wwwroot/piaobo/packages/thinksns-plus-authorization-pb-h5/src/views/balance/BalanceWithdraw.vue"],"names":[],"mappings":";AAqGA;EACE,0BAAA;EACA,OAAA;EACA,aAAA;CCpGD;ADsGD;EACE,iBAAA;EACA,UAAA;EACA,YAAA;EACA,gBAAA;EACA,kCAAA;CCpGD;AD+FD;EAQM,qBAAA;CCpGL;ADyGD;EACE,iCAAA;EACA,gBAAA;EACA,eAAA;CCvGD;ADwGC;EACE,oBAAA;CCtGH;ADiGD;EAQI,eAAA;CCtGH;ADyGD;EACE,iBAAA;CCvGD;ADyGD;EACE,kBAAA;CCvGD;ADyGD;EAEI,gBAAA;EACA,eAAA;EACA,eAAA;EACA,mBAAA;CCxGH;AD2GD;EACE,uBAAA;EACA,iBAAA;EACA,oBAAA;EACA,iCAAA;CCzGD;AD0GC;EACE,oBAAA;CCxGH;ADkGD;EASI,oBAAA;EACA,iBAAA;EACA,wBAAA;EACA,qBAAA;EACA,sBAAA;EACA,6BAAA;EACA,sBAAA;CCxGH","file":"BalanceWithdraw.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.commonHeader {\n  position: fixed!important;\n  top: 0;\n  width: 100vw;\n}\n.pageLoadmoreWrapper {\n  overflow: scroll;\n  top: 46px;\n  width: 100%;\n  position: fixed;\n  -webkit-overflow-scrolling: touch;\n  .recordLoadMore {\n    .mintLoadmoreBottom {\n      margin-bottom: -50px;\n    }\n  }  \n}\n\n.recordDetail {\n  border-bottom: 1px solid #ededed;\n  font-size: 14px;\n  padding: 8px 0;\n  &:last-child {\n    border-bottom: none;\n  }\n  .detailLabel {\n    color: #bfbfbf;\n  }\n}\n.textAlignLeft {\n  text-align: left;\n}\n.textAlignRight {\n  text-align: right;\n}\n.time {\n  span {\n    font-size: 12px;\n    color: #bfbfbf;\n    display: block;\n    text-align: center;\n  }\n}\n.recordList {\n  background-color: #fff;\n  padding-top: 8px;\n  padding-bottom: 8px;\n  border-bottom: 1px solid #efefef;\n  &:last-child {\n    border-bottom: none;\n  }\n  .recordBody {\n    text-align: initial;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    display: -webkit-box;\n    -webkit-line-clamp: 1;\n    -webkit-box-orient: vertical;\n    word-break: break-all;\n  }\n}\n",".commonHeader {\n  position: fixed!important;\n  top: 0;\n  width: 100vw;\n}\n.pageLoadmoreWrapper {\n  overflow: scroll;\n  top: 46px;\n  width: 100%;\n  position: fixed;\n  -webkit-overflow-scrolling: touch;\n}\n.pageLoadmoreWrapper .recordLoadMore .mintLoadmoreBottom {\n  margin-bottom: -50px;\n}\n.recordDetail {\n  border-bottom: 1px solid #ededed;\n  font-size: 14px;\n  padding: 8px 0;\n}\n.recordDetail:last-child {\n  border-bottom: none;\n}\n.recordDetail .detailLabel {\n  color: #bfbfbf;\n}\n.textAlignLeft {\n  text-align: left;\n}\n.textAlignRight {\n  text-align: right;\n}\n.time span {\n  font-size: 12px;\n  color: #bfbfbf;\n  display: block;\n  text-align: center;\n}\n.recordList {\n  background-color: #fff;\n  padding-top: 8px;\n  padding-bottom: 8px;\n  border-bottom: 1px solid #efefef;\n}\n.recordList:last-child {\n  border-bottom: none;\n}\n.recordList .recordBody {\n  text-align: initial;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 1;\n  -webkit-box-orient: vertical;\n  word-break: break-all;\n}\n"],"sourceRoot":""}]);

// exports
exports.locals = {
	"commonHeader": "_1YigXKzoQEEp_ZF5wHtzQB_0",
	"pageLoadmoreWrapper": "_2sslkKbqD2XhEXkTHaWL8u_0",
	"recordLoadMore": "_10k6eunMeyhYe3QsGDshDn_0",
	"mintLoadmoreBottom": "_2lDEIDA25mT-ywg3kTcOj9_0",
	"recordDetail": "_1ARPY-iO50QK4vWzgr9prt_0",
	"detailLabel": "_1WvbZeM4GO3XjFOvABMmff_0",
	"textAlignLeft": "_1A81ytvyEeebQFzmfZHiqB_0",
	"textAlignRight": "FuwlQe8-LZ5Bxa2pKCba0_0",
	"time": "l9zULt9ZdqK4otTWKJP37_0",
	"recordList": "_3aBf0lu90WZTnInSuUd01p_0",
	"recordBody": "_64KBygsNLrG8FoYOt6dYl_0"
};

/***/ }),

/***/ 1154:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(569)(true);
// imports


// module
exports.push([module.i, "\n.button-operation {\n  position: fixed;\n  bottom: 2vh;\n  width: 100vw;\n  text-align: center;\n}\n.button-operation .rule-operation.ivu-btn-text {\n  background-color: rgba(255, 255, 255, 0);\n}\n.ivu-modal-confirm-body div {\n  word-break: break-all;\n}\n", "", {"version":3,"sources":["/www/wwwroot/piaobo/packages/thinksns-plus-authorization-pb-h5/src/views/balance/Balance.vue","/www/wwwroot/piaobo/packages/thinksns-plus-authorization-pb-h5/src/views/balance/Balance.vue"],"names":[],"mappings":";AA0LA;EACE,gBAAA;EACA,YAAA;EACA,aAAA;EACA,mBAAA;CCzLD;AD2LG;EACE,yCAAA;CCzLL;AD6LD;EAEI,sBAAA;CC5LH","file":"Balance.vue","sourcesContent":["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.button-operation {\n  position: fixed;\n  bottom: 2vh;\n  width: 100vw;\n  text-align: center;\n  .rule-operation {\n    &.ivu-btn-text {\n      background-color: rgba(255,255,255, 0);\n    }\n  }\n}\n.ivu-modal-confirm-body {\n  div {\n    word-break: break-all;\n  }\n}\n",".button-operation {\n  position: fixed;\n  bottom: 2vh;\n  width: 100vw;\n  text-align: center;\n}\n.button-operation .rule-operation.ivu-btn-text {\n  background-color: rgba(255, 255, 255, 0);\n}\n.ivu-modal-confirm-body div {\n  word-break: break-all;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 1221:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1109);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(570)("5bca554e", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?{\"minimize\":false,\"sourceMap\":true,\"localIdentName\":\"[hash:base64]_0\",\"modules\":true,\"importLoaders\":true}!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-070268b8\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/less-loader/dist/cjs.js?{\"sourceMap\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../node_modules/iview-loader/index.js?{\"prefix\":false}!./Balance.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?{\"minimize\":false,\"sourceMap\":true,\"localIdentName\":\"[hash:base64]_0\",\"modules\":true,\"importLoaders\":true}!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-070268b8\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/less-loader/dist/cjs.js?{\"sourceMap\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../node_modules/iview-loader/index.js?{\"prefix\":false}!./Balance.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 1230:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1118);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(570)("5a17ebd4", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?{\"minimize\":false,\"sourceMap\":true,\"localIdentName\":\"[hash:base64]_0\",\"modules\":true,\"importLoaders\":true}!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-2fabad9a\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/less-loader/dist/cjs.js?{\"sourceMap\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../node_modules/iview-loader/index.js?{\"prefix\":false}!./BalanceRecords.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?{\"minimize\":false,\"sourceMap\":true,\"localIdentName\":\"[hash:base64]_0\",\"modules\":true,\"importLoaders\":true}!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-2fabad9a\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/less-loader/dist/cjs.js?{\"sourceMap\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../node_modules/iview-loader/index.js?{\"prefix\":false}!./BalanceRecords.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 1237:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1125);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(570)("6d40dd62", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?{\"minimize\":false,\"sourceMap\":true,\"localIdentName\":\"[hash:base64]_0\",\"modules\":true,\"importLoaders\":true}!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-587d7389\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/less-loader/dist/cjs.js?{\"sourceMap\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../node_modules/iview-loader/index.js?{\"prefix\":false}!./Account.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?{\"minimize\":false,\"sourceMap\":true,\"localIdentName\":\"[hash:base64]_0\",\"modules\":true,\"importLoaders\":true}!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-587d7389\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/less-loader/dist/cjs.js?{\"sourceMap\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../node_modules/iview-loader/index.js?{\"prefix\":false}!./Account.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 1250:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1138);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(570)("9a123ab0", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?{\"minimize\":false,\"sourceMap\":true,\"localIdentName\":\"[hash:base64]_0\",\"modules\":true,\"importLoaders\":true}!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-f36bda3c\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/less-loader/dist/cjs.js?{\"sourceMap\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../node_modules/iview-loader/index.js?{\"prefix\":false}!./BalanceWithdraw.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?{\"minimize\":false,\"sourceMap\":true,\"localIdentName\":\"[hash:base64]_0\",\"modules\":true,\"importLoaders\":true}!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-f36bda3c\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/less-loader/dist/cjs.js?{\"sourceMap\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!../../../node_modules/iview-loader/index.js?{\"prefix\":false}!./BalanceWithdraw.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 1265:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1154);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(570)("194618fc", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?{\"minimize\":false,\"sourceMap\":true}!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-070268b8\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/less-loader/dist/cjs.js?{\"sourceMap\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../../node_modules/iview-loader/index.js?{\"prefix\":false}!./Balance.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?{\"minimize\":false,\"sourceMap\":true}!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-070268b8\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/less-loader/dist/cjs.js?{\"sourceMap\":true}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!../../../node_modules/iview-loader/index.js?{\"prefix\":false}!./Balance.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 1330:
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(629);
var hasOwn = {}.hasOwnProperty;

module.exports = {

  ALIPAY_PC_DIRECT_URL: 'https://mapi.alipay.com/gateway.do',

  handleCharge: function(charge) {
    var channel = charge.channel;
    var credential = charge.credential[channel];
    var baseURL = this.ALIPAY_PC_DIRECT_URL;
    if (hasOwn.call(credential, 'channel_url')) {
      baseURL = credential.channel_url;
    }
    if (!hasOwn.call(credential, '_input_charset')) {
      if(hasOwn.call(credential, 'service')
        && credential.service === 'create_direct_pay_by_user') {
        credential._input_charset = 'utf-8';
      }
    }
    var query = utils.stringifyData(credential, channel, true);
    utils.redirectTo(baseURL + '?' + query, channel);
  }
};


/***/ }),

/***/ 1331:
/***/ (function(module, exports, __webpack_require__) {

var hasOwn = {}.hasOwnProperty;
var callbacks = __webpack_require__(646);

/*global AlipayJSBridge*/
module.exports = {

  handleCharge: function (charge) {
    var credential = charge.credential[charge.channel];
    if (hasOwn.call(credential, 'transaction_no')) {
      this.tradePay(credential.transaction_no);
    } else {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_credential', 'missing_field_transaction_no'));
    }
  },

  ready: function (callback) {
    if (window.AlipayJSBridge) {
      callback && callback();
    } else {
      document.addEventListener('AlipayJSBridgeReady', callback, false);
    }
  },

  tradePay: function (tradeNO) {
    this.ready(function () {
      // 通过传入交易号唤起快捷调用方式(注意tradeNO大小写严格)
      AlipayJSBridge.call('tradePay', {
        tradeNO: tradeNO
      }, function (data) {
        if ('9000' == data.resultCode) {
          callbacks.innerCallback('success');
        } else if('6001' == data.resultCode) {
          callbacks.innerCallback('cancel', callbacks.error(data.result));
        } else {
          callbacks.innerCallback('fail',
            callbacks.error(data.result));
        }
      });
    });
  }
};


/***/ }),

/***/ 1332:
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(629);
var mods = __webpack_require__(983);
var hasOwn = {}.hasOwnProperty;

module.exports = {

  ALIPAY_WAP_URL_OLD: 'https://wappaygw.alipay.com/service/rest.htm',
  ALIPAY_WAP_URL: 'https://mapi.alipay.com/gateway.do',

  handleCharge: function(charge) {
    var channel = charge.channel;
    var credential = charge.credential[channel];
    var baseURL = this.ALIPAY_WAP_URL;
    if (hasOwn.call(credential, 'req_data')) {
      baseURL = this.ALIPAY_WAP_URL_OLD;
    } else if (hasOwn.call(credential, 'channel_url')) {
      baseURL = credential.channel_url;
    }
    if (!hasOwn.call(credential, '_input_charset')) {
      if ((hasOwn.call(credential, 'service')
          && credential.service === 'alipay.wap.create.direct.pay.by.user')
        || hasOwn.call(credential, 'req_data')
      ) {
        credential._input_charset = 'utf-8';
      }
    }
    var query = utils.stringifyData(credential, channel, true);
    var targetURL = baseURL + '?' + query;
    var ap = mods.getExtraModule('ap');
    if (utils.inWeixin() && typeof ap !== 'undefined') {
      ap.pay(targetURL);
    } else {
      utils.redirectTo(targetURL, channel);
    }
  }
};

/***/ }),

/***/ 1333:
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(629);
var callbacks = __webpack_require__(646);
var hasOwn = {}.hasOwnProperty;

module.exports = {

  handleCharge: function(charge) {
    var channel = charge.channel;
    var credential = charge.credential[channel];

    if (!hasOwn.call(credential, 'url')) {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_credential', 'missing_field:url'));
      return;
    }
    utils.redirectTo(credential.url + '?' +
      utils.stringifyData(credential, channel), channel);
  }
};


/***/ }),

/***/ 1334:
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(629);
var hasOwn = {}.hasOwnProperty;

module.exports = {

  CMB_WALLET_URL:
    'https://netpay.cmbchina.com/netpayment/BaseHttp.dll?MB_EUserPay',

  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    var request_url = this.CMB_WALLET_URL;
    if (hasOwn.call(credential, 'ChannelUrl')) {
      request_url = credential.ChannelUrl;
      delete credential.ChannelUrl;
    }

    if (hasOwn.call(credential, 'channelVersion')) {
      delete credential.channelVersion;
    }

    utils.formSubmit(request_url, 'post', credential);
  }
};


/***/ }),

/***/ 1335:
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(629);

module.exports = {

  CP_B2B_URL: 'https://payment.chinapay.com/CTITS/service/rest/page/nref/000000000017/0/0/0/0/0',

  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    utils.formSubmit(this.CP_B2B_URL, 'post', credential);
  }
};


/***/ }),

/***/ 1336:
/***/ (function(module, exports, __webpack_require__) {

var stash = __webpack_require__(689);
var hasOwn = {}.hasOwnProperty;

(function() {
  var b = {};
  var a = {};
  a.PADCHAR = '=';
  a.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  a.makeDOMException = function() {
    try {
      return new DOMException(DOMException.INVALID_CHARACTER_ERR);
    } catch (d) {
      var c = new Error('DOM Exception 5');
      c.code = c.number = 5;
      c.name = c.description = 'INVALID_CHARACTER_ERR';
      c.toString = function() {
        return 'Error: ' + c.name + ': ' + c.message;
      };
      return c;
    }
  };
  a.getbyte64 = function(e, d) {
    var c = a.ALPHA.indexOf(e.charAt(d));
    if (c === -1) {
      throw a.makeDOMException();
    }
    return c;
  };
  a.decode = function(f) {
    f = '' + f;
    var j = a.getbyte64;
    var h, e, g;
    var d = f.length;
    if (d === 0) {
      return f;
    }
    if (d % 4 !== 0) {
      throw a.makeDOMException();
    }
    h = 0;
    if (f.charAt(d - 1) === a.PADCHAR) {
      h = 1;
      if (f.charAt(d - 2) === a.PADCHAR) {
        h = 2;
      }
      d -= 4;
    }
    var c = [];
    for (e = 0; e < d; e += 4) {
      g = (j(f, e) << 18) |
        (j(f, e + 1) << 12) |
        (j(f, e + 2) << 6) |
        j(f, e + 3);
      c.push(String.fromCharCode(g >> 16, (g >> 8) & 255, g & 255));
    }
    switch (h) {
      case 1:
        g = (j(f, e) << 18) | (j(f, e + 1) << 12) | (j(f, e + 2) << 6);
        c.push(String.fromCharCode(g >> 16, (g >> 8) & 255));
        break;
      case 2:
        g = (j(f, e) << 18) | (j(f, e + 1) << 12);
        c.push(String.fromCharCode(g >> 16));
        break;
    }
    return c.join('');
  };
  a.getbyte = function(e, d) {
    var c = e.charCodeAt(d);
    if (c > 255) {
      throw a.makeDOMException();
    }
    return c;
  };
  a.encode = function(f) {
    if (arguments.length !== 1) {
      throw new SyntaxError('Not enough arguments');
    }
    var g = a.PADCHAR;
    var h = a.ALPHA;
    var k = a.getbyte;
    var e, j;
    var c = [];
    f = '' + f;
    var d = f.length - f.length % 3;
    if (f.length === 0) {
      return f;
    }
    for (e = 0; e < d; e += 3) {
      j = (k(f, e) << 16) | (k(f, e + 1) << 8) | k(f, e + 2);
      c.push(h.charAt(j >> 18));
      c.push(h.charAt((j >> 12) & 63));
      c.push(h.charAt((j >> 6) & 63));
      c.push(h.charAt(j & 63));
    }
    switch (f.length - d) {
      case 1:
        j = k(f, e) << 16;
        c.push(h.charAt(j >> 18) + h.charAt((j >> 12) & 63) + g + g);
        break;
      case 2:
        j = (k(f, e) << 16) | (k(f, e + 1) << 8);
        c.push(h.charAt(j >> 18) +
          h.charAt((j >> 12) & 63) +
          h.charAt((j >> 6) & 63) + g);
        break;
    }
    return c.join('');
  };
  b.url = 'pay.htm';
  b.pay = function(d) {
    var c = encodeURIComponent(a.encode(d));
    if (hasOwn.call(stash, 'APURL')) {
      b.url = stash.APURL;
    }
    location.href = b.url + '?goto=' + c;
  };
  b.decode = function(c) {
    return a.decode(decodeURIComponent(c));
  };

  module.exports = b;
})();


/***/ }),

/***/ 1337:
/***/ (function(module, exports, __webpack_require__) {

var redirectBase = __webpack_require__(982);

module.exports = {

  handleCharge: function(charge) {
    redirectBase.handleCharge(charge);
  }
};


/***/ }),

/***/ 1338:
/***/ (function(module, exports, __webpack_require__) {

var redirectBase = __webpack_require__(982);

module.exports = {

  handleCharge: function(charge) {
    redirectBase.handleCharge(charge);
  }
};


/***/ }),

/***/ 1339:
/***/ (function(module, exports, __webpack_require__) {

var redirectBase = __webpack_require__(982);
var callbacks = __webpack_require__(646);
var utils = __webpack_require__(629);
var hasOwn = {}.hasOwnProperty;

module.exports = {
  handleCharge: function (charge) {
    var extra = charge.extra;
    if (hasOwn.call(extra, 'pay_channel')) {
      var pay_channel = extra.pay_channel;
      if (pay_channel === 'wx' && !utils.inWeixin()) {
        callbacks.innerCallback('fail',
          callbacks.error('Not in the WeChat browser'));
        return;
      } else if (pay_channel === 'alipay' && !utils.inAlipay()) {
        callbacks.innerCallback('fail',
          callbacks.error('Not in the Alipay browser'));
        return;
      }
    } else {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_charge', 'charge 格式不正确'));
      return;
    }
    redirectBase.handleCharge(charge);
  }
};


/***/ }),

/***/ 1340:
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(629);
var hasOwn = {}.hasOwnProperty;

module.exports = {

  JDPAY_WAP_URL_OLD: 'https://m.jdpay.com/wepay/web/pay',
  JDPAY_H5_URL: 'https://h5pay.jd.com/jdpay/saveOrder',
  JDPAY_PC_URL: 'https://wepay.jd.com/jdpay/saveOrder',

  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    var request_url = this.JDPAY_H5_URL;
    if (hasOwn.call(credential, 'channelUrl')) {
      request_url = credential.channelUrl;
      delete credential.channelUrl;
    } else if (hasOwn.call(credential, 'merchantRemark')) {
      request_url = this.JDPAY_WAP_URL_OLD;
    }
    utils.formSubmit(request_url, 'post', credential);
  }
};


/***/ }),

/***/ 1341:
/***/ (function(module, exports, __webpack_require__) {

var callbacks = __webpack_require__(646);
var utils = __webpack_require__(629);
var stash = __webpack_require__(689);
var hasOwn = {}.hasOwnProperty;

/*global mqq*/
module.exports = {
  SRC_URL: 'https://open.mobile.qq.com/sdk/qqapi.js?_bid=152',
  ID: 'mqq_api',

  handleCharge: function (charge) {
    var credential = charge.credential[charge.channel];

    if (!hasOwn.call(credential, 'token_id')) {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_credential', 'missing_token_id'));
      return;
    }
    stash.tokenId = credential.token_id;
    utils.loadUrlJs(this.ID, this.SRC_URL, this.callpay);
  },

  callpay: function () {
    if (typeof mqq != 'undefined') {
      if (mqq.QQVersion == 0) {
        callbacks.innerCallback('fail',
          callbacks.error('Not in the QQ client'));
        delete stash.tokenId;
        return;
      }
      mqq.tenpay.pay({
        tokenId: stash.tokenId
      }, function (result) {
        if (result.resultCode == 0) {
          callbacks.innerCallback('success');
        } else {
          callbacks.innerCallback('fail',
            callbacks.error(result.retmsg));
        }
      });
    } else {
      callbacks.innerCallback('fail',
        callbacks.error('network_err'));
    }
    delete stash.tokenId;
  }
};

/***/ }),

/***/ 1342:
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(629);

module.exports = {

  UPACP_PC_URL: 'https://gateway.95516.com/gateway/api/frontTransReq.do',

  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    utils.formSubmit(this.UPACP_PC_URL, 'post', credential);
  }
};


/***/ }),

/***/ 1343:
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(629);

module.exports = {

  UPACP_WAP_URL: 'https://gateway.95516.com/gateway/api/frontTransReq.do',

  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    utils.formSubmit(this.UPACP_WAP_URL, 'post', credential);
  }
};


/***/ }),

/***/ 1344:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by yulitao on 2016/12/29.
 */
var stash = __webpack_require__(689);
var callbacks = __webpack_require__(646);
var hasOwn = {}.hasOwnProperty;
/*global wx*/
module.exports = {

  handleCharge: function (charge) {
    var credential = charge.credential[charge.channel];
    var fields = [
      'appId', 'timeStamp', 'nonceStr', 'package', 'signType', 'paySign'
    ];
    for (var k = 0; k < fields.length; k++) {
      if (!hasOwn.call(credential, fields[k])) {
        callbacks.innerCallback('fail',
          callbacks.error('invalid_credential', 'missing_field_' + fields[k]));
        return;
      }
    }
    stash.jsApiParameters = credential;
    this.callpay();
  },

  wxLiteEnabled: function () {
    return typeof wx !== 'undefined' && wx.requestPayment;
  },

  //微信小程序支付
  callpay: function () {
    if (!this.wxLiteEnabled()) {
      console.log('请在微信小程序中打开');
      return;
    }
    var wx_lite = stash.jsApiParameters;
    delete wx_lite.appId;
    wx_lite.complete = function (res) {
      //支付成功
      if (res.errMsg === 'requestPayment:ok') {
        callbacks.innerCallback('success');
      }
      //取消支付
      if (res.errMsg === 'requestPayment:cancel') {
        callbacks.innerCallback('cancel', callbacks.error('用户取消支付'));
      }
      //支付验证签名失败
      if (res.err_code !== 'undefined' && res.err_desc !== 'undefined') {
        callbacks.innerCallback('fail', callbacks.error(res.err_desc, res));
      }
    };
    wx.requestPayment(wx_lite);
  },

  /* eslint-disable no-unused-vars */
  runTestMode: function (url) {
    wx.showModal({
      title: '提示',
      content: '因 "微信小程序" 限制 域名的原因 暂不支持 模拟付款 请使用 livekey 获取 charge 进行支付'
    });
  }
  /* eslint-enable no-unused-vars */
};


/***/ }),

/***/ 1345:
/***/ (function(module, exports, __webpack_require__) {

var callbacks = __webpack_require__(646);
var utils = __webpack_require__(629);
var stash = __webpack_require__(689);
var mods = __webpack_require__(983);
var hasOwn = {}.hasOwnProperty;

/*global WeixinJSBridge*/
module.exports = {

  PINGPP_NOTIFY_URL_BASE: 'https://notify.pingxx.com/notify',

  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    var fields = [
      'appId', 'timeStamp', 'nonceStr', 'package', 'signType', 'paySign'
    ];
    for (var k = 0; k < fields.length; k++) {
      if (!hasOwn.call(credential, fields[k])) {
        callbacks.innerCallback('fail',
          callbacks.error('invalid_credential', 'missing_field_' + fields[k]));
        return;
      }
    }
    stash.jsApiParameters = credential;
    this.callpay();
  },

  callpay: function() {
    var self = this;
    var wx_jssdk = mods.getExtraModule('wx_jssdk');
    if (typeof wx_jssdk !== 'undefined' && wx_jssdk.jssdkEnabled()) {
      wx_jssdk.callpay();
    } else if (typeof WeixinJSBridge == 'undefined') {
      var eventCallback = function() {
        self.jsApiCall();
      };
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady',
          eventCallback, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', eventCallback);
        document.attachEvent('onWeixinJSBridgeReady', eventCallback);
      }
    } else {
      this.jsApiCall();
    }
  },

  jsApiCall: function() {
    if (hasOwn.call(stash, 'jsApiParameters')) {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        stash.jsApiParameters,
        function(res) {
          delete stash.jsApiParameters;
          if (res.err_msg == 'get_brand_wcpay_request:ok') {
            callbacks.innerCallback('success');
          } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
            callbacks.innerCallback('cancel');
          } else {
            callbacks.innerCallback('fail',
              callbacks.error('wx_result_fail', res.err_msg));
          }
        }
      );
    }
  },

  runTestMode: function(charge) {
    var dopay = confirm('模拟付款？');
    if (dopay) {
      var path = '/charges/' + charge.id;
      utils.request(this.PINGPP_NOTIFY_URL_BASE + path + '?livemode=false',
        'GET', null,
        function(data, status) {
          if (status >= 200 && status < 400 && data == 'success') {
            callbacks.innerCallback('success');
          } else {
            var extra = 'http_code:' + status + ';response:' + data;
            callbacks.innerCallback('fail',
              callbacks.error('testmode_notify_fail', extra));
          }
        },
        function() {
          callbacks.innerCallback('fail', callbacks.error('network_err'));
        });
    }
  }
};


/***/ }),

/***/ 1346:
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(629);
var callbacks = __webpack_require__(646);
var hasOwn = {}.hasOwnProperty;

module.exports = {

  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    if (typeof credential === 'string') {
      utils.redirectTo(credential, charge.channel);
    } else if (typeof credential === 'object'
      && hasOwn.call(credential, 'url')
    ) {
      utils.redirectTo(credential.url, charge.channel);
    } else {
      callbacks.innerCallback('fail',
        callbacks.error('invalid_credential', 'credential 格式不正确'));
    }
  }
};


/***/ }),

/***/ 1347:
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(629);
var callbacks = __webpack_require__(646);
var hasOwn = {}.hasOwnProperty;

module.exports = {

  YEEPAY_WAP_URL: 'https://ok.yeepay.com/paymobile/api/pay/request',
  YEEPAY_WAP_TEST_URL: 'http://mobiletest.yeepay.com/paymobile/api/pay/request',

  handleCharge: function(charge) {
    var channel = charge.channel;
    var credential = charge.credential[channel];
    var fields = ['merchantaccount', 'encryptkey', 'data'];
    for (var k = 0; k < fields.length; k++) {
      if (!hasOwn.call(credential, fields[k])) {
        callbacks.innerCallback('fail',
          callbacks.error('invalid_credential', 'missing_field_' + fields[k]));
        return;
      }
    }
    var baseURL;
    if (hasOwn.call(credential, 'mode') && credential.mode == 'test') {
      baseURL = this.YEEPAY_WAP_TEST_URL;
    } else {
      baseURL = this.YEEPAY_WAP_URL;
    }
    utils.redirectTo(baseURL + '?' +
      utils.stringifyData(credential, channel, true), charge.channel);
  }
};


/***/ }),

/***/ 1348:
/***/ (function(module, exports, __webpack_require__) {

var stash = __webpack_require__(689);
var utils = __webpack_require__(629);
var dc = __webpack_require__(1009);

module.exports = {
  SRC_URL: 'https://cookie.pingxx.com',

  init: function() {
    var self = this;
    utils.documentReady(function(){
      try {
        self.initPuid();
      } catch (e){/* empty */}
    });
  },

  initPuid: function() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined'
        || localStorage === null) {
      return;
    }
    var puid = localStorage.getItem('pingpp_uid');
    if (puid === null) {
      puid = utils.randomString();
      try {
        localStorage.setItem('pingpp_uid', puid);
      } catch (e) {
        /* empty */
      }
    }
    stash.puid = puid;
    if (!document.getElementById('p_analyse_iframe')) {
      var iframe;
      try {
        iframe = document.createElement('iframe');
      }catch(e){
        iframe = document.createElement('<iframe name="ifr"></iframe>');
      }
      iframe.id = 'p_analyse_iframe';
      iframe.src = this.SRC_URL + '/?puid=' + puid;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }
    setTimeout(function() {
      dc.send();
    }, 0);
  }
};


/***/ }),

/***/ 1349:
/***/ (function(module, exports) {

/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/* global unescape, module */

(function () {
  /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
  function safe_add (x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  function bit_rol (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  function md5_cmn (q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
  }
  function md5_ff (a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function md5_gg (a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function md5_hh (a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5_ii (a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length.
  */
  function binl_md5 (x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (len % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var i;
    var olda;
    var oldb;
    var oldc;
    var oldd;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;

    for (i = 0; i < x.length; i += 16) {
      olda = a;
      oldb = b;
      oldc = c;
      oldd = d;

      a = md5_ff(a, b, c, d, x[i], 7, -680876936);
      d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

      a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5_gg(b, c, d, a, x[i], 20, -373897302);
      a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

      a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5_hh(d, a, b, c, x[i], 11, -358537222);
      c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

      a = md5_ii(a, b, c, d, x[i], 6, -198630844);
      d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
    }
    return [a, b, c, d];
  }

  /*
  * Convert an array of little-endian words to a string
  */
  function binl2rstr (input) {
    var i;
    var output = '';
    for (i = 0; i < input.length * 32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
    }
    return output;
  }

  /*
  * Convert a raw string to an array of little-endian words
  * Characters >255 have their high-byte silently ignored.
  */
  function rstr2binl (input) {
    var i;
    var output = [];
    output[(input.length >> 2) - 1] = undefined;
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0;
    }
    for (i = 0; i < input.length * 8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
    }
    return output;
  }

  /*
  * Calculate the MD5 of a raw string
  */
  function rstr_md5 (s) {
    return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
  }

  /*
  * Calculate the HMAC-MD5, of a key and some data (raw strings)
  */
  function rstr_hmac_md5 (key, data) {
    var i;
    var bkey = rstr2binl(key);
    var ipad = [];
    var opad = [];
    var hash;
    ipad[15] = opad[15] = undefined;
    if (bkey.length > 16) {
      bkey = binl_md5(bkey, key.length * 8);
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
    return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
  }

  /*
  * Convert a raw string to a hex string
  */
  function rstr2hex (input) {
    var hex_tab = '0123456789abcdef';
    var output = '';
    var x;
    var i;
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i);
      output += hex_tab.charAt((x >>> 4) & 0x0F) +
      hex_tab.charAt(x & 0x0F);
    }
    return output;
  }

  /*
  * Encode a string as utf-8
  */
  function str2rstr_utf8 (input) {
    return unescape(encodeURIComponent(input));
  }

  /*
  * Take string arguments and return either raw or hex encoded strings
  */
  function raw_md5 (s) {
    return rstr_md5(str2rstr_utf8(s));
  }
  function hex_md5 (s) {
    return rstr2hex(raw_md5(s));
  }
  function raw_hmac_md5 (k, d) {
    return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
  }
  function hex_hmac_md5 (k, d) {
    return rstr2hex(raw_hmac_md5(k, d));
  }

  function md5 (string, key, raw) {
    if (!key) {
      if (!raw) {
        return hex_md5(string);
      }
      return raw_md5(string);
    }
    if (!raw) {
      return hex_hmac_md5(key, string);
    }
    return raw_hmac_md5(key, string);
  }

  module.exports = md5;
}());


/***/ }),

/***/ 1350:
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(1352).v;
var hasOwn = {}.hasOwnProperty;

var PingppSDK = function () {
  __webpack_require__(1348).init();
};

PingppSDK.prototype.version = version;

module.exports = new PingppSDK();

var testmode = __webpack_require__(1351);
var callbacks = __webpack_require__(646);
var mods = __webpack_require__(983);
var stash = __webpack_require__(689);
var dc = __webpack_require__(1009);
var payment_elements = __webpack_require__(1010);

PingppSDK.prototype.createPayment = function (
  chargeJSON, callback, signature, debug
) {
  if (typeof callback === 'function') {
    callbacks.userCallback = callback;
  }

  payment_elements.init(chargeJSON);

  if (!hasOwn.call(payment_elements, 'id')) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_charge', 'no_charge_id'));
    return;
  }
  if (!hasOwn.call(payment_elements, 'channel')) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_charge', 'no_channel'));
    return;
  }

  if (hasOwn.call(payment_elements, 'app')) {
    if (typeof payment_elements.app === 'string') {
      stash.app_id = payment_elements.app;
    } else if (typeof payment_elements.app === 'object' &&
      typeof payment_elements.app.id === 'string') {
      stash.app_id = payment_elements.app.id;
    }
  }
  dc.report({
    type: stash.type || 'pure_sdk_click',
    channel: payment_elements.channel,
    ch_id: payment_elements.id
  });
  var channel = payment_elements.channel;
  if (!hasOwn.call(payment_elements, 'credential')) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_charge', 'no_credential'));
    return;
  }
  if (!payment_elements.credential) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_credential', 'credential_is_undefined'));
    return;
  }
  if (!hasOwn.call(payment_elements.credential, channel)) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_credential', 'credential_is_incorrect'));
    return;
  }
  if (!hasOwn.call(payment_elements, 'livemode')) {
    callbacks.innerCallback('fail',
      callbacks.error('invalid_charge', 'no_livemode_field'));
    return;
  }
  var channelModule = mods.getChannelModule(channel);
  if (typeof channelModule === 'undefined') {
    console.error('channel module "' + channel + '" is undefined');
    callbacks.innerCallback('fail',
      callbacks.error('invalid_channel',
        'channel module "' + channel + '" is undefined')
    );
    return;
  }
  if (payment_elements.livemode === false) {
    if (hasOwn.call(channelModule, 'runTestMode')) {
      channelModule.runTestMode(payment_elements);
    } else {
      testmode.runTestMode(payment_elements);
    }
    return;
  }

  if (typeof signature != 'undefined') {
    stash.signature = signature;
  }
  if (typeof debug == 'boolean') {
    stash.debug = debug;
  }
  channelModule.handleCharge(payment_elements);
};

PingppSDK.prototype.setAPURL = function (url) {
  stash.APURL = url;
};

PingppSDK.prototype.setUrlReturnCallback = function (callback, channels) {
  if (typeof callback === 'function') {
    callbacks.urlReturnCallback = callback;
  } else {
    throw 'callback need to be a function';
  }

  if (typeof channels !== 'undefined') {
    if (Array.isArray(channels)) {
      callbacks.urlReturnChannels = channels;
    } else {
      throw 'channels need to be an array';
    }
  }
};


/***/ }),

/***/ 1351:
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(629);
var hasOwn = {}.hasOwnProperty;
module.exports = {
  PINGPP_MOCK_URL: 'http://sissi.pingxx.com/mock.php',

  runTestMode: function (charge) {
    var params = {
      'ch_id': charge.id,
      'scheme': 'http',
      'channel': charge.channel
    };

    if (hasOwn.call(charge, 'order_no')) {
      params.order_no = charge.order_no;
    } else if (hasOwn.call(charge, 'orderNo')) {
      params.order_no = charge.orderNo;
    }
    if (hasOwn.call(charge, 'time_expire')) {
      params.time_expire = charge.time_expire;
    } else if (hasOwn.call(charge, 'timeExpire')) {
      params.time_expire = charge.timeExpire;
    }
    if (hasOwn.call(charge, 'extra')) {
      params.extra = encodeURIComponent(JSON.stringify(charge.extra));
    }
    utils.redirectTo(
      this.PINGPP_MOCK_URL + '?' + utils.stringifyData(params),
      charge.channel
    );
  }
};


/***/ }),

/***/ 1352:
/***/ (function(module, exports) {

module.exports = {
  v: '2.2.1'
};


/***/ }),

/***/ 1380:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
var cssModules = {}
cssModules["$style"] = __webpack_require__(1237)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(1058),
  /* template */
  __webpack_require__(1438),
  /* scopeId */
  null,
  /* cssModules */
  cssModules
)
Component.options.__file = "/www/wwwroot/piaobo/packages/thinksns-plus-authorization-pb-h5/src/views/balance/Account.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Account.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-587d7389", Component.options)
  } else {
    if (module.hot.data.cssModules && JSON.stringify(module.hot.data.cssModules) !== JSON.stringify(cssModules)) {
      delete Component.options._Ctor
    }
    hotAPI.reload("data-v-587d7389", Component.options)
  }
  module.hot.dispose(function (data) {
    data.cssModules = cssModules
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 1397:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showSpinner),
      expression: "showSpinner"
    }],
    attrs: {
      "id": "spinner"
    }
  }, [_vm._m(0)]), _vm._v(" "), _c('header', {
    class: ['commonHeader', _vm.$style.commonHeader],
    attrs: {
      "id": "balance-header"
    }
  }, [_c('Row', {
    attrs: {
      "gutter": 24
    }
  }, [_c('Col', {
    staticStyle: {
      "display": "flex",
      "justify-content": "flex-start"
    },
    attrs: {
      "span": "5"
    }
  }, [(!_vm.isWeixin) ? _c('BackIcon', {
    attrs: {
      "height": "21",
      "width": "21",
      "color": "#fff"
    },
    nativeOn: {
      "click": function($event) {
        _vm.$router.push('/users/profile')
      }
    }
  }) : _vm._e()], 1), _vm._v(" "), _c('Col', {
    staticClass: "title-col",
    attrs: {
      "span": "12"
    }
  }, [_c('div', [_c('span', {
    class: _vm.$style.newsTitle,
    staticStyle: {
      "font-size": "18px",
      "padding": "0 5px"
    }
  }, [_vm._v("钱包")])])]), _vm._v(" "), _c('Col', {
    staticClass: "header-end-col",
    attrs: {
      "span": "7"
    }
  }, [_c('router-link', {
    class: _vm.$style.toRecords,
    attrs: {
      "to": "/balance/records"
    }
  }, [_vm._v("收支细明")])], 1)], 1)], 1), _vm._v(" "), _c('section', {
    class: _vm.$style.balanceContent
  }, [_c('Row', {
    attrs: {
      "gutter": 24
    }
  }, [_c('Col', {
    attrs: {
      "span": "24",
      "align": "middle",
      "type": "flex"
    }
  }, [_c('p', [_vm._v("账户余额(" + _vm._s(_vm.goldName) + ")")])])], 1), _vm._v(" "), _c('Row', {
    attrs: {
      "gutter": 24,
      "align": "middle",
      "type": "flex"
    }
  }, [_c('Col', {
    attrs: {
      "span": "24"
    }
  }, [_c('h1', [_vm._v("\n          " + _vm._s(_vm.showAmount(_vm.balance)) + "\n        ")])])], 1)], 1), _vm._v(" "), _c('section', {
    class: _vm.$style.operations
  }, [_c('Row', {
    class: _vm.$style.operation,
    attrs: {
      "gutter": 24
    },
    nativeOn: {
      "click": function($event) {
        _vm.openRecharge($event)
      }
    }
  }, [_c('Col', {
    attrs: {
      "span": "20"
    }
  }, [_vm._v("\n        充值\n      ")]), _vm._v(" "), _c('Col', {
    staticClass: "header-end-col",
    attrs: {
      "span": "4"
    }
  }, [_c('RightArrowIcon', {
    attrs: {
      "height": "21",
      "width": "21",
      "color": "#bfbfbf"
    }
  })], 1)], 1), _vm._v(" "), _c('Row', {
    class: _vm.$style.operation,
    attrs: {
      "gutter": 24
    },
    nativeOn: {
      "click": function($event) {
        _vm.openWithdraw($event)
      }
    }
  }, [_c('Col', {
    attrs: {
      "span": "20"
    }
  }, [_vm._v("\n        提现\n      ")]), _vm._v(" "), _c('Col', {
    staticClass: "header-end-col",
    attrs: {
      "span": "4"
    }
  }, [_c('RightArrowIcon', {
    attrs: {
      "height": "21",
      "width": "21",
      "color": "#bfbfbf"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "button-operation"
  }, [_c('Row', {
    attrs: {
      "gutter": 24
    }
  }, [_c('Col', {
    attrs: {
      "span": "12"
    }
  }, [_c('Button', {
    staticClass: "rule-operation",
    attrs: {
      "size": "large",
      "long": "",
      "type": "text"
    },
    nativeOn: {
      "click": function($event) {
        _vm.showRule($event)
      }
    }
  }, [_vm._v("充值/提现规则")])], 1), _vm._v(" "), _c('Col', {
    attrs: {
      "span": "12"
    }
  }, [_c('router-link', {
    attrs: {
      "to": "/balance/withdraws"
    }
  }, [_vm._v("提现记录")])], 1)], 1)], 1), _vm._v(" "), _c('Modal', {
    on: {
      "on-cancel": _vm.resetAllRecharge
    },
    model: {
      value: (_vm.rechargeOpen),
      callback: function($$v) {
        _vm.rechargeOpen = $$v
      },
      expression: "rechargeOpen"
    }
  }, [_c('p', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "slot": "header"
    },
    slot: "header"
  }, [_c('span', [_vm._v("充值")])]), _vm._v(" "), _c('div', {
    staticStyle: {
      "text-align": "center"
    }
  }, [_c('Row', {
    staticStyle: {
      "border-bottom": "1px solid #e9eaec",
      "padding-bottom": "16px"
    },
    attrs: {
      "gutter": 24
    }
  }, _vm._l((_vm.system.labels), function(label, index) {
    return _c('Col', {
      key: index,
      attrs: {
        "span": "8"
      }
    }, [_c('Button', {
      class: ['ivu-btn', 'ivu-btn-ghost', {
        active: _vm.rechargeNum === label && _vm.customRecharge === ''
      }],
      nativeOn: {
        "click": function($event) {
          _vm.setRecharge(label)
        }
      }
    }, [_vm._v(_vm._s(_vm.showAmount(label)))])], 1)
  })), _vm._v(" "), _c('Row', {
    staticStyle: {
      "padding-top": "8px",
      "font-size": "14px"
    },
    attrs: {
      "gutter": 24,
      "type": "flex",
      "justify": "space-around"
    }
  }, [_c('Col', {
    class: _vm.$style.textAlignLeft,
    attrs: {
      "span": "12"
    }
  }, [_c('label', {
    attrs: {
      "for": "account"
    }
  }, [_vm._v("自定义" + _vm._s(_vm.goldName) + "数量")])]), _vm._v(" "), _c('Col', {
    class: _vm.$style.textAlignRight,
    attrs: {
      "span": "12"
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: (_vm.customRecharge),
      expression: "customRecharge",
      modifiers: {
        "number": true
      }
    }],
    class: _vm.$style.balanceInput,
    attrs: {
      "type": "number",
      "dir": "rtl",
      "autocomplete": "off",
      "placeholder": ("输入" + _vm.goldName + "数量")
    },
    domProps: {
      "value": (_vm.customRecharge)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.customRecharge = _vm._n($event.target.value)
      },
      "blur": function($event) {
        _vm.$forceUpdate()
      }
    }
  })])], 1)], 1), _vm._v(" "), _c('div', {
    staticStyle: {
      "text-align": "center",
      "padding-top": "16px"
    }
  }, [_c('Row', {
    attrs: {
      "gutter": 24
    }
  }, [_c('Col', {
    class: _vm.$style.textAlignLeft,
    attrs: {
      "span": "24"
    }
  }, [_c('Select', {
    attrs: {
      "size": "large",
      "placeholder": "选择充值方式"
    },
    model: {
      value: (_vm.rechargeType),
      callback: function($$v) {
        _vm.rechargeType = $$v
      },
      expression: "rechargeType"
    }
  }, _vm._l((_vm.rechargeTypes), function(item) {
    return _c('Option', {
      key: item.value,
      attrs: {
        "value": item.value
      }
    }, [_vm._v(_vm._s(item.label))])
  }))], 1)], 1)], 1), _vm._v(" "), _c('div', {
    attrs: {
      "slot": "footer"
    },
    slot: "footer"
  }, [_c('Button', {
    attrs: {
      "type": "primary",
      "size": "large",
      "long": "",
      "disabled": !_vm.rechargeNum && !_vm.customRecharge || !_vm.rechargeType,
      "loading": _vm.modal_loading
    },
    on: {
      "click": _vm.doRecharge
    }
  }, [_vm._v("确定")])], 1)]), _vm._v(" "), _c('Modal', {
    on: {
      "on-cancel": _vm.resetAllWithdraw
    },
    model: {
      value: (_vm.withdrawOpen),
      callback: function($$v) {
        _vm.withdrawOpen = $$v
      },
      expression: "withdrawOpen"
    }
  }, [_c('p', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "slot": "header"
    },
    slot: "header"
  }, [_c('span', [_vm._v("提现")])]), _vm._v(" "), _c('div', {
    staticStyle: {
      "text-align": "center"
    }
  }, [_c('Row', {
    staticStyle: {
      "padding-top": "8px",
      "font-size": "14px"
    },
    attrs: {
      "gutter": 24,
      "type": "flex",
      "justify": "space-around"
    }
  }, [_c('Col', {
    class: _vm.$style.textAlignLeft,
    attrs: {
      "span": "12"
    }
  }, [_c('label', {
    attrs: {
      "for": "account"
    }
  }, [_vm._v("提现数量")])]), _vm._v(" "), _c('Col', {
    class: _vm.$style.textAlignRight,
    attrs: {
      "span": "12"
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: (_vm.withdrawNum),
      expression: "withdrawNum",
      modifiers: {
        "number": true
      }
    }],
    class: _vm.$style.balanceInput,
    attrs: {
      "dir": "rtl",
      "type": "number",
      "autocomplete": "off",
      "placeholder": ("输入" + _vm.goldName + "数量")
    },
    domProps: {
      "value": (_vm.withdrawNum)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.withdrawNum = _vm._n($event.target.value)
      },
      "blur": function($event) {
        _vm.$forceUpdate()
      }
    }
  })])], 1), _vm._v(" "), _c('Row', {
    attrs: {
      "gutter": 24
    }
  }, [_c('Col', {
    class: _vm.$style.textAlignLeft,
    attrs: {
      "span": "24"
    }
  }, [_c('Select', {
    attrs: {
      "size": "large",
      "placeholder": "选择提现方式"
    },
    model: {
      value: (_vm.withdrawType),
      callback: function($$v) {
        _vm.withdrawType = $$v
      },
      expression: "withdrawType"
    }
  }, _vm._l((_vm.withdrawTypes), function(item) {
    return _c('Option', {
      key: item.value,
      attrs: {
        "value": item.value
      }
    }, [_vm._v(_vm._s(item.label))])
  }))], 1)], 1), _vm._v(" "), _c('Row', {
    staticStyle: {
      "padding-top": "8px",
      "font-size": "14px"
    },
    attrs: {
      "gutter": 24,
      "type": "flex",
      "justify": "space-around"
    }
  }, [_c('Col', {
    class: _vm.$style.textAlignLeft,
    attrs: {
      "span": "12"
    }
  }, [_c('label', {
    attrs: {
      "for": "account"
    }
  }, [_vm._v("提现账户")])]), _vm._v(" "), _c('Col', {
    class: _vm.$style.textAlignRight,
    attrs: {
      "span": "12"
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: (_vm.account),
      expression: "account",
      modifiers: {
        "number": true
      }
    }],
    class: _vm.$style.balanceInput,
    attrs: {
      "dir": "rtl",
      "type": "text",
      "autocomplete": "off",
      "placeholder": "输入提现账户"
    },
    domProps: {
      "value": (_vm.account)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.account = _vm._n($event.target.value)
      },
      "blur": function($event) {
        _vm.$forceUpdate()
      }
    }
  })])], 1)], 1), _vm._v(" "), _c('div', {
    attrs: {
      "slot": "footer"
    },
    slot: "footer"
  }, [_c('Button', {
    attrs: {
      "type": "primary",
      "size": "large",
      "long": "",
      "disabled": !_vm.withdrawNum || !_vm.withdrawType || !_vm.account,
      "loading": _vm.modal_loading
    },
    on: {
      "click": _vm.doWithdraw
    }
  }, [_vm._v("确定")])], 1)])], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "spinner-parent"
    }
  }, [_c('div', {
    staticClass: "spinner-double-bounce-bounce2"
  }), _vm._v(" "), _c('div', {
    staticClass: "spinner-double-bounce-bounce1"
  })])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-070268b8", module.exports)
  }
}

/***/ }),

/***/ 1419:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [
    [_c('div', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (_vm.showSpinner),
        expression: "showSpinner"
      }],
      attrs: {
        "id": "spinner"
      }
    }, [_vm._m(0)]), _vm._v(" "), _c('header', {
      class: ['commonHeader', _vm.$style.commonHeader],
      attrs: {
        "id": "balance-header"
      }
    }, [_c('Row', {
      attrs: {
        "gutter": 24
      }
    }, [_c('Col', {
      staticStyle: {
        "display": "flex",
        "justify-content": "flex-start"
      },
      attrs: {
        "span": "5"
      }
    }, [(!_vm.isWeixin) ? _c('BackIcon', {
      attrs: {
        "height": "21",
        "width": "21",
        "color": "#333"
      },
      nativeOn: {
        "click": function($event) {
          _vm.goBack()
        }
      }
    }) : _vm._e()], 1), _vm._v(" "), _c('Col', {
      staticClass: "title-col",
      attrs: {
        "span": "14"
      }
    }, [_c('Dropdown', {
      staticStyle: {
        "margin-left": "20px"
      },
      attrs: {
        "trigger": "click"
      },
      on: {
        "on-click": function (name) {
          _vm.recordsType(name);
        }
      }
    }, [_c('span', [_vm._v("\n                " + _vm._s(_vm.menuText) + "\n                "), _c('Icon', {
      attrs: {
        "type": "arrow-down-b"
      }
    })], 1), _vm._v(" "), _c('DropdownMenu', {
      attrs: {
        "slot": "list"
      },
      slot: "list"
    }, [_c('DropdownItem', {
      attrs: {
        "selected": _vm.action === '',
        "name": "all"
      }
    }, [_vm._v("全部")]), _vm._v(" "), _c('DropdownItem', {
      attrs: {
        "name": "in",
        "selected": _vm.action === 1,
        "divided": true
      }
    }, [_vm._v("收入")]), _vm._v(" "), _c('DropdownItem', {
      attrs: {
        "name": "out",
        "selected": _vm.action === 0,
        "divided": true
      }
    }, [_vm._v("支出")])], 1)], 1)], 1)], 1)], 1), _vm._v(" "), _c('div', {
      staticClass: "nothingDefault"
    }, [(_vm.nothing) ? _c('img', {
      attrs: {
        "src": _vm.nothing
      }
    }) : _vm._e()]), _vm._v(" "), (!_vm.nothing) ? _c('div', {
      ref: "wrapper",
      class: _vm.$style.pageLoadmoreWrapper,
      style: ({
        height: _vm.wrapperHeight + 'px'
      })
    }, [_c('mt-loadmore', {
      ref: "loadmore",
      class: _vm.$style.recordLoadMore,
      attrs: {
        "bottom-method": _vm.loadBottom,
        "top-method": _vm.loadTop,
        "bottom-all-loaded": _vm.bottomAllLoaded,
        "top-all-loaded": _vm.topAllLoaded,
        "bottomDistance": 70
      },
      on: {
        "bottom-status-change": _vm.bottomStatusChange
      }
    }, [_c('section', _vm._l((_vm.records), function(record, index) {
      return _c('Row', {
        key: index,
        class: _vm.$style.recordList,
        attrs: {
          "gutter": 24
        },
        nativeOn: {
          "click": function($event) {
            _vm.showDetail(index)
          }
        }
      }, [_c('Col', {
        class: _vm.$style.time,
        attrs: {
          "span": "4"
        }
      }, [_c('span', [_vm._v(_vm._s(_vm.localTime(record.created_at)['weekDay']))]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.localTime(record.created_at)['date']))])]), _vm._v(" "), _c('Col', {
        class: _vm.$style.recordBody,
        attrs: {
          "span": "15"
        }
      }, [_vm._v(_vm._s(record.subject))]), _vm._v(" "), _c('Col', {
        staticClass: "header-end-col",
        staticStyle: {
          "color": "#ff9400"
        },
        attrs: {
          "span": "5"
        }
      }, [_vm._v(_vm._s(record.action === 0 ? '-' : '+') + _vm._s(_vm.showAmount(record.amount)))])], 1)
    })), _vm._v(" "), _c('div', {
      class: ['mint-loadmore-bottom', _vm.$style.mintLoadmoreBottom],
      attrs: {
        "slot": "bottom"
      },
      slot: "bottom"
    }, [(_vm.bottomAllLoaded) ? _c('span', [_vm._v("没有更多了")]) : _c('section', [_c('span', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (_vm.bottomStatus === 'pull' && !_vm.bottomAllLoaded),
        expression: "bottomStatus === 'pull' && !bottomAllLoaded"
      }],
      class: {
        'rotate': _vm.topStatus === 'drop'
      }
    }, [_vm._v("上拉加载更多")]), _vm._v(" "), _c('span', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (_vm.bottomStatus === 'loading'),
        expression: "bottomStatus === 'loading'"
      }]
    }, [_vm._v("加载中...")]), _vm._v(" "), _c('span', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (_vm.bottomStatus === 'drop' && !_vm.bottomAllLoaded),
        expression: "bottomStatus === 'drop' && !bottomAllLoaded"
      }]
    }, [_vm._v("释放加载更多")])])])])], 1) : _vm._e(), _vm._v(" "), _c('Modal', {
      attrs: {
        "mask-closable": false
      },
      on: {
        "on-cancel": _vm.closeModal
      },
      model: {
        value: (_vm.detailOpen),
        callback: function($$v) {
          _vm.detailOpen = $$v
        },
        expression: "detailOpen"
      }
    }, [_c('p', {
      staticStyle: {
        "text-align": "center"
      },
      attrs: {
        "slot": "header"
      },
      slot: "header"
    }, [_c('span', [_vm._v("账户详情")])]), _vm._v(" "), _c('section', {
      staticStyle: {
        "text-align": "center"
      }
    }, [_c('Row', {
      staticStyle: {
        "padding-top": "16px",
        "font-size": "14px"
      },
      attrs: {
        "gutter": 24,
        "type": "flex",
        "justify": "space-around"
      }
    }, [_c('Col', {
      class: _vm.$style.textAlignLeft,
      attrs: {
        "span": "24"
      }
    }, [_c('p', {
      staticStyle: {
        "color": "#bfbfbf"
      }
    }, [_vm._v(_vm._s(_vm.detail.status === 1 ? '交易成功' : '交易失败'))])])], 1), _vm._v(" "), _c('Row', {
      staticStyle: {
        "padding-top": "16px"
      },
      attrs: {
        "gutter": 24
      }
    }, [_c('Col', {
      class: _vm.$style.textAlignLeft,
      attrs: {
        "span": "24"
      }
    }, [_c('h1', [_vm._v(_vm._s(_vm.detail.action === 1 ? "+ " : "- ") + _vm._s(_vm.showAmount(_vm.detail.amount)))])])], 1)], 1), _vm._v(" "), _c('section', {
      staticStyle: {
        "margin-top": "16px"
      }
    }, [_c('Row', {
      class: _vm.$style.recordDetail,
      attrs: {
        "gutter": 24
      }
    }, [_c('Col', {
      class: _vm.$style.detailLabel,
      attrs: {
        "span": "6"
      }
    }, [_vm._v(_vm._s(_vm.detail.action === 1 ? '付款人' : '收款人'))]), _vm._v(" "), _c('Col', {
      attrs: {
        "span": "18"
      }
    }, [_c('AccountComponent', {
      attrs: {
        "detail": _vm.detail
      }
    })], 1)], 1), _vm._v(" "), _c('Row', {
      class: _vm.$style.recordDetail,
      attrs: {
        "gutter": 24
      }
    }, [_c('Col', {
      class: _vm.$style.detailLabel,
      attrs: {
        "span": "6"
      }
    }, [_vm._v("交易说明")]), _vm._v(" "), _c('Col', {
      staticStyle: {
        "word-break": "break-all"
      },
      attrs: {
        "span": "18"
      }
    }, [_vm._v(_vm._s(_vm.detail.body))])], 1), _vm._v(" "), _c('Row', {
      class: _vm.$style.recordDetail,
      attrs: {
        "gutter": 24
      }
    }, [_c('Col', {
      class: _vm.$style.detailLabel,
      attrs: {
        "span": "6"
      }
    }, [_vm._v("交易时间")]), _vm._v(" "), _c('Col', {
      attrs: {
        "span": "18"
      }
    }, [_vm._v(_vm._s(_vm.time ? _vm.localDateTime(_vm.time) : ''))])], 1)], 1), _vm._v(" "), _c('div', {
      attrs: {
        "slot": "footer"
      },
      slot: "footer"
    })])]
  ], 2)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "spinner-parent"
    }
  }, [_c('div', {
    staticClass: "spinner-double-bounce-bounce2"
  }), _vm._v(" "), _c('div', {
    staticClass: "spinner-double-bounce-bounce1"
  })])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-2fabad9a", module.exports)
  }
}

/***/ }),

/***/ 1438:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.link) ? _c('div', {
    class: _vm.$style.root,
    on: {
      "click": _vm.jumpToUserFeeds
    }
  }, [_c('img', {
    directives: [{
      name: "lazy",
      rawName: "v-lazy",
      value: (_vm.getAvatar(_vm.user.avatar)),
      expression: "getAvatar(user.avatar)"
    }],
    staticStyle: {
      "width": "6vw",
      "margin-right": "1vw"
    },
    attrs: {
      "alt": _vm.user.name
    }
  }), _vm._v("\n    " + _vm._s(_vm.user.name) + "\n  ")]) : _c('div', {
    class: _vm.$style.root
  }, [_vm._v("\n    " + _vm._s(_vm.allChannel[this.detail.channel]) + "\n  ")])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-587d7389", module.exports)
  }
}

/***/ }),

/***/ 1483:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showSpinner),
      expression: "showSpinner"
    }],
    attrs: {
      "id": "spinner"
    }
  }, [_vm._m(0)]), _vm._v(" "), _c('header', {
    class: ['commonHeader', _vm.$style.commonHeader],
    attrs: {
      "id": "balance-header"
    }
  }, [_c('Row', {
    attrs: {
      "gutter": 24
    }
  }, [_c('Col', {
    staticStyle: {
      "display": "flex",
      "justify-content": "flex-start"
    },
    attrs: {
      "span": "5"
    }
  }, [(!_vm.isWeixin) ? _c('BackIcon', {
    attrs: {
      "height": "21",
      "width": "21",
      "color": "#333"
    },
    nativeOn: {
      "click": function($event) {
        _vm.goBack()
      }
    }
  }) : _vm._e()], 1), _vm._v(" "), _c('Col', {
    staticClass: "title-col",
    attrs: {
      "span": "14"
    }
  }, [_vm._v("\n        提现记录\n      ")])], 1)], 1), _vm._v(" "), _c('div', {
    staticClass: "nothingDefault"
  }, [(_vm.nothing) ? _c('img', {
    attrs: {
      "src": _vm.nothing
    }
  }) : _vm._e()]), _vm._v(" "), (!_vm.nothing) ? _c('div', {
    ref: "wrapper",
    class: _vm.$style.pageLoadmoreWrapper,
    style: ({
      height: _vm.wrapperHeight + 'px'
    })
  }, [_c('mt-loadmore', {
    ref: "loadmore",
    class: _vm.$style.recordLoadMore,
    attrs: {
      "bottom-method": _vm.loadBottom,
      "top-method": _vm.loadTop,
      "bottom-all-loaded": _vm.bottomAllLoaded,
      "top-all-loaded": _vm.topAllLoaded,
      "bottomDistance": 70
    },
    on: {
      "bottom-status-change": _vm.bottomStatusChange
    }
  }, [_c('section', _vm._l((_vm.withdrawRecords), function(record, index) {
    return _c('Row', {
      key: index,
      class: _vm.$style.recordList,
      attrs: {
        "gutter": 24
      },
      nativeOn: {
        "click": function($event) {
          _vm.showDetail(index)
        }
      }
    }, [_c('Col', {
      class: _vm.$style.time,
      attrs: {
        "span": "4"
      }
    }, [_c('span', [_vm._v(_vm._s(_vm.localTime(record.created_at)['weekDay']))]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.localTime(record.created_at)['date']))])]), _vm._v(" "), _c('Col', {
      class: _vm.$style.recordBody,
      attrs: {
        "span": "15"
      }
    }, [_vm._v(_vm._s(record.type === 'wechat' ? '微信 ' : '支付宝 ') + " 账户提现")]), _vm._v(" "), _c('Col', {
      staticClass: "header-end-col",
      staticStyle: {
        "color": "#bfbfbf"
      },
      attrs: {
        "span": "5"
      }
    }, [_vm._v(_vm._s(record.status === 1 ? '提现成功' : (record.status === 0 ? '待审核' : '被驳回')))])], 1)
  })), _vm._v(" "), _c('div', {
    class: ['mint-loadmore-bottom', _vm.$style.mintLoadmoreBottom],
    attrs: {
      "slot": "bottom"
    },
    slot: "bottom"
  }, [(_vm.bottomAllLoaded) ? _c('span', [_vm._v("没有更多了")]) : _c('section', [_c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.bottomStatus === 'pull' && !_vm.bottomAllLoaded),
      expression: "bottomStatus === 'pull' && !bottomAllLoaded"
    }],
    class: {
      'rotate': _vm.topStatus === 'drop'
    }
  }, [_vm._v("上拉加载更多")]), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.bottomStatus === 'loading'),
      expression: "bottomStatus === 'loading'"
    }]
  }, [_vm._v("加载中...")]), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.bottomStatus === 'drop' && !_vm.bottomAllLoaded),
      expression: "bottomStatus === 'drop' && !bottomAllLoaded"
    }]
  }, [_vm._v("释放加载更多")])])])])], 1) : _vm._e(), _vm._v(" "), _c('Modal', {
    attrs: {
      "mask-closable": false
    },
    on: {
      "on-cancel": _vm.closeModal
    },
    model: {
      value: (_vm.detailOpen),
      callback: function($$v) {
        _vm.detailOpen = $$v
      },
      expression: "detailOpen"
    }
  }, [_c('p', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "slot": "header"
    },
    slot: "header"
  }, [_c('span', [_vm._v("提现详情")])]), _vm._v(" "), _c('section', {
    staticStyle: {
      "text-align": "center"
    }
  }, [_c('Row', {
    staticStyle: {
      "padding-top": "16px",
      "font-size": "14px"
    },
    attrs: {
      "gutter": 24,
      "type": "flex",
      "justify": "space-around"
    }
  }, [_c('Col', {
    class: _vm.$style.textAlignLeft,
    attrs: {
      "span": "24"
    }
  }, [_c('p', {
    staticStyle: {
      "color": "#bfbfbf"
    }
  }, [_vm._v(_vm._s(_vm.detail.status === 1 ? '提现成功' : (_vm.detail.status === 0 ? '待审核' : '被驳回')))])])], 1), _vm._v(" "), _c('Row', {
    staticStyle: {
      "padding-top": "16px"
    },
    attrs: {
      "gutter": 24
    }
  }, [_c('Col', {
    class: _vm.$style.textAlignLeft,
    attrs: {
      "span": "24"
    }
  }, [_c('h1', [_vm._v(_vm._s(_vm.showAmount(_vm.detail.value)))])])], 1)], 1), _vm._v(" "), _c('section', {
    staticStyle: {
      "margin-top": "16px"
    }
  }, [_c('Row', {
    class: _vm.$style.recordDetail,
    attrs: {
      "gutter": 24
    }
  }, [_c('Col', {
    class: _vm.$style.detailLabel,
    attrs: {
      "span": "8"
    }
  }, [_vm._v("交易账户")]), _vm._v(" "), _c('Col', {
    attrs: {
      "span": "16"
    }
  }, [_vm._v("\n            " + _vm._s(_vm.detail.account) + "\n          ")])], 1), _vm._v(" "), _c('Row', {
    class: _vm.$style.recordDetail,
    attrs: {
      "gutter": 24
    }
  }, [_c('Col', {
    class: _vm.$style.detailLabel,
    attrs: {
      "span": "8"
    }
  }, [_vm._v("交易说明")]), _vm._v(" "), _c('Col', {
    staticStyle: {
      "word-break": "break-all"
    },
    attrs: {
      "span": "16"
    }
  }, [_vm._v("提现")])], 1), _vm._v(" "), _c('Row', {
    class: _vm.$style.recordDetail,
    attrs: {
      "gutter": 24
    }
  }, [_c('Col', {
    class: _vm.$style.detailLabel,
    attrs: {
      "span": "8"
    }
  }, [_vm._v("交易时间")]), _vm._v(" "), _c('Col', {
    attrs: {
      "span": "16"
    }
  }, [_vm._v(_vm._s(_vm.localDateTime(_vm.detail.created_at)))])], 1)], 1), _vm._v(" "), _c('div', {
    attrs: {
      "slot": "footer"
    },
    slot: "footer"
  })])], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "spinner-parent"
    }
  }, [_c('div', {
    staticClass: "spinner-double-bounce-bounce2"
  }), _vm._v(" "), _c('div', {
    staticClass: "spinner-double-bounce-bounce1"
  })])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-f36bda3c", module.exports)
  }
}

/***/ }),

/***/ 589:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
var cssModules = {}
cssModules["$style"] = __webpack_require__(1221)
__webpack_require__(1265)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(1059),
  /* template */
  __webpack_require__(1397),
  /* scopeId */
  null,
  /* cssModules */
  cssModules
)
Component.options.__file = "/www/wwwroot/piaobo/packages/thinksns-plus-authorization-pb-h5/src/views/balance/Balance.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] Balance.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-070268b8", Component.options)
  } else {
    if (module.hot.data.cssModules && JSON.stringify(module.hot.data.cssModules) !== JSON.stringify(cssModules)) {
      delete Component.options._Ctor
    }
    hotAPI.reload("data-v-070268b8", Component.options)
  }
  module.hot.dispose(function (data) {
    data.cssModules = cssModules
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 590:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
var cssModules = {}
cssModules["$style"] = __webpack_require__(1230)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(1060),
  /* template */
  __webpack_require__(1419),
  /* scopeId */
  null,
  /* cssModules */
  cssModules
)
Component.options.__file = "/www/wwwroot/piaobo/packages/thinksns-plus-authorization-pb-h5/src/views/balance/BalanceRecords.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] BalanceRecords.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2fabad9a", Component.options)
  } else {
    if (module.hot.data.cssModules && JSON.stringify(module.hot.data.cssModules) !== JSON.stringify(cssModules)) {
      delete Component.options._Ctor
    }
    hotAPI.reload("data-v-2fabad9a", Component.options)
  }
  module.hot.dispose(function (data) {
    data.cssModules = cssModules
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 591:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
var cssModules = {}
cssModules["$style"] = __webpack_require__(1250)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(1061),
  /* template */
  __webpack_require__(1483),
  /* scopeId */
  null,
  /* cssModules */
  cssModules
)
Component.options.__file = "/www/wwwroot/piaobo/packages/thinksns-plus-authorization-pb-h5/src/views/balance/BalanceWithdraw.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] BalanceWithdraw.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f36bda3c", Component.options)
  } else {
    if (module.hot.data.cssModules && JSON.stringify(module.hot.data.cssModules) !== JSON.stringify(cssModules)) {
      delete Component.options._Ctor
    }
    hotAPI.reload("data-v-f36bda3c", Component.options)
  }
  module.hot.dispose(function (data) {
    data.cssModules = cssModules
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 629:
/***/ (function(module, exports, __webpack_require__) {

var callbacks = __webpack_require__(646);
var hasOwn = {}.hasOwnProperty;

var utils = module.exports = {

  /**
   * 对象转换成 query string
   * @param object data  待转对象
   * @param string channel  渠道
   * @param boolean urlencode  是否需要 urlencode
   *
   * @return string query string
   */
  stringifyData: function (data, channel, urlencode) {
    if (typeof urlencode == 'undefined') {
      urlencode = false;
    }
    var output = [];
    for (var i in data) {
      if (!hasOwn.call(data, i) || typeof data[i] === 'function') {
        continue;
      }
      if (channel == 'bfb_wap' && i == 'url') {
        continue;
      }
      if (channel == 'yeepay_wap' && i == 'mode') {
        continue;
      }
      if (i == 'channel_url') {
        continue;
      }
      output.push(i + '=' +
          (urlencode ? encodeURIComponent(data[i]) : data[i]));
    }
    return output.join('&');
  },

  /**
   * 网络请求
   * @param string url
   * @param string method  请求方式, POST, GET ...
   * @param object requestData  请求数据
   * @param function successCallback  成功回调 (data, statusCode, xhr)
   * @param function errorCallback  错误回调 (xhr, statusCode, error)
   */
  request: function (url, method, requestData,
    successCallback, errorCallback, headers) {
    if (typeof XMLHttpRequest === 'undefined') {
      console.log('Function XMLHttpRequest is undefined.');
      return;
    }
    var xhr = new XMLHttpRequest();
    if (typeof xhr.timeout !== 'undefined') {
      xhr.timeout = 6000;
    }
    method = method.toUpperCase();

    if (method === 'GET' && typeof requestData === 'object' && requestData) {
      url += '?' + utils.stringifyData(requestData, '', true);
    }
    xhr.open(method, url, true);
    if (typeof headers !== 'undefined') {
      for (var k in headers) {
        if (hasOwn.call(headers, k)) {
          xhr.setRequestHeader(k, headers[k]);
        }
      }
    }
    if (method === 'POST') {
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      xhr.send(JSON.stringify(requestData));
    } else {
      xhr.send();
    }
    if (typeof successCallback == 'undefined') {
      successCallback = function () {};
    }
    if (typeof errorCallback == 'undefined') {
      errorCallback = function () {};
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        successCallback(xhr.responseText, xhr.status, xhr);
      }
    };
    xhr.onerror = function (e) {
      errorCallback(xhr, 0, e);
    };
  },

  /**
   * 表单提交
   * @param string url
   * @param string method  请求方式, POST, GET ...
   * @param object params  请求数据
   */
  formSubmit: function (url, method, params) {
    if (typeof window === 'undefined') {
      console.log('Not a browser, form submit url: ' + url);
      return;
    }
    var form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', url);

    for (var key in params) {
      if (hasOwn.call(params, key)) {
        var hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', key);
        hiddenField.setAttribute('value', params[key]);
        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();
  },

  randomString: function (length) {
    if (typeof length == 'undefined') {
      length = 32;
    }
    var chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = chars.length;
    var str = '';
    for (var i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * maxPos));
    }

    return str;
  },

  redirectTo: function (url, channel) {
    if (callbacks.shouldReturnUrlByCallback(channel)) {
      callbacks.triggerUrlReturnCallback(null, url);
      return;
    }
    if (typeof window === 'undefined') {
      console.log('Not a browser, redirect url: ' + url);
      return;
    }
    window.location.href = url;
  },

  inWeixin: function () {
    if (typeof navigator === 'undefined') {
      return false;
    }
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') !== -1;
  },

  inAlipay: function () {
    if (typeof navigator === 'undefined') {
      return false;
    }
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('alipayclient') !== -1;
  },

  documentReady: function (fn) {
    if (typeof document === 'undefined') {
      fn();
      return;
    }
    if (document.readyState != 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  },

  loadUrlJs: function (sid, jsurl, callback) {
    var nodeHead = document.getElementsByTagName('head')[0];
    var nodeScript = null;
    if (document.getElementById(sid) == null) {
      nodeScript = document.createElement('script');
      nodeScript.setAttribute('type', 'text/javascript');
      nodeScript.setAttribute('src', jsurl);
      nodeScript.setAttribute('id', sid);
      nodeScript.async = true;
      if (callback != null) {
        nodeScript.onload = nodeScript.onreadystatechange = function () {
          if (nodeScript.ready) {
            return false;
          }

          if (!nodeScript.readyState || nodeScript.readyState == 'loaded'
              || nodeScript.readyState == 'complete') {
            nodeScript.ready = true;
            callback();
          }
        };
      }
      nodeHead.appendChild(nodeScript);
    } else {
      if (callback != null) {
        callback();
      }
    }
  }
};


/***/ }),

/***/ 646:
/***/ (function(module, exports, __webpack_require__) {

var payment_elements = __webpack_require__(1010);

module.exports = {

  userCallback: undefined,

  urlReturnCallback: undefined,

  urlReturnChannels: [
    'alipay_pc_direct', // 默认只开启 alipay_pc_direct 使用 callback 返回 URL
  ],

  innerCallback: function(result, err) {
    if (typeof this.userCallback === 'function') {
      if (typeof err === 'undefined') {
        err = this.error();
      }
      this.userCallback(result, err);
      this.userCallback = undefined;
      payment_elements.clear();
    }
  },

  error: function(msg, extra) {
    msg = (typeof msg === 'undefined') ? '' : msg;
    extra = (typeof extra === 'undefined') ? '' : extra;
    return {
      msg: msg,
      extra: extra
    };
  },

  triggerUrlReturnCallback: function (err, url) {
    if (typeof this.urlReturnCallback === 'function') {
      this.urlReturnCallback(err, url);
    }
  },

  shouldReturnUrlByCallback: function (channel) {
    if (typeof this.urlReturnCallback !== 'function') {
      return false;
    }
    return this.urlReturnChannels.indexOf(channel) !== -1;
  }
};


/***/ }),

/***/ 689:
/***/ (function(module, exports) {

module.exports = {
};


/***/ }),

/***/ 982:
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(629);
var callbacks = __webpack_require__(646);
var hasOwn = {}.hasOwnProperty;

module.exports = {

  handleCharge: function(charge) {
    var credential = charge.credential[charge.channel];
    var targetURL;
    if (typeof credential === 'string') {
      targetURL = credential;
    } else if (hasOwn.call(credential, 'url')) {
      targetURL = credential.url;
    } else {
      callbacks.innerCallback('fail', callbacks.error('invalid_credential',
        'credential format is incorrect'));
      return;
    }
    utils.redirectTo(targetURL, charge.channel);
  }
};


/***/ }),

/***/ 983:
/***/ (function(module, exports, __webpack_require__) {

var hasOwn = {}.hasOwnProperty;
var mods = {};
module.exports = mods;

mods.channels = {
  alipay_pc_direct: __webpack_require__(1330),
  alipay_qr: __webpack_require__(1331),
  alipay_wap: __webpack_require__(1332),
  bfb_wap: __webpack_require__(1333),
  cmb_wallet: __webpack_require__(1334),
  cp_b2b: __webpack_require__(1335),
  fqlpay_qr: __webpack_require__(1337),
  fqlpay_wap: __webpack_require__(1338),
  isv_wap: __webpack_require__(1339),
  jdpay_wap: __webpack_require__(1340),
  qpay_pub: __webpack_require__(1341),
  upacp_pc: __webpack_require__(1342),
  upacp_wap: __webpack_require__(1343),
  wx_lite: __webpack_require__(1344),
  wx_pub: __webpack_require__(1345),
  wx_wap: __webpack_require__(1346),
  yeepay_wap: __webpack_require__(1347)
};

mods.extras = {
  ap: __webpack_require__(1336)
};

mods.getChannelModule = function(channel) {
  if (hasOwn.call(mods.channels, channel)) {
    return mods.channels[channel];
  }
  return undefined;
};

mods.getExtraModule = function(name) {
  if (hasOwn.call(mods.extras, name)) {
    return mods.extras[name];
  }
  return undefined;
};


/***/ })

});
//# sourceMappingURL=balance.bundle.js.map