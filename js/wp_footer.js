jQuery(function ($) {
  $(".et-social-icon a, .et-extra-social-icon a").attr("target", "_blank");
});
jQuery(function ($) {});
jQuery(function ($) {
  $("#et-info-phone").wrap(function () {
    var num = $(this).text();
    num = num.replace(/[^0-9+]+/g, "-");
    num = num.replace(/^[-]|[-]$/g, "");
    return '<a href="tel:' + num + '"></a>';
  });
});
