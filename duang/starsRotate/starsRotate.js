(function (context) {
    context.StarsRotate = function (options) {
        var that = this;
        that.pool = JSON.parse(JSON.stringify(that.pool));

        for (var k in options) {
            if (options.hasOwnProperty(k)) {
                that.pool[k] = options[k];
            }
        }
        that.init();
    };
    context.StarsRotate.prototype = {
        constructor: context.StarsRotate,
        pool: {
            hue: 343,
            maxStars: 1300,//星星数量
            hollow: 77,
            stars: [],
            w: null,
            h: null,
            ctx:null,
            canvas:null,
            starCanvas:null
        },
        init: function () {
            var that = this, canvas = that.pool.canvas;
            that.pool.ctx = canvas.getContext('2d');
            if (that.pool.h) {
                canvas.height = that.pool.h;
            } else {
                canvas.height = that.pool.h = canvas.clientHeight;
            }
            if (that.pool.w) {
                canvas.width = that.pool.w;
            } else {
                canvas.width = that.pool.w = canvas.clientWidth;
            }

            that.buildStars();
            that.animation();
        },
        reLoadSize:function (w,h) {
            var that = this;
            that.pool.canvas.width = that.pool.w = w;
            that.pool.canvas.height = that.pool.h = h;
            that.buildStars();
        },
        buildStars:function () {
            var that = this,
                starCanvas = document.createElement('canvas'),
                starCtx = starCanvas.getContext('2d');
            that.pool.starCanvas = starCanvas;
            starCanvas.width = 100;
            starCanvas.height = 100;
            var half = starCanvas.width / 2,
                gradient2 = starCtx.createRadialGradient(half, half, 0, half, half, half);
            gradient2.addColorStop(0.025, '#FFC0CB');
            gradient2.addColorStop(0.1, 'hsl(' + that.pool.hue + ', 84%,  78%)');
            gradient2.addColorStop(0.25, 'hsl(' + that.pool.hue + ', 23%, 6%)');
            gradient2.addColorStop(1, 'transparent');
            starCtx.fillStyle = gradient2;
            starCtx.beginPath();
            starCtx.arc(half, half, half, 0, Math.PI * 2);
            starCtx.fill();

            that.pool.stars.length = 0;
            for (var i = 0; i < that.pool.maxStars; i++) {
                that.pool.stars.push(new Star(that.pool.w, that.pool.h, that.pool.hollow, that.pool.maxStars));
            }
        },
        animation: function () {
            var that = this, ctx = that.pool.ctx;
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.5; //尾巴
            ctx.fillStyle = 'hsla(' + that.pool.hue + ', 5%, 5%, 2)';
            ctx.fillRect(0, 0, that.pool.w, that.pool.h);
            ctx.globalCompositeOperation = 'lighter';
            for (var i = 1, l = that.pool.stars.length; i < l; i++) {
                that.pool.stars[i].draw(ctx,that.pool.starCanvas);
            }
            window.requestAnimationFrame(function () {
                that.animation();
            });
        }
    };

    var Star = function (w, h, hollow,maxStars) {

        this.orbitRadius = random(hollow, maxOrbit(w, h));
        this.radius = random(30, this.orbitRadius) / 8;
        //星星大小
        this.orbitX = w / 2;
        this.orbitY = h / 2;
        this.timePassed = random(0, maxStars);
        this.speed = random(this.orbitRadius) / 50000;
        //星星移动速度
        this.alpha = random(2, 10) / 10;
    };

    Star.prototype.draw = function (ctx, starCanvas) {
        var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
            y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
            twinkle = random(10);

        if (twinkle === 1 && this.alpha > 0) {
            this.alpha -= 0.05;
        } else if (twinkle === 2 && this.alpha < 1) {
            this.alpha += 0.05;
        }

        ctx.globalAlpha = this.alpha;
        ctx.drawImage(starCanvas, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
        this.timePassed += this.speed;
    };

    function random(min, max) {
        if (arguments.length < 2) {
            max = min;
            min = 0;
        }

        if (min > max) {
            var hold = max;
            max = min;
            min = hold;
        }

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function maxOrbit(x, y) {
        var max = Math.max(x, y),
            diameter = Math.round(Math.sqrt(max * max + max * max));
        return diameter / 2;
        //星星移动范围，值越大范围越小，
    }
})(window);