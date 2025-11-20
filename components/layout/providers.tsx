'use client'

import { useMemo, useState } from 'react'
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'

export interface ProvidersProps {
	readonly children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 1,
						refetchOnWindowFocus: false,
					},
				},
			})
	)

	const dehydratedState = useMemo(() => dehydrate(queryClient), [queryClient])

	return (
		<JotaiProvider>
			<QueryClientProvider client={queryClient}>
				<HydrationBoundary state={dehydratedState}>
					{children}
				</HydrationBoundary>
			</QueryClientProvider>
		</JotaiProvider>
	)
}
