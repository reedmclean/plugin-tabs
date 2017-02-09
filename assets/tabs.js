require([
    'jquery'
], function($) {
    $(document).on('click.plugin.tabs', '.tabs .tabs-header .tab', function(e) {
        var $btn = $(e.target);
        var $tabs = $btn.parents('.tabs');
        var tabId = $btn.data('tab');

        $tabs.find('.tab').removeClass('active');
        $tabs.find('.tab[data-tab="' + tabId + '"]').addClass('active');
    });
});
