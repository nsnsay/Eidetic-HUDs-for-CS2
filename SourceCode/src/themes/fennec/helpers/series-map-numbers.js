export function seriesMapNumbers() {
	const mapNumbers = new Set();
  
	if (!this.$opts) {
	  return [];
	}
  
	for (const key of Object.keys(this.$opts)) {
	  if (key.startsWith('series.maps.')) {
		const segments = key.split('.');
		const mapNumberStr = segments[2];
		const mapNumber = Number(mapNumberStr);
  
		if (!isNaN(mapNumber)) {
		  // 检查该地图编号是否有相关的数据
		  const pickTeamScoreKey = `series.maps.${mapNumber}.pickTeamScore`;
		  const enemyTeamScoreKey = `series.maps.${mapNumber}.enemyTeamScore`;
		  const pickTeamKey = `series.maps.${mapNumber}.pickTeam`;
  
		  if (
			this.$opts[pickTeamScoreKey] !== undefined &&
			this.$opts[enemyTeamScoreKey] !== undefined &&
			this.$opts[pickTeamKey] !== undefined
		  ) {
			mapNumbers.add(mapNumber);
		  }
		}
	  }
	}
  
	if (mapNumbers.size === 0) {
	  return [];
	}
  
	const sortedMapNumbers = [...mapNumbers].sort((a, b) => a - b);
  
	// 截断地图数量为最多5张
	const resultMapNumbers = sortedMapNumbers.slice(0, 3);
  
	return resultMapNumbers;
  }