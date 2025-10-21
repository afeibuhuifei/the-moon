"use client"

import { useIndexStore } from "@/stores"
import { ViewPerspective } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select"
import { ChevronDownIcon } from "lucide-react"

const perspectiveOptions = [
	{ value: "north-pole", label: "北极视角", desc: "从北极俯瞰" },
	{ value: "south-pole", label: "南极视角", desc: "从南极仰视" },
	{ value: "equator", label: "赤道视角", desc: "从赤道水平观看" }
] as const

export function ViewPerspectiveSelector() {
	const { viewPerspective, setViewPerspective } = useIndexStore()

	const handlePerspectiveChange = (value: string | number) => {
		setViewPerspective(value as ViewPerspective)
	}

	const currentOption = perspectiveOptions.find(opt => opt.value === viewPerspective)

	return (
		<div className="fixed top-16 left-4 z-20">
			<Select value={viewPerspective} onChange={handlePerspectiveChange}>
				<SelectTrigger>
					<div className="flex flex-col items-start">
						<span className="text-sm font-medium text-white">{currentOption?.label}</span>
						<span className="text-xs text-white/70">{currentOption?.desc}</span>
					</div>
				</SelectTrigger>
				<SelectContent alignX="left" alignY="bottom">
					{perspectiveOptions.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							<div className="flex flex-col gap-1">
								<span className="font-medium">{option.label}</span>
								<span className="text-xs text-white/70">{option.desc}</span>
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}