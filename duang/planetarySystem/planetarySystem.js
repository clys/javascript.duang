(function (context) {
    var indexKeyName = 'ps-index';
    var privates = {};

    function private(that, fn) {
        (typeof fn === 'function' ? fn : privates[fn]).apply(that, Array.prototype.slice.call(arguments, 2));
    }


    var publics = function (container, options) {
        var that = this;
        that.pool = JSON.parse(JSON.stringify(that.pool));

        that.pool.container = container;
        for (var k in options) {
            if (options.hasOwnProperty(k)) {
                that.pool[k] = options[k];
            }
        }
        that.init();
    };
    publics.prototype = {
        pool: {
            container: null,
            containerSub: null,
            indexInfo: {
                '0': 0
            }
        },
        init: function () {
            var that = this;
            that.build();
        },
        build: function () {
            var that = this, container = that.pool.container;
            that.pool.indexInfo = {
                '0': 0
            };
            container.setAttribute('class', container.getAttribute('class') + ' planetarySystem');
            container.innerHTML =
                '<div class="ps-center">\
                 <i class="ps-sun ps-track"><i class="ps-core"><i class="ps-planet"></i></i></i>\
                 </div>';
            that.pool.containerSub = container.getElementsByClassName('ps-center')[0];
        },
        setList: function (list) {
            var that = this, one;
            list = JSON.parse(JSON.stringify(list));
            that.build();
            for (var i = 0, len = list.length; i < len; i++) {
                one = list[i];
                that.addPlanet(one);
                if (one.list) {
                    for (var li = 0, lLen = one.list.length; li < lLen; li++) {
                        that.addMoon(i, one.list[li]);
                    }
                }
            }
        },
        addPlanet: function (config) {
            var that = this;
            that.add(that.pool.containerSub, 0, config);
        },
        addMoon: function (index, config) {
            var that = this, pIndex;
            if (typeof index === 'number') {
                pIndex = '0-' + index;
                index = that.pool.containerSub.getElementsByClassName(indexKeyName + '_' + pIndex)[0];
            } else {
                pIndex = index.getAttribute('data-' + indexKeyName);
            }
            if (that.isNull(index)) {
                return;
            }
            index = index.getElementsByClassName('ps-core')[0];
            that.add(index, pIndex, config);
        },
        add: function (e, pIndex, config) {
            var that = this, code = e.innerHTML, indexInfo = that.pool.indexInfo, index, cl;
            pIndex = pIndex + '';
            if (that.isNull(indexInfo[pIndex])) {
                indexInfo[pIndex] = 0;
            }
            index = pIndex + '-' + indexInfo[pIndex];
            cl = indexKeyName + '_' + index;
            e.innerHTML =
                '<i class="ps-track ' + cl + '" data-' + indexKeyName + '="' + index + '">' +
                '<i class="ps-core">' +
                '<i class="ps-planet">' +
                '</i></i></i>'
                + code;
            that.pool.indexInfo[pIndex]++;


            that.setStyle(e.getElementsByClassName(cl)[0], config);
        },
        setStyle: function (track, config) {
            var that = this;
            if (that.isNull(track) || that.isNull(config)) {
                return;
            }
            var planet = track.getElementsByClassName('ps-planet')[0], st;
            st = track.style;
            if (!that.isNull(config.trackRadius)) {
                st.width = config.trackRadius * 2 + 1 + 'px';
                st.height = config.trackRadius * 2 + 1 + 'px';
                st.top = -config.trackRadius + 'px';
                st.left = -config.trackRadius + 'px';
            }
            if (!that.isNull(config.trackColor)) {
                st.borderColor = config.trackColor;
            }
            if (!that.isNull(config.cycle)) {
                st.animationDuration = config.cycle + "s";
                st.webkitAnimationDuration = config.cycle + "s";
                st.mozAnimationDuration = config.cycle + "s";
            }

            st = planet.style;
            if (!that.isNull(config.planetRadius)) {
                st.width = config.planetRadius * 2 + 1 + 'px';
                st.height = config.planetRadius * 2 + 1 + 'px';
                st.top = -config.planetRadius + 'px';
                st.left = -config.planetRadius + 'px';
            }
            if (!that.isNull(config.planetColor)) {
                st.background = config.planetColor;
            }
        },
        isNull: function (o) {
            return typeof o === 'undefined' || o === null;
        }
    };

    context.PlanetarySystem = publics;
})(window);