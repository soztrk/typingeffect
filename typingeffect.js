/**
 * Created by soztr on 27.03.2016.
 */
(function($) {

    $.typingEffect = function(element, options) {

        var defaults = {
            mask: "te-mask",
            animation:"zoom", // zoom,blink,ease,rotate,flipy,flipx,explode,shake
            duration:".4s",
            callBack: function() {}
        }

        var plugin = this;
        var data = [];
        var state = true;
        var i = 0;

        plugin.settings = {}

        var $element = $(element),
            element = element;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            // input wrapper
            $(element).wrap('<div class="te-wrapper"></div>');
            $(element).closest("div.te-wrapper").append('<div class="te-mask"></div>');
            $(".te-mask").css("color","#000");

            // set events
           $(element).on("keyup",function(){
               spell(this);
           });

           $(element).on("focus",function(){
               if(state){
                   mask(this,false);
               }
           });

           // todo: te-mask-> mouseenter->mask=false , mouseleave->mask=true
        }
        
        // public method 
        plugin.doSome = function() {
            // code goes here
            console.log(plugin.settings.foo);
        }

        // mask state
        var mask = function(elm,show) {
            if(show){
                $(elm).siblings("."+plugin.settings.mask).css("z-index","1");
                $(elm).css("color","#fff");
            }
            else {
                $(elm).siblings("."+plugin.settings.mask).css("z-index","-1");
                $(elm).css("color","#000");
            }
        }

        // spelling engine
        var spell = function(elm){
            var val = $(elm).val();
            var text = $(elm).siblings("."+plugin.settings.mask).text();
            if(data.length < 1) {
                // fark kontrolü
                if (text.length < val.length) {
                    val = val.replace(text,'');
                    val = val.split('');
                    data = data.concat(val);
                    animation(elm);
                }
                else {
                    $(elm).siblings("."+plugin.settings.mask).html(val);
                }
            }
        }

        var animation = function(elm){
            var timo
            if (state && data.length > 0) {
            $(elm).siblings("." + plugin.settings.mask).append('<span>'+data[i]+'</span>');
            $(elm).siblings("." + plugin.settings.mask).find("span")
                .css({"animation-name":plugin.settings.animation,"animation-duration":plugin.settings.duration})
                .on("webkitAnimationStart oanimationstart oAnimationStart msAnimationStart animationstart",
                    function () {
                        state = false;
                        mask(elm,true);
                        timo += 1500;
                    })
                .on("webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend",
                    function () {
                        $(elm).siblings("." + plugin.settings.mask).find("span").contents().unwrap();
                        data.splice(i,1);
                        state = true;
                        setTimeout(function(){
                            mask(elm,false);
                        },timo);
                        animation(elm);
                    });
            }
            else if (state && data.length == 0){
                spell(elm);
            }
        }

        plugin.init();

    }

    $.fn.typingEffect = function(options) {

        return this.each(function() {
            if (undefined == $(this).data('typingEffect')) {
                var plugin = new $.typingEffect(this, options);
                $(this).data('typingEffect', plugin);
            }
        });

    }

})(jQuery);