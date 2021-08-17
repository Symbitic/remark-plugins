# Remark Plugins

[![CI/CD Status](https://github.com/Symbitic/remark-plugins/workflows/main/badge.svg)](https://github.com/Symbitic/remark-plugins/actions)
[![MIT License](https://img.shields.io/github/license/Symbitic/remark-plugins)](https://github.com/Symbitic/remark-plugins/blob/master/LICENSE.md)
[![stars](https://img.shields.io/github/stars/Symbitic/remark-plugins.svg)](https://github.com/Symbitic/remark-plugins)

This is a collection of [**remark**](https://remark.js.org) plugins that were developed as part of my other project: [Markbook](https://github.com/Symbitic/markbook)

Feel free to contribute by submitting pull requests. Just make sure you follow the [Code of Conduct](CODE_OF_CONDUCT.md) and your submissions include unit tests.

[![BuyMeACoffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoff.ee/qh0rXkiCd)

## Packages

* [**remark-bibliography**](packages/remark-bibliography/README.md)

  Adds support for citations syntax and references using an external bibliography. Supports BibJSON and Chicago-style citations. Requires `remark-meta`.

* [**remark-deflist**](packages/remark-deflist/README.md)

  Adds support for pandoc-style definition lists syntax.

* [**remark-meta**](packages/remark-meta/README.md)

  Add YAML/TOML metadata to a VFile during processing. Requires [remark-frontmatter](https://npmjs.com/package/remark-frontmatter).

* [**remark-redirect**](packages/remark-redirect/README.md)

  Changes links that refer to `.md` so that they will refer to `.html` instead (useful for rendering multiple files). Also changes links to `README.md` into `index.html`

* [**remark-supersub**](packages/remark-supersub/README.md)

  Add support for Subscript and Superscript syntax.

## License

[MIT](LICENSE.md) &copy; Alex Shaw
