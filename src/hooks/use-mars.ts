"use client"

import { useRef, useMemo } from "react"
import {
	CanvasTexture,
	Color,
	Mesh,
	MeshPhongMaterial,
	SphereGeometry,
	Texture,
	TextureLoader
} from "three"

interface UseMarsProps {
	segments?: number
	radiusMultiplier?: number
}

export function useMars({ segments = 64, radiusMultiplier = 0.3 }: UseMarsProps = {}) {
	const marsRef = useRef<Mesh | null>(null)

	const marsRadius = 3389.5 // 火星半径（公里）
	const scaledRadius = marsRadius * radiusMultiplier * 0.0008 // 调整缩放比例，与地球保持一致

	const marsTexture = useMemo(() => {
		const loader = new TextureLoader()

		// 尝试加载真实的火星贴图
		try {
			const texture = loader.load('/assets/images/mars_surface.jpg')
			console.log('✅ 火星贴图加载成功')
			return texture
		} catch (error) {
			console.warn('⚠️ 火星贴图加载失败，使用程序生成纹理:', error)

			// 如果加载失败，使用程序生成的纹理
			const createMarsTexture = () => {
				const canvas = document.createElement("canvas")
				canvas.width = 1024
				canvas.height = 512
				const ctx = canvas.getContext("2d")!

				// 火星基础颜色 - 红橙色
				const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
				gradient.addColorStop(0, "#cd5c5c")
				gradient.addColorStop(0.3, "#b22222")
				gradient.addColorStop(0.5, "#8b4513")
				gradient.addColorStop(0.7, "#cd853f")
				gradient.addColorStop(1, "#daa520")

				ctx.fillStyle = gradient
				ctx.fillRect(0, 0, canvas.width, canvas.height)

				// 添加火星表面特征
				for (let i = 0; i < 50; i++) {
					const x = Math.random() * canvas.width
					const y = Math.random() * canvas.height
					const size = Math.random() * 20 + 5
					const opacity = Math.random() * 0.3 + 0.1

					ctx.fillStyle = `rgba(139, 69, 19, ${opacity})`
					ctx.beginPath()
					ctx.arc(x, y, size, 0, Math.PI * 2)
					ctx.fill()
				}

				// 添加极地冰盖效果
				const northPole = ctx.createRadialGradient(canvas.width / 2, 0, 0, canvas.width / 2, 0, 100)
				northPole.addColorStop(0, "rgba(255, 255, 255, 0.8)")
				northPole.addColorStop(1, "rgba(255, 255, 255, 0)")
				ctx.fillStyle = northPole
				ctx.fillRect(0, 0, canvas.width, 100)

				const southPole = ctx.createRadialGradient(canvas.width / 2, canvas.height, 0, canvas.width / 2, canvas.height, 100)
				southPole.addColorStop(0, "rgba(255, 255, 255, 0.8)")
				southPole.addColorStop(1, "rgba(255, 255, 255, 0)")
				ctx.fillStyle = southPole
				ctx.fillRect(0, canvas.height - 100, canvas.width, 100)

				return new CanvasTexture(canvas)
			}

			return createMarsTexture()
		}
	}, [])

	const mars = useMemo(() => {
		const geometry = new SphereGeometry(scaledRadius, segments, segments)
		const material = new MeshPhongMaterial({
			map: marsTexture,
			color: new Color("#cd5c5c"), // 火星基础色调
			emissive: new Color("#8b4513"),
			emissiveIntensity: 0.05,
			shininess: 10,
		})

		const mesh = new Mesh(geometry, material)
		marsRef.current = mesh
		return mesh
	}, [segments, scaledRadius, marsTexture])

	return mars
}