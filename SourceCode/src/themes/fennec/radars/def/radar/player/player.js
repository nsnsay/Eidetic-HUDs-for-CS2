import AlivePlayer from '/hud/radars/def/radar/player/alive-player/alive-player.vue'
import DeadPlayer from '/hud/radars/def/radar/player/dead-player/dead-player.vue'

export default {
	props: [
		'player',
	],

	components: {
		AlivePlayer,
		DeadPlayer,
	},
}
