"use client"

import { useState, useRef, useEffect } from "react"

export function DebugMenu() {
	const [isOpen, setIsOpen] = useState(false)
	const [count, setCount] = useState(0)
	const buttonRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		console.log("🔧 DebugMenu 组件已挂载")

		// 测试全局点击事件
		const handleGlobalClick = (e: MouseEvent) => {
			console.log("🌍 全局点击事件:", e.target)
		}

		document.addEventListener('click', handleGlobalClick)

		return () => {
			document.removeEventListener('click', handleGlobalClick)
		}
	}, [])

	const handleButtonClick = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		console.log("🎯 调试菜单按钮被点击!", { isOpen, count })
		setIsOpen(!isOpen)
		setCount(count + 1)
	}

	const handleItemClick = (value: string) => {
		console.log("📝 菜单项被点击:", value)
		setIsOpen(false)
	}

	return (
		<div className="fixed top-48 left-6 z-[9999] bg-red-500/20 backdrop-blur-md rounded-2xl border-2 border-red-500 shadow-2xl p-4 min-w-[200px]">
			<div className="space-y-4">
				{/* 标题 */}
				<div className="text-white font-bold text-center border-b border-red-500 pb-2">
					🔧 调试菜单
				</div>

				{/* 计数器显示 */}
				<div className="text-white text-center">
					点击次数: {count}
				</div>

				{/* 测试按钮 */}
				<button
					ref={buttonRef}
					onClick={handleButtonClick}
					className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg transition-colors duration-200"
				>
					{isOpen ? "关闭菜单" : "打开菜单"}
				</button>

				{/* 下拉菜单 */}
				{isOpen && (
					<div className="absolute top-full left-0 right-0 mt-2 bg-green-500 border-2 border-green-400 rounded-lg shadow-xl overflow-hidden z-[9999]">
						<div
							onClick={() => handleItemClick("选项1")}
							className="bg-green-400 hover:bg-green-300 text-black py-2 px-4 cursor-pointer transition-colors duration-200"
						>
							选项 1
						</div>
						<div
							onClick={() => handleItemClick("选项2")}
							className="bg-green-400 hover:bg-green-300 text-black py-2 px-4 cursor-pointer transition-colors duration-200"
						>
							选项 2
						</div>
						<div
							onClick={() => handleItemClick("选项3")}
							className="bg-green-400 hover:bg-green-300 text-black py-2 px-4 cursor-pointer transition-colors duration-200"
						>
							选项 3
						</div>
					</div>
				)}

				{/* 状态显示 */}
				<div className="text-xs text-white/80 text-center">
					菜单状态: {isOpen ? "打开" : "关闭"}
				</div>
			</div>
		</div>
	)
}