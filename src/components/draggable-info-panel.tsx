"use client"

import { useIndexStore } from "@/stores"
import { useEffect, useState, useRef } from "react"
import { Clock, ZoomIn, Eye, Activity, GripVertical, ChevronDown, ChevronUp } from "lucide-react"

export function DraggableInfoPanel() {
	const [currentTime, setCurrentTime] = useState<Date | null>(null)
	const { selected, viewPerspective, radiusMultiplier, speedMultiplier, moon, earth, mars, sun } = useIndexStore()
	const [position, setPosition] = useState({ x: 0, y: 0 })
	const [isDragging, setIsDragging] = useState(false)
	const [isCollapsed, setIsCollapsed] = useState(false)
	const dragStartPos = useRef({ x: 0, y: 0 })
	const panelRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		// 只在客户端设置时间，避免SSR不匹配
		setCurrentTime(new Date())

		const timer = setInterval(() => {
			setCurrentTime(new Date())
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	useEffect(() => {
		// 初始化位置
		if (panelRef.current) {
			const rect = panelRef.current.getBoundingClientRect()
			setPosition({
				x: window.innerWidth - rect.width - 24, // 距离右边缘24px
				y: 128 // 距离顶部128px
			})
		}
	}, [])

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsDragging(true)
		dragStartPos.current = {
			x: e.clientX - position.x,
			y: e.clientY - position.y
		}
	}

	const handleMouseMove = (e: MouseEvent) => {
		if (!isDragging) return

		const newX = e.clientX - dragStartPos.current.x
		const newY = e.clientY - dragStartPos.current.y

		// 限制在视口内
		const maxX = window.innerWidth - (panelRef.current?.offsetWidth || 200)
		const maxY = window.innerHeight - (panelRef.current?.offsetHeight || 300)

		setPosition({
			x: Math.max(0, Math.min(newX, maxX)),
			y: Math.max(0, Math.min(newY, maxY))
		})
	}

	const handleMouseUp = () => {
		setIsDragging(false)
	}

	const handleTitleClick = () => {
		setIsCollapsed(!isCollapsed)
	}

	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
			return () => {
				document.removeEventListener('mousemove', handleMouseMove)
				document.removeEventListener('mouseup', handleMouseUp)
			}
		}
	}, [isDragging])

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

	// 获取当前选中天体的详细数据
	const getSelectedBodyData = () => {
		switch (selected) {
			case "moon":
				return moon
			case "earth":
				return earth
			case "mars":
				return mars
			case "sun":
				return sun
			default:
				return null
		}
	}

	const selectedBodyData = getSelectedBodyData()

	return (
		<div
			ref={panelRef}
			className={`fixed bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl select-none transition-all duration-300 ease-in-out ${
				isCollapsed ? 'min-w-[180px] w-auto' : 'min-w-[220px] w-auto'
			}`}
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
				cursor: isDragging ? 'grabbing' : 'grab',
				userSelect: 'none',
				zIndex: isDragging ? 9999 : 60
			}}
		>
			{/* 拖动手柄 */}
			<div
				className="absolute top-2 left-2 p-1 cursor-grab hover:bg-white/10 rounded transition-colors duration-200"
				onMouseDown={handleMouseDown}
			>
				<GripVertical size={14} className="text-white/60" />
			</div>

			{/* 标题栏 - 可点击展开收起 */}
			<div
				className="flex items-center justify-between gap-2 pb-2 border-b border-white/10 cursor-pointer hover:bg-white/5 -mx-1 px-1 py-1 rounded transition-colors duration-200"
				onClick={handleTitleClick}
				onMouseDown={(e) => {
					// 防止拖拽操作触发点击事件
					if (e.target === e.currentTarget) {
						e.preventDefault()
					}
				}}
			>
				<div className="flex items-center gap-2">
					<Activity size={14} className="text-white/60" />
					<span className="text-sm font-semibold text-white">实时信息</span>
				</div>
				<div className="transition-transform duration-300">
					{isCollapsed ? (
						<ChevronUp size={14} className="text-white/60" />
					) : (
						<ChevronDown size={14} className="text-white/60" />
					)}
				</div>
			</div>

			{/* 内容区域 - 可展开收起 */}
			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out ${
					isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[600px] opacity-100'
				}`}
			>
				<div className="space-y-4 pt-2">

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

				{/* 天体详细信息 */}
				{selectedBodyData && (
					<div className="space-y-3">
						<div className="pt-2 border-t border-white/10">
							<span className="text-xs text-white/60 font-semibold">天体详细数据</span>
						</div>

						<div className="space-y-2 text-xs">
							<div className="flex justify-between">
								<span className="text-white/50">质量</span>
								<span className="text-white/80 text-right" style={{ maxWidth: "60%" }}>
									{selectedBodyData.mass}
								</span>
							</div>

							<div className="flex justify-between">
								<span className="text-white/50">实际半径</span>
								<span className="text-white/80 text-right" style={{ maxWidth: "60%" }}>
									{selectedBodyData.realRadius}
								</span>
							</div>

							<div className="flex justify-between">
								<span className="text-white/50">公转周期</span>
								<span className="text-white/80 text-right" style={{ maxWidth: "60%" }}>
									{selectedBodyData.orbitalPeriod}
								</span>
							</div>

							<div className="flex justify-between">
								<span className="text-white/50">自转周期</span>
								<span className="text-white/80 text-right" style={{ maxWidth: "60%" }}>
									{selectedBodyData.rotationPeriod}
								</span>
							</div>

							<div className="flex justify-between">
								<span className="text-white/50">轨道半径</span>
								<span className="text-white/80 text-right" style={{ maxWidth: "60%" }}>
									{selectedBodyData.orbitalRadius}
								</span>
							</div>

							<div className="flex justify-between">
								<span className="text-white/50">表面温度</span>
								<span className="text-white/80 text-right" style={{ maxWidth: "60%" }}>
									{selectedBodyData.surfaceTemperature}
								</span>
							</div>
						</div>
					</div>
				)}

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