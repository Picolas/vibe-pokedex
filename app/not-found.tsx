import Link from 'next/link'

export default function NotFoundPage() {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
			<h1 className="text-4xl font-semibold">Pokémon introuvable</h1>
			<p className="text-muted-foreground">
				Le Pokémon que vous cherchez n’existe pas ou a quitté la région.
			</p>
			<Link href="/" className="text-primary underline">
				Retourner à l’accueil
			</Link>
		</div>
	)
}
