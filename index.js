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
function createTabBody(block, i, isActive, book) {
 
    if(block.kwargs.type == "text" || block.kwargs.type == "asciidoc"){
        return new Promise((resolve,reject) => {
                book.renderBlock( 'asciidoc' , block.body )
                    .then(function(rendered){ 
                         resolve( '<div class="tab' + (isActive? ' active' : '') + '" data-tab="' + i + '">' + rendered + '</div>' , i);
                });
        });
    }else if(block.kwargs.type == "markdown"){
        return new Promise((resolve,reject) => {
                book.renderBlock( 'markdown' , block.body )
                    .then(function(rendered){ 
                         resolve( '<div class="tab' + (isActive? ' active' : '') + '" data-tab="' + i + '">' + rendered + '</div>' , i);
                });
        });        
    }else{
        return new Promise((resolve,reject) => {
            resolve( 
               '<div class="tab' + (isActive? ' active' : '') + '" data-tab="' + i + '"><pre><code class="lang-' + (block.kwargs.type || block.kwargs.name) + '">'
                  + escape(block.body) + '</code></pre></div>', i );
        });
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
            process: new Promise((resolve,reject) => {
                var blocks = [parentBlock].concat(parentBlock.blocks);
                var tabsContent = [];
                var tabsHeader = [];
                var book = this;
                var counter = blocks.length;

                blocks.forEach(function(block, i) {
                    var isActive = (i == 0);

                    if (!block.kwargs.name) {
                        throw new Error('Tab requires a "name" property');
                    }
                    
                    if (!block.kwargs.type) {
                        block.kwargs.type=block.kwargs.name;
                    }

                    tabsHeader[i] = createTab(block, i, isActive);
                    createTabBody(block, i, isActive, book).then(function(tabBody, x){
                        tabsContent[x] = tabBody;
                        if( --counter == 0) {                            
                            var tabContentText = '';
                            tabsContent.forEach(function(tab) {
                                tabContentText += tab;
                            });
                            var tabHeaderText = '';
                            tabsHeader.forEach(function(header) {
                                tabHeaderText += header;
                            });

                            resolve('<div class="tabs">' +
                                    '<div class="tabs-header">' + tabsHeaderText + '</div>' +
                                    '<div class="tabs-body">' + tabContentText+ '</div>' +
                                     '</div>');
                        }
                    });
                });

            })
        }
    }
};
