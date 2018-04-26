var escape = require('escape-html');


function alphanumeric(input) {
    return input.replace(/[^a-zA-Z0-9\-@]/g, '');
}

function wrapInTab(isActive, block, contents) {
    const safeName = alphanumeric(block.kwargs.name),
        safeOptionSet = alphanumeric(block.kwargs.optionSet);

    return '<div class="tab' + (isActive ? ' active' : '') + '" ' +
        'tab-name="' + safeName + '" ' +
        'option-set="' + safeOptionSet + '"' +
        '>' + contents + '</div>';
}

function createTabHeader(block, isActive) {
    return wrapInTab(isActive, block, block.kwargs.name);
}

async function createTabBody(block, isActive, book) {
    if (block.kwargs.type == "markdown") {
        return wrapInTab(
            isActive,
            block,
            await book.renderBlock('markdown', block.body
        ));
    }
    else {
        const content =
            '<pre>' +
                '<code class="lang-' + block.kwargs.name + '">' +
                escape(block.body) +
                '</code>' +
            '</pre>';
        return wrapInTab(isActive, block, content);
    }
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
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
            process: async function (parentBlock) {
                const book = this;
                // optionSet is used to sort tab groups that use the same set of options.
                // This will let us change the active tab for all of the tab groups using
                // the same optionSet by clicking any of them.
                // If an optionSet is not provided for this group of tabs, then create a GUID to
                // ensure that no other optionSet will alter the active tab for this tab group
                const optionSet = parentBlock.kwargs.optionSet || '@' + guid();
                const blocks = [parentBlock].concat(parentBlock.blocks);
                let tabsContent = "",
                    tabsHeader = "",
                    active = true;

                for (let block of blocks) {
                    block.kwargs.optionSet = optionSet;

                    if (!block.kwargs.name) {
                        throw new Error('Tab requires a "name" property');
                    }

                    if (!block.kwargs.type) {
                        block.kwargs.type = block.kwargs.name;
                    }

                    tabsHeader += createTabHeader(block, active);
                    tabsContent += await createTabBody(block, active, book);
                    active = false;
                };

                return '<div class="tabs">' +
                '<div class="tabs-header">' + tabsHeader + '</div>' +
                '<div class="tabs-body">' + tabsContent + '</div>' +
                '</div>';
            }
        }
    }
};
