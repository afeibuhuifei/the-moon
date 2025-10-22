"use client"

import { StoreProvider } from "@/providers/store"
import { useIndexStore } from "@/stores"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select"
import { Moon, Earth, Home, Sparkles, Orbit, Sun as SunIcon } from "lucide-react"

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

export function Header() {
	return (
		<StoreProvider>
			<Component />
		</StoreProvider>
	)
}

export function Component() {
	const [mounted, setMounted] = useState(false)
	const [root, setRoot] = useState("/")

	const selected = useIndexStore((state) => state.selected)
	const setSelected = useIndexStore((state) => state.setSelected)

	useEffect(() => {
		setRoot(window.location.href.split("/").slice(0, 3).join("/"))
		setMounted(true)
	}, [])

	const handleChange = (value: string | number) => {
		setSelected(value as "earth" | "moon" | "mars" | "sun")
	}

	const currentOption = celestialOptions.find(opt => opt.value === selected)
	const CurrentIcon = currentOption?.icon || Moon

	return (
		<header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between gap-4 p-6">
			{/* Logo/Brand */}
			<div className="flex items-center gap-3">
				{mounted ? (
					<a
						href={root}
						className="group flex items-center gap-2 text-white/80 hover:text-white transition-all duration-200"
					>
						<div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-200">
							<Home size={16} className="text-white" />
						</div>
						<span className="text-sm font-medium">The Moon</span>
					</a>
				) : (
					<div className="flex items-center gap-2 text-white/60">
						<div className="p-2 rounded-lg bg-white/5 border border-white/10">
							<Home size={16} />
						</div>
						<span className="text-sm font-medium">The Moon</span>
					</div>
				)}
			</div>

			{/* Center Title */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
				<Sparkles size={14} className="text-white/60 animate-pulse" />
				<div className="text-white/90 text-sm font-medium tracking-wide">
					3D 天体可视化
				</div>
				<Sparkles size={14} className="text-white/60 animate-pulse" />
			</div>

			{/* Empty space - Celestial selector moved to left side panel */}
			<div></div>
		</header>
	)
}
