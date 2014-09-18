plp-editor
============

Portable Linked Profile Editor. This repo will host definitions and implementations for Editors working with PLP 

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
