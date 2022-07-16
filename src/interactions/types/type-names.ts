import {TickerType} from '@prisma/client';

export const tickerTypeNames: Record<TickerType, string> = {
	[TickerType.GITHUB_REPO_STARS]: 'GitHub repository stars (input required)',
	[TickerType.GITHUB_REPO_FORKS]: 'GitHub repository forks (input required)',
	[TickerType.GITHUB_REPO_ISSUES]: 'GitHub repository issues (input required)',
	[TickerType.GITHUB_FOLLOWERS]: 'GitHub followers (input required)',
	[TickerType.TWITCH_FOLLOWERS]: 'Twitch followers (input required)',
	[TickerType.TWITTER_FOLLOWERS]: 'Twitter followers (input required)',
	[TickerType.YOUTUBE_SUBSCRIBERS]: 'YouTube subscribers (input required)',
	[TickerType.YOUTUBE_VIEWCOUNT]: 'YouTube view count (input required)',
	[TickerType.DISCORD_MEMBERS]: 'Discord members',
	[TickerType.DISCORD_MEMBERS_ROLE]: 'Discord members in a role (input required)',
	[TickerType.DISCORD_BOOSTS]: 'Discord server boosts',
	[TickerType.DISCORD_HUMANS]: 'Discord members (only users)',
	[TickerType.DISCORD_BOTS]: 'Discord members (only bots)',
	[TickerType.REDDIT_SUBSCRIBERS]: 'Reddit Subreddit subscribers',
	[TickerType.OPENSEA_COLLECTION_FLOOR]: 'OpenSea collection floor price (input required)',
	[TickerType.OPENSEA_COLLECTION_VOLUME]: 'OpenSea collection total volume (input required)',
	[TickerType.OPENSEA_COLLECTION_UNIQUE_HOLDERS]:
		'OpenSea collection unique holders (input required)',
	[TickerType.OPENSEA_COLLECTION_SUPPLY]: 'OpenSea collection supply (input required)',
	[TickerType.SELF_TICKERS]: 'Global ticker count',
	[TickerType.SELF_GUILDS]: 'Global servers StreamTicker is in',
	[TickerType.GUILD_TICKERS]: 'Server ticker count',
	[TickerType.INSTAGRAM_FOLLOWERS]: 'Instagram followers (input required)',
};

export const tickerDescriptions: Record<TickerType, string> = {
	[TickerType.GITHUB_REPO_STARS]: 'The amount of stars on a public GitHub repository',
	[TickerType.GITHUB_REPO_FORKS]: 'The amount of forks on a public GitHub repository',
	[TickerType.GITHUB_REPO_ISSUES]: 'The amount of open issues on a public GitHub repository',
	[TickerType.GITHUB_FOLLOWERS]: 'The amount of followers on a GitHub user',
	[TickerType.TWITCH_FOLLOWERS]: 'The amount of followers on a Twitch user',
	[TickerType.TWITTER_FOLLOWERS]: 'The amount of followers on a Twitter user',
	[TickerType.YOUTUBE_SUBSCRIBERS]: 'The amount of subscribers on a YouTube channel',
	[TickerType.YOUTUBE_VIEWCOUNT]: 'The amount of views on a YouTube channel',
	[TickerType.DISCORD_MEMBERS]: 'The amount of members in a Discord server',
	[TickerType.DISCORD_MEMBERS_ROLE]:
		'The amount of members in a Discord server with a specific role',
	[TickerType.DISCORD_BOOSTS]: 'The amount of boosts in a Discord server',
	[TickerType.DISCORD_HUMANS]: 'The amount of human members in a Discord server',
	[TickerType.DISCORD_BOTS]: 'The amount of bot members in a Discord server',
	[TickerType.REDDIT_SUBSCRIBERS]: 'The amount of subscribers on a Subreddit',
	[TickerType.OPENSEA_COLLECTION_FLOOR]: 'The floor price of an OpenSea collection',
	[TickerType.OPENSEA_COLLECTION_VOLUME]: 'The total volume of an OpenSea collection',
	[TickerType.OPENSEA_COLLECTION_UNIQUE_HOLDERS]:
		'The amount of unique holders of an OpenSea collection',
	[TickerType.OPENSEA_COLLECTION_SUPPLY]: 'The supply of an OpenSea collection',
	[TickerType.TWITTER_FOLLOWERS]: 'The amount of followers on a Twitter user',
	[TickerType.SELF_TICKERS]: 'The amount of tickers created by the bot globally',
	[TickerType.SELF_GUILDS]: 'The amount of guilds StreamTicker is used in',
	[TickerType.GUILD_TICKERS]: 'The amount of tickers created by the bot in this server',
	[TickerType.INSTAGRAM_FOLLOWERS]: 'The amount of followers an Instagram user has',
};

// export const defaultTickerFormats: Record<
// 	TickerType,
// 	`${string}${typeof AbstractHarvester.FORMATTER_REPLACER}${string}`
// > = {
// 	[TickerType.GITHUB_REPO_STARS]: 'Repo Stars: %v',
// 	[TickerType.GITHUB_REPO_FORKS]: 'Repo Forks: %v',
// 	[TickerType.GITHUB_REPO_ISSUES]: 'Repo Issues: %v',
// 	[TickerType.GITHUB_FOLLOWERS]: 'GitHub Followers: %v',
// 	[TickerType.TWITCH_FOLLOWERS]: 'Twitch Followers: %v',
// 	[TickerType.TWITTER_FOLLOWERS]: 'Twitter Followers: %v',
// 	[TickerType.YOUTUBE_SUBSCRIBERS]: 'Subscribers: %v',
// 	[TickerType.YOUTUBE_VIEWCOUNT]: 'Views: %v',
// 	[TickerType.DISCORD_MEMBERS]: 'Members: %v',
// 	[TickerType.DISCORD_MEMBERS_ROLE]: 'Humans with role: %v',
// 	[TickerType.DISCORD_BOOSTS]: 'Server Boosts: %v',
// 	[TickerType.DISCORD_HUMANS]: 'Humans: %v',
// 	[TickerType.DISCORD_BOTS]: 'Bots: %v',
// 	[TickerType.REDDIT_SUBSCRIBERS]: 'Reddit Subscribers: %v',
// 	[TickerType.OPENSEA_COLLECTION_FLOOR]: 'Floor: %v Ξ',
// 	[TickerType.OPENSEA_COLLECTION_VOLUME]: 'Volume: %v Ξ',
// 	[TickerType.OPENSEA_COLLECTION_UNIQUE_HOLDERS]: 'Unique Holders: %v',
// 	[TickerType.OPENSEA_COLLECTION_SUPPLY]: 'Supply: %v',
// 	[TickerType.SELF_TICKERS]: 'Global Tickers: %v',
// 	[TickerType.SELF_GUILDS]: 'Servers: %v',
// 	[TickerType.GUILD_TICKERS]: 'Tickers: %v',
// 	[TickerType.INSTAGRAM_FOLLOWERS]: 'Followers: %v',
// };