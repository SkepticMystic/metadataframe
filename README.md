# Metadataframe

Metadataframe allows you to get all metadata from your vault into CSV file.
With CSV in-hand, you can do any data analysis you want with it!

Please note, you need [Dataview](https://github.com/blacksmithgu/obsidian-dataview) enabled for this plugin to grab metadata.

## Useful Workflows

Metadataframe pairs well with death-au's [CSV Editor plugin](https://github.com/deathau/csv-obsidian).

One can also use Vinadon's [Advanced URIs plugin](https://github.com/Vinzent03/obsidian-advanced-uri) to run the `Write Metadataframe` command from outside of Obsidian. This can make it easier and faster to get data into another app, like Python.

## Settings

### Default Save Path

The file path for metadataframe to save the CSV file to. Default is the root of your vault `/`.

### Default Null Value

The value to use when a field value is missing. Default is `null`.

### Add Inherent File Metadata

Each file has alot of inherent metadata to it (besides the fields you add). Should metadataframe add these fields too? It can be alot, so there is the option to disable this behaviour.
