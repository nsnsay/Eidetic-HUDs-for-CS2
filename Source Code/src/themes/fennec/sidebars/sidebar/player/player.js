import { positionClass } from '/hud/helpers/position-class.js'
import { teamColorClass } from '/hud/helpers/team-color-class.js'
import newmoney from '/hud/sidebars/sidebar/player/newmoney/newmoney.vue'
import Primary from '/hud/sidebars/sidebar/player/primary/primary.vue'
import newkd from '/hud/sidebars/sidebar/player/newkd/newkd.vue'
import newhealth from '/hud/sidebars/sidebar/player/newhealth/newhealth.vue'
import newname from '/hud/sidebars/sidebar/player/newname/newname.vue'
import healthbar from '/hud/sidebars/sidebar/player/health-bar/health-bar.vue'

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
			lastHealth: null, // 记录上次的血量
			damageValue: 0,  // 当前的伤害值
			showDamage: false, // 是否显示伤害值
			damageTimeout: null, // 定时器
			damageQueue: [], // 存储每次血量减少的伤害值
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

		isLastManStanding() {  
			return this.leftTeamAlive === 1 && this.rightTeamAlive === 1;
		},
	},

	watch: {
		'player.health'(newHealth, oldHealth) {
			this.calculateDamage(newHealth, oldHealth);
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

		calculateDamage(newHealth, oldHealth) {
			// 如果是第一次初始化，设置 lastHealth 为当前血量
			if (this.lastHealth === null) {
				this.lastHealth = newHealth;
				return;
			}

			if (newHealth < oldHealth) {
				const damage = oldHealth - newHealth;
				this.damageQueue.push(damage); // 将伤害值添加到队列中
				this.lastHealth = newHealth;

				// 如果伤害值显示区域未显示，则开始显示
				if (!this.showDamage) {
					this.showDamage = true;
					this.damageValue = this.damageQueue.reduce((sum, val) => sum + val, 0); // 合并所有伤害值

					// 清除之前的定时器
					clearTimeout(this.damageTimeout);

					// 3秒后隐藏伤害值
					this.damageTimeout = setTimeout(() => {
						this.resetDamage();
					}, 3000);
				}
			}
		},

		resetDamage() {
			this.damageValue = 0;
			this.showDamage = false;
			this.damageQueue = []; // 清空伤害值队列
		},
	},

	created() {
		// 在组件创建时初始化 lastHealth
		this.lastHealth = this.player.health;
	},
}