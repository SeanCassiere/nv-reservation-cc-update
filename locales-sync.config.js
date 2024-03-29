// @ts-check
/* eslint-disable */
const { resolve } = require("path");

// these are the default values being using in ./src/i18n.ts
const common = "common";

// Using language codes from https://github.com/ladjs/i18n-locales
const en = "en";
const languagesCore = [common, en, "de", "fr", "es", "ar", "ru"];

// derived to remove en and the common directory
const secondaryLanguages = languagesCore.filter((l) => l !== en && l !== common);

const srcLocalesPath = resolve(__dirname, "public", "locales");

/**
 * @type {Parameters<typeof import('i18next-locales-sync').syncLocales>[0]}
 * */
const config = {
  primaryLanguage: "en",
  secondaryLanguages,
  localesFolder: srcLocalesPath,
};

module.exports = config;
