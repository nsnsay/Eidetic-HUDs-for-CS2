import { positionClass } from '/hud/helpers/position-class.js';
import { teamColorClass } from '/hud/helpers/team-color-class.js';
import Digits from '/hud/digits/digits.vue';

export default {
    components: {
        Digits,
        positionClass,
        teamColorClass,
    },
    props: [
        'position',
        'team',
    ],
    computed: {
        positionClass,
        isBombActive() {
			return this.player?.bomb?.isActive
		},
        player() {
            return this.$players.focused || {}; // 确保 player 至少是一个空对象
        },
        colorClass() {
			return teamColorClass(this.player.team)
        },
    },
    methods: {

    },
};