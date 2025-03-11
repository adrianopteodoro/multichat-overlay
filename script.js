////////////////
// PARAMETERS //
////////////////

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const sbServerAddress = urlParams.get("address") || "127.0.0.1";
const sbServerPort = urlParams.get("port") || "8080";
const minimumRole = 2;							// 1 - Viewer, 2 - VIP, 3 - Moderator, 4 - Broadcaster
const avatarMap = new Map();

/////////////
// OPTIONS //
/////////////

const showPlatform = urlParams.get("showPlatform") || true;
const showAvatar = urlParams.get("showAvatar") || true;
const showTimestamps = urlParams.get("showTimestamps") || true;
const showBadges = urlParams.get("showBadges") || true;
const showPronouns = urlParams.get("showPronouns") || true;
const showUsername = urlParams.get("showUsername") || true;
const showMessage = urlParams.get("showMessage") || true;
const font = urlParams.get("font") || true;
const fontSize = urlParams.get("fontSize") || true;

const hideAfter = urlParams.get("hideAfter") || true;
const excludeCommands = urlParams.get("excludeCommands") || true;
const ignoredChatters = urlParams.get("ignoredChatters") || true;

const showTwitchMessages = urlParams.get("showTwitchMessages") || true;
const showTwitchAnnouncements = urlParams.get("showTwitchAnnouncements") || true;
const showTwitchSubs = urlParams.get("showTwitchSubs") || true;
const showTwitchRaids = urlParams.get("showTwitchRaids") || true;

const showYouTubeMessages = urlParams.get("showYouTubeMessages") || true;
const showYouTubeSuperChats = urlParams.get("showYouTubeSuperChats") || true;
const showYouTubeSuperStickers = urlParams.get("showYouTubeSuperStickers") || true;
const showYouTubeMemberships = urlParams.get("showYouTubeMemberships") || true;

const showStreamlabsDonations = urlParams.get("showStreamlabsDonations") || true;
const showStreamElementsTips = urlParams.get("showStreamElementsTips") || true;



/////////////////////////
// STREAMER.BOT CLIENT //
/////////////////////////

const client = new StreamerbotClient({
	host: sbServerAddress,
	port: sbServerPort,

	onConnect: (data) => {
		console.log(`Streamer.bot successfully connected to ${sbServerAddress}:${sbServerPort}`)
		console.debug(data);
		SetConnectionStatus(true);
	},

	onDisconnect: () => {
		console.error(`Streamer.bot disconnected from ${sbServerAddress}:${sbServerPort}`)
		SetConnectionStatus(false);
	}
});

client.on('Twitch.ChatMessage', (response) => {
	console.debug(response.data);
	TwitchChatMessage(response.data);
})

client.on('Twitch.Cheer', (response) => {
	console.debug(response.data);
	TwitchChatMessage(response.data);
})

client.on('Twitch.AutomaticRewardRedemption', (response) => {
	console.debug(response.data);
	TwitchAutomaticRewardRedemption(response.data);
})

client.on('Twitch.Announcement', (response) => {
	console.debug(response.data);
	TwitchAnnouncement(response.data);
})

client.on('Twitch.Sub', (response) => {
	console.debug(response.data);
	TwitchSub(response.data);
})

client.on('Twitch.ReSub', (response) => {
	console.debug(response.data);
	TwitchResub(response.data);
})

client.on('Twitch.GiftSub', (response) => {
	console.debug(response.data);
	TwitchGiftSub(response.data);
})

client.on('Twitch.Raid', (response) => {
	console.debug(response.data);
	TwitchRaid(response.data);
})

client.on('Twitch.ChatMessageDeleted', (response) => {
	console.debug(response.data);
	TwitchChatMessageDeleted(response.data);
})

client.on('Twitch.UserBanned', (response) => {
	console.debug(response.data);
	TwitchUserBanned(response.data);
})

client.on('Twitch.UserTimedOut', (response) => {
	console.debug(response.data);
	TwitchUserBanned(response.data);
})

client.on('Twitch.ChatCleared', (response) => {
	console.debug(response.data);
	TwitchChatCleared(response.data);
})

client.on('YouTube.Message', (response) => {
	console.debug(response.data);
	YouTubeMessage(response.data)
})

client.on('YouTube.SuperChat', (response) => {
	console.debug(response.data);
	YouTubeSuperChat(response.data);
})

client.on('YouTube.SuperSticker', (response) => {
	console.debug(response.data);
	YouTubeSuperSticker(response.data);
})

client.on('YouTube.NewSponsor', (response) => {
	console.debug(response.data);
	YouTubeNewSponsor(response.data);
})

client.on('YouTube.GiftMembershipReceived', (response) => {
	console.debug(response.data);
	YouTubeGiftMembershipReceived(response.data);
})

client.on('Streamlabs.Donation', (response) => {
	console.debug(response.data);
	StreamlabsDonation(response.data);
})

client.on('StreamElements.Tip', (response) => {
	console.debug(response.data);
	StreamElementsTip(response.data);
})



///////////////////////
// MULTICHAT OVERLAY //
///////////////////////

async function TwitchChatMessage(data) {
	// Get a reference to the template
	const template = document.getElementById('messageTemplate');

	// Create a new instance of the template
	const instance = template.content.cloneNode(true);

	// Get divs
	const messageContainerDiv = instance.querySelector("#messageContainer");
	const firstMessageDiv = instance.querySelector("#firstMessage");
	const replyDiv = instance.querySelector("#reply");
	const replyUserDiv = instance.querySelector("#replyUser");
	const replyMsgDiv = instance.querySelector("#replyMsg");
	const userInfoDiv = instance.querySelector("#userInfo");
	const avatarDiv = instance.querySelector("#avatar");
	const timestampDiv = instance.querySelector("#timestamp");
	const platformDiv = instance.querySelector("#platform");
	const badgeListDiv = instance.querySelector("#badgeList");
	const pronounsDiv = instance.querySelector("#pronouns");
	const usernameDiv = instance.querySelector("#username");
	const messageDiv = instance.querySelector("#message");

	// Set First Time Chatter
	const firstMessage = data.message.firstMessage;
	if (firstMessage) {
		firstMessageDiv.style.display = 'block';
		messageContainerDiv.classList.add("firstMessageHighlight");
	}

	// Set Reply Message
	const isReply = data.message.isReply;
	if (isReply) {
		const replyUser = data.message.reply.userName;
		const replyMsg = data.message.reply.msgBody;

		replyDiv.style.display = 'block';
		replyUserDiv.innerText = replyUser;
		replyMsgDiv.innerText = replyMsg;
	}

	// Set timestamp
	timestampDiv.classList.add("timestamp");
	timestampDiv.innerText = GetCurrentTimeFormatted();

	// Set the username info
	usernameDiv.innerText = data.message.displayName;
	usernameDiv.style.color = data.message.color;

	// Set pronouns
	const pronouns = await GetPronouns('twitch', data.message.username);
	if (pronouns)
	{
		pronounsDiv.classList.add("pronouns");
		pronounsDiv.innerText = pronouns;
	}

	// Set the message data
	const message = data.message.message;
	const messageColor = data.message.color;
	const role = data.message.role;

	// Set message text
	messageDiv.innerText = message;

	// Set the "action" color
	if (data.message.isMe)
		messageDiv.style.color = messageColor;

	// Render platform
	const platformElements = `<img src="icons/platforms/twitch.png" class="platform"/>`;
	platformDiv.innerHTML = platformElements;

	// Render badges
	badgeListDiv.innerHTML = "";
	for (i in data.message.badges) {
		const badge = new Image();
		badge.src = data.message.badges[i].imageUrl;
		badge.classList.add("badge");
		badgeListDiv.appendChild(badge);
	}

	// Render emotes
	for (i in data.emotes) {
		const emoteElement = `<img src="${data.emotes[i].imageUrl}" class="emote"/>`;
		messageDiv.innerHTML = messageDiv.innerHTML.replace(new RegExp(`\\b${data.emotes[i].name}\\b`), emoteElement);
	}

	// Render cheermotes
	for (i in data.cheerEmotes) {
		const cheerEmoteElement = `<img src="${data.cheerEmotes[i].imageUrl}" class="emote"/>`;
		messageDiv.innerHTML = messageDiv.innerHTML.replace(new RegExp(`\\b${data.cheerEmotes[i].name}\\b`), cheerEmoteElement);
	}

	// Render avatars
	const username = data.message.username;
	const avatarURL = await GetAvatar(username);
	const avatar = new Image();
	avatar.src = avatarURL;
	avatar.classList.add("avatar");
	avatarDiv.appendChild(avatar);

	// Hide the header if the same username sends a message twice in a row
	const messageList = document.getElementById("messageList");
	if (messageList.children.length > 0)
	{
		const lastPlatform = messageList.lastChild.dataset.platform;
		const lastUserId = messageList.lastChild.dataset.userId;
		if (lastPlatform == "twitch" & lastUserId == data.user.id)
			userInfoDiv.style.display = "none";
	}

	// Embed image
	if (role >= minimumRole & IsImageUrl(message)) {
		const image = new Image();

		image.onload = function() {
			image.style.padding = "20px 0px";
			image.style.width = "100%";
			messageDiv.innerHTML = messageDiv.innerHTML.replace(message, '');
			messageDiv.appendChild(image);
			
			AddMessageItem(instance, data.message.msgId, 'twitch', data.user.id);
		};

		image.src = message;
	}
	else
	{
		AddMessageItem(instance, data.message.msgId, 'twitch', data.user.id);
	}
}

async function TwitchAutomaticRewardRedemption(data) {
	// Get a reference to the template
	const template = document.getElementById('messageTemplate');

	// Create a new instance of the template
	const instance = template.content.cloneNode(true);

	// Get divs
	const messageContainerDiv = instance.querySelector("#messageContainer");
	const firstMessageDiv = instance.querySelector("#firstMessage");
	const replyDiv = instance.querySelector("#reply");
	const replyUserDiv = instance.querySelector("#replyUser");
	const replyMsgDiv = instance.querySelector("#replyMsg");
	const userInfoDiv = instance.querySelector("#userInfo");
	const avatarDiv = instance.querySelector("#avatar");
	const timestampDiv = instance.querySelector("#timestamp");
	const platformDiv = instance.querySelector("#platform");
	const badgeListDiv = instance.querySelector("#badgeList");
	const usernameDiv = instance.querySelector("#username");
	const messageDiv = instance.querySelector("#message");

	if (data.reward_type != 'gigantify_an_emote')
		return;

	userInfoDiv.style.display = "none";

	// Show the gigantified emote
	const gigaEmote = data.gigantified_emote.imageUrl;
	const image = new Image();
	image.src = gigaEmote;
	image.style.padding = "20px 0px";
	image.style.width = "50%";

	image.onload = function () {
		messageDiv.innerHTML = '';
		messageDiv.appendChild(image);
	}

	AddMessageItem(instance, data.id);
}

async function TwitchAnnouncement(data) {
	// Get a reference to the template
	const template = document.getElementById('cardTemplate');

	// Create a new instance of the template
	const instance = template.content.cloneNode(true);

	// Get divs
	const cardDiv = instance.querySelector("#card");
	const headerDiv = instance.querySelector("#header");
	const avatarDiv = instance.querySelector("#avatar");
	const timestampDiv = instance.querySelector("#timestamp");
	const iconDiv = instance.querySelector("#icon");
	const titleDiv = instance.querySelector("#title");
	const contentDiv = instance.querySelector("#contentDiv");

	// Set the card background colors
	switch (data.announcementColor) {
		case "BLUE":
			cardDiv.classList.add('announcementBlue');
			break;
		case "GREEN":
			cardDiv.classList.add('announcementGreen');
			break;
		case "ORANGE":
			cardDiv.classList.add('announcementOrange');
			break;
		case "PURPLE":
			cardDiv.classList.add('announcementPurple');
			break;
	}

	// Set the card header
	iconDiv.innerText = "📢";
	titleDiv.innerText = "Announcement";

	// Get a reference to the message template
	const contentTemplate = document.getElementById('messageTemplate');

	// Create a new instance of the template
	const content = contentTemplate.content.cloneNode(true);	

	// Set timestamp
	content.querySelector("#timestamp").classList.add("timestamp");
	content.querySelector("#timestamp").innerText = GetCurrentTimeFormatted();

	content.querySelector("#username").innerText = data.user.name;
	content.querySelector("#username").style.color = data.user.color;
	content.querySelector("#message").innerText = data.text;

	// Remove the line break
	content.querySelector("#colon-separator").style.display = `inline`;
	content.querySelector("#line-space").style.display = `none`;

	// Render platform
	content.querySelector("#platform").style.display = `none`;

	// Render badges
	content.querySelector("#badgeList").innerHTML = "";
	for (i in data.user.badges) {
		const badge = new Image();
		badge.src = data.user.badges[i].imageUrl;
		badge.classList.add("badge");
		content.querySelector("#badgeList").appendChild(badge);
	}

	// Set pronouns
	const pronouns = await GetPronouns('twitch', data.user.login);
	if (pronouns)
	{
		content.querySelector("#pronouns").classList.add("pronouns");
		content.querySelector("#pronouns").innerText = pronouns;
	}

	// Render emotes
	for (i in data.parts) {
		if (data.parts[i].type == `emote`) {
			const emoteElement = `<img src="${data.parts[i].imageUrl}" class="emote"/>`;
			content.querySelector("#message").innerHTML = content.querySelector("#message").innerHTML.replace(new RegExp(`\\b${data.parts[i].text}\\b`), emoteElement);
		}
	}

	// Insert the modified template instance into the DOM
	instance.querySelector("#content").appendChild(content);

	AddMessageItem(instance, data.messageId);
}

async function TwitchSub(data) {
	// Get a reference to the template
	const template = document.getElementById('cardTemplate');

	// Create a new instance of the template
	const instance = template.content.cloneNode(true);

	// Get divs
	const cardDiv = instance.querySelector("#card");
	const headerDiv = instance.querySelector("#header");
	const avatarDiv = instance.querySelector("#avatar");
	const iconDiv = instance.querySelector("#icon");
	const titleDiv = instance.querySelector("#title");
	const contentDiv = instance.querySelector("#contentDiv");

	// Set the card background colors
	cardDiv.classList.add('twitch');

	// Set the card header
	for (i in data.user.badges) {
		if (data.user.badges[i].name == "subscriber") {
			const badge = new Image();
			badge.src = data.user.badges[i].imageUrl;
			badge.classList.add("badge");
			iconDiv.appendChild(badge);
		}
	}

	// Set the text
	const username = data.user.name;
	const subTier = data.sub_tier;
	const isPrime = data.is_prime;

	if (!isPrime)
		titleDiv.innerText = `${username} subscribed with Tier ${subTier.charAt(0)}`;
	else
		titleDiv.innerText = `${username} used their Prime Sub`;

	AddMessageItem(instance, data.messageId);
}

async function TwitchResub(data) {
	// Get a reference to the template
	const template = document.getElementById('cardTemplate');

	// Create a new instance of the template
	const instance = template.content.cloneNode(true);

	// Get divs
	const cardDiv = instance.querySelector("#card");
	const headerDiv = instance.querySelector("#header");
	const avatarDiv = instance.querySelector("#avatar");
	const iconDiv = instance.querySelector("#icon");
	const titleDiv = instance.querySelector("#title");
	const contentDiv = instance.querySelector("#content");

	// Set the card background colors
	cardDiv.classList.add('twitch');

	// Set the card header
	for (i in data.user.badges) {
		if (data.user.badges[i].name == "subscriber") {
			const badge = new Image();
			badge.src = data.user.badges[i].imageUrl;
			badge.classList.add("badge");
			iconDiv.appendChild(badge);
		}
	}

	// Set the text
	const username = data.user.name;
	const subTier = data.subTier;
	const isPrime = data.isPrime;
	const cumulativeMonths = data.cumulativeMonths;
	const message = data.text;

	if (!isPrime)
		titleDiv.innerText = `${username} resubscribed with Tier ${subTier.charAt(0)} (${cumulativeMonths} months)`;
	else
		titleDiv.innerText = `${username} used their Prime Sub (${cumulativeMonths} months)`;
	contentDiv.innerText = `${message}`;

	AddMessageItem(instance, data.messageId);
}

async function TwitchGiftSub(data) {
	// Get a reference to the template
	const template = document.getElementById('cardTemplate');

	// Create a new instance of the template
	const instance = template.content.cloneNode(true);

	// Get divs
	const cardDiv = instance.querySelector("#card");
	const headerDiv = instance.querySelector("#header");
	const avatarDiv = instance.querySelector("#avatar");
	const iconDiv = instance.querySelector("#icon");
	const titleDiv = instance.querySelector("#title");
	const contentDiv = instance.querySelector("#content");

	// Set the card background colors
	cardDiv.classList.add('twitch');

	// Set the card header
	for (i in data.user.badges) {
		if (data.user.badges[i].name == "subscriber") {
			const badge = new Image();
			badge.src = data.user.badges[i].imageUrl;
			badge.classList.add("badge");
			iconDiv.appendChild(badge);
		}
	}

	// Set the text
	const username = data.user.name;
	const subTier = data.subTier;
	const recipient = data.recipient.name;
	const cumlativeTotal = data.cumlativeTotal;

	titleDiv.innerText = `${username} gifted a Tier ${subTier.charAt(0)} subscription to ${recipient}`;
	if (cumlativeTotal > 0)
		contentDiv.innerText = `They've gifted ${cumlativeTotal} subs in total!`;

	AddMessageItem(instance, data.messageId);
}

async function TwitchRaid(data) {
	// Get a reference to the template
	const template = document.getElementById('cardTemplate');

	// Create a new instance of the template
	const instance = template.content.cloneNode(true);

	// Get divs
	const cardDiv = instance.querySelector("#card");
	const headerDiv = instance.querySelector("#header");
	const avatarDiv = instance.querySelector("#avatar");
	const iconDiv = instance.querySelector("#icon");
	const titleDiv = instance.querySelector("#title");
	const contentDiv = instance.querySelector("#content");

	// Set the card background colors
	cardDiv.classList.add('twitch');

	// Render avatars
	const username = data.from_broadcaster_user_login;
	const avatarURL = await GetAvatar(username);
	const avatar = new Image();
	avatar.src = avatarURL;
	avatar.classList.add("avatar");
	avatarDiv.appendChild(avatar);

	// Set the text
	const viewers = data.viewers;

	titleDiv.innerText = `${username} is raiding`;
	contentDiv.innerText = `with a party of ${viewers}`;

	AddMessageItem(instance, data.messageId);
}

function TwitchChatMessageDeleted(data) {
	const messageList = document.getElementById("messageList");

	// Maintain a list of chat messages to delete
	const messagesToRemove = [];

	// ID of the message to remove
	const messageId = data.messageId;

	// Find the items to remove
	for (let i = 0; i < messageList.children.length; i++) {
		if (messageList.children[i].id === messageId) {
			messagesToRemove.push(messageList.children[i]);
		}
	}

	// Remove the items
	messagesToRemove.forEach(item => {
		messageList.removeChild(item);
	});
}

function TwitchUserBanned(data) {
	const messageList = document.getElementById("messageList");

	// Maintain a list of chat messages to delete
	const messagesToRemove = [];

	// ID of the message to remove
	const userId = data.user_id;

	// Find the items to remove
	for (let i = 0; i < messageList.children.length; i++) {
		if (messageList.children[i].dataset.userId === userId) {
			messagesToRemove.push(messageList.children[i]);
		}
	}

	// Remove the items
	messagesToRemove.forEach(item => {
		messageList.removeChild(item);
	});
}

function TwitchChatCleared(data) {
	const messageList = document.getElementById("messageList");

	while (messageList.firstChild) {
		messageList.removeChild(messageList.firstChild);
	}
}

function YouTubeMessage(data) {
	// Get a reference to the template
	const template = document.getElementById('messageTemplate');

	// Create a new instance of the template
	const instance = template.content.cloneNode(true);

	// Get divs
	const userInfoDiv = instance.querySelector("#userInfo");
	const avatarDiv = instance.querySelector("#avatar");
	const timestampDiv = instance.querySelector("#timestamp");
	const platformDiv = instance.querySelector("#platform");
	const badgeListDiv = instance.querySelector("#badgeList");
	const usernameDiv = instance.querySelector("#username");
	const messageDiv = instance.querySelector("#message");

	// Set timestamp
	timestampDiv.classList.add("timestamp");
	timestampDiv.innerText = GetCurrentTimeFormatted();

	// Set the message data
	usernameDiv.innerText = data.user.name;
	usernameDiv.style.color = "#f70000";	// YouTube users do not have colors, so just set it to red
	messageDiv.innerText = data.message;

	// Render platform
	const platformElements = `<img src="icons/platforms/youtube.png" class="platform"/>`;
	platformDiv.innerHTML = platformElements;

	// Render badges
	if (data.user.isOwner) {
		const badge = new Image();
		badge.src = `icons/badges/youtube-broadcaster.svg`;
		badge.style.filter = `invert(100%)`;
		badge.style.opacity = 0.8;
		badge.classList.add("badge");
		badgeListDiv.appendChild(badge);
	}

	if (data.user.isModerator) {
		const badge = new Image();
		badge.src = `icons/badges/youtube-moderator.svg`;
		badge.style.filter = `invert(100%)`;
		badge.style.opacity = 0.8;
		badge.classList.add("badge");
		badgeListDiv.appendChild(badge);
	}

	if (data.user.isSponsor) {
		const badge = new Image();
		badge.src = `icons/badges/youtube-member.svg`;
		badge.style.filter = `invert(100%)`;
		badge.style.opacity = 0.8;
		badge.classList.add("badge");
		badgeListDiv.appendChild(badge);
	}

	if (data.user.isVerified) {
		const badge = new Image();
		badge.src = `icons/badges/youtube-verified.svg`;
		badge.style.filter = `invert(100%)`;
		badge.style.opacity = 0.8;
		badge.classList.add("badge");
		badgeListDiv.appendChild(badge);
	}

	// Render emotes
	for (i in data.emotes) {
		const emoteElement = `<img src="${data.emotes[i].imageUrl}" class="emote"/>`;		
		messageDiv.innerHTML = messageDiv.innerHTML.replace(new RegExp(`\\b${data.emotes[i].name}\\b`), emoteElement);
	}

	// Render avatars
	const avatar = new Image();
	avatar.src = data.user.profileImageUrl;
	avatar.classList.add("avatar");
	avatarDiv.appendChild(avatar);

	// Hide the header if the same username sends a message twice in a row
	const messageList = document.getElementById("messageList");
	if (messageList.children.length > 0)
	{
		const lastPlatform = messageList.lastChild.dataset.platform;
		const lastUserId = messageList.lastChild.dataset.userId;
		if (lastPlatform == "youtube" & lastUserId == username)
			userInfoDiv.style.display = "none";
	}

	AddMessageItem(instance, data.eventId, 'youtube', username);
}

function YouTubeSuperChat(data) {
	// Get a reference to the template
	const template = document.getElementById('cardTemplate');

	// Create a new instance of the template
	const instance = template.content.cloneNode(true);

	// Get divs
	const cardDiv = instance.querySelector("#card");
	const headerDiv = instance.querySelector("#header");
	const avatarDiv = instance.querySelector("#avatar");
	const iconDiv = instance.querySelector("#icon");
	const titleDiv = instance.querySelector("#title");
	const contentDiv = instance.querySelector("#content");

	// Set the card background colors
	cardDiv.classList.add('youtube');

	// Set message text
	titleDiv.innerText = `🪙 ${data.user.name} sent a Super Chat (${data.amount})`;
	contentDiv.innerText = `${data.message}!`;

	AddMessageItem(instance, data.eventId);
}

function YouTubeSuperSticker(data) {

	// Get a reference to the template
	const template = document.getElementById('cardTemplate');

	// Create a new instance of the template
	const instance = template.content.cloneNode(true);

	// Get divs
	const cardDiv = instance.querySelector("#card");
	const headerDiv = instance.querySelector("#header");
	const avatarDiv = instance.querySelector("#avatar");
	const iconDiv = instance.querySelector("#icon");
	const titleDiv = instance.querySelector("#title");
	const contentDiv = instance.querySelector("#content");

	// Set the card background colors
	cardDiv.classList.add('youtube');

	const stickerTemplate = document.getElementById('stickerTemplate');

	// Create a new instance of the template
	const stickerInstance = stickerTemplate.content.cloneNode(true);

	// Render sticker
	stickerInstance.querySelector("#stickerImg").src = FindFirstImageUrl(data);
	stickerInstance.querySelector("#stickerLabel").innerText = `${data.user.name} sent a Super Sticker (${data.amount})`;

	contentDiv.appendChild(stickerInstance);

	AddMessageItem(instance, data.eventId);
}

function YouTubeNewSponsor(data) {
	// Get a reference to the template
	const template = document.getElementById('cardTemplate');

	// Create a new instance of the template
	const instance = template.content.cloneNode(true);

	// Get divs
	const cardDiv = instance.querySelector("#card");
	const headerDiv = instance.querySelector("#header");
	const avatarDiv = instance.querySelector("#avatar");
	const iconDiv = instance.querySelector("#icon");
	const titleDiv = instance.querySelector("#title");
	const contentDiv = instance.querySelector("#content");

	// Set the card background colors
	cardDiv.classList.add('youtube');

	// Set message text
	titleDiv.innerText = `⭐ New ${data.levelName}`;
	contentDiv.innerText = `Welcome ${data.user.name}!`;

	AddMessageItem(instance, data.eventId);
}

function YouTubeGiftMembershipReceived(data) {
	// Get a reference to the template
	const template = document.getElementById('cardTemplate');

	// Create a new instance of the template
	const instance = template.content.cloneNode(true);

	// Get divs
	const cardDiv = instance.querySelector("#card");
	const headerDiv = instance.querySelector("#header");
	const avatarDiv = instance.querySelector("#avatar");
	const iconDiv = instance.querySelector("#icon");
	const titleDiv = instance.querySelector("#title");
	const contentDiv = instance.querySelector("#content");

	// Set the card background colors
	cardDiv.classList.add('youtube');

	// Set message text
	titleDiv.innerText = `🎁 ${data.gifter.name} gifted a membership`;
	contentDiv.innerText = `to ${data.user.name} (${data.tier})!`;

	AddMessageItem(instance, data.eventId);
}

async function StreamlabsDonation(data) {
	// Get a reference to the template
	const template = document.getElementById('cardTemplate');

	// Create a new instance of the template
	const instance = template.content.cloneNode(true);

	// Get divs
	const cardDiv = instance.querySelector("#card");
	const headerDiv = instance.querySelector("#header");
	const avatarDiv = instance.querySelector("#avatar");
	const iconDiv = instance.querySelector("#icon");
	const titleDiv = instance.querySelector("#title");
	const contentDiv = instance.querySelector("#content");

	// Set the card background colors
	cardDiv.classList.add('streamlabs');

	// Set the text
	const donater = data.from;
	const formattedAmount = data.formattedAmount;
	const currency = data.currency;
	const message = data.message;

	titleDiv.innerText = `🪙 ${donater} donated ${currency}${formattedAmount}`;
	contentDiv.innerText = `${message}`;

	AddMessageItem(instance);
}

async function StreamElementsTip(data) {
	// Get a reference to the template
	const template = document.getElementById('cardTemplate');

	// Create a new instance of the template
	const instance = template.content.cloneNode(true);

	// Get divs
	const cardDiv = instance.querySelector("#card");
	const headerDiv = instance.querySelector("#header");
	const avatarDiv = instance.querySelector("#avatar");
	const iconDiv = instance.querySelector("#icon");
	const titleDiv = instance.querySelector("#title");
	const contentDiv = instance.querySelector("#content");

	// Set the card background colors
	cardDiv.classList.add('streamelements');

	// Set the text
	const donater = data.username;
	const formattedAmount = `$${data.amount}`;
	const currency = data.currency;
	const message = data.message;

	titleDiv.innerText = `🪙 ${donater} donated ${currency}${formattedAmount}`;
	contentDiv.innerText = `${message}`;

	AddMessageItem(instance, data.id);
}



//////////////////////
// HELPER FUNCTIONS //
//////////////////////

function GetCurrentTimeFormatted() {
	const now = new Date();
	let hours = now.getHours();
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const ampm = hours >= 12 ? 'PM' : 'AM';

	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'

	const formattedTime = `${hours}:${minutes} ${ampm}`;
	return formattedTime;
}

async function GetAvatar(username) {
	if (avatarMap.has(username)) {
		console.debug(`Avatar found for ${username}. Retrieving from hash map.`)
		return avatarMap.get(username);
	}
	else {
		console.debug(`No avatar found for ${username}. Retrieving from Decapi.`)
		let response = await fetch('https://decapi.me/twitch/avatar/' + username);
		let data = await response.text()
		avatarMap.set(username, data);
		return data;
	}
}

async function GetPronouns(platform, username) {
	const response = await client.getUserPronouns(platform, username);
	const userFound = response.pronoun.userFound;
	const pronouns = `${response.pronoun.pronounSubject}/${response.pronoun.pronounObject}`;

	if (userFound)
		return `${response.pronoun.pronounSubject}/${response.pronoun.pronounObject}`;
	else
		return '';
}

function IsImageUrl(url) {
	return url.match(/^http.*\.(jpeg|jpg|gif|png)$/) != null;
}

function AddMessageItem(element, elementID, platform, userId) {
	// Calculate the height of the div before inserting
	const tempDiv = document.getElementById('IPutThisHereSoICanCalculateHowBigEachMessageIsSupposedToBeBeforeIAddItToTheMessageList');
	tempDiv.appendChild(element);

	setTimeout(function () {
		const calculatedHeight = tempDiv.clientHeight + "px";

		// Create a new line item to add to the message list later
		var lineItem = document.createElement('li');
		lineItem.id = elementID;
		lineItem.dataset.platform = platform;
		lineItem.dataset.userId = userId;

		// Move the element from the temp div to the new line item
		while (tempDiv.firstChild) {
			lineItem.appendChild(tempDiv.firstChild);
		}

		// Add the line item to the list and animate it
		// We need to manually set the height as straight CSS can't animate on "height: auto"
		messageList.appendChild(lineItem);
		setTimeout(function () {
			lineItem.className = lineItem.className + " show";
			lineItem.style.height = calculatedHeight;
		}, 10);

		// Remove old messages that have gone off screen to save memory
		while (messageList.clientHeight > 5 * window.innerHeight) {
			messageList.removeChild(messageList.firstChild);
		}

		tempDiv.innerHTML = '';

	}, 100);
}

// I used Gemini for this shit so if it doesn't work, blame Google
function FindFirstImageUrl(jsonObject) {
	if (typeof jsonObject !== 'object' || jsonObject === null) {
		return null; // Handle invalid input
	}

	function iterate(obj) {
		if (Array.isArray(obj)) {
			for (const item of obj) {
				const result = iterate(item);
				if (result) {
					return result;
				}
			}
			return null;
		}

		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (key === 'imageUrl') {
					return obj[key]; // Found it! Return the value.
				}

				if (typeof obj[key] === 'object' && obj[key] !== null) {
					const result = iterate(obj[key]); // Recursive call for nested objects
					if (result) {
						return result; // Propagate the found value
					}
				}
			}
		}
		return null; // Key not found in this level
	}

	return iterate(jsonObject);
}



///////////////////////////////////
// STREAMER.BOT WEBSOCKET STATUS //
///////////////////////////////////

// This function sets the visibility of the Streamer.bot status label on the overlay
function SetConnectionStatus(connected) {
	let statusContainer = document.getElementById("statusContainer");
	if (connected) {
		statusContainer.style.background = "#2FB774";
		statusContainer.innerText = "Connected!";
		statusContainer.style.opacity = 1;
		setTimeout(() => {
			statusContainer.style.transition = "all 2s ease";
			statusContainer.style.opacity = 0;
		}, 10);
	}
	else {
		statusContainer.style.background = "#D12025";
		statusContainer.innerText = "Connecting...";
		statusContainer.style.transition = "";
		statusContainer.style.opacity = 1;
	}
}

// let data = `{
//     "tier": "MVP",
//     "gifter": {
//         "id": "UCoRAcQTA-wMmKs0-wzdTv_Q",
//         "url": "http://www.youtube.com/channel/UCoRAcQTA-wMmKs0-wzdTv_Q",
//         "name": "Braden1026",
//         "profileImageUrl": "https://yt3.ggpht.com/6xJpCBeqZnrfLhd8UQxAW6m0X3B82Gv5W8wvk-tou70CO6Mfg8q80m5j8sag3FYw6odUlCXQeg=s88-c-k-c0x00ffffff-no-rj",
//         "isOwner": false,
//         "isModerator": false,
//         "isSponsor": true,
//         "isVerified": false
//     },
//     "eventId": "LCC.EhwKGkNON3gwX0hjLUlzREZZb0sxZ0FkdzZFd2xn",
//     "user": {
//         "id": "UCeP_O6Yrzh_6tTeqmOzPSgA",
//         "url": "http://www.youtube.com/channel/UCeP_O6Yrzh_6tTeqmOzPSgA",
//         "name": "Jay Little",
//         "profileImageUrl": "https://yt3.ggpht.com/0etJfax2KXCioZiagFV8jEDYfhjR-1IKoQ6caLO594bcdk3M1tOzQuEUTmtip1AAW-tOEznDZg=s88-c-k-c0x00ffffff-no-rj",
//         "isOwner": false,
//         "isModerator": false,
//         "isSponsor": true,
//         "isVerified": false
//     },
//     "publishedAt": "2025-03-08T06:41:14.925125+11:00"
// }`;

// YouTubeGiftMembershipReceived(JSON.parse(data));