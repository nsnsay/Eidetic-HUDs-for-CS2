import GrenadeProjectile from '/hud/radars/def/radar/grenade/grenade-projectile/grenade-projectile.vue'
import Inferno from '/hud/radars/def/radar/grenade/inferno/inferno.vue'
import Smoke from '/hud/radars/def/radar/grenade/smoke/smoke.vue'

export default {
	props: [
		'grenade',
	],

	components: {
		GrenadeProjectile,
		Inferno,
		Smoke,
	},
}
