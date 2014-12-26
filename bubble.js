;
(function (window, document, Math) {
    'use strict';
    var bubble = function (el, options) {
        el = typeof el == 'string' ? document.getElementById(el) : el;
        if (!el) {
            throw  "Element Not Found!!!";
        }

        var that = this;

        /* detect retina */
        if (window.devicePixelRatio > 1) {
            options.retina = true;
            options.pxRatio = window.devicePixelRatio;
        }

        /* create canvas element */
        var canvas_el = document.createElement('canvas');

        /* set size canvas */
        canvas_el.style.width = "100%";
        canvas_el.style.height = "100%";

        /* append canvas */
        var canvas = el.appendChild(canvas_el);

        this.canvas = {
            el: canvas,
            w: canvas.offsetWidth,
            h: canvas.offsetHeight,
            ctx: canvas.getContext("2d")
        };

        if (that.options.retina) {
            that.canvas.w *= this.options.pxRatio;
            that.canvas.h *= this.options.pxRatio;
        }

        canvas_el.width = this.canvas.w;
        canvas_el.height = this.canvas.h;

        /* override default properties */
        for (var obj in options) {
            if (options.hasOwnProperty(obj)) {
                this.options[obj] = options[obj];
            }
        }

        /* catch objects */
        this.data = [];

        /* recalibrate canvas and re-draw  */
        window.addEventListener("resize", this.onResize.bind(this), false);

        /* Add new circles in an array*/
        this.circleCreate();

        /* Start Animation */
        this.animating = true;
        this.animate();
    };

    var _proto = bubble.prototype;

    // INSERT POINT: OPTIONS
    _proto.options = {
        retina: false,
        pxRatio: 1,
        count: 20,
        color: ["#036", "#fc331c", "#fc0d1b", "#ff0080", "rgb(250,248,5)", '#f35d4f','#f36849','#c0d988','#6ddaf1','#f1e85b']
    };

    _proto.animating = false;

    _proto.onResize = function () {
        var that = this;
        that.canvas.w = that.canvas.el.offsetWidth;
        that.canvas.h = that.canvas.el.offsetHeight;

        if (that.options.retina) {
            that.canvas.w *= this.options.pxRatio;
            that.canvas.h *= this.options.pxRatio;
        }

        that.canvas.el.width = that.canvas.w;
        that.canvas.el.height = that.canvas.h;

    };

    _proto.circleCreate = function () {
        var _opt = this.options,
            i = 0,
            len = this.options.count;

        for (; i < len; i++) {
            this.data.push(new circle(_opt.color, _opt.position, this.canvas));
        }
    };

    _proto.circleRemove = function () {
        this.data = [];
    };

    _proto.updateCircle = function () {
        var i = 0,
            len = this.options.count,
            particles = this.data,
            particle,
            x,
            y;

        for (; i < len; i++) {
            particle = particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;

            x = particle.x + particle.radius;
            y = particle.y + particle.radius;

            if (x > this.canvas.w) {
                particle.vx = -Math.abs(particle.vx);
            }
            else if (particle.x < 0) {
                particle.vx = Math.abs(particle.vx);
            }

            if (y > this.canvas.h) {
                particle.vy = -Math.abs(particle.vx);
            }
            else if (particle.y < 0) {
                particle.vy = Math.abs(particle.vy);
            }
        }
    };
    var index = 0;
    _proto.animate = function () {
        if (!this.animating) return;

        this.updateCircle();
        this.drawAll();
        this.requestAnimFrame = rAF(this.animate.bind(this));
    };

    _proto.drawAll = function () {
        var i = 0,
            ctx = this.canvas.ctx,
            len = this.options.count;
        ctx.clearRect(0, 0, this.canvas.w, this.canvas.h);
        for (; i < len; i++) {
            this.data[i].draw(ctx);
        }
    };

    _proto.destroy = function () {
        this.canvas.el.remove();
    };

    var circle = function (color, position, canvas) {
        /* position */
        this.x = position ? position.x : Math.random() * canvas.w;
        this.y = position ? position.y : Math.random() * canvas.h;

        /* size */
        this.radius = 1 + Math.random() * 20;

        /* color */
        this.color = color[Math.floor(Math.random() * color.length)];

        /* animation - velocity for speed */
        this.vx = ((Math.random() * (2)) - 1);
        this.vy = ((Math.random() * (2)) - 1);

    };

    circle.prototype.draw = function (ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    };

    var rAF = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    var cRAF = (function () {
        return window.cancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            clearTimeout
    })();

    window.bubbleJS = function (tag_id, options) {
        return new bubble(tag_id, options);
    };
})(window, document, Math);