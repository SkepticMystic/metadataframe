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
        containerEl.createEl('h2', { text: 'Settings for Metadataframe' });

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
            .setDesc('What should the default value be for missing field values? Default is \'null\'. Don\'t use quotes, just enter the value.')
            .addText(text => text
                .setValue(settings.nullValue)
                .onChange(async (value) => {
                    settings.nullValue = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Add inherent file metadata')
            .setDesc('Each file has alot of inherent metadata to it (besides the fields you add). Should metadataframe add these fields too? It can be alot, so there is the option to disable this behaviour.')
            .addToggle(toggle => toggle
                .setValue(settings.addFileData)
                .onChange(async (value) => {
                    settings.addFileData = value;
                    await this.plugin.saveSettings();
                }));
    }
}
