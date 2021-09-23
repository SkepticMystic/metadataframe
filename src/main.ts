import { Parser, transforms } from 'json2csv';
import { normalizePath, Notice, Plugin } from 'obsidian';
import { dropHeaderOrAlias, splitLinksRegex } from 'src/Constants';
import { stringToNullOrUndefined } from 'src/Utility';
import { MetadataframeSettings } from './Settings';

interface MyPluginSettings {
	mySetting: string;
	defaultSavePath: string;
	nullValue: string;
	undefinedValue: string
	addFileData: boolean
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
	defaultSavePath: '/',
	nullValue: 'null',
	undefinedValue: 'undefined',
	addFileData: true
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
					console.log(error)
				}
			}
		});

		this.addSettingTab(new MetadataframeSettings(this.app, this));
	}



	createJSDF() {
		const { settings } = this

		const files = this.app.vault.getMarkdownFiles()
		let yamldf: { [key: string]: any }[] = []
		let uniqueKeys: string[] = [];

		let actualNullValue = stringToNullOrUndefined(settings.nullValue)

		files.forEach((file, i) => {
			// Add a new object for each file
			yamldf.push({ file: { path: file.path } });

			// Grab the dv metadata cache for it
			if (!this.app.plugins.plugins.dataview.api) {
				new Notice('Dataview must be enabled')
				return;
			}
			const cache = this.app.plugins.plugins.dataview.api.page(file.path);
			Object.keys(cache).forEach(key => {

				// Process values
				if (key !== 'position') {

					if (key !== 'file' || settings.addFileData) {
						// Collect unique keys for later
						if (!uniqueKeys.includes(key)) uniqueKeys.push(key);

						const value = cache[key]

						if (!value) { // Null values
							yamldf[i][key] = actualNullValue
						} else if (typeof value === 'string') { // String values

							const splits = value.match(splitLinksRegex);
							if (splits !== null) {
								const strs = splits.map((link) => {
									const dropped = link.match(dropHeaderOrAlias)?.[1];
									if (dropped) {
										return `[[${dropped}]]`
									} else {
										return link
									}
								}
								).join(', ');
								yamldf[i][key] = strs
							}
							else {
								yamldf[i][key] = value
							}

						} else if (Object.prototype.toString.call(value) === '[object Object]') {
							yamldf[i][key] = value
						} else {
							const arrValues = [value].flat(4)

							if (arrValues?.[0]?.ts) { //Dates
								yamldf[i][key] = arrValues.map(val => val?.ts).join(', ')
							} else if (arrValues?.[0]?.path) { // Link objects
								yamldf[i][key] = arrValues.map(val => `[[${val?.path}]]`).join(', ')
							} else { // Arrays are joined into strings
								yamldf[i][key] = arrValues.join(', ')
							}
						}
					}
				}
			})
		})

		let actualUndefinedValue = stringToNullOrUndefined(settings.undefinedValue);

		for (let i = 0; i < Object.keys(yamldf).length; i++) {
			uniqueKeys.forEach(key => {
				if (yamldf[i][key] === undefined) {
					yamldf[i][key] = actualUndefinedValue
				}
			})
		}

		return yamldf
	}

	async writeMetadataframe(jsDF: { [key: string]: string | number }[]) {
		const { settings } = this;
		const defaultValue = settings.nullValue

		const opts = { defaultValue, transforms: [transforms.flatten()] };

		let csv = '';
		try {
			const parser = new Parser(opts);
			csv = parser.parse(jsDF);

			if (settings.defaultSavePath === '' && csv !== '') {
				new Notice('Please choose a path to save to in settings')
			} else {
				try {
					const savePath = normalizePath(settings.defaultSavePath)
					const now = window.moment().format("YYYY-MM-DD HHmmss");

					await this.app.vault.createBinary(`${savePath} ${now}.csv`, csv)
					new Notice('Write Metadataframe complete')

				} catch (error) {
					new Notice('File already exists')
				}
			}
		} catch (err) {
			console.error(err);
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
