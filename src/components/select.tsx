"use client"

import { cn } from "@/utils"
import { ChevronDownIcon } from "lucide-react"
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"

interface SelectContextValue {
	open: boolean
	setOpen: (v: boolean) => void
	value: string | number | undefined
	onChange: (v: string | number) => void
}

const SelectContext = createContext<SelectContextValue | null>(null)

function useSelect() {
	const ctx = useContext(SelectContext)
	if (!ctx) throw new Error("Select components must be used within <Select>")
	return ctx
}

interface SelectProps {
	value: string | number | undefined
	onChange: (v: string | number) => void
	children: ReactNode
}

export function Select({ value, onChange, children }: SelectProps) {
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	// 使用更可靠的事件处理
	useEffect(() => {
		const handleGlobalClick = (event: Event) => {
			const target = event.target as Node
			if (ref.current && !ref.current.contains(target)) {
				setOpen(false)
			}
		}

		if (open) {
			document.addEventListener('click', handleGlobalClick)
			document.addEventListener('touchstart', handleGlobalClick)
		}

		return () => {
			document.removeEventListener('click', handleGlobalClick)
			document.removeEventListener('touchstart', handleGlobalClick)
		}
	}, [open])

	return (
		<SelectContext.Provider value={{ open, setOpen, value, onChange }}>
			<div ref={ref} className="relative">
				{children}
			</div>
		</SelectContext.Provider>
	)
}

export function SelectTrigger({ children }: { children: ReactNode }) {
	const { open, setOpen } = useSelect()
	const buttonRef = useRef<HTMLButtonElement>(null)

	// 添加调试信息
	useEffect(() => {
		if (buttonRef.current) {
			console.log("🔘 SelectTrigger 按钮已挂载")
		}
	}, [])

	const handleClick = () => {
		console.log("🎯 SelectTrigger 被点击!", { 当前状态: open })
		setOpen(!open)
	}

	return (
		<button
			ref={buttonRef}
			type="button"
			onClick={handleClick}
			onTouchEnd={(e) => {
				e.preventDefault()
				console.log("📱 SelectTrigger 触摸结束!")
				handleClick()
			}}
			className="flex w-full cursor-pointer items-center justify-between gap-1 text-left transition-all duration-200 hover:bg-white/5 rounded-xl relative z-50 select-none"
			style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
		>
			{children}
			<ChevronDownIcon
				size={14}
				className={cn(
					"text-white/60 transition-transform duration-200 pointer-events-none",
					open && "rotate-180 text-white/80"
				)}
			/>
		</button>
	)
}

interface SelectContentProps {
	children: ReactNode
	alignX?: "left" | "right"
	alignY?: "top" | "bottom"
}

export function SelectContent({ children, alignX = "right", alignY = "bottom" }: SelectContentProps) {
	const { open } = useSelect()
	const dropdownRef = useRef<HTMLUListElement>(null)

	useEffect(() => {
		if (open && dropdownRef.current) {
			console.log("📋 SelectContent 已显示")
			// 确保下拉菜单在最前面
			dropdownRef.current.style.zIndex = '9999'
		}
	}, [open])

	if (!open) return null

	return (
		<ul
			ref={dropdownRef}
			className={cn(
				"absolute border-2 rounded-xl shadow-2xl",
				"z-[9999]",
				alignX === "left" ? "left-0" : "right-0",
				alignY === "top" ? "bottom-full mb-2" : "mt-3"
			)}
			style={{
				background: 'rgba(0, 0, 0, 0.95)',
				borderColor: 'rgba(255, 255, 255, 0.3)',
				backdropFilter: 'blur(20px)',
				pointerEvents: 'auto',
				touchAction: 'manipulation',
				minWidth: '200px'
			}}
		>
			{children}
		</ul>
	)
}

export function SelectItem({ value, children }: { value: string | number; children: ReactNode }) {
	const { onChange, setOpen, value: selected } = useSelect()
	const active = selected === value

	const handleClick = () => {
		console.log("📝 SelectItem 被点击!", { value, selected })
		onChange(value)
		setOpen(false)
	}

	return (
		<li
			className={cn(
				"cursor-pointer px-4 py-3 whitespace-nowrap transition-all duration-200",
				"select-none"
			)}
			style={{
				backgroundColor: active ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
				color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
				fontWeight: active ? '600' : '400',
				pointerEvents: 'auto',
				touchAction: 'manipulation'
			}}
			onClick={handleClick}
			onTouchEnd={(e) => {
				e.preventDefault()
				console.log("📱 SelectItem 触摸结束!", { value })
				handleClick()
			}}
			onMouseOver={(e) => {
				if (!active) {
					e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
				}
			}}
			onMouseOut={(e) => {
				if (!active) {
					e.currentTarget.style.backgroundColor = 'transparent'
				}
			}}
		>
			{children}
		</li>
	)
}
