!function(){var e=sessionStorage.getItem("buffer");e?$("#entry-form").modal("hide"):($("#entry-form").modal("show"),$(".alert").hide(),$("#company").change(function(e){var t=e.target.value;"buffer"===t&&($(".alert-danger").hide(),$(".alert-success").show(),setTimeout(function(){$("#entry-form").modal("hide")},2e3),sessionStorage.setItem("buffer",!0)),"other"===t&&($(".alert-success").hide(),$(".alert-danger").show()),"none"===t&&$(".alert").hide()})),$(".tab-content").height(function(){return $(window).height()-75}),$(".last-li").height(function(){return $(window).height()-$(".list-group").height()})}();