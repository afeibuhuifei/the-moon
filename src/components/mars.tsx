"use client"

import { useMars } from "@/hooks/use-mars"
import { useIndexStore } from "@/stores"
import { useEffect, useRef } from "react"
import { Object3D } from "three"

interface Props {
	world: Object3D | null
}

export function Mars({ world }: Props) {
	if (!world) return null

	const radiusMultiplier = 0.3 // 与地球相同的缩放比例
	const mars = useMars({ radiusMultiplier })
	const { speedMultiplier, mars: { marsRotationSpeed } } = useIndexStore()
	const speedMultiplierRef = useRef(speedMultiplier)
	speedMultiplierRef.current = speedMultiplier

	useEffect(() => {
		if (!mars) return
		world.add(mars)

		let lastTime = performance.now()
		let frameId: number

		const animate = () => {
			const now = performance.now()
			const delta = (now - lastTime) / 1000
			lastTime = now

			// 使用最新的速度倍数动态更新自转
			mars.rotateY(marsRotationSpeed * speedMultiplierRef.current * delta)

			frameId = requestAnimationFrame(animate)
		}

		animate()

		return () => {
			world.remove(mars)
			cancelAnimationFrame(frameId)
		}
	}, [world, mars, marsRotationSpeed])

	return null
}