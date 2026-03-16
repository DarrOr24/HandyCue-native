/**
 * Config plugin to lock iOS to portrait only.
 * Android keeps orientation: "default" for Google Play requirements.
 */
const { withInfoPlist } = require('@expo/config-plugins');

function withIosPortraitOnly(config) {
  return withInfoPlist(config, (config) => {
    config.modResults.UISupportedInterfaceOrientations = [
      'UIInterfaceOrientationPortrait',
    ];
    return config;
  });
}

module.exports = withIosPortraitOnly;
