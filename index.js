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
    if(block.kwargs.type == "asciidoc"){        
        return new Promise((resolve,reject) => {
                book.renderBlock( 'asciidoc' , block.body )
                    .then(function(rendered){ 
                         resolve( '<div class="tab' + (isActive? ' active' : '') + '" data-tab="' + i + '">' + rendered + '</div>' );
                });
        });
    }else if(block.kwargs.type == "markdown"){
        return new Promise((resolve,reject) => {
                book.renderBlock( 'markdown' , block.body )
                    .then(function(rendered){ 
                         resolve( '<div class="tab' + (isActive? ' active' : '') + '" data-tab="' + i + '">' + rendered + '</div>' );
                });
        });        
    }else{
        if(block.kwargs.linenumbers == 'yes'){
            
            return new Promise((resolve,reject) => {          

                var start = 0;
                
                if(block.kwargs.startnumber){
                    start = parseInt(block.kwargs.startnumber,10);
                }
                
                var bodyText = escape(block.body);
                var lines = bodyText.split('\n');       
                
// using tables..          
//                var resultText = '<pre><table><tbody>';                
//                 for(var line = 0; line < lines.length; line++){          
//                       resultText += '<tr class="codeline"  style="background-color:rgb(248,248,248);">'
//                                   + '<td class="codecell" style="text-align:right; padding-top:2px; padding-bottom:2px;" data-line-number="'+(line+start)+'">'
//                                   + '</td><td style="text-align:left; padding-top:2px; padding-bottom:2px;">'
//                                   + '<code class="lang-' + (block.kwargs.type || block.kwargs.name) + '">'
//                                   + (lines[line]) 
//                                   + '</code></td></tr>';                    
//                 }
//                resultText+='</tbody></table></pre>';           
                
                
// using spans..                 
                var resultText = '<div class="codetabblock" startnumber="'+start+'"><pre>';                                
                for(var line = 0; line < lines.length; line++){
                    resultText += '<span class="codetabline">'
                                + '<code class="lang-' + (block.kwargs.type || block.kwargs.name) + '">'
                                + (lines[line]) 
                                + '</code>'                    
                                + '</span>';
                }
                resultText += '</pre></div>';
                

                resultText = '<div class="tab' + (isActive? ' active' : '') + '" data-tab="' + i + '">'+resultText+'</div>';                
                resolve(resultText);
                
            });
               
        }else{
            return new Promise((resolve,reject) => {
                resolve(             
                   '<div class="tab' + (isActive? ' active' : '') + '" data-tab="' + i + '"><pre><code class="lang-' + (block.kwargs.type || block.kwargs.name) + '">'
                      + escape(block.body) + '</code></pre></div>' );
            });
        }
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
                
                var promise = new Promise((resolve,reject) => {
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
                        
                        if (!block.kwargs.linenumbers) {
                            block.kwargs.linenumbers = 'no';
                        }

                        console.log("Processing "+i+" -> "+block.kwargs.name+" :: "+block.kwargs.type);

                        tabsHeader[i] = createTab(block, i, isActive);
                        createTabBody(block, i, isActive, book).then(function(tabBody){
                            tabsContent[i] = tabBody;
                            console.log("Tab "+i+" has completed.. counter is now "+counter);
                            console.log("tabsContent.length: "+tabsContent.length);
                            if( --counter == 0) {                           

                                var tabContentText = '';
                                tabsContent.forEach(function(tab) {
                                    tabContentText += tab;                                
                                });

                                var tabHeaderText = '';
                                tabsHeader.forEach(function(header) {
                                    tabHeaderText += header;
                                });

                                console.log("Resolving final aggregate tab content promise..");
                                resolve('<div class="tabs">' +
                                        '<div class="tabs-header">' + tabHeaderText + '</div>' +
                                        '<div class="tabs-body">' + tabContentText + '</div>' +
                                         '</div>');
                            }
                        });
                    });

                });
                return promise;
            }
        }
    }
};
