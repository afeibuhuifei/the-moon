"use client"

import { useRef, useMemo } from "react"
import {
	CanvasTexture,
	Color,
	Mesh,
	MeshBasicMaterial,
	SphereGeometry,
	Texture,
	TextureLoader,
	PointLight,
	Sprite,
	SpriteMaterial
} from "three"

interface UseSunProps {
	segments?: number
	radiusMultiplier?: number
}

export function useSun({ segments = 64, radiusMultiplier = 0.3 }: UseSunProps = {}) {
	const sunRef = useRef<Mesh | null>(null)

	const sunRadius = 695700 // 太阳半径（公里）
	const scaledRadius = sunRadius * radiusMultiplier * 0.0008 // 调整缩放比例，与其他天体保持一致

	const sunTexture = useMemo(() => {
		const loader = new TextureLoader()

		// 尝试加载真实的太阳贴图
		try {
			const texture = loader.load('/assets/images/sun_surface.jpg')
			console.log('✅ 太阳贴图加载成功')
			return texture
		} catch (error) {
			console.warn('⚠️ 太阳贴图加载失败，使用程序生成纹理:', error)

			// 如果加载失败，使用程序生成的纹理
			const createSunTexture = () => {
				const canvas = document.createElement("canvas")
				canvas.width = 1024
				canvas.height = 512
				const ctx = canvas.getContext("2d")!

				// 太阳基础颜色 - 明亮的黄白色
				const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)
				gradient.addColorStop(0, "#fff8dc")
				gradient.addColorStop(0.3, "#ffd700")
				gradient.addColorStop(0.6, "#ffa500")
				gradient.addColorStop(0.9, "#ff8c00")
				gradient.addColorStop(1, "#ff6347")

				ctx.fillStyle = gradient
				ctx.fillRect(0, 0, canvas.width, canvas.height)

				// 添加太阳黑子和表面纹理
				for (let i = 0; i < 20; i++) {
					const x = Math.random() * canvas.width
					const y = Math.random() * canvas.height
					const size = Math.random() * 15 + 3
					const opacity = Math.random() * 0.4 + 0.2

					ctx.fillStyle = `rgba(139, 69, 19, ${opacity})`
					ctx.beginPath()
					ctx.arc(x, y, size, 0, Math.PI * 2)
					ctx.fill()
				}

				// 添加耀斑效果
				for (let i = 0; i < 30; i++) {
					const x = Math.random() * canvas.width
					const y = Math.random() * canvas.height
					const size = Math.random() * 8 + 2
					const opacity = Math.random() * 0.6 + 0.3

					const flare = ctx.createRadialGradient(x, y, 0, x, y, size)
					flare.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
					flare.addColorStop(0.5, `rgba(255, 215, 0, ${opacity * 0.7})`)
					flare.addColorStop(1, `rgba(255, 165, 0, 0)`)

					ctx.fillStyle = flare
					ctx.beginPath()
					ctx.arc(x, y, size, 0, Math.PI * 2)
					ctx.fill()
				}

				return new CanvasTexture(canvas)
			}

			return createSunTexture()
		}
	}, [])

	const sun = useMemo(() => {
		const geometry = new SphereGeometry(scaledRadius, segments, segments)
		const material = new MeshBasicMaterial({
			map: sunTexture,
		})

		const mesh = new Mesh(geometry, material)
		sunRef.current = mesh
		return mesh
	}, [segments, scaledRadius, sunTexture])

	// 添加太阳光晕效果
	const sunGlow = useMemo(() => {
		const glowCanvas = document.createElement("canvas")
		glowCanvas.width = 256
		glowCanvas.height = 256
		const ctx = glowCanvas.getContext("2d")!

		const glowGradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
		glowGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
		glowGradient.addColorStop(0.3, "rgba(255, 215, 0, 0.6)")
		glowGradient.addColorStop(0.6, "rgba(255, 165, 0, 0.3)")
		glowGradient.addColorStop(1, "rgba(255, 165, 0, 0)")

		ctx.fillStyle = glowGradient
		ctx.fillRect(0, 0, 256, 256)

		const glowTexture = new CanvasTexture(glowCanvas)
		const glowMaterial = new SpriteMaterial({
			map: glowTexture,
			blending: 2, // AdditiveBlending
			transparent: true,
			opacity: 0.8
		})

		const glowSprite = new Sprite(glowMaterial)
		glowSprite.scale.set(scaledRadius * 2, scaledRadius * 2, 1) // 减小光晕效果，避免过曝

		return glowSprite
	}, [scaledRadius])

	// 添加点光源（用于照亮其他天体，但不影响太阳本身）
	const sunLight = useMemo(() => {
		const light = new PointLight(0xffffff, 1.5, 1000) // 太阳作为主光源
		light.position.set(0, 0, 0)
		return light
	}, [])

	return { sun, sunGlow, sunLight }
}