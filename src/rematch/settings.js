const defaultSettings = {
	nightMode: false
};

// Get settings from localStorage
let localSettings = {};
try {
	localSettings = JSON.parse(localStorage.getItem('settings') || {});
} catch (error) {}

export const settings = {
	state: {
		...defaultSettings,
		...localSettings
	},
	reducers: {
		updateSettings(state) {
			localStorage.setItem('settings', JSON.stringify(state));
			return state;
		},
		setNightMode(state, activated) {
			const settings = {...state, nightMode: activated};
			return settings;
		}
	},
	effects: {
		switchNightMode(activated) {
			this.setNightMode(activated);
			this.updateSettings();
			return activated;
		}
	}
};
