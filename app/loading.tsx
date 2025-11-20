import { Loader2 } from 'lucide-react'

export default function RootLoading() {
	return (
		<div className="flex h-[60vh] items-center justify-center gap-2 text-muted-foreground">
			<Loader2 className="size-5 animate-spin" />
			<span>Chargement en cours...</span>
		</div>
	)
}
