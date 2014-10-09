# PLP App: Editor

HTML5 app providing human interface to create and edit [Portable Linked
Profiles](https://github.com/hackers4peace/plp-docs) + listing them in [PLP
Directory](https://github.com/hackers4peace/plp-directory)

## About

PLP Editors are apps which allows the user to create or update PLPs, and
manage listings in Directories. For broader overview see [PLP
Docs](https://github.com/hackers4peace/plp-docs)

They interface with:

* [PLP Provider](https://github.com/hackers4peace/plp-provider) - operations on profile itself
 * [ ] create
 * [ ] read
 * [ ] update
 * [ ] delete
* [PLP Directory](https://github.com/hackers4peace/plp-directory) - operations on listings of profiles
 * [ ] create
 * [ ] read
 * [ ] update
 * [ ] delete

## Setup

```bash
$ cp config.example.js config.js
```

edit *config.js* to specify your default services (provider and
directory)

```bash
$ bower install
```

## Development

You need to serve it using some simple http server, for example
[serve](http://npm.im/serve) or from root of this repo:

```shell
$ python -m SimpleHTTPServer
```




## Unlicense

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
