import { App, normalizePath, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface MyPluginSettings {
	mySetting: string;
	defaultSavePath: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
	defaultSavePath: ''
}

declare module "obsidian" {
	interface App {
		plugins: {
			plugins: {
				dataview: { api: any };
			}
		}
	}
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		console.log('Loading Metadataframe plugin');

		await this.loadSettings();

		this.addCommand({
			id: 'write-metadataframe',
			name: 'Write Metadataframe',
			callback: async () => {
				try {
					const jsDF = this.createJSDF()
					console.log(jsDF)
					await this.writeMetadataframe(jsDF);
				} catch (error) {
					new Notice('An error occured. Please check the console.')
				}
			}
		});

		this.addSettingTab(new MetadataframeSettings(this.app, this));
	}

	// Source: https://stackoverflow.com/questions/11257062/converting-json-object-to-csv-format-in-javascript
	arrayToCSV(objArray: { [key: string]: string | number }[]) {
		const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
		let str = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}` + '\r\n';

		return array.reduce((str: string, next: string) => {
			str += `${Object.values(next).map(value => `"${value}"`).join(",")}` + '\r\n';
			return str;
		}, str);
	}

	createJSDF() {
		const files = this.app.vault.getMarkdownFiles()
		let yamldf: { [key: string]: string | number }[] = []
		let uniqueKeys: string[] = [];

		files.forEach((file, i) => {
			// Add a new object for each file
			yamldf.push({ file: file.path });

			// Grab the dv metadata cache for it
			if (!this.app.plugins.plugins.dataview.api) {
				new Notice('Dataview must be enabled')
				return;
			}
			const cache = this.app.plugins.plugins.dataview.api.page(file.path);
			Object.keys(cache).forEach(key => {
				// Collect unique keys for later
				if (!uniqueKeys.includes(key)) uniqueKeys.push(key);

				// Process values
				if (key !== 'file' && key !== 'position') {
					const value = cache[key]

					if (!value) { // Null values
						yamldf[i][key] = null
					} else if (typeof value === 'string') { // String values
						yamldf[i][key] = value
					} else if (value.ts) { //Dates
						yamldf[i][key] = value.ts
					} else if (Array.isArray(value)) { // Arrays are joined into strings
						yamldf[i][key] = value.join(', ')
					} else if (value.path) { // Link objects
						yamldf[i][key] = value.path
					}
				}
			})
		})


		// Make the jagged array square
		/// If a file doesn't have all fields, then add those fields as null
		/// Maybe use undefined instead?
		Object.keys(yamldf).forEach((file, i) => {
			uniqueKeys.forEach(key => {
				if (yamldf[i][key] === undefined) {
					yamldf[i][key] = null
				}
			})
		})

		return yamldf
	}

	async writeMetadataframe(jsDF: { [key: string]: string | number }[]) {
		const csv = this.arrayToCSV(jsDF)
		console.log(csv)

		if (this.settings.defaultSavePath === '') {
			new Notice('Please choose a path to save to in settings')

		} else {
			try {
				const savePath = normalizePath(this.settings.defaultSavePath)
				const now = window.moment().format("YYYY-MM-DD HHmmss");

				await this.app.vault.createBinary(`${savePath} ${now}.csv`, csv)
				new Notice('Write Metadataframe complete')

			} catch (error) {
				new Notice('File already exists')
			}
		}
	}

	onunload() {
		console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class MetadataframeSettings extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { settings } = this.plugin
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
	}
}
