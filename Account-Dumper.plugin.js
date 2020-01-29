//META{"name":"AccountDumper","displayName":"AccountDumper","website":"https://github.com/EastArctica/BD-Plugins","source":"https://github.com/EastArctica/BD-Plugins/blob/master/Account-Dumper.plugin.js"}*//

var passwd = null;
var running = false
class AccountDumper {
	getName(){return "AccountDumper";}
	getAuthor(){return "East_Arctica";}
	getVersion(){return "0.1";}
	getDescription(){return "Dump all of your Account Information to a text file(Not actually Yes)!";}
    load() {}
    
	start() {
        let libraryScript = document.getElementById("ZLibraryScript");
        if (!libraryScript || !window.ZLibrary) {
            if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
            libraryScript = document.createElement("script");
            libraryScript.setAttribute("type", "text/javascript");
            libraryScript.setAttribute("src", "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js");
            libraryScript.setAttribute("id", "ZLibraryScript");
            document.head.appendChild(libraryScript);
        }

        if (window.ZLibrary) this.initialize();
		else libraryScript.addEventListener("load", () => { this.initialize(); });
    }
	
    initialize() {
        ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "LINK_TO_RAW_CODE");
    }	


	get settingFields() {
		return {
			encrypt: { label: "Encrypt your data", type: "bool" },
			autobackup: { label: "Auto Backup", type: "bool" },
			frequency: { label: "How often would you like to backup? (In Hours)", type: "text" },
            savefriends: { label: "Save your friends?", type: "bool" },
            saveservers: { label: "Save your servers?", type: "bool" },
			saveinvites: { label: "Save your server invites?", type: "bool" },
			data: { label: "Your Data:", type: "text" }
		};
	}

	getSettingsPanel() {
		var wrapper = document.createElement("div");
		// Buttons
		const CheckButton = document.createElement("button");
		CheckButton.innerHTML = "Check!";
		CheckButton.addEventListener("click", value => {this.Check()});

		const FriendButton = document.createElement("button");
		FriendButton.innerHTML = "Add Friends!";
		FriendButton.addEventListener("click", value => {this.AddFriends()});
		// Text Areas
		const InvitesArea = document.createElement("textarea");
		InvitesArea.placeholder = "Your Invites will be here";
		InvitesArea.setAttribute("id", "InvitesArea");

		const FailedArea = document.createElement("textarea");
		FailedArea.placeholder = "Your Failed Invite guild ID's will be here";
		FailedArea.setAttribute("id", "FailedArea");

		const GuildArea = document.createElement("textarea");
		GuildArea.placeholder = "Your guild ID's will be here";
		GuildArea.setAttribute("id", "GuildArea");

		const FriendArea = document.createElement("textarea");
		FriendArea.placeholder = "Your Friends will be here";
		FriendArea.setAttribute("id", "FriendArea");



		wrapper.appendChild(CheckButton);
		wrapper.appendChild(FriendButton);
		wrapper.appendChild(InvitesArea);
		wrapper.appendChild(FailedArea);
		wrapper.appendChild(GuildArea);
		wrapper.appendChild(FriendArea);
		return wrapper;
	}

	saveSettings() {

	}

	async AddFriends() {
		if (running === true) {
			BdApi.showToast('You are already doing something with the plugin! Wait until it is complete.', {type: 'error',timeout: 4500}) // Alert the user
		} else {
			running = true
			const delay = ms => new Promise(res => setTimeout(res, ms));

			var friends = document.getElementById("FriendArea").value
			console.log(friends)
			var friendslist = BdApi.findModuleByProps("getFriendIDs").getFriendIDs()
			var friendslists = friends.split(',');
			var res = friendslists.filter( function(n) { return !this.has(n) }, new Set(friendslist) );
			for (var i in res) {
				var UserInfo = ZLibrary.DiscordAPI.User.fromId(res[i]).discordObject
				var fullUser = UserInfo.username + "#" + UserInfo.discriminator
				BdApi.findModuleByProps("addRelationship").sendRequest(fullUser)
				await delay(30000);
			}
			BdApi.showToast('Finished adding friends!', {type: 'error',timeout: 4500}) // Alert the user
			running = false
		}
	}

	async Check() {
		if (running == true) {
			BdApi.showToast('You are already doing something with the plugin! Wait until it is complete.', {type: 'error',timeout: 4500}) // Alert the user
		} else {
			running = true
			console.log("Started Invite creation. This might take a while")
			var inviteslist = []
			var guildslist = BdApi.findModuleByProps("guildPositions").guildPositions
			var failedinvites = []
			var channelcreatedin = []
			var friendslist = BdApi.findModuleByProps("getFriendIDs").getFriendIDs()
			const delay = ms => new Promise(res => setTimeout(res, ms));
			//  Guilds and invites
			var Guilds = BdApi.findModuleByProps("getGuilds").getGuilds()
			for (var i in Guilds) {
				var GuildId = Guilds[i].id
					// Finding the Channel Information of the guild
				var ChannelInfo = BdApi.findModuleByProps("getChannels", "getDefaultChannel").getDefaultChannel(GuildId)

					// Create invite from the channel ID
				BdApi.findModuleByProps("createInvite", "resolveInvite").createInvite(ChannelInfo.id, {"max_age":0,"max_uses":0,"temporary":false}, "Guild Channels").then(function(value) {
					inviteslist.push(value.body.code)
					channelcreatedin.push(ChannelInfo.id)
				}).catch((err) => {
					failedinvites.push(Guilds[i].name)
					BdApi.showToast(`Missing permissions to create invite in: ` + Guilds[i].name, {type: 'error',timeout: 4500})
				});
				await delay(3500);
			}

			console.log("Invites were created in the channels:")
			console.log(channelcreatedin)
			console.log("Invites Below:")
			console.log(inviteslist)
			console.log("Guilds Below:")
			console.log(guildslist)
			console.log("Failed to create invites in:")
			console.log(failedinvites)
			console.log("Friends Below:")
			console.log(friendslist)
			document.getElementById("InvitesArea").innerHTML = inviteslist
			document.getElementById("FailedArea").innerHTML = failedinvites
			document.getElementById("GuildArea").innerHTML = guildslist
			document.getElementById("FriendArea").innerHTML = friendslist
			running = false
		}
	};

    stop() {
		running = false
    }
}
