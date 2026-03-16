const appJson = require('./app.json');
const withEdgeToEdgeDisabled = require('./plugins/withEdgeToEdgeDisabled');
const withIosPortraitOnly = require('./plugins/withIosPortraitOnly');

module.exports = {
  expo: {
    ...appJson.expo,
    plugins: [
      ...(appJson.expo.plugins || []),
      withEdgeToEdgeDisabled,
      withIosPortraitOnly,
    ],
  },
};
