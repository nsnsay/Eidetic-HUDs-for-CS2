import { formatMapName } from '/hud/helpers/format-map-name.js';
import { seriesMapNumbers } from '/hud/helpers/series-map-numbers.js';

export default {
	components: {
		
	},

	data() {
		return {
			logoImageLoaded: false,
		};
	},

	computed: {
		seriesMapNumbers,
		formattedMapName() {
			if (!this.$map || !this.$map.name) return ''; // 如果 $map.name 不存在，返回空字符串
	  
			// 去掉前缀 "de_"
			let nameWithoutPrefix = this.$map.name.replace(/^de_/, '');
	  
			// 首字母大写
			return nameWithoutPrefix.charAt(0).toUpperCase() + nameWithoutPrefix.slice(1);
		  },
	},

	methods: {
		formatMapName,
		handleImageLoad() {
			this.logoImageLoaded = true;
		},
		handleImageError(event) {
			event.target.style.display = 'none';
		},
		isDecider(mapNumber) {
			return this.$opts[`series.maps.${mapNumber}.isDecider`] === true;
		},
		updateDynamicMapCount() {
			const mapCount = this.seriesMapNumbers.length;
			const backgroundElement = this.$el.querySelector('.map-names-background');
			if (backgroundElement) {
				backgroundElement.setAttribute('data-map-count', mapCount);
			}
		},

		isCurrentMap(mapNumber) {
			// 使用 formatMapName 处理地图名，确保与 formattedMapName 的处理逻辑一致
			const mapName = this.$opts[`series.maps.${mapNumber}.name`];
			return formatMapName(mapName) === this.formattedMapName;
		},
	},
}