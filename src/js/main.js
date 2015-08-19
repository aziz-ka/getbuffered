(function() {
	var isBuffer = sessionStorage.getItem("buffer");
	
	if(!isBuffer) {
		$("#entry-form").modal("show");
		$(".alert").hide();
		$("#company").change(function(event) {
			var companyPick = event.target.value;
			if(companyPick === "buffer") {
				$(".alert-danger").hide();
				$(".alert-success").show();

				setTimeout(function() {
					$("#entry-form").modal("hide");
				}, 2000);
				sessionStorage.setItem("buffer", true);
			}
			if(companyPick === "other") {
				$(".alert-success").hide();
				$(".alert-danger").show();
			}
			if(companyPick === "none") {
				$(".alert").hide();
			}
		});
	} else {
		$("#entry-form").modal("hide");
	}
	
	$(".tab-content").height(function() {
		return $(window).height() - 75;
	});
	$(".last-li").height(function() {
		return $(window).height() - $(".list-group").height();
	});
})();
