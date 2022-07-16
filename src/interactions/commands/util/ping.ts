import {SlashCommand, SlashCreator, CommandContext} from 'slash-create';

export class PingCommand extends SlashCommand {
	constructor(creator: SlashCreator) {
		super(creator, {
			name: 'ping',
			description: 'Check if StreamTicker is online.',
		});
	}

	async run(ctx: CommandContext) {
		console.log(this.client);
		ctx.send(':ninja:', {
			ephemeral: true,
		});
	}
}