import { positionClass } from '/hud/helpers/position-class.js'
import { teamColorClass } from '/hud/helpers/team-color-class.js'
import newmoney from '/hud/sidebars2/sidebar/player/newmoney/newmoney.vue'
import Primary from '/hud/sidebars2/sidebar/player/primary/primary.vue'
import newkd from '/hud/sidebars2/sidebar/player/newkd/newkd.vue'
import newhealth from '/hud/sidebars2/sidebar/player/newhealth/newhealth.vue'
import newname from '/hud/sidebars2/sidebar/player/newname/newname.vue'
import healthbar from '/hud/sidebars2/sidebar/player/health-bar/health-bar.vue'

export default {
	props: [
		'position',
		'player',
	],

	components: {
		newmoney,
		Primary,
		newkd,
		newhealth,
		newname,
		healthbar,
	},

	data() {
		return {
			logoImageLoaded: false,
			defaultLogoUrl: '/hud/player-logos/player.webp',
		}
	},

	computed: {
		positionClass,

		isBombActive() {
			return !! this.player?.bomb?.isActive
		},

		leftTeamAlive() {
			return this.countAlivePlayers(this.$teams[0])
		},

		rightTeamAlive() {
			return this.countAlivePlayers(this.$teams[1])
		},

		colorClass() {
			return teamColorClass(this.player.team)
		},

		isLastManStanding() {  // 新添加的计算属性
			return this.leftTeamAlive === 1 && this.rightTeamAlive === 1;
		},

		liveTitle() { // 新增计算属性，动态生成标题
			const left = this.leftTeamAlive;
			const right = this.rightTeamAlive;
			if (left === 1 || right === 1) {
				return 'Clutch Versus';
			} else {
				return 'Players Alive';
			}
		},

		iconUrl() {
			return `/hud/img/weapons/${this.player.primary.unprefixedName}.svg`
		},

		siconUrl() {
			return `/hud/img/weapons/${this.player.secondary.unprefixedName}.svg`
		},

		grenades() {
			let foundPerType = {}

			return this.player.grenades.map((grenade) => {
				foundPerType[grenade.name] = (foundPerType[grenade.name] || 0) + 1

				return {
					iconUrl: `/hud/img/weapons/${grenade.unprefixedName}.svg`,
					isActive: grenade.isActive,
					key: `${grenade.name}${foundPerType[grenade.name]}`,
				}
			})
		},
	},

	methods: {
		getPlayerLogoUrl(name) {
			return `/hud/player-logos/${name}.png`;
		},

		handleImageError(event) {
			event.target.src = this.defaultLogoUrl;
			this.logoImageLoaded = true;
		},

		countAlivePlayers(team) {
			let alive = 0

			for (const player of team.players) {
				if (player.isAlive) alive++
			}

			return alive
		},
	},
}