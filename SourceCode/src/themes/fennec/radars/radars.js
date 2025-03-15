import bolt from '/hud/radars/bolt/bolt.vue'
import radar from '/hud/radars/def/radar/radar.vue'

export default {
	components: {
        radar,
		bolt,
	},
	data() {
		return {
			logoImageLoaded: false,
		}
	},
}