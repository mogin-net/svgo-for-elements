import sketch from 'sketch';
import settings from 'sketch/settings';
import UI from 'sketch/ui';
import { ConfigOptions, Settings } from './const';

export function configPrettify() {
  const val = !settings.settingForKey(Settings.Prettify);
  settings.setSettingForKey(Settings.Prettify, val);
  sketch.UI.message(`Output: ${val ? 'Prettyfied' : 'Minified'}`);
}

export function configRemoveDimensions() {
  const val = !settings.settingForKey(Settings.RemoveDimensions);
  settings.setSettingForKey(Settings.RemoveDimensions, val);
  sketch.UI.message(`Dimensions: ${val ? 'Removed' : 'Original'}`);
}

export function configuration() {
  const prettify = !!settings.settingForKey(Settings.Prettify);
  const removeDimensions = !!settings.settingForKey(Settings.RemoveDimensions);
  const initialValue =
    settings.settingForKey(Settings.ExportSetting) || ConfigOptions.Default;
  const message = `How do you want to export your SVG?\n\nOutput: ${
    prettify ? 'Prettyfied' : 'Minified'
  }\nDimensions: ${removeDimensions ? 'Removed' : 'Original'}`;
  UI.getInputFromUser(
    message,
    {
      type: UI.INPUT_TYPE.selection,
      initialValue,
      possibleValues: [
        ConfigOptions.Disabled,
        ConfigOptions.Default,
        ConfigOptions.CurrentColor,
        ConfigOptions.Custom,
      ],
    },
    (err, value) => {
      if (err) {
        return;
      }
      settings.setSettingForKey(Settings.ExportSetting, value);
      sketch.UI.message(`Export setting: ${value}`);
    }
  );
}
