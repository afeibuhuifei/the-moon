import { deepMerge } from "@/utils"
import { create } from "zustand"
import { SelectedObject, ViewPerspective } from "@/lib/types"

type State = {
	debug: boolean
	selected: SelectedObject
	viewPerspective: ViewPerspective
	radiusMultiplier: number
	speedMultiplier: number
	starfield: {
		starCount: number
		starMinDistance: number
		starSpread: number
		starMinSize: number
		starMaxSize: number
	}
	rotation: {
		dragSpeedFactor: number
		inertiaDamping: number
	}
	moon: {
		moonDistanceMultiplier: number
		moonDistance: number
		moonRadius: number
		moonRotationSpeed: number
		moonOrbitSpeed: number
		mass: string // 质量
		realRadius: string // 实际半径
		orbitalPeriod: string // 公转周期
		rotationPeriod: string // 自转周期
		orbitalRadius: string // 轨道半径
		surfaceTemperature: string // 表面温度
	}
	earth: {
		earthRadius: number
		earthRotationSpeed: number
		mass: string // 质量
		realRadius: string // 实际半径
		orbitalPeriod: string // 公转周期
		rotationPeriod: string // 自转周期
		orbitalRadius: string // 轨道半径
		surfaceTemperature: string // 表面温度
	}
	mars: {
		marsRadius: number
		marsRotationSpeed: number
		mass: string // 质量
		realRadius: string // 实际半径
		orbitalPeriod: string // 公转周期
		rotationPeriod: string // 自转周期
		orbitalRadius: string // 轨道半径
		surfaceTemperature: string // 表面温度
	}
	sun: {
		sunRadius: number
		sunRotationSpeed: number
		mass: string // 质量
		realRadius: string // 实际半径
		orbitalPeriod: string // 公转周期
		rotationPeriod: string // 自转周期
		orbitalRadius: string // 轨道半径
		surfaceTemperature: string // 表面温度
	}
	clouds: {
		cloudsRotationSpeed: number
	}
	cursor: {
		cursorHideDelay: number
	}
	zoom: {
		zoomMin: number
		zoomMax: number
		zoomSpeed: number
	}
	pitch: {
		pitchMin: number
		pitchMax: number
	}
	camera: {
		cameraFov: number
		cameraNear: number
		cameraFar: number
	}
	setSelected: (value: SelectedObject) => void
	setViewPerspective: (value: ViewPerspective) => void
	updateConfig: (partial: Partial<State>) => void
	resetConfig: () => void
}

const defaultState: Omit<State, "setSelected" | "setViewPerspective" | "updateConfig" | "resetConfig"> = {
	debug: false,
	selected: "moon",
	viewPerspective: "equator",
	radiusMultiplier: 0.0005,
	speedMultiplier: 10000,
	starfield: {
		starCount: 1000,
		starMinDistance: 5000,
		starSpread: 10000,
		starMinSize: 20,
		starMaxSize: 50,
	},
	rotation: {
		dragSpeedFactor: 0.002,
		inertiaDamping: 0.95,
	},
	moon: {
		moonDistanceMultiplier: 0.000008,
		moonDistance: 384400,
		moonRadius: 1737.4,
		moonRotationSpeed: (2 * Math.PI) / 2_359_200,
		moonOrbitSpeed: (2 * Math.PI) / 2_359_200,
		mass: "7.342×10²² kg",
		realRadius: "1,737.4 km",
		orbitalPeriod: "27.32 天",
		rotationPeriod: "27.32 天",
		orbitalRadius: "384,400 km",
		surfaceTemperature: "-173°C ~ 127°C",
	},
	earth: {
		earthRadius: 6378,
		earthRotationSpeed: (2 * Math.PI) / 86_400,
		mass: "5.972×10²⁴ kg",
		realRadius: "6,371 km",
		orbitalPeriod: "365.25 天",
		rotationPeriod: "23小时56分4秒",
		orbitalRadius: "149.6百万 km (1 AU)",
		surfaceTemperature: "-88°C ~ 58°C",
	},
	mars: {
		marsRadius: 3389.5,
		marsRotationSpeed: (2 * Math.PI) / 88_775, // 火星自转周期（24.6小时）
		mass: "6.417×10²³ kg",
		realRadius: "3,389.5 km",
		orbitalPeriod: "687 天",
		rotationPeriod: "24小时37分",
		orbitalRadius: "227.9百万 km (1.52 AU)",
		surfaceTemperature: "-143°C ~ 35°C",
	},
	sun: {
		sunRadius: 695700,
		sunRotationSpeed: (2 * Math.PI) / 600_000, // 太阳自转周期（约25天）
		mass: "1.989×10³⁰ kg",
		realRadius: "695,700 km",
		orbitalPeriod: "不适用（银河系公转约2.25亿年）",
		rotationPeriod: "25-35 天（赤道较快）",
		orbitalRadius: "0（太阳系中心）",
		surfaceTemperature: "5,505°C",
	},
	clouds: {
		cloudsRotationSpeed: 0.000005,
	},
	cursor: {
		cursorHideDelay: 2000,
	},
	zoom: {
		zoomMin: 3,
		zoomMax: 10,
		zoomSpeed: 0.01,
	},
	pitch: {
		pitchMin: -Math.PI / 2,
		pitchMax: Math.PI / 2,
	},
	camera: {
		cameraFov: 40,
		cameraNear: 0.1,
		cameraFar: 5000 + 10000 + 20,
	},
}

export const useIndexStore = create<State>((set, get) => ({
	...defaultState,

	setSelected: (value: SelectedObject) => set({ selected: value }),
	setViewPerspective: (value: ViewPerspective) => set({ viewPerspective: value }),

	updateConfig: (partial: Partial<State>) => set((state) => deepMerge(state, partial)),

	resetConfig: () => {
		const current = get()
		set({ ...defaultState, selected: current.selected })
	},
}))
