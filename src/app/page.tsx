import { Scene } from "@/components/scene"
import { Header } from "@/components/header"
import { ViewPerspectiveSelector } from "@/components/view-perspective-selector"
import { InfoPanel } from "@/components/info-panel"
import { Footer } from "@/components/footer"

export default function Page() {
	return (
		<main className="h-screen w-screen">
			<Header />
			<ViewPerspectiveSelector />
			<InfoPanel />
			<Scene />
			<Footer />
			<footer className="fixed bottom-6 left-1/2 transform -translate-x-1/2 text-white/60 text-xs pointer-events-none z-10 flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
				<span>Made with</span>
				<span className="text-red-400">❤</span>
				<span>by afei @2025</span>
			</footer>
		</main>
	)
}
