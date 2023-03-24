import { defineConfig } from "cypress";
import * as dotenv from 'dotenv';
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import webpack from "@cypress/webpack-preprocessor";


dotenv.config();
async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);
  on('task', {
    log(message) {
      console.log(message)
      return null
    },
  }),
    on(
      "file:preprocessor",
      webpack({
        webpackOptions: {
          resolve: {
            extensions: [".ts", ".js"],
          },
          module: {
            rules: [
              {
                test: /\.ts$/,
                exclude: [/node_modules/],
                use: [
                  {
                    loader: "ts-loader",
                  },
                ],
              },
              {
                test: /\.feature$/,
                use: [
                  {
                    loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                    options: config,
                  },
                ],
              },
            ],
          },
        },
      }),
    );
  return config;
}

export default defineConfig({
  defaultCommandTimeout: 5000,
  viewportWidth: 1200,
  viewportHeight: 800,
  env: {
    ldap: process.env.LDAP,
    pwd: process.env.PWD
  },
  e2e: {
    specPattern: "**/*.feature",
    baseUrl: "https://www.google.fr/",
    includeShadowDom: true,
    setupNodeEvents,
    // implement node event listeners here
    defaultCommandTimeout: 10000,
  },
});
