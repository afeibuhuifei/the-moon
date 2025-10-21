"use client"

import { useIndexStore } from "@/stores"
import { useEffect, useState } from "react"
import { Clock, ZoomIn, Eye, Activity } from "lucide-react"

export function InfoPanel() {
	const [currentTime, setCurrentTime] = useState<Date | null>(null)
	const { selected, viewPerspective, radiusMultiplier, speedMultiplier } = useIndexStore()

	useEffect(() => {
		// 只在客户端设置时间，避免SSR不匹配
		setCurrentTime(new Date())

		const timer = setInterval(() => {
			setCurrentTime(new Date())
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("zh-CN", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit"
		})
	}

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("zh-CN", {
			year: "numeric",
			month: "long",
			day: "numeric",
			weekday: "long"
		})
	}

	const viewPerspectiveLabels = {
		"north-pole": "北极视角",
		"south-pole": "南极视角",
		"equator": "赤道视角"
	}

	const selectedLabels = {
		"moon": "月球",
		"earth": "地球",
		"mars": "火星",
		"sun": "太阳"
	}

	return (
		<div className="fixed top-32 right-6 z-60">
			<div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-4 min-w-[220px]">
				<div className="space-y-4">
					{/* 标题 */}
					<div className="flex items-center gap-2 pb-2 border-b border-white/10">
						<Activity size={14} className="text-white/60" />
						<span className="text-sm font-semibold text-white">实时信息</span>
					</div>

					{/* 时间信息 */}
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Clock size={12} className="text-white/60" />
							<span className="text-xs text-white/60">时间</span>
						</div>
						{currentTime ? (
							<>
								<div className="text-sm font-mono text-white">
									{formatTime(currentTime)}
								</div>
								<div className="text-xs text-white/50">
									{formatDate(currentTime)}
								</div>
							</>
						) : (
							<>
								<div className="text-sm font-mono text-white/50">
									加载中...
								</div>
								<div className="text-xs text-white/30">
									请稍候
								</div>
							</>
						)}
					</div>

					{/* 视角信息 */}
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Eye size={12} className="text-white/60" />
							<span className="text-xs text-white/60">当前视角</span>
						</div>
						<div className="text-sm text-white">
							{viewPerspectiveLabels[viewPerspective]}
						</div>
					</div>

					{/* 选中对象 */}
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<ZoomIn size={12} className="text-white/60" />
							<span className="text-xs text-white/60">当前天体</span>
						</div>
						<div className="text-sm text-white">
							{selectedLabels[selected]}
						</div>
					</div>

					{/* 参数信息 */}
					<div className="space-y-2">
						<span className="text-xs text-white/60">渲染参数</span>
						<div className="space-y-1">
							<div className="flex justify-between text-xs">
								<span className="text-white/50">半径倍数</span>
								<span className="text-white/80 font-mono">
									{radiusMultiplier.toFixed(5)}
								</span>
							</div>
							<div className="flex justify-between text-xs">
								<span className="text-white/50">速度倍数</span>
								<span className="text-white/80 font-mono">
									{speedMultiplier.toFixed(0)}
								</span>
							</div>
						</div>
					</div>

					{/* 状态指示器 */}
					<div className="pt-2 border-t border-white/10">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
							<span className="text-xs text-white/60">系统运行中</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}