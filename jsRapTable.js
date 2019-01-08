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
		sort:{index:0,up:false},
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
		$('<span>').appendTo(th);
		th.addEventListener('click', function(e){
			let i = $(th).index();
			let u = $(th).hasClass('darr');
			base.Sort(i,u);
		});
	});
	$('td:not(:last-child)',this).each(function(){
		let td = this;
		let grip = $('<div>').addClass('grip').appendTo($(this))[0];
		grip.addEventListener('mousedown', function(e){
			let i = $(td).index();
			ths = $('th',base).eq(i);
			thd = $('th',base).eq(++i);
			startOffset = e.clientX;
			startWidth = $(ths).width();
			e.stopPropagation();
        });
		grip.addEventListener('click',function (e){
			e.stopPropagation();
		});
	});
	document.addEventListener('mousemove',function (e) {
		$('tbody tr',base).css({cursor:'w-resize'});
		if(ths && thd){
			let ows = $(ths).width();
			let owd = $(thd).width();
			let ow = ows + owd;
			let dw = e.clientX - startOffset + startWidth - ows;
			if(ows + dw < 3)
				dw = 3 - ows;
			if(owd - dw < 3)
				dw = owd - 3;
			$(ths).width(ows + dw);
			$(thd).width(owd - dw);
			if(dw > 0)
				$(ths).width(ow - $(thd).width());
			else
				$(thd).width(ow - $(ths).width());
		}else
			$('tbody tr',base).css({cursor:'pointer'});
	});
	document.addEventListener('mouseup',function(e){
			ths = null;
			thd = null;
			e.stopPropagation();
	});
	
	this.Sort = function(i,u){
		if(!this.opt.onSort)return;
		$('.uarr').removeClass('uarr');
		$('.darr').removeClass('darr');
		if(u)
			$('th',this).eq(i).addClass('uarr');
		else
			$('th',this).eq(i).addClass('darr');
		this.opt.onSort.call(this,i,u);
	}
	
	this.Sort(this.opt.sort.index,this.opt.sort.up);
});

}})(jQuery);