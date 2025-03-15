import Update from '/config/options/update/update.vue'

export default {
	components: {
		Update,
	},

	data() {
		return {
			initialTheme: null,
			optionValues: {},
			sections: [],
			currentSection: null,
			nameOverrideMap: {
				'Preferences': '参数 Prefs',
				'Teams': '团队 Teams',
				'Theme': '主题 Theme',
				'Cvars': '游戏参数设置 Cvars Settings',
				'Displays': 'HUD显示 Displays',
				'Title': '系列标题 Series Title',
				'Series: Map 1': "Map 1",
				'Series: Map 2': "Map 2",
				'Series: Map 3': "Map 3",
				'Series: Map 4': "Map 4",
				'Series: Map 5': "Map 5",
				'样式修改': "样式修改(未完善,.) TODO ing..."
				// 添加更多的映射关系
			},
	}
},

	computed: {
		filteredSections() {
			return this.sections.map(section => ({
				...section,
				displayedName: this.nameOverrideMap[section.name] || section.name,
			}));
		},
	},

	mounted() {
		document.addEventListener('keydown', this.onKeydown)
		this.initOptions()
	},

	beforeUnmount() {
		document.removeEventListener('keydown', this.onKeydown)
	},

	methods: {
		async initOptions() {
			const res = await fetch('/config/options')
			const json = await res.json()

			this.sections = json.reduce((acc, option) => {
				const section = option.section

				if (!acc[section]) {
					acc[section] = {
						name: section,
						description: option.sectionDescription,
						options: [],
					}
				}

				acc[section].options.push({
					...option,
					inputType: this.getInputType(option.type),
					keySegments: option.key.split('.'),
				})

				return acc
			}, {})

			this.sections = Object.values(this.sections)

			const optionValues = {}
			json.forEach(option => {
				optionValues[option.key] = option.value
			})

			this.initialTheme = optionValues.theme
			this.optionValues = optionValues

			// 设置默认的 currentSection 为 "Theme"
			const themeSection = this.sections.find(section => section.name === 'Theme')
			if (themeSection) {
				this.currentSection = themeSection
			} else if (this.sections.length > 0) {
				this.currentSection = this.sections[0]
			}
		},

		getInputType(type) {
			switch (type) {
				case 'boolean': return 'checkbox'
				case 'color': return 'color'
				case 'number': return 'number'
				case 'text': return 'textarea'
				default: return 'text'
			}
		},

		onKeydown(e) {
			// on Ctrl+S, save changes
			if (
				e.key.toLowerCase() === 's'
				&& ! e.altKey
				&& e.ctrlKey
				&& ! e.metaKey
				&& ! e.shiftKey
			) {
				e.preventDefault()
				e.stopImmediatePropagation()
				return this.save()
			}
		},

		async save() {
			await fetch('/config/options', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(this.optionValues),
			})

			if (this.optionValues.theme !== this.initialTheme) {
				window.location.reload()
			}
		},

		async forceHudRefresh() {
			await fetch('/config/force-hud-refresh', { method: 'POST' })
		},

		resetValue(key) {
			this.optionValues[key] = null
		},
	},
}