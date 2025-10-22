"use client"

import { useEffect, useRef } from "react"

export function NativeMenu() {
	const menuRef = useRef<HTMLDivElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		console.log("🌐 NativeMenu 组件已挂载")

		const button = buttonRef.current
		const dropdown = dropdownRef.current
		let isOpen = false

		const handleButtonClick = (e: MouseEvent) => {
			e.preventDefault()
			e.stopPropagation()
			console.log("💥 原生按钮被点击!", { isOpen })
			isOpen = !isOpen

			if (dropdown) {
				dropdown.style.display = isOpen ? 'block' : 'none'
				console.log("📱 下拉菜单显示状态:", dropdown.style.display)
			}
		}

		const handleItemClick = (value: string) => {
			console.log("🎯 原生菜单项被点击:", value)
			isOpen = false
			if (dropdown) {
				dropdown.style.display = 'none'
			}
		}

		const handleGlobalClick = (e: MouseEvent) => {
			if (isOpen && button && !button.contains(e.target as Node) && dropdown && !dropdown.contains(e.target as Node)) {
				isOpen = false
				dropdown.style.display = 'none'
				console.log("🌍 点击外部，关闭菜单")
			}
		}

		if (button) {
			button.addEventListener('click', handleButtonClick)
		}

		if (dropdown) {
			const items = dropdown.querySelectorAll('.menu-item')
			items.forEach((item, index) => {
				const element = item as HTMLElement
				element.addEventListener('click', () => handleItemClick(`选项${index + 1}`))
			})
		}

		document.addEventListener('click', handleGlobalClick)

		return () => {
			if (button) {
				button.removeEventListener('click', handleButtonClick)
			}
			document.removeEventListener('click', handleGlobalClick)
		}
	}, [])

	return (
		<div
			ref={menuRef}
			className="fixed top-72 right-6 z-[9998] bg-purple-500/20 backdrop-blur-md rounded-2xl border-2 border-purple-500 shadow-2xl p-4 min-w-[200px]"
			style={{
				background: 'rgba(168, 85, 247, 0.2)',
				backdropFilter: 'blur(12px)',
				border: '2px solid rgb(168, 85, 247)',
			}}
		>
			<div className="space-y-4">
				{/* 标题 */}
				<div className="text-white font-bold text-center border-b border-purple-500 pb-2">
					🌐 原生HTML菜单
				</div>

				{/* 原生HTML按钮 */}
				<button
					ref={buttonRef}
					style={{
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						border: 'none',
						color: 'white',
						padding: '12px 16px',
						borderRadius: '8px',
						cursor: 'pointer',
						fontWeight: 'bold',
						width: '100%',
						transition: 'all 0.2s ease',
					}}
					onMouseOver={(e) => {
						e.currentTarget.style.transform = 'translateY(-1px)'
						e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)'
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.transform = 'translateY(0px)'
						e.currentTarget.style.boxShadow = 'none'
					}}
				>
					点击测试原生菜单
				</button>

				{/* 原生HTML下拉菜单 */}
				<div
					ref={dropdownRef}
					style={{
						display: 'none',
						position: 'absolute',
						top: '100%',
						left: 0,
						right: 0,
						marginTop: '8px',
						background: 'rgba(16, 185, 129, 0.9)',
						border: '2px solid #10b981',
						borderRadius: '8px',
						overflow: 'hidden',
						zIndex: 9999,
						backdropFilter: 'blur(10px)',
					}}
				>
					<div
						className="menu-item"
						style={{
							padding: '12px 16px',
							cursor: 'pointer',
							color: 'black',
							fontWeight: '500',
							transition: 'background-color 0.2s ease',
						}}
						onMouseOver={(e) => {
							e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.8)'
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.backgroundColor = 'transparent'
						}}
					>
						原生选项 1
					</div>
					<div
						className="menu-item"
						style={{
							padding: '12px 16px',
							cursor: 'pointer',
							color: 'black',
							fontWeight: '500',
							transition: 'background-color 0.2s ease',
						}}
						onMouseOver={(e) => {
							e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.8)'
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.backgroundColor = 'transparent'
						}}
					>
						原生选项 2
					</div>
					<div
						className="menu-item"
						style={{
							padding: '12px 16px',
							cursor: 'pointer',
							color: 'black',
							fontWeight: '500',
							transition: 'background-color 0.2s ease',
						}}
						onMouseOver={(e) => {
							e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.8)'
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.backgroundColor = 'transparent'
						}}
					>
						原生选项 3
					</div>
				</div>

				{/* 说明 */}
				<div className="text-xs text-white/80 text-center">
					使用原生addEventListener
				</div>
			</div>
		</div>
	)
}