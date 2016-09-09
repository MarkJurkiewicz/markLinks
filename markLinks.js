document.addEventListener("DOMContentLoaded", function(event) {
    timeStamp();
    viewTime();
    handlers();

});

var timeStamp = {

    getQueryVariable : function () {
        var regex = /\bt=([\dhHmMsS.:]*)(?:,([\dhHmMsS.:]+))?\b/g,
            match = regex.exec(location.hash) || regex.exec(location.search);
        if (match) {
            return match[1];
        }
        return false;
    },

    /**
     * parseTime(str)
     * @param str A timecode
     * @returns the time in seconds
     */
     parseTime : function (str) {
        var plain = /^\d+(\.\d+)?$/g,
            npt = /^(?:npt:)?(?:(?:(\d+):)?(\d\d?):)?(\d\d?)(\.\d+)?$/,
            quirks = /^(?:(\d\d?)[hH])?(?:(\d\d?)[mM])?(\d\d?)[sS]$/,
            match;
        if (plain.test(str)) {
            return parseFloat(str);
        }
        match = npt.exec(str) || quirks.exec(str);
        if (match) {
            return (3600 * (parseInt(match[1], 10) || 0) + 60 * (parseInt(match[2], 10) || 0) + parseInt(match[3], 10) + (parseFloat(match[4]) || 0));
        }
        return 0;
    }
};


    var viewTime = {

        skipTime: function () {
            var time,
                media,
                link,

                t = timeStamp.getQueryVariable() || 0;


            if (t) {
                time = timeStamp.parseTime(t);
                media = document.querySelector('audio, video');
                link = document.querySelector('p:nth-child(3n+3)');

                // Preload the media
                media.setAttribute('preload', 'true');
                // Set ID for quick links
                link.setAttribute('id', 'quick');
                // Set the current time. Will update if playing. Will fail if paused.
                media.currentTime = time;
                // Start video playback on clicking link with timestamp.
                media.play();
                // remove hash value from URL without refreshing in order to click Video Click Link again
                window.history.pushState('', '/', window.location.pathname);

            }
        }
    };

var handlers = {

    resetZero: function () {
        // When video playback is finished.  Reset to the beginning and pause
        viewTime.media.addEventListener('ended', function stopEndListener(e) {
            this.currentTime = 0;
            e.preventDefault();
            e.stopPropagation();
            this.removeEventListener('ended', stopEndListener);
            return false;
        }, false);
    },

    iPhonePlay: function () {
        // Click handler for overcoming html5 media player limitations
        viewTime.link.addEventListener('touchstart', function stopTouchListener(c) {
            viewTime.media.play();
            this.removeEventListener('touchstart', stopTouchListener);
            return false;

        }, false);
    }
};

//    windowListeners: function () {
//        if (window.addEventListener) {
//            window.addEventListener("DOMContentLoaded" , false);
//            window.addEventListener("hashchange", false);
//        }
//        else if (window.attachEvent) {
//            window.attachEvent("onload", timeJump);
//            window.attachEvent("onhashchange", timeJump);
//        }
//    }
//};
