(function (STUDIP) {
    /**
     * Add methods to insert or remove css styles
     */
    var sheet  = null;

    function addRule(selector, css) {
        var index, style, propText;
        if (sheet === null) {
            style = document.createElement('style');
            sheet = document.head.appendChild(style).sheet;
        }
        index = sheet.cssRules.length;
        propText = Object.keys(css).map(function (p) {
            return p + ':' + css[p];
        }).join(';');
        sheet.insertRule(selector + '{' + propText + '}', index);
        return index;
    }

    function removeRule(index) {
        if (sheet !== null) {
            sheet.deleteRule(index);
        }
    }

    STUDIP.CSS = STUDIP.CSS || {};
    STUDIP.CSS.addRule = addRule;
    STUDIP.CSS.removeRule = removeRule;

}(STUDIP));


(function ($, STUDIP) {

    var SELECTOR = '#layout_page a[href*="about.php?"], .index_container a[href*="about.php?"]',
        DELAY = 200,
        FOLD = 8,
        userDetailsCache = {},
        userDetails = $('<div id="user-details-popup"/>').hide(),
        ruleIndex = new Array(),
        timeout;

    function locateParam(string, param) {
        var parts = string.split('?'),
            result = false,
            temp;
        if (parts.length === 0) {
            return false;
        }

        string = parts.slice(1).join('?');
        parts  = string.split('&');

        for (var i = 0, l = parts.length; i < l; i += 1) {
            temp = parts[i].split('=');
            if (param === temp.shift()) {
                result = temp.join('=');
                break;
            }
        }
        return result;
    }

    function getUserDetails(username, callback) {
        if (userDetailsCache[username]) {
            callback(userDetailsCache[username]);
        } else {
            var userdetails_uri = $('meta[name="user-details"]').attr('content');
            $.get(userdetails_uri + '/' + username, function (response) {
                userDetailsCache[username] = response;
                callback(response);
            });
        }
    }

    $(SELECTOR).live('mouseenter', function (event) {
        window.clearTimeout(timeout);

        var href = $(this).attr('href'),
            username = locateParam(href, 'username'),
            cmd = locateParam(href, 'cmd'),
            $element = $(this);
        if (!username || cmd) {
            return;
        }
        getUserDetails(username, function (details) {
            var position = $element.offset(),
                width, height, offset;

            userDetails.html(details);

            width  = userDetails.outerWidth(true);
            height = userDetails.outerHeight(true);

            position.top  -= height;
            position.left -= (width - $element.outerWidth(true)) / 2;

            while (ruleIndex.length > 0) {
                STUDIP.CSS.removeRule(ruleIndex.pop());
            }

            if (position.left < FOLD) {
                offset =  FOLD - position.left;
                position.left = FOLD;
                ruleIndex.push(STUDIP.CSS.addRule('#user-details-popup:before', {'margin-left': '-' + (12 + offset) + 'px'}));
                ruleIndex.push(STUDIP.CSS.addRule('#user-details-popup:after', {'margin-left': '-' + (10 + offset) + 'px'}));
            } else if (position.left > $(window).width() - (width + FOLD)) {
                offset = position.left - ($(window).width() - (width + FOLD));
                position.left = $(window).width() - (width + FOLD);
                ruleIndex.push(STUDIP.CSS.addRule('#user-details-popup:before', {'margin-left': (offset - 12) + 'px'}));
                ruleIndex.push(STUDIP.CSS.addRule('#user-details-popup:after', {'margin-left': (offset - 10) + 'px'}));
            }

            userDetails.css(position).stop(true, true).show('fade', 'fast');
        });
    });

    $(SELECTOR + ', #user-details').live('mouseleave', function () {
        timeout = window.setTimeout(function() { userDetails.hide('fade', 'fast'); }, DELAY);
    });

    $('#user-details').live('mouseenter', function () {
        window.clearTimeout(timeout);
    });

    $(document).ready(function () {
        userDetails.appendTo('body');
    });

}(jQuery, STUDIP));