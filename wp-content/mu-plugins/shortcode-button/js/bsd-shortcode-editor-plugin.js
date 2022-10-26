/**
* TinyMCE plugin to add a dropdown list of shortcodes to the editor
*/

(function($) {
  if (typeof window.tinymce_shortcodes !== 'undefined') {
    var sc = window.tinymce_shortcodes,
        shortcodeKeys = [], shortcodeValues = [];

    var i = 0;

    $.each(sc, function(index, value) {
      shortcodeKeys[i] = {text:index, value:i};

      shortcodeValues[i] = value;

      i++;
    });

    tinymce.PluginManager.add('bsd_shortcode', function(editor) {
      editor.addButton('bsd_shortcode', {
        type: 'listbox',
        text: 'Short-codes',
        onselect: function(e) {
          var v = e.control.settings.value;

          tinyMCE.activeEditor.selection.setContent(shortcodeValues[v]);
        },
        values: shortcodeKeys
      });
    });
  } else {
    console.error('No shortcode list found');
  }
})(jQuery);