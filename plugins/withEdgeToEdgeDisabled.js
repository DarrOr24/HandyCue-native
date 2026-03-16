/**
 * Config plugin to add edgeToEdgeEnabled=false to gradle.properties.
 * This helps avoid Android 15 edge-to-edge deprecation warnings from React Native
 * until upstream fixes are available.
 * @see https://reactnative.dev/docs/edge-to-edge
 */
const { withGradleProperties } = require('@expo/config-plugins');

function withEdgeToEdgeDisabled(config) {
  return withGradleProperties(config, (config) => {
    const props = config.modResults;
    const idx = props.findIndex(
      (p) => p.type === 'property' && p.key === 'edgeToEdgeEnabled'
    );
    if (idx >= 0) {
      props[idx] = { type: 'property', key: 'edgeToEdgeEnabled', value: 'false' };
    } else {
      props.push(
        { type: 'empty' },
        { type: 'comment', value: 'Disable edge-to-edge to avoid Android 15 deprecation warnings' },
        { type: 'property', key: 'edgeToEdgeEnabled', value: 'false' }
      );
    }
    return config;
  });
}

module.exports = withEdgeToEdgeDisabled;
