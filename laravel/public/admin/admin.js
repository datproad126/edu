/**
 * Created by Admin on 7/23/2016.
 */
(function () {
    'use strict';
    // $('.calendar').calendarsPicker({ dateFormat:'dd-mm-yyyy' });
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': token
        }
    });

    var interval;
    // Thuong xuyen kiem tra don hang
    /*    function checkOrder() {
            $.ajax({
                type: "GET",
                url: site_url + 'orders/0',
                data: {'task': 'count'},
                success: function (data) {
                    if(data.count) {
                        $('.order-count').html(data.count);
                        if( $('#orderModal').css('display') != 'block') {
                            $('#orderModal').modal('show');
                            $('#orderModal .sound').html('<br/><audio controls  loop src="'+site_front+'uploads/others/sound.mp3" type="audio/mpeg"></audio>');
                            var audio = $("#orderModal audio").get(0);
    
                            fakeClick(function() {
                                audio.play();
                            });
                        }
                        window.clearInterval(interval);
                    }
                },
                error: function (data) {
                }
            });
            return false;
        }*/

    // Check comments
    /*    function checkComments(){
            $.ajax({
                type: "GET",
                url: site_url + 'comments',
                data: {'count': '1'},
                success: function (res) {
                    if(res.code && res.data > 0) {
                        $('.comments-count').html('<small class="label pull-right bg-green" style="font-size:14px">' +res.data+ '</small>');
                    }
                },
                error: function (data) {
                }
            });
        }*/
    //setInterval(checkComments, 10000);

    // Check contact
    /*    function checkContact(){
            $.ajax({
                type: "GET",
                url: site_url + 'contact',
                data: {'count': '1'},
                success: function (res) {
                    if(res.code && res.data > 0) {
                        $('.contact-count').html('<small class="label pull-right bg-green" style="font-size:14px">' +res.data+ '</small>');
                    }
                },
                error: function (data) {
                }
            });
        }*/
    //setInterval(checkContact, 8000);

    /*$('.money').keyup( function(){
        if(this.value == ''){
            return;
        }

        this.value = formatMoney(this.value);
    });
    $('.money').trigger('keyup');

    function formatMoney(value){
        var n = parseInt( String(value).replace(/\D/g,''),10);
        var string = n.toLocaleString().replace(/,/g, '.');
        return string;
    }

    function fakeClick(fn) {
        var $a = $('<a href="#" id="fakeClick"></a>');
        $a.bind("click", function(e) {
            e.preventDefault();
            fn();
        });

        $("body").append($a);

        var evt,
            el = $("#fakeClick").get(0);

        if (document.createEvent) {
            evt = document.createEvent("MouseEvents");
            if (evt.initMouseEvent) {
                evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                el.dispatchEvent(evt);
            }
        }

        $(el).remove();
    }*/

    /*function getLocation(type, value, defaultvalue, updateTo){
        $.ajax({
            method: "GET",
            url: site_front + 'location',
            data: {type: type, value: value, default: defaultvalue},
            success: function (res) {
                if(res.code > 0) {
                    $(updateTo).html(res.data);
                }else{
                    alert( res.msg );
                }
            },
            error: function (data) {

            }
        });
    }*/

    $(document).ready(function () {
        getMedia();
        initAjax();
    });
}());

function getMedia(indexPage) {
    if (!indexPage) indexPage = 1;
    $.ajax({
        method: "POST",
        type: "POST",
        url: site_front + 'upload',
        data: {'action': 'get', 'page': indexPage},
        success: function (res) {
            if (res.code > 0) {
                res.data.data.forEach(function (v, i) {
                    var img_thumbnail = v.link;
                    if (v.type == 'video') {
                        img_thumbnail = 'assets/img/movie-clip-icon.png';
                    } else if (v.type == 'document') {
                        img_thumbnail = 'assets/img/document-img.png';
                    }
                    $('#mediaModal .w-multi-img').append('<div class="thumbnail"><img title="' + v.title + '" alt="' + v.title + '" data-type="' + v.type + '" data-link="/' + v.link + '" data-intro="' + v.title + '" data-id="' + v.id + '" src="/' + img_thumbnail + '" /></div>');
                });
            } else {
                alert(res.msg);
            }
        },
        error: function (data) {

        }
    });
}

var oldHtml = '';

function addLoading(object) {
    oldHtml = object.html();
    object.attr('disabled', 'disabled').html('<img src="' + site_front + 'assets/img/loading.gif"/>')
}

function removeLoading(object) {
    object.removeAttr('disabled').html(oldHtml);
}

function ajax(obj, url, formData, callback, method) {
    var button = $(obj);
    var alert = button.closest('alert');
    method = method || "POST";

    addLoading(button);
    alert.addClass('hidden').removeClass('alert-danger').removeClass('alert-success');

    $.ajax({
        type: method,
        url: url.indexOf(site_url) === -1 ? site_url + url : url,
        data: formData,
        success: function (data) {
            removeLoading(button);

            if (callback) {
                data.object = button;
                callback(data);
            }
        },
        error: function (data) {
            removeLoading(button);
        }
    });

    return false;
}

function initAjax() {
    $('.ajax-reload').click(function (e) {
        var $link = $(this).data('link');
        var $href = window.location.href;
        $href = $href.indexOf('?') === -1 ? $href + '?' : $href + '&';

        var _cb = function (data) {
            if (data.html) {
                $('.data-table').html(data.html);
                initAjax();
            }
        };

        ajax(this, $href + $link, {}, _cb, 'GET');

        e.preventDefault();
        return false;
    });

    $('.ajax-delete').click(function (e) {
        if (!confirm('Bạn có chắc chắn muốn xóa dữ liệu?')) {
            return false;
        }

        var $id = $(this).data('id');

        var _cb = function (data) {
            if (data.html) {
                $('.data-table').html(data.html);
                initAjax();
            }
        };

        ajax(this, $(this).data('name') + '/' + $(this).data('id'), {}, _cb, 'DELETE');

        e.preventDefault();
        return false;
    });
}
