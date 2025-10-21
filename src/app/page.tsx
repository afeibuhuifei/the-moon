import { Scene } from "@/components/scene"

export default function Page() {
	return (
		<main className="h-screen w-screen">
			<Scene />
			<footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm pointer-events-none z-10">
				[by afei @2025]
			</footer>
		</main>
	)
}
