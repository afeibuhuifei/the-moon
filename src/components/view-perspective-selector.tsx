"use client"

import { useIndexStore } from "@/stores"
import { ViewPerspective } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select"
import { Eye, Globe, Navigation, Compass } from "lucide-react"

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

export function ViewPerspectiveSelector() {
	const { viewPerspective, setViewPerspective } = useIndexStore()

	const handlePerspectiveChange = (value: string | number) => {
		setViewPerspective(value as ViewPerspective)
	}

	const currentOption = perspectiveOptions.find(opt => opt.value === viewPerspective)
	const CurrentIcon = currentOption?.icon || Eye

	return (
		<div className="fixed top-20 left-6 z-60">
			<div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
				<div className="p-1">
					<Select value={viewPerspective} onChange={handlePerspectiveChange}>
						<SelectTrigger>
							<div className="flex items-center gap-3 px-4 py-3">
								<div className={`p-2 rounded-xl bg-gradient-to-br ${currentOption?.color} shadow-lg`}>
									<CurrentIcon size={16} className="text-white" />
								</div>
								<div className="flex flex-col items-start">
									<span className="text-sm font-semibold text-white">{currentOption?.label}</span>
									<span className="text-xs text-white/60">{currentOption?.desc}</span>
								</div>
							</div>
						</SelectTrigger>
						<SelectContent alignX="left" alignY="bottom">
							<div className="bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl p-2 min-w-[200px]">
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
							</div>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	)
}