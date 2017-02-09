# tabs

Include multiple tabbed blocks to your GitBook (for example when documenting an API).

![Preview](./preview.png)

### Installation

Adds the plugin to your `book.json`, then run `gitbook install` if you are building your book locally.

```js
{
    "plugins": ["codetabs@git+https://github.com/gameontext/plugin-codetabs.git#1.0.1"]
}
```

### Usage

```md

This is a code block with tabs for each languages:

{% tabs name="Fish", type="text" -%}
msg = "Hello World"
print msg
{%- tab name="JavaScript", type="js" -%}
var msg = "Hello World";
console.log(msg);
{%- tab name="HTML", type="html" -%}
<b>Hello World</b>
{%- endtabs %}
```

### Escaping templating syntax

For languages using syntax like `{{`, `{%`; we have to escape these content:


```md
Here is some angular and react code

{% tabs name="Python", type="py" -%}
    {% raw %}
    <h1>Hello {{yourName}}!</h1>
    {% endraw %}
{%- language name="React", type="js" -%}
var React = require('react')
{%- endtabs %}
```



