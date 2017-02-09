var escape = require('escape-html');

/*
    Generate HTML for the tab in the header

    @param {Block}
    @param {Boolean}
    @return {String}
*/
function createTab(block, i, isActive) {
    return '<div class="tab' + (isActive? ' active' : '') + '" data-tab="' + i + '">' + block.kwargs.name + '</div>';
}

/*
    Generate HTML for the tab's content

    @param {Block}
    @param {Boolean}
    @return {String}
*/
function createTabBody(block, i, isActive) {
    if(block.kwargs.type == "text"){
        return '<div class="tab' + (isActive? ' active' : '') + '" data-tab="' + i + '">' + block.body + '</div>';
    }else{
        return '<div class="tab' + (isActive? ' active' : '') + '" data-tab="' + i + '"><pre><code class="lang-' + (block.kwargs.type || block.kwargs.name) + '">'
            + escape(block.body) +
        '</code></pre></div>';
    }
}

module.exports = {
    book: {
        assets: './assets',
        css: [
            'tabs.css'
        ],
        js: [
            'tabs.js'
        ]
    },

    blocks: {
        tabs: {
            blocks: ['tab'],
            process: function(parentBlock) {
                var blocks = [parentBlock].concat(parentBlock.blocks);
                var tabsContent = '';
                var tabsHeader = '';

                blocks.forEach(function(block, i) {
                    var isActive = (i == 0);

                    if (!block.kwargs.name) {
                        throw new Error('Tab requires a "name" property');
                    }
                    
                    if (!block.kwargs.type) {
                        block.kwargs.type=block.kwargs.name;
                    }

                    tabsHeader += createTab(block, i, isActive);
                    tabsContent += createTabBody(block, i, isActive);
                });


                return '<div class="tabs">' +
                    '<div class="tabs-header">' + tabsHeader + '</div>' +
                    '<div class="tabs-body">' + tabsContent + '</div>' +
                '</div>';
            }
        }
    }
};
