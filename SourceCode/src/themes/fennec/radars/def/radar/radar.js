import Bomb from '/hud/radars/def/radar/bomb/bomb.vue'
import Grenade from '/hud/radars/def/radar/grenade/grenade.vue'
import Player from '/hud/radars/def/radar/player/player.vue'

export default {
	components: {
		Bomb,
		Grenade,
		Player,
	},

	computed: {
		radarConfig() {
			return this.$radars[this.$map.name] || this.$radars[this.$map.sanitizedName]
		},

		radarImageUrl() {
			return this.radarConfig?.radarImageUrl || `/hud/img/radars/simpleradar/${this.$map.sanitizedName}.png`
		},
	},
}
