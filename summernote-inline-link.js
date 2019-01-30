(function (factory) {
  if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
      module.exports = factory(require('jquery'));
  } else {
      factory(window.jQuery);
  }
}(function ($) {
  $.extend($.summernote.plugins, {
      'emoji': function (context) {
          var self = this;
          var ui = $.summernote.ui;

          /*IE polyfill*/
          if (!Array.prototype.filter) {
              Array.prototype.filter = function (fun /*, thisp*/) {
                  var len = this.length >>> 0;
                  if (typeof fun != "function")
                      throw new TypeError();

                  var res = [];
                  var thisp = arguments[1];
                  for (var i = 0; i < len; i++) {
                      if (i in this) {
                          var val = this[i];
                          if (fun.call(thisp, val, i, this))
                              res.push(val);
                      }
                  }
                  return res;
              };
          }

          var addListener = function () {
              $('body').on('click', '#emoji-filter', function (e) {
                  e.stopPropagation();
                  $('#emoji-filter').focus();
              });
              $('body').on('keyup', '#emoji-filter', function (e) {
                  var filteredList = filterEmoji($(e.currentTarget).val());
                  $("#emoji-dropdown .emoji-list").html(filteredList);
              });
              $(document).on('focus', '.note-editor', function(){
                  self.$panel.fadeOut('500');
              });
          };

          var render = function () {
              var render = '<p> Test </p>'
              return render;
          };

          var filterEmoji = function (value) {
              var filtered = emojis.filter(function (el) {
                  return el.indexOf(value) > -1;
              });
              return render(filtered);
          };

          // add emoji button
          context.memo('button.emoji', function () {
              // create button
              var button = ui.button({
                  contents: 'Inline Links',
                  tooltip: 'Inline links',
                  click: function () {
                    var richTextPopover = $('.popover-content');
                    var left = richTextPopover.offset().left;
                    var top = richTextPopover.offset().top;
                    self.$panel.css('left', left);
                    self.$panel.css('top', (top + richTextPopover.height()) + 'px');
                    self.$panel.show();
                  }
              });

              // create jQuery object from button instance.
              var $emoji = button.render();
              return $emoji;
          });

          // This events will be attached when editor is initialized.
          this.events = {
              // This will be called after modules are initialized.
              'summernote.init': function (we, e) {
                  addListener();
              },
              // This will be called when user releases a key on editable.
              'summernote.keyup': function (we, e) {
              }
          };

          // This method will be called when editor is initialized by $('..').summernote();
          // You can create elements for plugin
          this.initialize = function () {
              this.$panel = $('<div class="dropdown-menu dropdown-keep-open emoji-dialog animated fadeInUp" id="emoji-dropdown">' +
              '<div class="row m-0-l m-0-r">' +
                  '<div class="col-md-12">' +
                      '<p class="m-0-t">Inline Links <i class="fa fa-times pull-right cursor-pointer closeEmoji"></i></p>' +
                      '<input type="text" class="form-control" placeholder="Zoek naar jouw emotie!" id="emoji-filter"/>' +
                      '<br/>' +
                  '</div>' +
              '</div>' +
              '<div>' +
              render() +
              '</div>' +
              '</div>').hide();

              this.$panel.appendTo('body');
          };

          this.destroy = function () {
              this.$panel.fadeOut('500', function(){
                 $this.$panel.remove(); 
              });
              this.$panel = null;
          };
      }
  });
}));