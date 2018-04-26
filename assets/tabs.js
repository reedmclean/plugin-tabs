require([
    'gitbook',
    'jquery'
],
    function () {
        function tabsWithAnyOptionSet() {
            return $('.tab[option-set]');
        }

        function setOptionSetInactive(optionSet) {
            return $('.tab[option-set="' + optionSet + '"]').removeClass('active');
        }

        function setOptionNameTabsActive(optionSet, tabName) {
            return $('.tab[tab-name="' + tabName + '"][option-set="' + optionSet + '"]').addClass('active');
        }

        function setActiveTabForOptionSet(optionSet, tabName) {
            setOptionSetInactive(optionSet);
            setOptionNameTabsActive(optionSet, tabName);
        }

        $(document).on('click.plugin.tabs', '.tabs .tabs-header .tab', (e) => {
            const $btn = $(e.target);
            const tabName = $btn.attr('tab-name');
            const optionSet = $btn.attr('option-set');

            setActiveTabForOptionSet(optionSet, tabName);

            // Only GUID option sets will contain "-", since we clean out all
            // non-alphanumeric characters from option set name when building the tab groups
            if (!optionSet.startsWith("@")) {
                // Since this is a manually specified optionSet, store it so we can load it 
                // the next time they come to the page.
                localStorage.setItem(optionSet + 'ActiveTab', tabName);
            }
        });

        gitbook.events.bind('page.change', () => {
            const tabsWithOptions = tabsWithAnyOptionSet(),
                allOptionSets = [],
                previouslySeenOption = {};

            tabsWithOptions.each(function() {
                const optionSet = $(this).attr("option-set");
                if (! previouslySeenOption.hasOwnProperty(optionSet) &&
                    ! optionSet.startsWith("@"))
                {
                    previouslySeenOption[optionSet] = true;
                    const activeTab = localStorage.getItem(optionSet + 'ActiveTab');

                    if (activeTab) {
                        setActiveTabForOptionSet(optionSet, activeTab);
                    }
                }
            });
        });
    });
