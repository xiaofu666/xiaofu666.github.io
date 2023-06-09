var canvas = document.getElementById('canvas');
if (canvas && canvas.getContext) {
    if ($.browser.msie && $.browser.version == '9.0') {
        $('.pic').text('开启此功能，请选用谷歌、火狐、Opera、Safari打开')
    }
    var canvasObj = new createQRImage('canvas');
    setDefault();
    function emptyFn() {}
    function getStr(type) {
        var o = new window["Mode_" + type];
        return {
            str: o.getString(),
            error: o.getError()
        }
    }
    var timerCache = null;
    function execCanvas(callback) {
        clearTimeout(timerCache);
        timerCache = setTimeout(callback || emptyFn, 500)
    }
    function checkMode(type, callback) {
        callback = callback || emptyFn;
        var o = getStr(type);
        var str = o.str;
        var errors = [];
        errors = o.error;
        if (type == 'text' && str == '支持文本、网址和电子邮箱') {
            errors.push('文本不能为空');
            str = ''
        } else if (type == 'url' && str == 'http://') {
            errors.push('文本不能为空');
            str = ''
        }
        $('#apiText').attr('title', str);
        execCanvas(function() {
            canvasObj.changeText(str || 'https://xiaofu666.github.io', callback)
        })
    }
    function getround() {
        if ($('#diy_dot')[0]) {
            var level = parseInt($('#diy_dot').css('left')) + 5;
            var value = (Math.abs(135 - level) / 135) * 0.5;
            var isWater = level <= 135 ? true : false;
            canvasObj.setRound(isWater, value)
        }
    }
    $("#text_text").bind({
        "change": function() {
            if ($(this).val() != '支持文本、网址和电子邮箱') {
                countSize($(this));
                checkMode('text', getround)
            }
        },
        "keyup": function() {
            $(this).trigger("change")
        },
        "paste": function() {
            var $this = $(this);
            setTimeout(function() {
                $this.trigger("change")
            }, 100)
        }
    });
    $('#card_n,#card_tel,#card_phone,#car_note,#card_org,#card_til,#card_mail,#card_adr,#card_url').keyup(function() {
        checkMode('card', getround)
    });
    $('#hidetel').click(function() {
        checkMode('card', getround)
    });
    $('#sms_tel').keyup(function() {
        checkMode('sms', getround)
    });
    $('#sms_sms').keyup(function() {
        var len = $(this).val().length;
        $('#sms_len').text(len);
        checkMode('sms', getround)
    });
    $('#wifi_ssid,#wifi_p').keyup(function() {
        checkMode('wifi', getround)
    });
    $('#wifi_t').change(function() {
        checkMode('wifi', getround)
    });
    $('#url_url').keyup(function() {
        if ($('#urloptions')[0].checked && (($('#wpublic')[0] && $('#wpublic')[0].checked) || ($('#wpersonal')[0] && $('#wpersonal')[0].checked))) {
            checkMode('weixin', getround)
        } else {
            checkMode('url', getround)
        }
    });
    $('#telephone_tel').keyup(function() {
        checkMode('telephone', getround)
    });
    $('#mail_mail').keyup(function() {
        checkMode('mail', getround)
    });
    $(".content .ctext").bind({
        focus: function() {
            if ($(this).val() == "输入文本") {
                $(this).val("")
            }
        },
        blur: function() {
            if ($(this).val() == "") {
                $(this).val("输入文本")
            }
        }
    });
    $('#fntab li').click(function() {
        var rel = $(this).attr('rel');
        checkMode(rel, getround)
    });
    $('#level').change(function() {
        canvasObj.changeLevel($(this).val())
    });
    $('#margin').change(function() {
        canvasObj.changeMargin($(this).val())
    });
    $('#rotate').change(function() {
        canvasObj.changeRotate($(this).val())
    });
    $('#gradientWay').change(function() {
        canvasObj.changeGradientWay($(this).val(), $('#gccolor').val())
    });
    $("#foreground").change(function(event) {
        canvasObj.changeForeground(event)
    });
    $("#background").change(function(event) {
        canvasObj.changeBackground(event)
    });
    $("#logotypes").change(function(event) {
        var type = $('input[name="logotype"]:checked').val();
        canvasObj.changeLogotype(type)
    });
    $("#logoimg").change(function(event) {
        var type = $('input[name="logotype"]:checked').val();
        $('#level').val('H').attr('disabled', 'disabled');
        canvasObj.changeLogoimg(event, type)
    });
    $('#gradientWay').change(function() {
        var val = $('#gradientWay').val();
        var color = val ? $('#gccolor').val() : null;
        canvasObj.changeGcColor(val, color)
    });
    $('#resetBgColor').click(function() {
        canvasObj.resetBgColor()
    });
    $('#resetFgColor').click(function() {
        canvasObj.resetFgColor()
    });
    $('#resetPtColor').click(function() {
        canvasObj.resetPtColor();
        $('#icp_ptcolor').css('background-color', '#000');
        $(this).hide()
    });
    $('#resetInPtColor').click(function() {
        canvasObj.resetInPtColor();
        $('#icp_inptcolor').css('background-color', '#000');
        $(this).hide()
    });
    $('#resetGcColor').click(function() {
        canvasObj.resetGcColor();
        $('#icp_gccolor').css('background-color', '#000');
        $(this).hide()
    });
    $('#resetMargin').click(function() {
        canvasObj.resetMargin()
    });
    $('#resetWidth').click(function() {
        canvasObj.resetWidth()
    });
    $('#resetBackground').click(function() {
        $('#background').val('');
        canvasObj.resetBackground()
    });
    $('#resetForeground').click(function() {
        $('#foreground').val('');
        canvasObj.resetForeground()
    });
    $('#resetLogoimg').click(function() {
        $('#logoimg').val('');
        $('#picelem').hide();
        $('#format').show();
        $('#turn').hide();
        canvasObj.resetLogoimg(function() {
            $('#level')[0].options[0].selected = true;
            $('#level').removeAttr('disabled')
        })
    });
    $('#resetRound').click(function() {
        canvasObj.resetRound();
        $('#diy_dot').attr('style', '')
    });
    $('#resetRound1').click(function() {
        $('#diy_dot').css('left', '-5px');
        canvasObj.changeRound(true, 0.5)
    });
    $('#resetRound2').click(function() {
        $('#diy_dot').css('left', '265px');
        canvasObj.changeRound(false, 0.5)
    });
    $('#resetAll').click(function() {
        $('#logoimg').val('');
        canvasObj.resetAll();
        resetAll()
    });
    var isScrolled = false;
    var startX = 0,
        startLevel = 0;
    $("#diy_dot").bind({
        "mousedown": function(e) {
            isScrolled = true;
            startX = e.clientX;
            startLevel = e.target.offsetLeft + 5
        },
        "mouseup": function(e) {
            isScrolled = false;
            startLevel = e.target.offsetLeft + 5
        }
    });
    $(document).bind({
        "mousemove": function(e) {
            if (isScrolled) {
                var level = startLevel + e.clientX - startX;
                level = level > 270 ? 270 : (level < 0 ? 0 : level);
                $("#diy_dot").attr("style", "left:" + (level - 5) + "px");
                var value = (Math.abs(135 - level) / 135) * 0.5;
                var isWater = level <= 135 ? true : false;
                canvasObj.changeRound(isWater, value)
            }
        },
        "mouseup": function() {
            isScrolled = false
        }
    });
    var dataURLtoBlob = function(dataURL) {
        var arr = dataURL.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], {
            type: mime
        })
    };
    $('#savepng').click(function() {
        var $this = $(this);
        canvasObj.getBase64(function(data) {
            var url = 'data:image/png;base64,' + data;
            $this.attr('href', url).data('url', url).attr('download', '小富二维码');
            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(dataURLtoBlob(url), '小富二维码.png')
            } else if (navigator.userAgent.match(/MSIE 9/)) {
                $('#pngdata').val(data);
                $('#form').submit()
            }
        })
    });
    $("#cbutton").click(function() {
        var text = $.trim($("#ctext").val());
        if (text == "输入文本") {
            text = ""
        }
        if (text == "") {
            $("#resetContent").css('display', 'none');
            $('#level')[0].options[0].selected = true;
            $('#level').removeAttr('disabled');
            canvasObj.changeLevel("L")
        } else {
            $("#resetContent").css('display', 'block');
            $('#level').val('H').attr('disabled', 'disabled');
            canvasObj.changeLevel("H")
        }
        canvasObj.changeContent(text)
    });
    $("#resetContent").click(function() {
        $(this).css('display', 'none');
        canvasObj.resetContent(function() {
            $('#level')[0].options[0].selected = true;
            $('#level').removeAttr('disabled')
        })
    });
    $('#resetFtColor').click(function() {
        canvasObj.resetFtColor();
        $('#icp_ftcolor').css('background-color', '#000');
        $(this).hide()
    });
    $('#fonteffect').change(function() {
        canvasObj.changeFontEffect($(this).val())
    });
    $('#fontsize').change(function() {
        canvasObj.changeFontSize($(this).val())
    });
    $('#size').change(function() {
        canvasObj.changeWidth($(this).val());
        getround();
        canvasObj.drawImage()
    });
    $("#pin-trigger").hover(function() {
        var top = $(this).offset().top;
        var left = $(this).offset().left;
        $(this).addClass("pin-trigger-on");
        $("#pin-panel").show().css({
            'left': left - 254,
            'top': top + 34
        })
    });
    $("#pin-panel").mouseleave(function() {
        $("#pin-trigger").removeClass("pin-trigger-on");
        $(this).hide()
    });
    $("#pin-panel li").click(function() {
        $(this).addClass("active").siblings().removeClass("active");
        canvasObj.changePtImage($(this).index())
    })
}

