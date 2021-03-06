/**
 * Created by aidenZou on 15/9/10.
 */

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : "; expires=" + exdate.toGMTString())
}

function checkCookie() {
    username = getCookie('username');
    if (username != null && username != "") {
        alert('Welcome again ' + username + '!')
    }
    else {
        username = prompt('Please enter your name:', "");
        if (username != null && username != "") {
            setCookie('username', username, 365)
        }
    }
}

$(function () {
    var ycApp = new Framework7({
        modalTitle: '有菜提示',
        modalButtonOk: '确定',
        modalButtonCancel: '取消'
    });

//var d_url = 'https://cun.im/yc';
    var api_url = '/api/coupon',
        _xsrf = getCookie('_xsrf');

    var $action_1 = $('.action_1'),
        $action_2 = $('.action_2'),
        $mobile = $('#mobile');

    var mobile = store.get('mobile');
    mobile && !isNaN(mobile) && $mobile.val(mobile) && ($('.hint .mobile').text(mobile));

    $('#draw').on('click', function () {
        mobile = $mobile.val();
        var err_text = '';
        if (!mobile) {
            err_text = '请输入手机号领取红包';
        }

        var reg = /^1\d{10}$/;
        if (err_text == "" && !/^1\d{10}$/.test(mobile)) {
            err_text = '请输入正确手机号领取红包';
        }
        if (err_text) {
            ycApp.alert(err_text, '温馨提示!', function () {
                $mobile.focus();
            });
            return;
        }

        //ajax
        var reqest = {
            mobile: mobile,
            code: code,
            _xsrf: _xsrf
        };
        $.post(api_url, reqest, function (data) {

            if (!data || data.errcode) {
                if (4002 == data.errcode) {   // 未注册
                    show_send_smscode();
                    return;
                }
                ycApp.alert(data.errmsg, '温馨提示!');
                return;
            }

            var _amount = parseInt(data.coupon.discount / 100);

            $('#number').text(_amount);
            $('.hint .mobile').text(mobile);
            $action_1.hide();
            $action_2.show();
            store.set('mobile', mobile);
        });
    });

// 发送验证码倒计时
    var remaintime = 60;
    var has_disabled_send_smscode = false;
    var djs;
    var djsFun = function () {
        if (has_disabled_send_smscode) {
            return;
        }

        $send_btn = $('#send_smscode');
        $send_btn.text('(' + remaintime + 's)重新获取');

        (djs = setInterval(function () {
            has_disabled_send_smscode = true;
            remaintime--;
            if (remaintime > 0) {
                $send_btn.text('(' + remaintime + 's)重新获取');
            } else {
                clearInterval(djs);
                $send_btn.text('获取验证码');
                remaintime = 60;
                has_disabled_send_smscode = false;
            }
        }, 1000));
    };

    var modal;

    function show_send_smscode() {

        var smscodeModal = ycApp.modal({
            title: '手机号码验证',
            text: '为保证抢红包成功，请验证您的手机号码',
            afterText: '<div id="reg">' +
            '<input type="tel" name="reg_smscode" id="reg_smscode" maxlength="6" placeholder="请输入短信验证码"/>' +
            '<button id="send_smscode">获取验证码</button><div id="reg_errmsg"></div></div>',
            buttons: [
                {
                    text: '提交并领取红包',
                    bold: true,
                    close: false,
                    onClick: function () {
                        //return true;
                        submit();
                    }
                }
            ]
        });
        $('#send_smscode').on('click', function (e) {
            if (has_disabled_send_smscode) {
                return;
            }
            //var data = {errcode: 3000, errmsg: "请稍等50秒重新发送"}
            $.post('/api/util/smscode', {mobile: mobile, _xsrf: _xsrf}, function (data) {
                if (data && data.errcode) {
                    $('#reg_errmsg').text(data.errmsg);
                    return;
                }
                djsFun();
            });
        });

        var submit = function () {
            var smscode = $('#reg_smscode').val();
            if (!smscode) {
                $('#reg_errmsg').text('请输入短信验证码');
                return;
            }

            //ajax
            var reqest = {
                mobile: mobile,
                code: code,
                smscode: smscode,
                _xsrf: _xsrf
            };
            $.post(api_url, reqest, function (data) {
                if (!data || data.errcode) {
                    $('#reg_errmsg').text(data.errmsg);
                    return;
                }
                ycApp.closeModal(smscodeModal);

                var _amount = parseInt(data.coupon.discount / 100);

                $('#number').text(_amount);
                $('.hint .mobile').text(mobile);
                $action_1.hide();
                $action_2.show();
                store.set('mobile', mobile);
            });
        };
    }

// 修改号码
    $('.up_mobile').on('click', function () {
        var up_mobile_modal = ycApp.prompt('您更换之前手机号:' + mobile, '手机号码更改',
            function (value) {

                var err_text = '';
                if (!value) {
                    err_text = '请输入手机号';
                }

                var reg = /^1\d{10}$/;
                if (err_text == "" && !/^1\d{10}$/.test(value)) {
                    err_text = '请输入正确手机号';
                }
                if (err_text) {
                    ycApp.alert(err_text, '温馨提示!', function () {
                    });
                    return;
                }

                $.post('/api/update_mobile', {mobile: value, _xsrf: _xsrf}, function (data) {
                    if (data && data.errcode) {
                        $('#reg_errmsg').text(data.errmsg);
                        return;
                    }
                    ycApp.alert('号码更换成功，下次领取红包时，将自动放入新手机账户');
                    store.set('mobile', value);
                });
            }
        );
        $(up_mobile_modal).find('.modal-text-input').attr('type', 'tel').attr('maxlength', 11).attr('placeholder', '请输入您的新手机号');
    });
});
