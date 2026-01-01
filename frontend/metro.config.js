const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// WASM support for expo-sqlite
config.resolver.assetExts.push('wasm');
config.resolver.sourceExts = config.resolver.sourceExts.filter(ext => ext !== 'wasm');

module.exports = config;
