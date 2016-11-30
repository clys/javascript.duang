(function (context) {
    var privates = {};

    function private(that, fn) {
        (typeof fn === 'function' ? fn : privates[fn]).apply(that, Array.prototype.slice.call(arguments, 2));
    }

    var publics = function () {

    };
    publics.prototype = {};

    context.planetarySystem = publics;
})(window);