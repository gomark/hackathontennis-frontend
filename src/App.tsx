import { useState, useCallback } from "react"
import { LoginPage } from "@/components/LoginPage"
import { BookingPage } from "@/components/BookingPage"
import { AuthState } from "@/shared/services/authService"
import { Toaster } from "sonner"
import { useEffect } from 'react'
 
function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    auth: null,
    isInitialized: false
  })  

  const handleAuthStateChange = useCallback((newAuthState: AuthState) => {
    setAuthState(newAuthState)
  }, [])

  useEffect(() => {
    document.title = "Ace book"
  }, [])  

  return (
    <>
      {!authState.isInitialized || !authState.isLoggedIn ? (
        <LoginPage onAuthStateChange={handleAuthStateChange} />
      ) : (
        <BookingPage onAuthStateChange={handleAuthStateChange} />
      )}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: { background: 'white' },
          className: 'class',
        }}
      />
    </>
  )
}
 
export default App