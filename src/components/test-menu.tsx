"use client"

import { useState } from "react"

export function TestMenu() {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div className="fixed top-96 left-1/2 transform -translate-x-1/2 z-[9999]">
			<button
				onClick={() => {
					console.log("🔥 测试菜单按钮被点击!")
					setIsOpen(!isOpen)
				}}
				style={{
					background: 'red',
					color: 'white',
					border: 'none',
					padding: '12px 24px',
					borderRadius: '8px',
					cursor: 'pointer',
					fontSize: '16px',
					fontWeight: 'bold'
				}}
			>
				{isOpen ? '关闭测试菜单' : '打开测试菜单'}
			</button>

			{isOpen && (
				<div
					style={{
						position: 'absolute',
						top: '100%',
						left: 0,
						right: 0,
						marginTop: '8px',
						background: 'yellow',
						border: '3px solid red',
						borderRadius: '8px',
						padding: '16px',
						zIndex: 9999,
						boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
					}}
				>
					<div style={{ color: 'black', fontSize: '14px', fontWeight: 'bold' }}>
						🎉 测试菜单内容可见！
					</div>
					<div style={{ color: 'black', fontSize: '12px', marginTop: '8px' }}>
						如果你能看到这个黄色背景的菜单，说明下拉功能正常工作。
					</div>
					<button
						onClick={() => {
							console.log("✅ 测试选项被点击!")
							setIsOpen(false)
						}}
						style={{
							background: 'green',
							color: 'white',
							border: 'none',
							padding: '8px 16px',
							borderRadius: '4px',
							cursor: 'pointer',
							marginTop: '8px',
							fontSize: '12px'
						}}
					>
						点击我关闭
					</button>
				</div>
			)}
		</div>
	)
}