import { teamColorClass } from '/hud/helpers/team-color-class.js';
import { positionClass } from '/hud/helpers/position-class.js';
import Digits from '/hud/digits/digits.vue';
import playerAvatars from '/hud/focused-player/name-and-stats/name-row/player-avatars/player-avatars.vue';

export default {
  props: ['position', 'team', 'match'],
  components: {
    Digits,
    playerAvatars,
    positionClass,
  },
  computed: {
    positionClass,
    player() {
      return this.$players.focused || {}; // 确保 player 至少是一个空对象
    },

    grenades() {
      let foundPerType = {};

      return this.player.grenades.map((grenade) => {
        foundPerType[grenade.name] = (foundPerType[grenade.name] || 0) + 1;

        return {
          iconUrl: `/hud/img/weapons/${grenade.unprefixedName}.svg`,
          isActive: grenade.isActive,
          key: `${grenade.name}${foundPerType[grenade.name]}`,
        };
      });
    },
    data() {
      return {
        logoImageLoaded: false,
      };
    },
    colorClass() {
      if (!this.player || !this.player.team) return ''; // 防止 player.team 未定义
      return teamColorClass(this.player.team);
    },
    weapon() {
      if (!this.player) return null; // 确保 player 存在
      if (this.player.primary?.isActive) return this.player.primary;
      if (this.player.secondary?.isActive) return this.player.secondary;
      return null; // 如果没有武器，返回 null
    },
  },
  methods: {
    getAmmoClip() {
      // 如果 weapon.ammoClip 不存在或为 null，返回默认值 '0'
      return this.weapon?.ammoClip || '1';
    },
    getAmmoReserve() {
      // 如果 weapon.ammoReserve 不存在或为 null，返回默认值 '0'
      return this.weapon?.ammoReserve || '0';
    },
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
  },
};
