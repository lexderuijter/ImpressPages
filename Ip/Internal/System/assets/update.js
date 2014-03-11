
(function($){
    "use strict";

    var ipSystem = new function() {

        this.init = function() {
            var postData = {};
            postData.aa = 'System.getIpNotifications';
            postData.securityToken = ip.securityToken;
            postData.jsonrpc = '2.0';

            $.ajax({
                url: ip.baseUrl,
                data: postData,
                dataType: 'json',
                type: 'POST',
                success: notificationsResponse,
                error: function () {
                    alert('Unknown error. Please see logs.');
                }
            });


        };

        var notificationsResponse = function (response) {
            var $container = $('.ipsSystemStatus');
            var messages = '';
            if (response != '') {
                messages = response;
                if (messages.length > 0) {
                    $container.removeClass('hidden');
                    var i = 0;
                    for (i = 0; i < messages.length; i++) {
                        $container.html($container.html() + '<div class="' + messages[i]['type'] + '">' + messages[i]['message'] + '</div>');

                        if (messages[i]['code'] == 'update') {
                            var $downloadLink = $('<a target="_blank" class="btn btn-default" href="' + messages[i]['downloadUrl'] + '">Download</a>');
                            var $updateLink = $('<a class="btn btn-primary actStartUpdate" href="' + messages[i]['downloadUrl'] + '" data-md5="' + messages[i]['md5'] + '">Start update</a>');
                            $container.append($downloadLink);
                            $container.append(' ');
                            $container.append($updateLink);
                            $container.append('<br/><br/>')
                            $updateLink.on('click', startUpdate);
                        }
                    }
                }
            }
        }

        var startUpdate = function (e) {
            var $link = $(this);
            e.preventDefault();

            var postData = {};
            postData.aa = 'Update.startUpdate';
            postData.securityToken = ip.securityToken;
            postData.downloadUrl = $link.attr('href');
            postData.md5 = $link.data('md5');

            $.ajax({
                url: ip.baseUrl,
                data: postData,
                dataType: 'json',
                type: 'POST',
                success: function (response) {
                    if (!response) {
                        return;
                    }
                    if (response.status && response.status == 'success') {
                        if (response.redirectUrl) {
                            parent.document.location = response.redirectUrl;
                        }
                    } else {
                        if (response.error) {
                            alert(response.error);
                        }
                    }
                },
                error: function (response) {
                    alert('Update has failed: ' + response.responseText);
                }
            });
        }

    };

    $(function() {
        ipSystem.init();
    });

})(ip.jQuery);