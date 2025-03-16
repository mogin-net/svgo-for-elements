# svgo-for-elements

## Usage

Selecting menu items or hitting keys is out of fashion. SVGO Compressor will compress your SVG assets whenever you export them, without you having to do anything.

You’ll get a message on your document window to let you know the compression worked as expected.

If you need uncompressed SVG assets, you can temporarily disable the Plugin by opening Sketch’s **Preferences › Plugins** and unchecking 'SVGO Compressor'. Or you can right-click any layer and select **Copy SVG Code**, and that will give you the original, uncompressed code.

## Custom SVGO configuration

SVGO Compressor uses a default configuration that does a reasonable job of compressing SVG code, while maintaining compatibility and avoiding rendering issues. If you need to change the defaults, you can do so by creating an `svgo.config.js` file in Sketch's `Plugins` directory (located by default in `~/Library/Application\ Support/com.bohemiancoding.sketch3/Plugins/`).

For a complete reference of what your SVGO config should look like, see [SVGO’s configuration documentation](https://github.com/svg/svgo#configuration).

Any option that is not set on your custom configuration will use the defaults set by SVGO Compressor. For example, here's how a sample configuration to output unminified code could look like:

```javascript
module.exports = {
  js2svg: {
    indent: 2,
    pretty: true,
  },
};
```

Keep in mind that our defaults do not match the ones in SVGO 100%. If you use the `preset-default` option in SVGO your results may vary from the ones this plugin exports. For the record, here's the default configuration we use:

```
{
  path: currentFile, // This is the path to the currently exported SVG asset
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          inlineStyles: false,
          convertStyleToAttrs: true,
          cleanupListOfValues: true,
          removeViewBox: false,
          cleanupEnableBackground: false,
          removeHiddenElems: false,
          convertShapeToPath: false,
          moveElemsAttrsToGroup: false,
          moveGroupAttrsToElems: false,
          convertPathData: false,
          sortAttrs: true,
        }
      }
    }
  ],
}
```

Again, for more information about custom configurations please refer to SVGO's own documentation. Please note that the custom plugins feature is untested in SVGO Compressor, so it may or may not work.

## Installation

- [Download](../../releases/latest/download/svgo-for-elements.sketchplugin.zip) the latest release of the plugin
- Un-zip
- Double-click on svgo-for-elements.sketchplugin

## Development Guide

_This plugin was created using `skpm`. For a detailed explanation on how things work, checkout the [skpm Readme](https://github.com/skpm/skpm/blob/master/README.md)._

Install the dependencies

```bash
npm install
```

Once the installation is done, you can run some commands inside the project folder:

```bash
npm run build
```

To watch for changes:

```bash
npm run watch
```

Additionally, if you wish to run the plugin every time it is built:

```bash
npm run start
```

### Custom Configuration

#### Babel

To customize Babel, you have two options:

- You may create a [`.babelrc`](https://babeljs.io/docs/usage/babelrc) file in your project's root directory. Any settings you define here will overwrite matching config-keys within skpm preset. For example, if you pass a "presets" object, it will replace & reset all Babel presets that skpm defaults to.

- If you'd like to modify or add to the existing Babel config, you must use a `webpack.skpm.config.js` file. Visit the [Webpack](#webpack) section for more info.

#### Webpack

To customize webpack create `webpack.skpm.config.js` file which exports function that will change webpack's config.

```js
/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config - original webpack config.
 * @param {boolean} isPluginCommand - whether the config is for a plugin command or a resource
 **/
module.exports = function (config, isPluginCommand) {
  /** you can change config here **/
};
```

### Debugging

To view the output of your `console.log`, you have a few different options:

- Use the [`sketch-dev-tools`](https://github.com/skpm/sketch-dev-tools)
- Run `skpm log` in your Terminal, with the optional `-f` argument (`skpm log -f`) which causes `skpm log` to not stop when the end of logs is reached, but rather to wait for additional data to be appended to the input

### Publishing your plugin

```bash
skpm publish <bump>
```

(where `bump` can be `patch`, `minor` or `major`)

`skpm publish` will create a new release on your GitHub repository and create an appcast file in order for Sketch users to be notified of the update.

You will need to specify a `repository` in the `package.json`:

```diff
...
+ "repository" : {
+   "type": "git",
+   "url": "git+https://github.com/ORG/NAME.git"
+  }
...
```

## Acknowledgements

I would like to thank:

- The [SVGO project](https://github.com/svg/svgo), for creating the golden standard for SVG compression.
- [Andrey Shakhmin](https://github.com/turbobabr), for his inspiration during the [Hamburg Hackathon](http://designtoolshackday.com), where he showed us how to use node modules inside Sketch.
- [Sketch App](https://github.com/sketch-hq/svgo-compressor), for the original code of this plugin.
- [Realmac Software](https://www.realmacsoftware.com/), for developing Elements.
