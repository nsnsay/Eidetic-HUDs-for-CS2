/* player.js */
import { positionClass } from '/hud/helpers/position-class.js';
import { teamColorClass } from '/hud/helpers/team-color-class.js';
import newmoney from '/hud/replays/sidebar/player/newmoney/newmoney.vue';
import Primary from '/hud/replays/sidebar/player/primary/primary.vue';
import newkd from '/hud/replays/sidebar/player/newkd/newkd.vue';
import newhealth from '/hud/replays/sidebar/player/newhealth/newhealth.vue';
import newname from '/hud/replays/sidebar/player/newname/newname.vue';
import healthbar from '/hud/replays/sidebar/player/health-bar/health-bar.vue';

export default {
  props: ['position', 'player'],

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
      totalDamage: 0, // 累计的伤害值
      showDamage: false, // 是否显示伤害值
      damageTimeout: null, // 定时器
    };
  },

  computed: {
    positionClass,

    isBombActive() {
      return !!this.player?.bomb?.isActive;
    },

    leftTeamAlive() {
      return this.countAlivePlayers(this.$teams[0]);
    },

    rightTeamAlive() {
      return this.countAlivePlayers(this.$teams[1]);
    },

    colorClass() {
      return teamColorClass(this.player.team);
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
    getTeamLogoUrl(team) {
      const teamClass = teamColorClass(team);
      switch (teamClass) {
        case '--t':
          return '/hud/img/icons/Terrorists.png';
        case '--ct':
          return '/hud/img/icons/Counter Terrorists.png';
        default:
          return '/hud/img/icons/unknown.png'; // 默认图片路径
      }
    },

    handleImageError(event) {
      event.target.src = this.defaultLogoUrl;
      this.logoImageLoaded = true;
    },

    countAlivePlayers(team) {
      let alive = 0;

      for (const player of team.players) {
        if (player.isAlive) alive++;
      }

      return alive;
    },

    calculateDamage(newHealth, oldHealth) {
      // 如果是第一次初始化，设置 lastHealth 为当前血量
      if (this.lastHealth === null) {
        this.lastHealth = newHealth;
        return;
      }

      if (newHealth < oldHealth) {
        const damage = oldHealth - newHealth;
        this.totalDamage += damage; // 累加伤害值
        this.lastHealth = newHealth;

        // 如果伤害值显示区域未显示，则开始显示
        if (!this.showDamage) {
          this.showDamage = true;
        }

        // 清除之前的定时器
        clearTimeout(this.damageTimeout);

        // 3秒后隐藏伤害值并重置
        this.damageTimeout = setTimeout(() => {
          this.resetDamage();
        }, 3000);
      }
    },

    resetDamage() {
      this.totalDamage = 0;
      this.showDamage = false;
    },

    adjustPlayerPositions() {
      // 获取所有玩家
      const players = this.$teams[0].players.concat(this.$teams[1].players);

      // 按原始位置排序
      players.sort((a, b) => a.originalPosition - b.originalPosition);

      // 遍历所有玩家
      players.forEach((player, index) => {
        if (player.isAlive) {
          // 更新玩家的位置
          player.positionClass = `position-${index + 1}`;
        }
      });
    },
  },

  created() {
    // 在组件创建时初始化 lastHealth
    this.lastHealth = this.player.health;
  },

  mounted() {
    // 监听玩家死亡事件，调整玩家位置
    this.$watch(
      () => this.player.isAlive,
      (newValue) => {
        if (!newValue) {
          this.adjustPlayerPositions();
        }
      }
    );
  },
};
