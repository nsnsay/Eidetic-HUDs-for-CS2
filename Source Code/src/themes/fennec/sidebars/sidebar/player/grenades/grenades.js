import { positionClass } from '/hud/helpers/position-class.js';

export default {
  props: ['position', 'player'],

  computed: {
    positionClass,

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
  },
};
