//META{"name":"VoiceLink","displayName":"VoiceLink","website":"https://github.com/EastArctica/BD-Plugins","source":"https://github.com/EastArctica/BD-Plugins/blob/master/VoiceLink.plugin.js"}*//

var embedOpen = false;
var updateInterval;
var makeSureClosedInterval;
var popupWrapperWidth = 275;
var popupWrapperHeight = 35;
online = false


class VoiceLink {
	getName(){return "Voice Linker";}
	getAuthor(){return "East_Arctica";}
	getVersion(){return "0.1";}
	getDescription(){return "Give a link to the current voice channel you are in!";}
    load() {}
    
	start() {
        online = true
        let libraryScript = document.getElementById("ZLibraryScript");
        if (!libraryScript || !window.ZLibrary) {
            if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
            libraryScript = document.createElement("script");
            libraryScript.setAttribute("type", "text/javascript");
            libraryScript.setAttribute("src", "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js");
            libraryScript.setAttribute("id", "ZLibraryScript");
            document.head.appendChild(libraryScript);
        }
        this.addButton()
        if (window.ZLibrary) this.initialize();
        else libraryScript.addEventListener("load", () => { this.initialize(); });
    }
	
    initialize() {
        ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "LINK_TO_RAW_CODE");
    }	
    async addButton() {
        const delay = ms => new Promise(res => setTimeout(res, ms));
        while (online == true) {
            await delay(1000);
            if (BdApi.findModuleByProps("getChannelId", "getVoiceChannelId").getVoiceChannelId() != null) {
                try {
                    var channelId = window.location.toString().split("/")[window.location.toString().split("/").length - 1];
                    var channelObject = ZLibrary.DiscordAPI.Channel.fromId(channelId);
                    if (!channelObject) return;
                    var channel = ZLibrary.DiscordAPI.Channel.from(channelObject);
                    var permissions = channel.discordObject.permissions;
    
                    if (document.getElementsByClassName("embed-button-wrapper").length == 0) {
                        var daButtons = document.getElementsByClassName("flex-1xMQg5")[0];
                        var embedButton = document.createElement("button");
                        embedButton.setAttribute("type", "button");
                        embedButton.setAttribute("class", "buttonWrapper-1ZmCpA da-buttonWrapper button-38aScr da-button lookBlank-3eh9lL da-lookBlank colorBrand-3pXr91 da-colorBrand grow-q77ONN da-grow normal embed-button-wrapper");

                        var embedButtonInner = document.createElement("div");
                        embedButtonInner.setAttribute("class", "contents-18-Yxp da-contents button-3AYNKb da-button button-2vd_v_ da-button embed-button-inner");
    
                        var embedButtonIcon = document.createElement("img");
                        //version="1.1" xmlns="http://www.w3.org/2000/svg" class="icon-3D60ES da-icon" viewBox="0 0 22 22" fill="currentColor"
                        embedButtonIcon.setAttribute("src", "https://image.flaticon.com/icons/svg/25/25463.svg");
                        embedButtonIcon.setAttribute("class", "icon-3D60ES da-icon");
                        embedButtonIcon.setAttribute("style", "filter: invert(70%) !important;");

    
                        embedButtonIcon.onmouseover = () => {
                            embedButtonIcon.setAttribute("style", "filter: invert(100%) !important;");
                        };
                        embedButtonIcon.onmouseout = () => {    
                            embedButtonIcon.setAttribute("style", "filter: invert(70%) !important;");
                        };
    
                        embedButtonInner.appendChild(embedButtonIcon);
                        embedButton.appendChild(embedButtonInner);
                        daButtons.insertBefore(embedButton, daButtons.firstChild);
    
                        embedButton.onclick = () => {
                            var channelId = window.location.toString().split("/")[window.location.toString().split("/").length - 1];
                            var channel = ZLibrary.DiscordAPI.Channel.from(ZLibrary.DiscordAPI.Channel.fromId(channelId));
    
                            // Only send the embed if the user has permissions to embed links.
                            var currguild = ZLibrary.DiscordAPI.currentGuild;
                            var currguildid = currguild.discordObject.id;
                            var currvoice = BdApi.findModuleByProps("getChannelId", "getVoiceChannelId").getVoiceChannelId();
                            this.openEmbedPopup()
                            description.href = "https://discordapp.com/channels/" + currguildid + "/" + currvoice
                            description.innerHTML = "https://discordapp.com/channels/" + currguildid + "/" + currvoice
                        };
                    }
                } catch (e) {
                }
            }
        }
    
    }
    openEmbedPopup() {
        if (!document.getElementById("embedPopupWrapper")) {
            embedOpen = true;
            var inputStyle = "width: 275px; margin: auto auto 10px auto;";
            var textInputStyle = "background-color: #484B52; border: none; border-radius: 5px; height: 30px; padding-left: 10px;";
            var fadeOutBackground = document.createElement("div");

            var popupWrapper = document.createElement("div");
            popupWrapper.setAttribute("id", "embedPopupWrapper");

            var positionInterval = setInterval(() => {
                if (!document.getElementById("embedPopupWrapper")) {
                    window.clearInterval(positionInterval);
                }
                popupWrapper.setAttribute("style", "text-align: center; border-radius: 10px; width: " + popupWrapperWidth + "px; height: " + popupWrapperHeight + "px; position: absolute; top: " + ((window.innerHeight / 2) - (popupWrapperHeight / 2)) + "px; left: " + ((window.innerWidth / 2) - (popupWrapperWidth / 2)) + "px; background-color: #36393F; z-index: 999999999999999999999; text-rendering: optimizeLegibility;");
            }, 100);

            var description = document.createElement("textarea");
            description.setAttribute("id", "description");
            description.setAttribute("placeholder", "Description");
            description.setAttribute("style", inputStyle + "height: 35px !important; resize: none;" + textInputStyle);
            description.oninput = () => {
                oldDescription = description.value;
            };

            popupWrapper.appendChild(description);

            fadeOutBackground.setAttribute("id", "fadeOutBackground");
            fadeOutBackground.setAttribute("style", "position: absolute; width: 100%; height: 100%; top: 22px; background-color: rgba(0, 0, 0, 0.8); z-index: 999999999999999999998;");
            fadeOutBackground.onclick = () => {
                this.closeEmbedPopup();
            };

            document.body.appendChild(fadeOutBackground);

            document.body.appendChild(popupWrapper);
        }
    }
    closeEmbedPopup() {
        try {
            document.getElementById("embedPopupWrapper").remove();
        } catch (e) {}
        try {
            document.getElementById("fadeOutBackground").remove();
        } catch (e) {}
        embedOpen = false;
    }


    stop() {
    }
}