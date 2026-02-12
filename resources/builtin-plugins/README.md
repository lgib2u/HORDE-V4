# Built-in plugins

Plugins in this folder are shipped with the app and loaded from the repo (no download on install).

## logseq-integrate-any-api

Integrate Any API + default "Ask Ollama" (response as child). Source: [eefahd/logseq-integrate-any-api](https://github.com/eefahd/logseq-integrate-any-api).

**First-time setup:** build the plugin so the app can load it:

```bash
yarn build:builtin-plugin
```

Or from the plugin directory:

```bash
cd resources/builtin-plugins/logseq-integrate-any-api && yarn install && yarn build
```

The app resolves the builtin plugin at `resources/builtin-plugins/logseq-integrate-any-api` (relative to the app path when running Electron).
