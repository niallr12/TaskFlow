import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { CompletedWeekPage } from './pages/CompletedWeekPage'
import { InboxPage } from './pages/InboxPage'
import { TodayPage } from './pages/TodayPage'
import { WaitingPage } from './pages/WaitingPage'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<TodayPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/waiting" element={<WaitingPage />} />
        <Route path="/completed" element={<CompletedWeekPage />} />
      </Route>
    </Routes>
  )
}

export default App
