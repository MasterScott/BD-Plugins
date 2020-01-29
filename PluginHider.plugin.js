//META{"name":"PluginHider","source":"https://raw.githubusercontent.com/EastArctica/BD-Plugins/master/PluginHider.plugin.js"}*//

const config = {
	info: {
		name: "Plugin Hider",
		authors: [
			{
				name: "East_Arctica#9238",
				discord_id: "478646141815226378",
				github_username: "EastArctica"
			}
		],
		version: "1.1.0",
		description: "Hide your Plugins.",
		github:
			"https://github.com/EastArctica/BD-Plugins/blob/master/PluginHider.plugin.js",
		github_raw:
			"https://raw.githubusercontent.com/EastArctica/BD-Plugins/master/PluginHider.plugin.js"
	},
	changelog: [

		{
			title: "Stuff",
			type: "fixed",
			items: [
				"Released!"
			]
		}

	],
	main: "index.js"
};





function getLibraries_220584715265114113() {
	const title = "Libraries Missing";
	const ModalStack = BdApi.findModuleByProps(
		"push",
		"update",
		"pop",
		"popWithKey"
	);
	const TextElement = BdApi.findModuleByProps("Sizes", "Weights");
	const ConfirmationModal = BdApi.findModule(
		(m) => m.defaultProps && m.key && m.key() == "confirm-modal"
	);
	if (!ModalStack || !ConfirmationModal || !TextElement)
		return BdApi.alert(
			title,
			`The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`
		);
	ModalStack.push(function(props) {
		return BdApi.React.createElement(
			ConfirmationModal,
			Object.assign(
				{
					header: title,
					children: [
						TextElement({
							color: TextElement.Colors.PRIMARY,
							children: [
								`In order to work, ${config.info.name} needs to download the two libraries `,
								BdApi.React.createElement(
									"a",
									{
										href: "https://github.com/rauenzi/BDPluginLibrary/",
										target: "_blank"
									},
									"ZeresPluginLibrary"
								),
								` and `,
								BdApi.React.createElement(
									"a",
									{
										href: "https://github.com/KyzaGitHub/Khub/tree/master/Libraries/KSS",
										target: "_blank"
									},
									"KSS"
								),
								`.`
							]
						})
					],
					red: false,
					confirmText: "Download",
					cancelText: "No! Disable this plugin!",
					onConfirm: () => {
						// Install ZLibrary first.
						require("request").get(
							"https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
							async (error, response, body) => {
								if (error)
									return require("electron").shell.openExternal(
										"https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js"
									);
								await new Promise((r) =>
									require("fs").writeFile(
										require("path").join(
											ContentManager.pluginsFolder,
											"0PluginLibrary.plugin.js"
										),
										body,
										r
									)
								);
							}
						);
						// Install KSS last.
						require("request").get(
							"https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Libraries/KSS/1KSSLibrary.plugin.js",
							async (error, response, body) => {
								if (error)
									return require("electron").shell.openExternal(
										"https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/KyzaGitHub/Khub/master/Libraries/KSS/1KSSLibrary.plugin.js"
									);
								await new Promise((r) =>
									require("fs").writeFile(
										require("path").join(
											ContentManager.pluginsFolder,
											"1KSSLibrary.plugin.js"
										),
										body,
										r
									)
								);
							}
						);
					},
					onCancel: () => {
						pluginModule.disablePlugin(this.getName());
					}
				},
				props
			)
		);
	});
}

var PluginHider = (() => {


	return !global.ZeresPluginLibrary
		? class {
				constructor() {
					this._config = config;
				}
				getName() {
					return config.info.name;
				}
				getAuthor() {
					return config.info.authors.map((a) => a.name).join(", ");
				}
				getDescription() {
					return config.info.description;
				}
				getVersion() {
					return config.info.version;
				}
				load() {
					getLibraries_220584715265114113();
				}
				start() {}
				stop() {}
		  }
		: (([Plugin, Api]) => {
				const plugin = (Plugin, Api) => {
					const {
						Toasts,
						DiscordSelectors,
						DiscordClasses,
						PluginUpdater,
						DiscordModules,
						WebpackModules,
						Tooltip,
						Modals,
						ReactTools,
						ReactComponents,
						ContextMenu,
						Patcher,
						Settings,
						PluginUtilities,
						DiscordAPI,
						DOMTools,
						DiscordClassModules
					} = Api;

					const {
						MessageActions,
						Dispatcher,
						DiscordPermissions,
						ChannelStore,
						SimpleMarkdown
					} = DiscordModules;

					const selectors = {
						chat: WebpackModules.getByProps("chat").chat,
						chatContent: WebpackModules.getByProps("chatContent").chatContent
					};

					var updateInterval;

					var files = [];

					var enabled = false;

					var KSS = null;

					return class PluginHider extends Plugin {
						onStart() {
							if (!window.KSSLibrary) {
								getLibraries_220584715265114113();
							}
							
							this.defaultSettings = {buttonEnabled: true, defaultText: 11};
							this.settings = Object.assign({}, this.defaultSettings);
							this.settings = this.loadSettings(this.defaultSettings);

								var currentver = config.info.version;
								PluginUpdater.checkForUpdate(
									"PluginHider",
									currentver,
									"https://raw.githubusercontent.com/EastArctica/BD-Plugins/master/PluginHider.plugin.js"
								);


							KSS = new KSSLibrary(this);
						}

						onStop() {
							clearInterval(updateInterval);
							this.removeButton();
							this.unpatch();
							KSS.dispose();
						}

						FireEvent(element, eventName) {
							if (element != null) {
								const mouseoverEvent = new Event(eventName);
								element.dispatchEvent(mouseoverEvent);
							}
						}
					};
				};
				return plugin(Plugin, Api);
		  })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/







/* 
(document.getElementsByClassName("bda-slist")[0].children[PluginNumber])
Is the LI of the plugin

(document.getElementsByClassName("bda-slist")[0].children[PluginNumber]).getAttribute('data-name')
Is the Plugins name


for (var PluginNumber in document.getElementsByClassName("bda-slist")[0].children)
	if ((document.getElementsByClassName("bda-slist")[0].children[PluginNumber]).tagName == "LI") {
		if ((document.getElementsByClassName("bda-slist")[0].children[PluginNumber]).getAttribute('data-name') == "XenoLib") {
			// Set the display to none
			(document.getElementsByClassName("bda-slist")[0].children[PluginNumber]).setAttribute("style", "display:none;")

			// console.log((document.getElementsByClassName("bda-slist")[0].children[PluginNumber]).getAttribute('data-name'))
		}
	}
*/
