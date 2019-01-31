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

          var parentNode;
          var range;
          var selection;
          var selectionText;

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
              $(document).on('focus', '.note-editor', function(){
                  self.$panel.hide();
                  $('.inline-link-input').val('');
              });
              $(document).on('click', '.save', function (e) {
                  if ($(parentNode).parents().is('.note-editable') || $(parentNode).is('.note-editable')) {
                      var anchorTag = document.createElement('a');
                      anchorTag.innerHTML = selectionText;
                      anchorTag.href = $('.inline-link-input').val();

                      range.deleteContents();
                      range.insertNode(anchorTag);
                      //cursor at the last with this
                      range.collapse(false);
                      selection.removeAllRanges();
                      selection.addRange(range);
                  } else {
                      return;
                  }
                  
              });
          };

          var render = function () {
              var render = 
                '<p> Inline link </p>' + 
                '<div class="row m-0-l m-0-r">' +
                  '<div class="col-md-12">' +
                  '<input type="text" ' +
                        'class="form-control inline-link-input" placeholder="https://www.ibm.com" ' +
                        'id="emoji-filter"/>' +
                  '<br/>' +
                  '<p class="save">Save</p>'
                  '</div>' +
                '</div>';
              return render;
          };

          // add emoji button
          context.memo('button.emoji', function () {
              // create button
              var button = ui.button({
                  contents: '<span id="btn-inline-link">Inline Links</span>',
                  click: function () {
                    var inLineLinkInput = $('.inline-link-input');
                    selection = window.getSelection();

                    if (selection.baseNode.parentNode.nodeName === 'A') {
                        var currentAnchorLinkHref = selection.baseNode.parentNode.href;
                        inLineLinkInput.val(currentAnchorLinkHref);
                    } else {
                        inLineLinkInput.val('');
                    }

                    // Get current selected text, range and parentNode and store as fields
                    selectionText = selection.toString();
                    range = selection.getRangeAt(0);
                    parentNode = range.commonAncestorContainer.parentNode;

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
          };

          // This method will be called when editor is initialized by $('..').summernote();
          // You can create elements for plugin
          this.initialize = function () {
              this.$panel = $('<div class="dropdown-menu dropdown-keep-open emoji-dialog animated fadeInUp" id="emoji-dropdown">' +
              '<div>' +
              render() +
              '</div>' +
              '</div>').hide();

              this.$panel.appendTo('body');
          };

          this.destroy = function () {
              this.$panel.hide();
              this.$panel.remove();
              this.$panel = null;
          };
      }
  });
}));