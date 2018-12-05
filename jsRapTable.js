(function($){
$.fn.jsRapTable = function(options){
	
return this.each(function(){
	this.opt = $.extend({
	},options);
	let base = this;
	let ths = null;
	let thd = null;
    let startOffset = 0;
	let startWidth = 0;
	$(this).addClass('rapTable');
	$('td:not(:last-child)',this).each(function() {
		let td = this;
		let grip =$('<div>').addClass('grip').appendTo($(this))[0];
		grip.addEventListener('mousedown', function (e) {
			let i = $(td).index();
			ths = $('th',base).eq(i);
			thd = $('th',base).eq(++i);
			startOffset = e.clientX;
			startWidth = $(ths).width();
        });
	});
	document.addEventListener('mousemove', function (e) {
		$('tbody tr',base).css({cursor:'w-resize'});
		if(ths && thd){
			let ows = $(ths).width();
			let owd = $(thd).width();
			let ow = ows + owd;
			let dw = e.clientX - startOffset + startWidth - ows;
				$(ths).width(ows + dw);
				$(thd).width(owd - dw);
				if(dw > 0)
					$(ths).width(ow - $(thd).width());
				else
					$(thd).width(ow - $(ths).width());
		}else
			$('tbody tr',base).css({cursor:'pointer'});
	});
	document.addEventListener('mouseup', function () {
			ths = null;
			thd = null;
	});
});

}})(jQuery);