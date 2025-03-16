import sketch from 'sketch';
import settings from 'sketch/settings';
import fs from '@skpm/fs';
import UI from 'sketch/ui';
import { optimize } from 'svgo';

import { ConfigOptions, Settings } from './const';

export function about() {
  const setting =
    settings.settingForKey(Settings.ExportSetting) || ConfigOptions.Disabled;
  const prettify = !!settings.settingForKey(Settings.Prettify);
  const removeDimensions = !!settings.settingForKey(Settings.RemoveDimensions);
  const config = `Plugin: ${setting}\nOutput: ${
    prettify ? 'Prettyfied' : 'Minified'
  }\nDimensions: ${removeDimensions ? 'Removed' : 'Original'}`;
  sketch.UI.alert(
    'About SVGO Compressor for Elements',
    `This Plugin uses SVGO to compress SVG assets exported from Sketch.\n\n${config}\n\n\nIt works automatically whenever you export to SVG, so you don’t need to do anything special. Just work on your design as always, and enjoy smaller & cleaner SVG files.`
  );
}

function getDefaultConfig(extra = []) {
  return {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            inlineStyles: false,
            removeViewBox: false,
            cleanupEnableBackground: false,
            removeHiddenElems: false,
            convertShapeToPath: false,
            moveElemsAttrsToGroup: false,
            moveGroupAttrsToElems: false,
            convertPathData: false,
          },
        },
      },
      'convertStyleToAttrs',
      'cleanupListOfValues',
      'sortAttrs',
      ...extra,
    ],
  };
}

function getRemoveDimensionsConfig() {
  const removeDim = !!settings.settingForKey(Settings.RemoveDimensions);
  if (removeDim) {
    return [
      {
        name: 'removeDimensions',
      },
    ];
  }
  return [];
}

function getPrettyfiedConfig() {
  const isPretty = !!settings.settingForKey(Settings.Prettify);
  if (isPretty) {
    return {
      js2svg: {
        indent: 2,
        pretty: true,
      },
    };
  }
  return {};
}

function getSvgoConfig() {
  const exportSettings =
    settings.settingForKey(Settings.ExportSetting) || ConfigOptions.Disabled;
  switch (exportSettings) {
    case ConfigOptions.Default:
      return {
        ...getPrettyfiedConfig(),
        ...getDefaultConfig([...getRemoveDimensionsConfig()]),
      };
    case ConfigOptions.Custom:
      return { ...getDefaultConfig(), ...getExternalConfig() };
    case ConfigOptions.CurrentColor:
      return {
        ...getPrettyfiedConfig(),
        ...getDefaultConfig([
          ...getRemoveDimensionsConfig(),
          {
            name: 'convertColors',
            params: {
              currentColor: true,
            },
          },
        ]),
      };
  }
}

function getExternalConfig() {
  const homeDir = NSHomeDirectory();
  const configFile =
    homeDir +
    '/Library/Application Support/com.bohemiancoding.sketch3/Plugins/svgo.config.js';
  let externalConfig = {};
  if (fs.existsSync(configFile)) {
    try {
      externalConfig = eval(fs.readFileSync(configFile, 'utf8'));
    } catch (error) {
      console.log('Error: ' + error.message);
    }
  }
}

export function compress(context) {
  const exports = context.actionContext.exports;
  let filesToCompress = 0;
  const exportSettings =
    settings.settingForKey('exportSetting') || ConfigOptions.Disabled;
  exports.forEach((currentExport) => {
    if (currentExport.request.format() == 'svg') {
      filesToCompress++;
      if (exportSettings == ConfigOptions.Disabled) {
        return;
      }
      let currentFile;
      currentFile = currentExport.path;
      if (currentExport.path.path !== undefined) {
        currentFile = currentExport.path.path();
      }
      const svgString = fs.readFileSync(currentFile, 'utf8');
      const config = { path: currentFile, ...getSvgoConfig() };
      const result = optimize(svgString, config);
      fs.writeFileSync(currentFile, result.data, 'utf8');
    }
  });
  if (filesToCompress > 0) {
    UI.message(
      `SVGO Compressor: ${filesToCompress} file${
        filesToCompress == 1 ? '' : 's'
      } compressed with: ${exportSettings}`
    );
  }
}
