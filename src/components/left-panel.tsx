"use client"

import { StoreProvider } from "@/providers/store"
import { useIndexStore } from "@/stores"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select"
import { Moon, Earth, Home, Sparkles, Orbit, Sun as SunIcon, Eye, Globe, Navigation, Compass } from "lucide-react"

const celestialOptions = [
	{
		value: "moon",
		label: "月球",
		desc: "探索地球的天然卫星",
		icon: Moon,
		color: "from-gray-300 to-gray-100",
		bgGradient: "from-gray-900 via-gray-800 to-black"
	},
	{
		value: "earth",
		label: "地球",
		desc: "我们的蓝色家园",
		icon: Earth,
		color: "from-blue-400 via-green-400 to-blue-500",
		bgGradient: "from-blue-900 via-green-800 to-blue-900"
	},
	{
		value: "mars",
		label: "火星",
		desc: "红色星球的奥秘",
		icon: Orbit,
		color: "from-red-400 to-orange-400",
		bgGradient: "from-red-900 via-orange-800 to-red-900"
	},
	{
		value: "sun",
		label: "太阳",
		desc: "太阳系的中心恒星",
		icon: SunIcon,
		color: "from-yellow-300 to-orange-400",
		bgGradient: "from-yellow-800 via-orange-700 to-yellow-900"
	}
] as const

const perspectiveOptions = [
	{
		value: "north-pole",
		label: "北极视角",
		desc: "从北极俯瞰",
		icon: Navigation,
		color: "from-blue-400 to-cyan-300"
	},
	{
		value: "south-pole",
		label: "南极视角",
		desc: "从南极仰视",
		icon: Compass,
		color: "from-purple-400 to-pink-300"
	},
	{
		value: "equator",
		label: "赤道视角",
		desc: "从赤道水平观看",
		icon: Globe,
		color: "from-green-400 to-emerald-300"
	}
] as const

export function LeftPanel() {
	return (
		<StoreProvider>
			<Component />
		</StoreProvider>
	)
}

export function Component() {
	const [mounted, setMounted] = useState(false)

	const selected = useIndexStore((state) => state.selected)
	const setSelected = useIndexStore((state) => state.setSelected)
	const viewPerspective = useIndexStore((state) => state.viewPerspective)
	const setViewPerspective = useIndexStore((state) => state.setViewPerspective)

	useEffect(() => {
		setMounted(true)
	}, [])

	const handleCelestialChange = (value: string | number) => {
		setSelected(value as "earth" | "moon" | "mars" | "sun")
	}

	const handlePerspectiveChange = (value: string | number) => {
		setViewPerspective(value as "north-pole" | "south-pole" | "equator")
	}

	const currentCelestialOption = celestialOptions.find(opt => opt.value === selected)
	const CurrentCelestialIcon = currentCelestialOption?.icon || Moon

	const currentPerspectiveOption = perspectiveOptions.find(opt => opt.value === viewPerspective)
	const CurrentPerspectiveIcon = currentPerspectiveOption?.icon || Eye

	if (!mounted) return null

	return (
		<div className="fixed left-6 top-24 z-60 flex flex-col sm:flex-row gap-4">
			{/* Celestial Body Selector */}
			<div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
				<div className="p-1" style={{ overflow: 'visible' }}>
					<Select value={selected} onChange={handleCelestialChange}>
						<SelectTrigger>
							<div className="flex items-center gap-3 px-4 py-3">
								<div className={`p-2 rounded-xl bg-gradient-to-br ${currentCelestialOption?.color} shadow-lg`}>
									<CurrentCelestialIcon size={16} className="text-white" />
								</div>
								<div className="flex flex-col items-start">
									<span className="text-sm font-semibold text-white">{currentCelestialOption?.label}</span>
									<span className="text-xs text-white/60">{currentCelestialOption?.desc}</span>
								</div>
							</div>
						</SelectTrigger>
						<SelectContent alignX="left" alignY="bottom">
							{celestialOptions.map((option) => {
								const Icon = option.icon
								const isActive = selected === option.value
								return (
									<SelectItem key={option.value} value={option.value}>
										<div className={`
											flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
											${isActive
												? 'bg-white/10 border border-white/20'
												: 'hover:bg-white/5 border border-transparent'
											}
										`}>
											<div className={`p-1.5 rounded-lg bg-gradient-to-br ${option.color}`}>
												<Icon size={12} className="text-white" />
											</div>
											<div className="flex flex-col gap-0.5">
												<span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/80'}`}>
													{option.label}
												</span>
												<span className="text-xs text-white/50">{option.desc}</span>
											</div>
										</div>
									</SelectItem>
								)
							})}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* View Perspective Selector */}
			<div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
				<div className="p-1" style={{ overflow: 'visible' }}>
					<Select value={viewPerspective} onChange={handlePerspectiveChange}>
						<SelectTrigger>
							<div className="flex items-center gap-3 px-4 py-3">
								<div className={`p-2 rounded-xl bg-gradient-to-br ${currentPerspectiveOption?.color} shadow-lg`}>
									<CurrentPerspectiveIcon size={16} className="text-white" />
								</div>
								<div className="flex flex-col items-start">
									<span className="text-sm font-semibold text-white">{currentPerspectiveOption?.label}</span>
									<span className="text-xs text-white/60">{currentPerspectiveOption?.desc}</span>
								</div>
							</div>
						</SelectTrigger>
						<SelectContent alignX="left" alignY="bottom">
							{perspectiveOptions.map((option) => {
								const Icon = option.icon
								const isActive = viewPerspective === option.value
								return (
									<SelectItem key={option.value} value={option.value}>
										<div className={`
											flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
											${isActive
												? 'bg-white/10 border border-white/20'
												: 'hover:bg-white/5 border border-transparent'
											}
										`}>
											<div className={`p-1.5 rounded-lg bg-gradient-to-br ${option.color}`}>
												<Icon size={12} className="text-white" />
											</div>
											<div className="flex flex-col gap-0.5">
												<span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/80'}`}>
													{option.label}
												</span>
												<span className="text-xs text-white/50">{option.desc}</span>
											</div>
										</div>
									</SelectItem>
								)
							})}
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	)
}