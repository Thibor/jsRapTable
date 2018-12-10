$.fn.sortElements = (function(){
var sort = [].sort;
return function(comparator, getSortable){
	getSortable = getSortable || function(){return this;};
	var placements = this.map(function(){
		var sortElement = getSortable.call(this),parentNode = sortElement.parentNode,nextSibling = parentNode.insertBefore(document.createTextNode(''),sortElement.nextSibling);
		return function(){
			if (parentNode === this)
				throw new Error("You can't sort elements if any one is a descendant of another.");
			parentNode.insertBefore(this, nextSibling);
			parentNode.removeChild(nextSibling);
		};
	});
	return sort.call(this, comparator).each(function(i){
		placements[i].call(getSortable.call(this));
	});
};
})();

(function($){
$.fn.jsRapTable = function(options){
	
return this.each(function(){
	this.opt = $.extend({
		onSort:null
	},options);
	let base = this;
	let ths = null;
	let thd = null;
    let startOffset = 0;
	let startWidth = 0;
	$(this).addClass('rapTable');
	$('th',this).each(function(){
		let th = this;
		th.addEventListener('click', function(e){
			let d = $(th).hasClass('darr');
			$('.uarr').removeClass('uarr');
			$('.darr').removeClass('darr');
			if(d)
				$(th).addClass('uarr');
			else
				$(th).addClass('darr');
			if(base.opt.onSort)
				base.opt.onSort.call(this,$(th).index(),d);
		});
	});
	$('td:not(:last-child)',this).each(function() {
		let td = this;
		let grip =$('<div>').addClass('grip').appendTo($(this))[0];
		grip.addEventListener('mousedown', function (e) {
			let i = $(td).index();
			ths = $('th',base).eq(i);
			thd = $('th',base).eq(++i);
			startOffset = e.clientX;
			startWidth = $(ths).width();
			e.stopPropagation();
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
		e.stopPropagation();
	});
	document.addEventListener('mouseup', function () {
			ths = null;
			thd = null;
	});
});

}})(jQuery);