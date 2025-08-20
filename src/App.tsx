import { useState } from "react"
import { LoginPage } from "@/components/LoginPage"
import { BookingPage } from "@/components/BookingPage"
import { AuthState } from "@/shared/services/authService"
 
function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    auth: null,
    isInitialized: false
  })

  const handleAuthStateChange = (newAuthState: AuthState) => {
    setAuthState(newAuthState)
  }

  if (!authState.isInitialized || !authState.isLoggedIn) {
    return <LoginPage onAuthStateChange={handleAuthStateChange} />
  }

  return <BookingPage />
}
 
export default App