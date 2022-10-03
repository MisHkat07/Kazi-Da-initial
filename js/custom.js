if (!window.et_animation_data) {
  var et_animation_data = [];
}
if (!window.et_link_options_data) {
  var et_link_options_data = [];
}
function togglePlayableTags(overlay_id, wait) {
  var $ = jQuery,
    overlay = $(overlay_id + ".divioverlay");
  if (!overlay_id) {
    overlay_id = "";
  }
  if (!wait) {
    wait = 1;
  }
  setTimeout(function () {
    overlay
      .find("iframe")
      .not('[id^="gform"], .frm-g-recaptcha, [name^="__privateStripeFrame"]')
      .each(function () {
        let iframe = $(this),
          iframeSRC = iframe.attr("src");
        if (iframeSRC !== undefined && iframeSRC !== "") {
          let srcG = "google.com/",
            isGoogleSRC = iframeSRC.indexOf(srcG),
            srcPDF = ".pdf",
            isPDF = iframeSRC.indexOf(srcPDF),
            srcFB = "facebook.com/",
            isFB = iframeSRC.indexOf(srcFB);
          if (isGoogleSRC === -1 && isPDF === -1 && isFB === -1) {
            let iframeOuterHTML = iframe.prop("outerHTML"),
              src = iframeOuterHTML.match(
                /src=[\'"]?((?:(?!\/>|>|"|\'|\s).)+)"/
              )[0];
            src = src.replace("src", "data-src");
            iframeOuterHTML = iframeOuterHTML.replace(
              /src=".*?"/i,
              'src="about:blank" data-src=""'
            );
            if (src != 'data-src="about:blank"') {
              iframeOuterHTML = iframeOuterHTML.replace('data-src=""', src);
            }
            $(iframeOuterHTML).insertAfter(iframe);
            iframe.remove();
          }
        }
      });
  }, wait);
  overlay.find("video").each(function () {
    let pThis = $(this),
      parentHasClassRemoveControls = pThis.parents(
        ".do-video-autoplay-removecontrols"
      );
    if (parentHasClassRemoveControls.length > 0) {
      pThis.removeAttr("controls");
    }
    if (overlay_id != "") {
      setTimeout(function () {
        pThis.get(0).play();
      }, 1);
    } else {
      pThis.get(0).pause();
    }
  });
  overlay.find("audio").each(function () {
    this.pause();
    this.currentTime = 0;
  });
}
!(function (send) {
  var divioverlays_interceptor_send = function (body) {
    var isDiviOverlaysOpen = document.querySelectorAll(
      ".divioverlay.divioverlay-open"
    );
    if (isDiviOverlaysOpen.length > 0) {
      try {
        if (body !== null) {
          var doCustomFieldName = "et_pb_signup_divioverlayid",
            action = "action=et_pb_submit_subscribe_form",
            is_optin_submit_subscribe_form = body.indexOf(action),
            is_divioverlays_ref_form = body.indexOf(doCustomFieldName);
          if (
            is_optin_submit_subscribe_form !== -1 &&
            is_divioverlays_ref_form !== -1
          ) {
            var result = [];
            body.split("&").forEach(function (part) {
              var item = part.split("="),
                name = decodeURIComponent(item[0]),
                value = decodeURIComponent(item[1]),
                doCustomField = "et_custom_fields[" + doCustomFieldName + "]";
              if (name != doCustomField && name != "et_post_id") {
                result.push(part);
              }
              if (name == doCustomField) {
                result.push("et_post_id=" + value);
              }
            });
            var url = result.join("&");
            body = url;
          }
          send.call(this, body);
        }
        if (body === null) {
          send.call(this);
        }
      } catch (err) {
        send.call(this, body);
      }
    } else {
      send.call(this, body);
    }
  };
  XMLHttpRequest.prototype.send = divioverlays_interceptor_send;
})(XMLHttpRequest.prototype.send);
(function () {
  var dov_nTimer = setInterval(function () {
    if (typeof jQuery !== "undefined") {
      function isNitroPackEnabled() {
        let nitropack = false;
        if (
          jQuery('[id^="nitropack"]').length > 0 ||
          jQuery('[class^="nitropack"]').length > 0 ||
          typeof window.IS_NITROPACK !== "undefined" ||
          typeof window.NITROPACK_STATE !== "undefined" ||
          jQuery('[id="nitro-telemetry"]').length > 0
        ) {
          nitropack = true;
        }
        return nitropack;
      }
      let delayDiviOverlaysInit = isNitroPackEnabled() === true ? 1000 : 1;
      setTimeout(function () {
        (function ($, window, document, undefined) {
          "use strict";
          var diviBodyElem = $("body"),
            pagecontainer = $("#page-container"),
            sidebarOverlay = $("#sidebar-overlay");
          $.fn.mainDiviOverlays = function (options) {
            var d_styleTagID = "divi-overlays-styles",
              overlaysList = [],
              overlaysDetached = {},
              overlays_opening = {},
              overlays_closing = {},
              zIndex = 16777221,
              wpAdminBar = $("#wpadminbar"),
              tempPagecontainer = $("<div/>", {
                id: "page-container",
                class: "temp-page-container",
                style: "overflow-y: hidden;",
              }),
              ExtraTheme = detectTheme() === "Extra" ? true : false,
              wpAdminBarHeight = 0;
            if (ExtraTheme) {
              var temp_et_pb_extra_column_main = $("<div/>", {
                class: "et_pb_extra_column_main",
                style: "overflow-y: hidden;",
              });
              temp_et_pb_extra_column_main.appendTo(tempPagecontainer);
            }
            if (wpAdminBar.length) {
              wpAdminBarHeight = wpAdminBar.outerHeight();
            }
            $('<style id="' + d_styleTagID + '"></style>').appendTo("head");
            if ($("div.overlay-container").length) {
              setTimeout(function () {
                let allOverlaysContainers = $("div.overlay-container");
                allOverlaysContainers.each(function () {
                  let overlay_id = parseInt(
                      $(this).attr("id").replace("divi-overlay-container-", "")
                    ),
                    overlay_selector = "#overlay-" + overlay_id,
                    overlay = $(overlay_selector),
                    enableajax = overlay.data("enableajax");
                  overlay.addClass("hideoverlay").attr("style", "");
                  if (typeof enableajax === "undefined") {
                    enableajax = false;
                  }
                  if (!enableajax) {
                    overlaysDetached[overlay_id] = $(this).detach();
                  }
                });
                sidebarOverlay.removeClass("hiddenMainContainer");
                checkTriggersAutomaticAndCSS();
              }, 1500);
              togglePlayableTags("", 1);
              var diviMobile = isDiviMobile();
              window.addEventListener(
                "orientationchange",
                function () {
                  applyToDiviOverlayViewportHeight();
                },
                false
              );
              window.addEventListener(
                "resize",
                function () {
                  applyToDiviOverlayViewportHeight();
                },
                false
              );
              function applyToDiviOverlayViewportHeight(post_id) {
                if (typeof post_id === "undefined") {
                  post_id = "";
                }
                let viewportHeight = window.innerHeight,
                  currentWpAdminBarHeight,
                  preventScrollEnabled,
                  overlayOpen =
                    post_id != ""
                      ? $("div#overlay-" + post_id)
                      : $(".divioverlay").filter(":visible");
                overlayOpen.removeAttr("style");
                preventScrollEnabled = overlayOpen.attr("data-preventscroll");
                if (wpAdminBar.length) {
                  if (preventScrollEnabled) {
                    currentWpAdminBarHeight = wpAdminBar.outerHeight();
                  }
                }
                let overlayHeight = overlayOpen.height();
                if (viewportHeight >= overlayHeight) {
                  if (preventScrollEnabled != 1) {
                    overlayOpen.height(viewportHeight + "px");
                  } else {
                    window.scrollTo(0, 0);
                  }
                }
              }
              reassignID_etboc();
              $(document).keyup(function (e) {
                if (e.keyCode == 27) {
                  closeActiveOverlay();
                }
              });
              $(window).on("load", function (e) {
                if (window.location.hash) {
                  let hash = window.location.hash.substring(1),
                    idx_overlay = hash.indexOf("overlay");
                  if (idx_overlay !== -1) {
                    let idx_overlayArr = hash.split("-");
                    if (idx_overlayArr.length > 1) {
                      let overlay_id = idx_overlayArr[1];
                      setTimeout(function () {
                        showOverlay(overlay_id);
                      }, 1500);
                    }
                  }
                }
              });
              var body = $("body"),
                htmlBody = $("html,body"),
                overlay_container = $("div.overlay-container"),
                dummy = document.createElement("div"),
                AnimationEnd =
                  "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
                themesBreakpoint = { Divi: 980, Extra: 1024 };
              const config = {
                attributes: false,
                childList: true,
                subtree: true,
              };
              const callback = function (mutationsList, observer) {
                mutationsList.forEach(function (mutation) {
                  if (mutation.type === "childList") {
                    applyToDiviOverlayViewportHeight();
                  }
                });
              };
              const observer = new MutationObserver(callback);
              $(overlay_container).each(function () {
                $('[id="' + this.id + '"]:gt(0)').remove();
              });
              function evAddTriggerListeners() {
                $('body [id^="overlay_"]').on("click touch tap", function () {
                  var overlayArr = $(this).attr("id").split("_"),
                    overlay_id = overlayArr[3],
                    cookieName = "divioverlay" + overlay_id;
                  doEraseCookie(cookieName);
                  showOverlay(overlay_id);
                });
                body.on("click touch tap", '[id^="overlay_"]', function (e) {
                  var overlayArr = $(this).attr("id").split("_"),
                    overlay_id = overlayArr[3],
                    cookieName = "divioverlay" + overlay_id;
                  doEraseCookie(cookieName);
                  showOverlay(overlay_id);
                });
                body.on(
                  "click touch tap",
                  '[rel^="unique_overlay_"]',
                  function (e) {
                    e.preventDefault();
                    var overlayArr = $(this).attr("rel").split("_"),
                      overlay_id = overlayArr[4],
                      cookieName = "divioverlay" + overlay_id;
                    doEraseCookie(cookieName);
                    showOverlay(overlay_id);
                    return false;
                  }
                );
                $('body [class*="divioverlay-"], body [class*="overlay-"]').on(
                  "click touch tap",
                  function (e) {
                    if (typeof $(this).attr("class") !== "undefined") {
                      var overlayArr = $(this).attr("class").split(" ");
                      $(overlayArr).each(function (index, value) {
                        var idx_overlay = value.indexOf("overlay");
                        if (idx_overlay !== -1) {
                          var idx_overlayArr = value.split("-");
                          if (idx_overlayArr.length > 1) {
                            var overlay_id = idx_overlayArr[1];
                            if (!DovisInt(overlay_id)) {
                              return;
                            }
                            var cookieName = "divioverlay" + overlay_id;
                            doEraseCookie(cookieName);
                            showOverlay(overlay_id);
                          }
                        }
                      });
                    }
                  }
                );
              }
              evAddTriggerListeners();
              function checkTriggersAutomaticAndCSS() {
                if (typeof overlays_with_css_trigger !== "undefined") {
                  if ($(overlays_with_css_trigger).length > 0) {
                    $.each(
                      overlays_with_css_trigger,
                      function (overlay_id, selector) {
                        $(selector).on("click touch tap", function () {
                          var cookieName = "divioverlay" + overlay_id;
                          doEraseCookie(cookieName);
                          showOverlay(overlay_id);
                        });
                      }
                    );
                  }
                }
                if (typeof overlays_with_automatic_trigger !== "undefined") {
                  if ($(overlays_with_automatic_trigger).length > 0) {
                    $.each(
                      overlays_with_automatic_trigger,
                      function (overlay_id, at_settings) {
                        var at_settings_parsed = jQuery.parseJSON(at_settings),
                          at_type_value = at_settings_parsed.at_type,
                          at_onceperload = at_settings_parsed.at_onceperload;
                        if (at_onceperload == 1) {
                          showOverlayOnce(overlay_id);
                        }
                        if (at_type_value == "overlay-timed") {
                          var time_delayed = at_settings_parsed.at_value * 1000;
                          if (time_delayed == 0) {
                            time_delayed = 1000;
                          }
                          time_delayed = time_delayed + 1000;
                          setTimeout(function () {
                            showOverlay(overlay_id);
                          }, time_delayed);
                        }
                        if (at_type_value == "overlay-scroll") {
                          let overlayScroll = at_settings_parsed.at_value,
                            refScroll,
                            byPixels = overlayScroll.indexOf("%"),
                            byPercentage = overlayScroll.indexOf("px");
                          if (byPixels !== -1 || byPercentage !== -1) {
                            if (byPixels !== -1) {
                              overlayScroll = overlayScroll.replace(/%/g, "");
                              refScroll = "%";
                            }
                            if (byPercentage !== -1) {
                              overlayScroll = overlayScroll.replace(/px/g, "");
                              refScroll = "px";
                            }
                            overlayScroll = overlayScroll.split(":");
                            let overlayScrollFrom = overlayScroll[0],
                              overlayScrollTo = overlayScroll[1];
                            $(window).scroll(function (e) {
                              let overlay_selector = "#overlay-" + overlay_id,
                                overlay = $(overlaysDetached[overlay_id]).find(
                                  overlay_selector
                                ),
                                s = getScrollTop(),
                                d = $(document).height(),
                                c = $(window).height(),
                                wScroll,
                                displayonceperloadpassed = overlay.attr(
                                  "data-displayonceperloadpassed"
                                );
                              if (refScroll == "%") {
                                wScroll = (s / (d - c)) * 100;
                              } else if (refScroll == "px") {
                                wScroll = s;
                              } else {
                                return;
                              }
                              if (
                                overlayScrollFrom > 0 &&
                                overlayScrollTo > 0
                              ) {
                                if (
                                  overlayScrollFrom <= wScroll &&
                                  overlayScrollTo >= wScroll
                                ) {
                                  if (!isActiveOverlay(overlay_id)) {
                                    if (
                                      at_onceperload == 1 &&
                                      displayonceperloadpassed != 1
                                    ) {
                                      showOverlay(overlay_id);
                                      overlay.attr(
                                        "data-displayonceperloadpassed",
                                        1
                                      );
                                    }
                                    if (at_onceperload == 0) {
                                      showOverlay(overlay_id);
                                    }
                                  }
                                } else if (isActiveOverlay(overlay_id)) {
                                  closeActiveOverlay(overlay_id);
                                }
                              }
                              if (
                                overlayScrollFrom > 0 &&
                                overlayScrollTo == ""
                              ) {
                                if (overlayScrollFrom <= wScroll) {
                                  if (!isActiveOverlay(overlay_id)) {
                                    if (
                                      at_onceperload == 1 &&
                                      displayonceperloadpassed != 1
                                    ) {
                                      showOverlay(overlay_id);
                                      overlay.attr(
                                        "data-displayonceperloadpassed",
                                        1
                                      );
                                    }
                                    if (at_onceperload == 0) {
                                      showOverlay(overlay_id);
                                    }
                                  }
                                } else if (isActiveOverlay(overlay_id)) {
                                  closeActiveOverlay(overlay_id);
                                }
                              }
                              if (
                                overlayScrollFrom == "" &&
                                overlayScrollTo > 0
                              ) {
                                if (overlayScrollTo >= wScroll) {
                                  if (!isActiveOverlay(overlay_id)) {
                                    if (
                                      at_onceperload == 1 &&
                                      displayonceperloadpassed != 1
                                    ) {
                                      showOverlay(overlay_id);
                                      overlay.attr(
                                        "data-displayonceperloadpassed",
                                        1
                                      );
                                    }
                                    if (at_onceperload == 0) {
                                      showOverlay(overlay_id);
                                    }
                                  }
                                } else if (isActiveOverlay(overlay_id)) {
                                  closeActiveOverlay(overlay_id);
                                }
                              }
                            });
                          }
                        }
                        if (at_type_value == "overlay-exit") {
                          $.exitIntent("enable", { sensitivity: 100 });
                          $(document).bind("exitintent", function () {
                            let overlay_selector = "#overlay-" + overlay_id,
                              overlay = $(overlaysDetached[overlay_id]).find(
                                overlay_selector
                              ),
                              at_onceperload = overlay.attr(
                                "data-displayonceperload"
                              ),
                              displayonceperloadpassed = overlay.attr(
                                "data-displayonceperloadpassed"
                              );
                            if (!isActiveOverlay(overlay_id)) {
                              if (
                                at_onceperload == 1 &&
                                displayonceperloadpassed != 1
                              ) {
                                showOverlay(overlay_id);
                                overlay.attr(
                                  "data-displayonceperloadpassed",
                                  1
                                );
                              }
                              if (undefined === at_onceperload) {
                                showOverlay(overlay_id);
                              }
                            }
                          });
                        }
                      }
                    );
                  }
                }
              }
              $(".nav a, .mobile_nav a").each(function (index, value) {
                var href = $(value).attr("href");
                if (href !== undefined) {
                  var idx_overlay = href.indexOf("overlay");
                  if (idx_overlay !== -1) {
                    var idx_overlayArr = href.split("-");
                    if (idx_overlayArr.length > 1) {
                      var overlay_id = idx_overlayArr[1];
                      $(this).attr("data-overlayid", overlay_id);
                      $(this).on("click touch tap", function () {
                        overlay_id = $(this).data("overlayid");
                        showOverlay(overlay_id);
                      });
                    }
                  }
                }
              });
              $("a").each(function (e) {
                var href = $(this).attr("href");
                if (href !== undefined) {
                  var hash = href[0],
                    ref = href.indexOf("divioverlay");
                  if (hash == "#" && href.length > 1 && ref != -1) {
                    var overlay_id = parseInt(
                      href.replace("#divioverlay-", "")
                    );
                    if (typeof overlay_id == "number") {
                      $(this).attr("data-overlayid", overlay_id);
                      $(this).on("click touch tap", function (e) {
                        overlay_id = $(this).data("overlayid");
                        showOverlay(overlay_id);
                        e.preventDefault();
                      });
                    }
                  }
                }
              });
              function shuffle(array) {
                var currentIndex = array.length,
                  temporaryValue,
                  randomIndex;
                while (0 !== currentIndex) {
                  randomIndex = Math.floor(Math.random() * currentIndex);
                  currentIndex -= 1;
                  temporaryValue = array[currentIndex];
                  array[currentIndex] = array[randomIndex];
                  array[randomIndex] = temporaryValue;
                }
                return array;
              }
              function toggleOverlay(overlay_id, ajax_enabled) {
                var overlay_selector = "#overlay-" + overlay_id,
                  overlay_cache_selector = "#overlay-" + overlay_id,
                  overlay_container = "#divi-overlay-container-" + overlay_id,
                  overlay_container_elem = $(
                    "#divi-overlay-container-" + overlay_id
                  ),
                  overlay = $("body").find(overlay_cache_selector),
                  overlayToClose = overlay,
                  overlayBG,
                  overlayCloseBtn = $("body").find(
                    overlay_cache_selector + " > a.overlay-close"
                  ),
                  oid = overlay.attr("id"),
                  prevent_mainpage_scroll = overlay.data("preventscroll"),
                  displayonceperload = overlay.data("displayonceperload"),
                  overlay_active_selector =
                    "div.overlay-container div.overlay-body",
                  preventOpen = overlay.attr("data-preventopen"),
                  contentLoaded =
                    overlay.attr("data-contentloaded") === "0" &&
                    ajax_enabled === 1
                      ? false
                      : true,
                  cookieName = "divioverlay" + overlay_id,
                  cookieDays = overlay.data("cookie"),
                  animationin = overlay.attr("data-animationin"),
                  animationout = overlay.attr("data-animationout"),
                  animationspeedin = overlay.attr("data-animationspeedin"),
                  animationspeedout = overlay.attr("data-animationspeedout"),
                  overlay_content = $(overlay_selector + " .entry-content"),
                  enablebgblur = overlay.attr("data-enablebgblur");
                if (doReadCookie(cookieName) && cookieDays != 0) {
                  return;
                }
                if (overlays_opening[overlay_id] === true) {
                  return;
                }
                if (overlays_closing[overlay_id] === true) {
                  return;
                }
                if (
                  overlay.hasClass("hideoverlay") &&
                  !overlay.hasClass("divi-overlay-closing") &&
                  !overlay.hasClass("divi-overlay-opening")
                ) {
                  overlays_opening[overlay_id] = true;
                  overlaysList.push(overlay_id);
                }
                if (
                  !overlay.hasClass("hideoverlay") &&
                  !overlay.hasClass("divi-overlay-opening") &&
                  overlay.hasClass("divioverlay-open")
                ) {
                  overlays_closing[overlay_id] = true;
                }
                $(".dov_dv_section")
                  .addClass("et_pb_section")
                  .removeClass("dov_dv_section");
                var et_pb_newsletter = overlay.find(
                  ".et_pb_newsletter_form form .et_pb_newsletter_fields"
                );
                if (et_pb_newsletter.length) {
                  var et_pb_signup_divioverlayid = et_pb_newsletter.find(
                    ".et_pb_signup_divioverlayid"
                  );
                  if (et_pb_signup_divioverlayid.length < 1) {
                    $("<input>")
                      .attr({
                        type: "text",
                        name: "et_pb_signup_divioverlayid",
                        class:
                          "et_pb_signup_divioverlayid et_pb_signup_custom_field",
                        "data-original_id": "et_pb_signup_divioverlayid",
                        value: overlay_id,
                      })
                      .appendTo(et_pb_newsletter);
                  }
                }
                if (
                  overlay.hasClass("hideoverlay") &&
                  !overlay.hasClass("divi-overlay-closing")
                ) {
                  overlay.attr("data-scrolltop", getScrollTop());
                }
                applyToDiviOverlayViewportHeight(overlay_id);
                var overlayOpen = document.querySelector(
                  overlay_selector + " .entry-content"
                );
                var activeOverlayID = getLastOverlayOpened();
                if (activeOverlayID !== null) {
                  overlayToClose = $("#overlay-" + overlay_id);
                  zIndex = zIndex + 1;
                  overlay_container_elem.css("z-index", zIndex);
                } else {
                  overlay_container_elem.css("z-index", zIndex);
                }
                if (
                  !overlay.hasClass("hideoverlay") &&
                  !overlay.hasClass("divi-overlay-opening") &&
                  overlay.hasClass("divioverlay-open")
                ) {
                  var oid = "" + overlay_id,
                    index = overlaysList.indexOf(oid);
                  if (index >= -1) {
                    overlaysList.splice(index, 1);
                  }
                  var overlayToClose_overlay_selector =
                      "#overlay-" + overlay_id,
                    overlayToClose_overlay_content = $(
                      overlayToClose_overlay_selector + " .entry-content"
                    ),
                    overlayToClose_prevent_mainpage_scroll =
                      prevent_mainpage_scroll,
                    overlayToClose_cookieDays = overlayToClose.data("cookie"),
                    overlayToClose_cookieName = "divioverlay" + overlay_id,
                    overlayToClose_overlay_container =
                      "#divi-overlay-container-" + overlay_id,
                    overlayToClose_overlayBG = $("body").find(
                      overlayToClose_overlay_container + " .divioverlay-bg"
                    ),
                    another_overlay_opening = oid !== overlay_id ? true : false,
                    another_overlay_prevent_mainpage_scroll =
                      overlaysList.length > 0 &&
                      body.hasClass("prevent_mainpage_scroll")
                        ? true
                        : false;
                  if (diviMobile === false) {
                    observer.disconnect();
                  }
                  if (overlayToClose_cookieDays > 0) {
                    doCreateCookie(
                      overlayToClose_cookieName,
                      "true",
                      overlayToClose_cookieDays
                    );
                  }
                  if (!overlaysList.length || overlaysList.length < 1) {
                    if (enablebgblur === "1") {
                      pagecontainer.removeClass(
                        "animate__OutOfFocusIn animate__OutOfFocusIn_ended"
                      );
                      pagecontainer
                        .addClass("animate__OutOfFocusOut")
                        .one(AnimationEnd, function (e) {
                          if (
                            !overlayToClose.hasClass("divi-overlay-opening") &&
                            $(this).hasClass("animate__OutOfFocusOut")
                          ) {
                            pagecontainer.removeClass(
                              "animate__animated animate__OutOfFocusOut"
                            );
                          }
                        });
                    }
                  }
                  overlayToClose_overlay_content.css(
                    "cssText",
                    "animation-duration: " + animationspeedout + "s ;"
                  );
                  overlayToClose_overlay_content.addClass(
                    "animate__" + animationout
                  );
                  overlayToClose.addClass("divi-overlay-closing");
                  overlayToClose.removeClass("divioverlay-open");
                  if (overlayToClose_prevent_mainpage_scroll) {
                    if (another_overlay_prevent_mainpage_scroll === false) {
                      body.removeClass("prevent_mainpage_scroll");
                      pagecontainer.removeClass(
                        "prevent_mainpage_scroll_mobile prevent_content_scroll"
                      );
                      htmlBody.scrollTop(
                        $(overlayToClose).attr("data-scrolltop")
                      );
                    }
                    $(overlayToClose).attr("data-scrolltop", "");
                    overlayToClose.removeClass("pcs_enabled");
                  }
                  overlayToClose_overlayBG.css(
                    "cssText",
                    "animation-duration: " + animationspeedout + "s ;"
                  );
                  overlayToClose_overlayBG
                    .removeClass("animate__fadeIn")
                    .addClass("animate__masterfadeOut")
                    .one(AnimationEnd, function (e) {
                      overlayToClose_overlayBG.removeClass(
                        "animate__masterfadeOut"
                      );
                      overlayToClose_overlayBG.css("animation-duration", "");
                    });
                  overlayCloseBtn.addClass(
                    "animate__animated animate__fadeOut"
                  );
                  overlayToClose_overlay_content.one(
                    AnimationEnd,
                    function (e) {
                      if (
                        !overlayToClose.hasClass("hideoverlay") &&
                        !overlayToClose.hasClass("divi-overlay-opening") &&
                        !overlayToClose.hasClass("divioverlay-open")
                      ) {
                        overlayToClose.addClass("hideoverlay");
                        overlayToClose_overlay_content.css(
                          "animation-duration",
                          ""
                        );
                        overlayToClose_overlay_content.removeClass(
                          "animate__" + animationout
                        );
                        overlayToClose.removeAttr("style");
                        if (!overlaysList.length || overlaysList.length < 1) {
                          body.removeClass("divioverlay-exists-opened");
                          pagecontainer.removeClass("dov-zIndex0");
                          $("#page-container .container").removeClass(
                            "dov-zIndex0"
                          );
                          $("#page-container #main-header").removeClass(
                            "dov-zIndex0"
                          );
                          $("#wpadminbar").removeClass("dov-zIndex0");
                          sidebarOverlay.css("z-index", "-15");
                        }
                        zIndex = zIndex - 1;
                        overlay_container_elem.css("z-index", "");
                        setTimeout(function () {
                          overlayCloseBtn.removeClass(
                            "animate__animated animate__fadeOut"
                          );
                          if (overlayToClose_prevent_mainpage_scroll) {
                            if (
                              another_overlay_prevent_mainpage_scroll === false
                            ) {
                              sidebarOverlay.removeClass("pcs_enabled");
                            }
                          }
                          if (
                            enablebgblur === "1" ||
                            (overlayToClose_prevent_mainpage_scroll &&
                              another_overlay_prevent_mainpage_scroll === false)
                          ) {
                            pagecontainer.prepend($("#sidebar-overlay"));
                            tempPagecontainer.detach();
                          }
                          overlayToClose.removeClass("divi-overlay-closing");
                          overlays_closing[overlay_id] = false;
                          evAddTriggerListeners();
                        }, 50);
                        togglePlayableTags("#overlay-" + overlay_id);
                      }
                    }
                  );
                }
                if (
                  overlay.hasClass("hideoverlay") &&
                  !overlay.hasClass("divi-overlay-closing")
                ) {
                  overlayBG = $("body").find(
                    overlay_container + " .divioverlay-bg"
                  );
                  applyOverlayBackground(overlay, overlay_container);
                  if (diviMobile === false) {
                    observer.observe(overlayOpen, config);
                  }
                  overlay.removeClass("hideoverlay");
                  overlay.addClass("divioverlay-open");
                  overlayCloseBtn
                    .addClass("animate__animated animate__fadeIn")
                    .one(AnimationEnd, function (e) {
                      if ($(this).hasClass("animate__fadeIn")) {
                        overlayCloseBtn.removeClass(
                          "animate__animated animate__fadeIn"
                        );
                      }
                    });
                  overlayBG.addClass("animate__fadeIn");
                  if (prevent_mainpage_scroll) {
                    overlay.addClass("pcs_enabled");
                  }
                  if (enablebgblur === "1" || prevent_mainpage_scroll) {
                    diviBodyElem.append(tempPagecontainer);
                    if (ExtraTheme) {
                      temp_et_pb_extra_column_main.prepend(sidebarOverlay);
                    } else {
                      tempPagecontainer.prepend(sidebarOverlay);
                    }
                  }
                  if (contentLoaded === true) {
                    overlayOpenOnAnimationEnd(
                      overlay_id,
                      overlay,
                      overlay_content,
                      animationin,
                      animationspeedin,
                      prevent_mainpage_scroll
                    );
                  }
                  if (
                    $("body").find(
                      overlay_container + " .twentytwenty-container"
                    ).length > 0
                  ) {
                    window.cwp_twentytwenty_container_init();
                  }
                  if (enablebgblur === "1") {
                    pagecontainer
                      .addClass("animate__animated animate__OutOfFocusIn")
                      .one(AnimationEnd, function (e) {
                        if (
                          !overlay.hasClass("divi-overlay-closing") &&
                          $(this).hasClass("animate__OutOfFocusIn")
                        ) {
                          pagecontainer.addClass("animate__OutOfFocusIn_ended");
                        }
                      });
                  }
                  body.addClass("divioverlay-exists-opened");
                  pagecontainer.addClass("dov-zIndex0");
                  $("#page-container .container").addClass("dov-zIndex0");
                  $("#page-container #main-header").addClass("dov-zIndex0");
                  $("#wpadminbar").addClass("dov-zIndex0");
                  sidebarOverlay.css("z-index", "16777210");
                  setTimeout(function () {
                    if (!ajax_enabled) {
                      pluginsCompatibilities(overlay);
                      $(window).trigger("resize");
                    }
                    if (prevent_mainpage_scroll) {
                      sidebarOverlay.addClass("pcs_enabled");
                      body.addClass("prevent_mainpage_scroll");
                      pagecontainer.addClass(
                        "prevent_mainpage_scroll_mobile prevent_content_scroll"
                      );
                    }
                    if (ajax_enabled && !contentLoaded) {
                      var data = {
                          action: "divioverlays_getcontent",
                          security: divioverlays_us,
                          divioverlays_id: overlay_id,
                          _: $.now(),
                        },
                        overlay_styles = $("#divioverlay-styles"),
                        overlay_styles_html = overlay_styles.html(),
                        overlay_links = $("#divioverlay-links"),
                        output = "",
                        output_divicontent = "",
                        output_divistyles = "",
                        output_divimodulestyles = "",
                        loading_img =
                          '<img class="do-loadingimg" src="' +
                          divioverlays_loadingimg +
                          '" alt="Loading ..." width="36" height="36">',
                        ajaxResults = $("<div/>", { class: "et-l et-l--post" });
                      overlay_content.html(loading_img);
                      jQuery.get(
                        divioverlays_ajaxurl + "?p=" + overlay_id,
                        data,
                        function (response) {
                          if (response) {
                            overlay.attr("data-contentloaded", 1);
                            output = $(response);
                            output_divicontent = output
                              .filter("#divioverlay-content-ajax")
                              .html();
                            output_divistyles = output
                              .filter('div[id="divioverlay-css-ajax"]')
                              .html();
                            output_divimodulestyles = output
                              .filter('style[id^="et-builder-module-design"]')
                              .html();
                            let diviScriptAnimationData = output.filter(
                              'script:contains("et_animation_data")'
                            );
                            diviScriptAnimationData.each(function () {
                              let pScript = $(this),
                                scriptHtml = pScript.html().trim(),
                                etanimationdata_index = scriptHtml.indexOf(
                                  "et_animation_data = "
                                ),
                                etanimationdata_lastclub_index =
                                  scriptHtml.indexOf("]"),
                                etanimationdata = scriptHtml.substring(
                                  etanimationdata_index + 20,
                                  etanimationdata_lastclub_index + 1
                                ),
                                ajax_et_animation_data =
                                  JSON.parse(etanimationdata);
                              if (
                                !ajax_et_animation_data ||
                                !ajax_et_animation_data > 0
                              ) {
                                return !1;
                              }
                              if (
                                Object.prototype.toString.call(
                                  et_animation_data
                                ) === "[object Object]"
                              ) {
                                et_animation_data = Object.assign(
                                  et_animation_data,
                                  ajax_et_animation_data
                                );
                              }
                              if (Array.isArray(et_animation_data) === true) {
                                et_animation_data = et_animation_data.concat(
                                  ajax_et_animation_data
                                );
                              }
                            });
                            let diviScriptLinkData = output.filter(
                              'script:contains("et_link_options_data")'
                            );
                            diviScriptAnimationData.each(function () {
                              let pScript = $(this),
                                scriptHtml = pScript.html().trim(),
                                etlinkoptionsdata_index = scriptHtml.indexOf(
                                  "et_link_options_data = "
                                ),
                                etlinkoptionsdata_from = scriptHtml.substring(
                                  etlinkoptionsdata_index + 22
                                ),
                                etlinkoptionsdata_lastclub_index =
                                  etlinkoptionsdata_from.indexOf("]"),
                                etlinkoptionsdata =
                                  etlinkoptionsdata_from.substring(
                                    0,
                                    etlinkoptionsdata_lastclub_index + 1
                                  ),
                                ajax_etlink_options_data =
                                  JSON.parse(etlinkoptionsdata);
                              if (
                                !ajax_etlink_options_data ||
                                !ajax_etlink_options_data > 0
                              ) {
                                return !1;
                              }
                              if (
                                Object.prototype.toString.call(
                                  et_link_options_data
                                ) === "[object Object]"
                              ) {
                                et_link_options_data = Object.assign(
                                  et_link_options_data,
                                  ajax_etlink_options_data
                                );
                              }
                              if (
                                Array.isArray(et_link_options_data) === true
                              ) {
                                et_link_options_data =
                                  et_link_options_data.concat(
                                    ajax_etlink_options_data
                                  );
                              }
                            });
                            ajaxSupportGF(output, overlay_links);
                            overlayOpenOnAnimationEnd(
                              overlay_id,
                              overlay,
                              overlay_content,
                              animationin,
                              animationspeedin,
                              prevent_mainpage_scroll
                            );
                            if (undefined === output_divistyles) {
                              output_divistyles = output
                                .filter('style[id^="et-core"]')
                                .html();
                            }
                            if (undefined !== output_divistyles) {
                              output_divistyles = output_divistyles.replace(
                                /\#page-container/g,
                                " "
                              );
                              output_divistyles = output_divistyles.replace(
                                /\.et_pb_extra_column_main/g,
                                " "
                              );
                            }
                            ajaxResults.html(output_divicontent);
                            overlay_content.html(ajaxResults);
                            pluginsCompatibilities(overlay);
                            output_divistyles =
                              overlay_styles_html +
                              output_divistyles +
                              output_divimodulestyles;
                            overlay_styles.html(output_divistyles);
                            applyOverlayBackground(
                              overlay,
                              overlay_container,
                              "ajax"
                            );
                            output
                              .filter('link[id^="et-builder-googlefonts"]')
                              .attr(
                                "id",
                                "inline-styles-et-builder-googlefonts"
                              )
                              .appendTo(overlay_links);
                            setTimeout(function () {
                              reassignID_etboc();
                              $(".dov_dv_section")
                                .addClass("et_pb_section")
                                .removeClass("dov_dv_section");
                              jQuery(document.body).trigger("post-load");
                              window.et_pb_init_modules();
                              let fixDiviLoopWhenInitModules = setTimeout(
                                function () {
                                  window.et_calculate_fullscreen_section_size =
                                    function () {
                                      let n = $,
                                        d = n(window);
                                      n("section.et_pb_fullscreen").each(
                                        function () {
                                          et_calc_fullscreen_section.bind(
                                            n(this)
                                          )();
                                        }
                                      ),
                                        (clearTimeout(
                                          et_calc_fullscreen_section.timeout
                                        ),
                                        (et_calc_fullscreen_section.timeout =
                                          setTimeout(function () {
                                            d.off(
                                              "resize",
                                              et_calculate_fullscreen_section_size
                                            ),
                                              d.off(
                                                "et-pb-header-height-calculated",
                                                et_calculate_fullscreen_section_size
                                              ),
                                              d.trigger("resize"),
                                              d.on(
                                                "resize",
                                                et_calculate_fullscreen_section_size
                                              ),
                                              d.on(
                                                "et-pb-header-height-calculated",
                                                et_calculate_fullscreen_section_size
                                              );
                                          })));
                                    };
                                },
                                200
                              );
                            }, 200);
                          }
                        }
                      );
                    }
                  }, 100);
                }
              }
              function applyOverlayBackground(
                overlay,
                overlay_container,
                ajaxReference,
                sumRef
              ) {
                if (typeof overlay === "undefined" || typeof overlay === null) {
                  return;
                }
                if (
                  typeof overlay_container === "undefined" ||
                  typeof overlay_container === null
                ) {
                  return;
                }
                if (typeof ajaxReference === "undefined") {
                  ajaxReference = false;
                }
                if (typeof sumRef === "undefined") {
                  sumRef = 0;
                }
                if (overlay.length > 0 && overlay_container.length > 0) {
                  let fSBGColor,
                    bgcolor,
                    overlayBG = overlay.find(
                      overlay_container + " .divioverlay-bg"
                    );
                  fSBGColor = overlay
                    .find(".et_pb_section:first-child")
                    .css("background-color");
                  if (
                    ajaxReference !== false &&
                    overlay.attr("data-bgcolor") === ""
                  ) {
                    if ("undefined" === typeof fSBGColor) {
                      sumRef += 1;
                      if (sumRef < 15) {
                        setTimeout(() => {
                          applyOverlayBackground(
                            overlay,
                            overlay_container,
                            ajaxReference,
                            sumRef
                          );
                        }, 100);
                      }
                    }
                  }
                  if (overlay.attr("data-bgcolor") !== "") {
                    bgcolor = overlay.attr("data-bgcolor");
                  } else if (
                    fSBGColor !== "" &&
                    fSBGColor !== "rgba(0,0,0,0.01)" &&
                    fSBGColor !== "rgba(0,0,0,0)" &&
                    "undefined" !== typeof fSBGColor
                  ) {
                    fSBGColor = fSBGColor
                      .replace(/^rgba?\(|\s+|\)$/g, "")
                      .split(",");
                    bgcolor =
                      "rgb(" +
                      fSBGColor[0] +
                      "," +
                      fSBGColor[1] +
                      "," +
                      fSBGColor[2] +
                      ")";
                  } else {
                    bgcolor = "rgba(61,61,61,0.9)";
                  }
                  if (
                    overlayBG.css("background-color") === "" ||
                    overlayBG.css("background-color") === "transparent" ||
                    overlayBG.css("background-color") === "rgba(0,0,0,0)" ||
                    overlayBG.css("background-color") === "rgb(0,0,0)" ||
                    bgcolor !== "rgb(0,0,0)"
                  ) {
                    d_addStyles(
                      overlay_container + " .divioverlay-bg",
                      "background:" + bgcolor + " ;"
                    );
                  }
                }
              }
              function overlayOpenOnAnimationEnd(
                overlay_id,
                overlay,
                overlay_content,
                animation,
                animationspeedin,
                prevent_mainpage_scroll
              ) {
                overlay_content.css(
                  "cssText",
                  "animation-duration: " + animationspeedin + "s ;"
                );
                overlay_content.addClass("animate__" + animation);
                toggleSrcInPlayableTags(overlay);
                initDiviAnimations(overlay_id);
                overlay_content.one(AnimationEnd, function (e) {
                  overlay_content.css("animation-duration", "");
                  overlay_content.removeClass("animate__" + animation);
                  overlay.removeClass("divi-overlay-opening");
                  overlays_opening[overlay_id] = false;
                  dov_initDiviElements(overlay_id);
                });
              }
              function initDiviAnimations(overlay_id) {
                let divi_animated_elements = $(
                    "#overlay-" + overlay_id + " .et-will-animate"
                  ),
                  e = divi_animated_elements;
                if ($(divi_animated_elements).length > 0) {
                  $.each(divi_animated_elements, function (elem, selector) {
                    restoreDiviAnimation($(selector));
                  });
                }
              }
              function restoreDiviAnimation(animated_element) {
                let t = window,
                  e = animated_element;
                if (!t.et_animation_data || !t.et_animation_data.length > 0) {
                  return !1;
                }
                e.addClass("et_animated"),
                  e.addClass("et-animated"),
                  e.removeClass("et-will-animate");
                for (var i = 0; i < et_animation_data.length; i += 1) {
                  let a = !1,
                    n = et_animation_data[i];
                  if (e.hasClass(et_animation_data[i].id)) {
                    et_animation_data[i].class = et_animation_data[i].id;
                  }
                }
                return !1;
              }
              function pluginsCompatibilities(overlay) {
                let slickSliders = overlay.find(".slick-slider");
                if (slickSliders.length > 0) {
                  slickSliders.slick("setPosition");
                }
                let gform_wrappers = overlay.find(".gform_wrapper");
                if (gform_wrappers.length > 0) {
                  gform_wrappers.show();
                }
              }
              function ajaxSupportGF(output, overlay_links) {
                let wpdomready,
                  wphooks,
                  a11y,
                  i18n,
                  gform_css,
                  gforms_css,
                  gform_scripts,
                  gfs = body.find('script[id^="gform_"]');
                if (gfs.length < 1) {
                  wpdomready = body.find('script[id^="wp-dom-ready-js"]');
                  if (wpdomready.length < 1) {
                    output
                      .filter('script[id^="wp-dom-ready-js"]')
                      .appendTo(overlay_links);
                  }
                  wphooks = body.find('script[id^="wp-hooks-js"]');
                  if (wphooks.length < 1) {
                    output
                      .filter('script[id^="wp-hooks-js"]')
                      .appendTo(overlay_links);
                  }
                  i18n = body.find('script[id^="wp-i18n"]');
                  if (i18n.length < 1) {
                    output
                      .filter('script[id^="wp-i18n"]')
                      .appendTo(overlay_links);
                  }
                  a11y = body.find('script[id^="wp-a11y"]');
                  if (a11y.length < 1) {
                    output
                      .filter('script[id^="wp-a11y-js"]')
                      .appendTo(overlay_links);
                  }
                  gform_css = body.find('link[id^="gform_"]');
                  if (gform_css.length < 1) {
                    output.filter('link[id^="gform_"]').appendTo(overlay_links);
                  }
                  gforms_css = body.find('link[id^="gforms_"]');
                  if (gforms_css.length < 1) {
                    output
                      .filter('link[id^="gforms_"]')
                      .appendTo(overlay_links);
                  }
                  gform_scripts = body.find('script[id^="gform_"]');
                  if (gform_scripts.length < 1) {
                    output
                      .filter('script[id^="gform_"]')
                      .appendTo(overlay_links);
                  }
                }
              }
              function d_addStyles(selector, css) {
                var CSSline,
                  CSSlines,
                  regexCSSline,
                  regex,
                  stylesTag = $("#" + d_styleTagID),
                  stylesTagContent = stylesTag.text();
                if (selector && selector !== undefined) {
                  CSSline = "body " + selector + " { " + css + " }";
                  regexCSSline = d_escapeRegExp(CSSline);
                  regex = new RegExp(regexCSSline, "g");
                  stylesTagContent = stylesTagContent.replace(regex, "");
                  stylesTag.text(stylesTagContent);
                  stylesTag.append(CSSline);
                }
              }
              function d_escapeRegExp(string) {
                return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              }
              function reassignID_etboc() {
                $(".overlay-container #et-boc").removeAttr("id");
                $(".overlay-container .entry-content").attr("id", "et-boc");
              }
              function dov_initDiviElements(overlay_id) {
                let $et_pb_circle_counter = $(
                    "#overlay-" + overlay_id + " .et_pb_circle_counter"
                  ),
                  $et_pb_number_counter = $(
                    "#overlay-" + overlay_id + " .et_pb_number_counter"
                  ),
                  $et_pb_countdown_timer = $(
                    "#overlay-" + overlay_id + " .et_pb_countdown_timer"
                  ),
                  $et_pb_tabs = $("#overlay-" + overlay_id + " .et_pb_tabs"),
                  $et_pb_map = $(
                    "#overlay-" + overlay_id + " .et_pb_map_container"
                  ),
                  $et_pb_menu = $(".et-menu-nav ul.nav"),
                  viewportWidth = $(window).width();
                setTimeout(function () {
                  window.et_fix_testimonial_inner_width(),
                    $et_pb_circle_counter.length &&
                      window.et_pb_reinit_circle_counters(
                        $et_pb_circle_counter
                      ),
                    $et_pb_number_counter.length &&
                      window.et_pb_reinit_number_counters(
                        $et_pb_number_counter
                      ),
                    $et_pb_countdown_timer.length &&
                      window.et_pb_countdown_timer_init($et_pb_countdown_timer),
                    $et_pb_tabs.length && window.et_pb_tabs_init($et_pb_tabs),
                    window.et_reinit_waypoint_modules(),
                    dov_et_pb_init_maps($et_pb_map);
                  setTimeout(function () {
                    callDOFuncs("#overlay-" + overlay_id);
                    evAddTriggerListeners();
                  }, 100);
                }, 1);
              }
              function dov_et_pb_init_maps($et_pb_map) {
                $et_pb_map.each(function () {
                  et_pb_map_init($(this));
                });
              }
              function dov_et_get_animation_classes() {
                return [
                  "et_animated",
                  "infinite",
                  "fade",
                  "fadeTop",
                  "fadeRight",
                  "fadeBottom",
                  "fadeLeft",
                  "slide",
                  "slideTop",
                  "slideRight",
                  "slideBottom",
                  "slideLeft",
                  "bounce",
                  "bounceTop",
                  "bounceRight",
                  "bounceBottom",
                  "bounceLeft",
                  "zoom",
                  "zoomTop",
                  "zoomRight",
                  "zoomBottom",
                  "zoomLeft",
                  "flip",
                  "flipTop",
                  "flipRight",
                  "flipBottom",
                  "flipLeft",
                  "fold",
                  "foldTop",
                  "foldRight",
                  "foldBottom",
                  "foldLeft",
                  "roll",
                  "rollTop",
                  "rollRight",
                  "rollBottom",
                  "rollLeft",
                ];
              }
              function dov_et_remove_animation($element) {
                var animation_classes = dov_et_get_animation_classes();
                $element.removeClass(animation_classes.join(" ")),
                  $element.removeAttr("style");
              }
              var dov_checkCursorOverDiviTabTimer = 0,
                dov_checkDiviTabElem;
              function dov_enableDiviURLLinkModules(parent) {
                "undefined" != typeof et_link_options_data &&
                  0 < et_link_options_data.length &&
                  $.each(
                    et_link_options_data,
                    function (index, link_option_entry) {
                      if (
                        link_option_entry.class &&
                        link_option_entry.url &&
                        link_option_entry.target
                      ) {
                        var $clickable = $(
                          parent + " ." + link_option_entry.class
                        );
                        $clickable.off("click");
                        $clickable.on("click", function (event) {
                          if (
                            (event.target !== event.currentTarget &&
                              !dov_et_is_click_exception($(event.target))) ||
                            event.target === event.currentTarget
                          ) {
                            if (
                              (event.stopPropagation(),
                              "_blank" === link_option_entry.target)
                            ) {
                              return void window.open(link_option_entry.url);
                            }
                            var url = link_option_entry.url;
                            url && "#" === url[0] && $(url).length
                              ? (et_pb_smooth_scroll($(url), void 0, 800),
                                history.pushState(null, "", url))
                              : (window.location = url);
                          }
                        }),
                          $clickable.on("click", "a, button", function (event) {
                            dov_et_is_click_exception($(this)) ||
                              event.stopPropagation();
                          });
                      }
                    }
                  );
              }
              function dov_et_is_click_exception($element) {
                for (
                  var is_exception = !1,
                    click_exceptions = [
                      ".et_pb_toggle_title",
                      ".mejs-container *",
                      ".et_pb_contact_field input",
                      ".et_pb_contact_field textarea",
                      ".et_pb_contact_field_checkbox *",
                      ".et_pb_contact_field_radio *",
                      ".et_pb_contact_captcha",
                      ".et_pb_tabs_controls a",
                    ],
                    i = 0;
                  i < click_exceptions.length;
                  i += 1
                ) {
                  if ($element.is(click_exceptions[i])) {
                    is_exception = !0;
                    break;
                  }
                }
                return is_exception;
              }
              function dov_enableDiviToggleHover(parent) {
                if (typeof parent === "undefined") {
                  var parent = "";
                }
                $(parent + ".et_pb_toggle").on("mouseenter", function (e) {
                  $(this).children(".et_pb_toggle_title").trigger("click");
                });
              }
              function dov_enableDiviTabHover(parent) {
                if (typeof parent === "undefined") {
                  var parent = "";
                }
                $(
                  parent +
                    ' .et_pb_tabs .et_pb_tabs_controls > [class^="et_pb_tab_"]'
                ).on("mouseenter", function (e) {
                  if (!$(this).hasClass("et_pb_tab_active")) {
                    dov_checkDiviTabElem = $(this);
                  } else {
                    dov_checkDiviTabElem = false;
                  }
                  if (dov_checkDiviTabElem !== false) {
                    dov_checkDiviTab();
                  }
                });
              }
              function dov_checkDiviTab() {
                let clickTrigger = false;
                if (
                  dov_checkDiviTabElem !== false &&
                  dov_checkDiviTabElem.is(":hover")
                ) {
                  if (dov_checkDiviTabElem) {
                    if (!dov_checkDiviTabElem.hasClass("et_pb_tab_active")) {
                      clearTimeout(dov_checkCursorOverDiviTabTimer);
                      dov_checkDiviTabElem.find("a").trigger("click");
                    }
                    if (dov_checkDiviTabElem.hasClass("et_pb_tab_active")) {
                      clickTrigger = true;
                    }
                  }
                  if (clickTrigger === false) {
                    dov_checkCursorOverDiviTabTimer = setTimeout(
                      dov_checkDiviTab,
                      150
                    );
                  }
                } else {
                  clearTimeout(dov_checkCursorOverDiviTabTimer);
                }
              }
              function callDOFuncs(parent) {
                removeMobileMenuDuplicates();
                dov_enableDiviURLLinkModules(parent);
                if (typeof diviTabsToggleHover !== "undefined") {
                  if (diviTabsToggleHover === true) {
                    dov_enableDiviTabHover(parent);
                    dov_enableDiviToggleHover(parent);
                  }
                }
              }
              function removeMobileMenuDuplicates() {
                var mobile_menu_selector = $(
                  ".et_pb_menu__wrap .et_mobile_menu"
                ).filter(":hidden");
                $(mobile_menu_selector).each(function () {
                  $('[id="' + this.id + '"]:gt(0)').remove();
                });
              }
              if (typeof diviTabsToggleHoverGlobal !== "undefined") {
                if (diviTabsToggleHoverGlobal === true) {
                  callDOFuncs();
                }
              }
              function getScrollTop() {
                if (typeof pageYOffset != "undefined") {
                  return pageYOffset;
                } else {
                  var B = document.body;
                  var D = document.documentElement;
                  D = D.clientHeight ? D : B;
                  return D.scrollTop;
                }
              }
              function showOverlay(overlay_id) {
                if (!DovisInt(overlay_id)) {
                  return;
                }
                let the_overlay = $(overlaysDetached[overlay_id]);
                the_overlay.appendTo(sidebarOverlay);
                let overlay_selector = "#overlay-" + overlay_id,
                  overlay = $(overlay_selector),
                  enableajax = overlay.data("enableajax"),
                  divi_overlay_container_selector =
                    "#divi-overlay-container-" + overlay_id;
                if (typeof enableajax === "undefined") {
                  enableajax = false;
                }
                if ($(divi_overlay_container_selector).length) {
                  if (!enableajax) {
                    toggleSrcInPlayableTags(overlay);
                  }
                  toggleOverlay(overlay_id, enableajax);
                }
              }
              function showOverlayOnce(overlay_id) {
                if (!DovisInt(overlay_id)) {
                  return;
                }
                let overlay = "#overlay-" + overlay_id;
                $(overlaysDetached[overlay_id])
                  .find(overlay)
                  .attr("data-displayonceperload", 1);
              }
              function toggleSrcInPlayableTags(str) {
                str.find("iframe").each(function () {
                  var src = $(this).data("src");
                  $(this).attr("src", src);
                });
                return str;
              }
              body.on(
                "click touch tap",
                ".overlay-close, .overlay-close span, .close-divi-overlay",
                function (e) {
                  let target = $(e.target),
                    currentTarget = $(e.currentTarget);
                  if (
                    !target.hasClass("et_pb_section") &&
                    !target.hasClass("close-divi-overlay") &&
                    !target.hasClass("overlay-close") &&
                    !currentTarget.hasClass("overlay-close")
                  ) {
                    return;
                  }
                  if (!target.hasClass("et_pb_section")) {
                    target = $(e.currentTarget);
                  }
                  let elemHasCloseClass = target.hasClass("close-divi-overlay"),
                    parentsWithCloseClass = target.parents(
                      ".close-divi-overlay"
                    ),
                    elemHasDefaultCloseClass = target.hasClass("overlay-close"),
                    parentsWithDefaultCloseClass =
                      target.parents(".overlay-close"),
                    doReturn = true;
                  if (
                    elemHasDefaultCloseClass === false &&
                    parentsWithDefaultCloseClass.length === 0
                  ) {
                    doReturn = true;
                  } else {
                    doReturn = false;
                  }
                  if (doReturn === true) {
                    if (
                      (elemHasCloseClass === false &&
                        parentsWithCloseClass.length === 0) ||
                      (elemHasCloseClass === false &&
                        parentsWithCloseClass.length > 0 &&
                        parentsWithCloseClass.is("div") === true)
                    ) {
                      doReturn = true;
                    } else {
                      doReturn = false;
                    }
                  }
                  if (doReturn === true) {
                    return;
                  }
                  closeThisOverlay(this);
                }
              );
              function closeActiveOverlay(overlay_id) {
                if ("undefined" !== overlay_id) {
                  var overlay_id = getActiveOverlay();
                }
                if (overlay_id !== null) {
                  showOverlay(overlay_id);
                }
              }
              function closeThisOverlay(element) {
                var overlay = $(element).parents(
                  ".divioverlay.divioverlay-open"
                );
                if (overlay.hasClass("divioverlay-open")) {
                  var overlay_id = parseInt(
                    overlay.attr("id").replace("overlay-", "")
                  );
                  if (typeof overlay_id === "number") {
                    showOverlay(overlay_id);
                  }
                }
              }
              function getActiveOverlay() {
                let overlay = sidebarOverlay.find(
                    ".overlay-container .divioverlay.divioverlay-open:first"
                  ),
                  overlay_id = null;
                if (overlay.length) {
                  let overlayArr = overlay.attr("id").split("-");
                  overlay_id = overlayArr[overlayArr.length - 1];
                }
                return overlay_id;
              }
              function getLastOverlayOpened() {
                let overlay_id = overlaysList[overlaysList.length - 1];
                if (typeof overlay_id !== "undefined") {
                  return overlay_id;
                } else {
                  return null;
                }
              }
              function isOpeningOverlay(overlay_id) {
                if (!overlay_id) {
                  return null;
                }
                var overlay = $("#overlay-" + overlay_id);
                if ($(overlay).css("opacity") < 1) {
                  return true;
                }
                return false;
              }
              function isClosingOverlay(overlay_id) {
                if (!overlay_id) {
                  return null;
                }
                var overlay = $("#overlay-" + overlay_id);
                if ($(overlay).hasClass("close")) {
                  return false;
                }
                return true;
              }
              function isActiveOverlay(overlay_id) {
                if (!overlay_id) {
                  var overlay = $(".divioverlay.divioverlay-open");
                } else {
                  var overlay = $("#overlay-" + overlay_id);
                }
                if ($(overlay).hasClass("divioverlay-open")) {
                  return true;
                }
                return false;
              }
              function doCreateCookie(name, value, days) {
                var expires = "";
                if (days) {
                  var date = new Date();
                  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
                  expires = "; expires=" + date.toUTCString();
                }
                document.cookie =
                  name + "=" + value + expires + "; path=/; SameSite=Lax;";
              }
              function doReadCookie(name) {
                var nameEQ = name + "=";
                var ca = document.cookie.split(";");
                for (var i = 0; i < ca.length; i += 1) {
                  var c = ca[i];
                  while (c.charAt(0) == " ") {
                    c = c.substring(1, c.length);
                  }
                  if (c.indexOf(nameEQ) == 0) {
                    return c.substring(nameEQ.length, c.length);
                  }
                }
                return null;
              }
              function doEraseCookie(name) {
                doCreateCookie(name, "", -1);
              }
              function isDiviMobile() {
                diviMobile = false;
                if ($("body").hasClass("et_mobile_device")) {
                  diviMobile = true;
                }
                return diviMobile;
              }
            }
            function detectTheme() {
              let currentTheme = "Divi";
              if (diviBodyElem.hasClass("et_extra")) {
                currentTheme = "Extra";
              }
              return currentTheme;
            }
          };
          var $doviframes = $("#sidebar-overlay .overlay iframe");
          setTimeout(function () {
            $doviframes.each(function () {
              var iframeHeight = this.height;
              if (iframeHeight == "") {
                iframeHeight = $(this).height();
              }
              var iframeWidth = this.width;
              if (iframeWidth == "") {
                iframeWidth = $(this).width();
              }
              iframeHeight = parseInt(iframeHeight);
              iframeWidth = parseInt(iframeWidth);
              var ratio = iframeHeight / iframeWidth;
              $(this)
                .attr("data-ratio", ratio)
                .removeAttr("width")
                .removeAttr("height");
              var width = $(this).parent().width();
              $(this)
                .width(width)
                .height(width * ratio);
            });
          }, 200);
          $(window).on("resize orientationchange", function () {
            $doviframes.each(function () {
              var width = $(this).parent().width();
              $(this)
                .width(width)
                .height(width * $(this).data("ratio"));
            });
          });
          pagecontainer.prepend(sidebarOverlay);
          function resetAnimatedElems() {
            let divi_animated_elements = $(".divioverlay .et_animated"),
              e = divi_animated_elements;
            if ($(divi_animated_elements).length > 0) {
              $.each(divi_animated_elements, function (elem, selector) {
                saveDiviAnimation($(selector));
              });
            }
          }
          function saveDiviAnimation(animated_element) {
            let t = window,
              e = animated_element;
            if (!t.et_animation_data || !t.et_animation_data.length > 0) {
              return !1;
            }
            e.removeClass("et-waypoint"), e.removeClass("et-animated");
            for (var i = 0; i < et_animation_data.length; i += 1) {
              let a = !1,
                n = et_animation_data[i];
              if (
                n &&
                n.class &&
                e.hasClass(n.class) &&
                n.style &&
                n.repeat &&
                n.duration &&
                n.delay &&
                n.intensity &&
                n.starting_opacity &&
                n.speed_curve
              ) {
                return (
                  (a = n.class),
                  e.addClass("et-will-animate"),
                  e.attr("data-animation", a),
                  (et_animation_data[i].id = et_animation_data[i].class),
                  (et_animation_data[i].class = void 0),
                  !0
                );
              }
            }
            return !1;
          }
          resetAnimatedElems();
          sidebarOverlay.mainDiviOverlays();
        })(jQuery, window, document);
      }, delayDiviOverlaysInit);
      clearInterval(dov_nTimer);
    }
  }, 50);
})();
function DovisInt(value) {
  var x;
  return isNaN(value) ? !1 : ((x = parseFloat(value)), (0 | x) === x);
}
