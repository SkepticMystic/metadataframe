import { App, PluginSettingTab, Setting } from 'obsidian';
import MyPlugin from './main';

export class MetadataframeSettings extends PluginSettingTab {
    plugin: MyPlugin;

    constructor(app: App, plugin: MyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { settings } = this.plugin;
        let { containerEl } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: 'Settings for Metadataframe.' });

        new Setting(containerEl)
            .setName('Default save path')
            .setDesc('The full file path to save the metadataframe to. Don\'t include the file extension. For example, this is a correct file path: SubFolder/metadataframe. Use "/" to save to the root of your vault.')
            .addText(text => text
                .setValue(settings.defaultSavePath)
                .onChange(async (value) => {
                    settings.defaultSavePath = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Null value')
            .setDesc('If a file has a field, but no value for it, what should the null value be? Default is \'null\'. You don\'t have to use quotes.')
            .addText(text => text
                .setValue(settings.nullValue)
                .onChange(async (value) => {
                    settings.nullValue = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Undefined value')
            .setDesc('If a file is missing a field (no key or value), then the plugin still has to assign it a value for that field to make the dataframe square. What value should it give to undefined field values? Default is \'undefined\'. You don\'t have to use quotes. This value can be the same as the null value above.')
            .addText(text => text
                .setValue(settings.undefinedValue)
                .onChange(async (value) => {
                    settings.undefinedValue = value;
                    await this.plugin.saveSettings();
                }));
    }
}
