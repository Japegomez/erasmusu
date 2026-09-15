const { getDefaultConfig } = require("expo/metro-config");

/**
 * SDK 52+: Expo detecta workspaces y configura Metro solo.
 * No tocar watchFolders / nodeModulesPaths (rompe resolución de deps anidadas).
 * @see https://docs.expo.dev/guides/monorepos/
 */
const config = getDefaultConfig(__dirname);

module.exports = config;
