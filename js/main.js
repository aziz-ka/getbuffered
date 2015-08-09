(function() {
	$(".tab-content").height(function() {
		return $(window).height() - 75;
	});
	$(".last-li").height(function() {
		return $(window).height() - $(".list-group").height();
	});
})();
