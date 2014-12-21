;(function (window, document, Math) {
    'use strict';
    var bubble = function(el, options){
        this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;

        this.options = {
            // INSERT POINT: OPTIONS
            retina: false

        };

        for ( var obj in options ) {
            if(options.hasOwnProperty(obj)){
                this.options[obj] = options[obj];
            }
        }

        /* detect retina */
        if(window.devicePixelRatio > 1){
            options.retina = true;
        }
    };

    var _proto = bubble.prototype;

    _proto.destroy = function(){

    };


    var circle = function(){

    };

    window.bubble = function(tag_id, options){
        return new bubble(tag_id, options);
    };
})(window, document, Math);