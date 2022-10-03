(function ($) {
  var divi_module_list = [
    ".et_overlay",
    ".et-pb-icon",
    ".et_pb_shop",
    ".et_pb_button.et_pb_custom_button_icon",
    ".et_pb_more_button",
    ".et_pb_dmb_breadcrumbs li[data-icon]",
    ".et_pb_dmb_breadcrumbs a[data-icon]",
    ".dgpc_product_carousel .swiper-button-prev",
    ".dgpc_product_carousel .swiper-button-next",
    ".et_pb_b3_testimonial_grid_slider .swiper-button-next",
    ".et_pb_b3_testimonial_grid_slider .swiper-button-prev",
    ".et_pb_testimonial_slider .swiper-button-next",
    ".et_pb_testimonial_slider .swiper-button-prev",
  ];
  var divi_module_list_toggles = [
    ".et-core-control-toggle",
    '.et-fb-form__toggle[data-name="button"]',
    '.et-fb-form__toggle[data-name="button_one"]',
    '.et-fb-form__toggle[data-name="button_two"]',
    '.et-fb-form__toggle[data-name="image"]',
    '.et-fb-form__toggle[data-name="overlay"]',
  ];
  var all_divi_module_list = divi_module_list.join();
  var all_divi_module_list_toggles = divi_module_list_toggles.join();
  var fb_list = ".et-fb-font-icon-list";
  var fb_frame_selector = "et-fb-app-frame";
  function is_et_fb_pro() {
    if ($("#et-fb-app").length) {
      return true;
    }
    return false;
  }
  $(function () {
    b3_hide_icons();
    setTimeout(function () {
      b3_process_icons();
      b3_show_icons();
    }, 100);

    if (is_et_fb_pro()) {
      var targetNode = document.getElementById("et-fb-app");
      var config = { childList: true, attributes: true, subtree: true };
      var callback = function (mutationsList) {
        mutationsList.forEach(function (thisMutation) {
          if (thisMutation.type == "childList") {
            var target = thisMutation.target;
            if (
              $(target).attr("id") === "et-fb-app" ||
              $(target).attr("id") === "et_fb_root" ||
              $(target).hasClass("et_pb_section") ||
              $(target).hasClass("et_pb_row") ||
              $(target).hasClass("et_pb_column")
            ) {
              b3_process_icons();
              b3_show_icons();
            }

            if (thisMutation.addedNodes.length > 0) {
              if (
                $(target).attr("data-name") === "image" ||
                $(target).hasClass("et-fb-form__toggle") ||
                $(target).attr("data-name") === "button" ||
                $(target).attr("data-name") === "overlay" ||
                $(target).attr("data-name") === "button_one" ||
                $(target).attr("data-name") === "button_two" ||
                target.classList.contains("et-fb-form__toggle")
              ) {
                b3_process_fb_icon_list();
              }
            }
          }
        });
      };
      var observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    }
  });

  var fbBody = $("body.et-fb");
  if (fbBody.length) {
    var MO = window.MutationObserver
      ? window.MutationObserver
      : window.WebkitMutationObserver;
    if (MO) {
      new MO(function (events) {
        b3_process_fb_icon_list();
        $.each(events, function (i, event) {
          if (
            event.target &&
            (event.type != "characterData" || event.target.parentElement)
          ) {
            var $element = $(
              event.type == "characterData"
                ? event.target.parentElement
                : event.target
            );

            if (
              $element.hasClass("et-pb-icon") &&
              $element.closest(".et_pb_main_blurb_image").length &&
              $element.closest(".et_pb_module.et_pb_blurb")
            ) {
              var iconContent = $element.html();
              if (iconContent.indexOf("|") != -1) {
                symbol_data = iconContent.split("|");
                $element.html(symbol_data[2]);
                $element.removeClass(
                  "b3_divi_et_icon_fd b3_divi_b3holidayicon_icon_fd b3_divi_b3lineicon_icon_fd"
                );
                $element.addClass("b3_divi_" + symbol_data[0] + "_icon_fd ");
                $element.attr(
                  "data-b3c",
                  "b3_divi_" + symbol_data[0] + "_icon_fd "
                );
                $element.attr("data-icon", symbol_data[2]);
                $element.attr("data-iconfamily", symbol_data[0]);
              }
            } else if (event.addedNodes && event.addedNodes.length) {
              $.each(event.addedNodes, function (i, node) {
                $(node)
                  .find(".et-pb-icon")
                  .each(function () {
                    var $iconChild = $(this);
                    if (
                      $iconChild.closest(
                        ".et_pb_module.et_pb_blurb .et_pb_main_blurb_image"
                      ).length
                    ) {
                      var iconContent = $iconChild.html();
                      if (iconContent.indexOf("|") != -1) {
                        symbol_data = iconContent.split("|");
                        $iconChild.html(symbol_data[2]);
                        $iconChild.removeClass(
                          "b3_divi_et_icon_fd b3_divi_b3holidayicon_icon_fd b3_divi_b3lineicon_icon_fd"
                        );
                        $iconChild.addClass(
                          "b3_divi_" + symbol_data[0] + "_icon_fd "
                        );
                        $iconChild.attr(
                          "data-b3c",
                          "b3_divi_" + symbol_data[0] + "_icon_fd "
                        );
                        $iconChild.attr("data-icon", symbol_data[2]);
                        $iconChild.attr("data-iconfamily", symbol_data[0]);
                      }
                    }
                  });
              });
            }
          }
        });
      }).observe(fbBody[0], {
        characterData: true,
        childList: true,
        subtree: true,
      });
    }
  }
  $(document).on("click", fb_list + " > li", function (e) {
    b3_hide_icons();
    setTimeout(function () {
      b3_process_fb_icon_list();
      b3_process_icons();
      b3_show_icons();
    }, 100);
  });
  $(document).ajaxComplete(function () {
    b3_hide_icons();
    setTimeout(function () {
      b3_process_fb_icon_list();
      b3_process_icons();
      b3_show_icons();
    }, 100);
  });
  function b3_process_icons() {
    var builder_frame;
    var module;
    var target_element;
    var icon_data;
    var icon_modules;
    var is_et_fb = false;

    if (is_et_fb_pro() && $("iframe#" + fb_frame_selector)) {
      is_et_fb = true;
      builder_frame = $("iframe#" + fb_frame_selector);
      icon_modules = $(all_divi_module_list, builder_frame.contents());
    } else {
      icon_modules = $(all_divi_module_list);
    }
    for (i = 0; i < icon_modules.length; i++) {
      module = icon_modules[i];
      if (is_et_fb) {
        target_element = $(module, builder_frame.contents());
      } else {
        target_element = $(module);
      }
      if (!target_element.length) {
        continue;
      }

      if (target_element.data("icon") !== undefined) {
        var icon_data = target_element.attr("data-icon");
        if (icon_data.indexOf("icon_quotations_alt2") > -1) {
          icon_data = icon_data.split("~|");
        } else {
          icon_data = icon_data.split("|");
        }
        if (icon_data.length >= 2) {
          target_element.attr("data-icon", icon_data[2]);
        }
      } else {
        if (target_element.hasClass("et_pb_shop")) {
          continue;
        }
        var icon_data = target_element.html();
        if (icon_data.indexOf("icon_quotations_alt2") > -1) {
          icon_data = icon_data.split("~|");
        } else {
          icon_data = icon_data.split("|");
        }
        if (icon_data.length >= 2) {
          target_element.html(icon_data[2]);
        }
      }
      if (icon_data[1]) {
        target_element.removeClass(
          "b3_divi_et_icon_fd b3_divi_b3holidayicon_icon_fd b3_divi_b3lineicon_icon_fd"
        );
        target_element.attr("data-iconfamily", icon_data[0]);
        target_element.addClass("b3_divi_" + icon_data[0] + "_icon_fd ");
        target_element.attr(
          "data-b3c",
          "b3_divi_" + icon_data[0] + "_icon_fd "
        );
        target_element.attr("data-icon", icon_data[2]);
      }
      if (target_element.is("[data-iconfamily]")) {
        var this_fam = target_element.attr("data-iconfamily");
        if (!target_element.hasClass("b3_divi_" + this_fam + "_icon_fd")) {
          target_element.addClass(" b3_divi_" + this_fam + "_icon_fd ");
        }
      }
    }
  }
  function b3_process_fb_icon_list() {
    var icon_list_ul = $(fb_list);
    var icon_list_children = icon_list_ul.children();
    var icon_data;
    var icon_set_name;
    for (var i = 0; i < icon_list_children.length; i++) {
      var icon_item = icon_list_children[i];
      if (
        $(icon_item).not(".b3_divi_icons_list") ||
        $(icon_item).hasClass("active")
      ) {
        icon_data = $(icon_item).data("icon") + "";
        if (icon_data.indexOf("icon_quotations_alt2") > -1) {
          icon_data = icon_data.split("~|");
        } else {
          icon_data = icon_data.split("|");
        }

        if (icon_data.length > 1) {
          icon_set_name = icon_data[0];
          $(icon_item).attr({
            "data-iconfamily": icon_data[0],
            "data-iconname": icon_data[1],
            title: icon_data[1],
            "data-icon": icon_data[2],
          });
          $(icon_item).addClass(
            "b3_divi_icons_list b3_divi_" + icon_data[0] + "_icon_fd "
          );
        } else {
          $(icon_item).attr("data-iconfamily", "et");
        }
      }
    }
  }
  $(document).on("click", all_divi_module_list_toggles, function (e) {
    setTimeout(function () {
      b3_process_fb_icon_list();
    }, 100);
  });
  function b3_hide_icons() {
    if (is_et_fb_pro() && $("iframe#" + fb_frame_selector).length) {
      var builder_frame = $("iframe#" + fb_frame_selector);
      $(all_divi_module_list, builder_frame.contents()).removeClass(
        "show_icon"
      );
      $(all_divi_module_list, builder_frame.contents()).addClass("hide_icon");
    } else {
      $(all_divi_module_list).removeClass("show_icon");
      $(all_divi_module_list).addClass("hide_icon");
    }
  }
  function b3_show_icons() {
    if (is_et_fb_pro() && $("iframe#" + fb_frame_selector).length) {
      var builder_frame = $("iframe#" + fb_frame_selector);
      $(all_divi_module_list, builder_frame.contents()).removeClass(
        "hide_icon"
      );
      $(all_divi_module_list, builder_frame.contents()).addClass("show_icon");
    } else {
      $(all_divi_module_list).removeClass("hide_icon");
      $(all_divi_module_list).addClass("show_icon");
    }
  }
})(jQuery);
