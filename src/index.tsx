import '@reach/dialog/styles.css'
import 'inter-ui'
import 'polyfills'
import 'tracing'
import 'connection/eagerlyConnect'

import { ApolloProvider } from '@apollo/client'
import { apolloClient } from 'graphql/data/apollo'
import { BlockNumberProvider } from 'lib/hooks/useBlockNumber'
import { MulticallUpdater } from 'lib/state/multicall'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { SystemThemeUpdater, ThemeColorMetaUpdater } from 'theme/components/ThemeToggle'
import { isBrowserRouterEnabled } from 'utils/env'

import Web3Provider from './components/Web3Provider'
import { LanguageProvider } from './i18n'
import App from './pages/App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import store from './state'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import LogsUpdater from './state/logs/updater'
import OrderUpdater from './state/signatures/updater'
import TransactionUpdater from './state/transactions/updater'
import ThemeProvider, { ThemedGlobalStyle } from './theme'
import RadialGradientByChainUpdater from './theme/components/RadialGradientByChainUpdater'

if (window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

function Updaters() {
  return (
    <>
      <RadialGradientByChainUpdater />
      <ListsUpdater />
      <SystemThemeUpdater />
      <ThemeColorMetaUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <OrderUpdater />
      <MulticallUpdater />
      <LogsUpdater />
    </>
  )
}

const queryClient = new QueryClient()

const container = document.getElementById('root') as HTMLElement

const Router = isBrowserRouterEnabled() ? BrowserRouter : HashRouter

createRoot(container).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <LanguageProvider>
            <Web3Provider>
              <ApolloProvider client={apolloClient}>
                <BlockNumberProvider>
                  <Updaters />
                  <ThemeProvider>
                    <ThemedGlobalStyle />
                    <App />
                  </ThemeProvider>
                </BlockNumberProvider>
              </ApolloProvider>
            </Web3Provider>
          </LanguageProvider>
        </Router>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
)

if (process.env.REACT_APP_SERVICE_WORKER !== 'false') {
  serviceWorkerRegistration.register()
}
