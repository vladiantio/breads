import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './theme/theme-provider'
import { I18nProvider } from './i18n/i18n-provider'
import { dynamicActivate } from './i18n/i18n'
import { detectLocale } from './i18n/languages'
import { AppSettingsProvider } from './features/settings/app-settings-provider'

import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60, // 1 minute
    },
  },
})

const locale = detectLocale()
await dynamicActivate(locale)

export const App = () => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppSettingsProvider>
          <I18nProvider>
            <RouterProvider router={router} />
          </I18nProvider>
        </AppSettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
)
