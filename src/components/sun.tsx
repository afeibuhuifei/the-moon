"use client"

import { useSun } from "@/hooks/use-sun"
import { useIndexStore } from "@/stores"
import { useEffect, useRef } from "react"
import { Object3D } from "three"

interface Props {
	world: Object3D | null
}

export function Sun({ world }: Props) {
	if (!world) return null

	const radiusMultiplier = 0.2 // 太阳缩放比例调小，避免显示过大占用过多屏幕空间
	const { sun, sunGlow, sunLight } = useSun({ radiusMultiplier })
	const { speedMultiplier, sun: { sunRotationSpeed } } = useIndexStore()
	const speedMultiplierRef = useRef(speedMultiplier)
	speedMultiplierRef.current = speedMultiplier

	useEffect(() => {
		if (!sun || !sunGlow || !sunLight) return

		// 添加太阳到场景
		world.add(sun)

		// 添加光晕效果
		world.add(sunGlow)

		// 添加光源到场景
		world.add(sunLight)

		let lastTime = performance.now()
		let frameId: number

		const animate = () => {
			const now = performance.now()
			const delta = (now - lastTime) / 1000
			lastTime = now

			// 使用最新的速度倍数动态更新自转
			sun.rotateY(sunRotationSpeed * speedMultiplierRef.current * delta)

			frameId = requestAnimationFrame(animate)
		}

		animate()

		return () => {
			world.remove(sun)
			world.remove(sunGlow)
			world.remove(sunLight)
			cancelAnimationFrame(frameId)
		}
	}, [world, sun, sunGlow, sunLight, sunRotationSpeed])

	return null
}