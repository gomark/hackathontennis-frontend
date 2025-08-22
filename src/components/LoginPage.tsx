import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { authService, AuthState } from '@/shared/services/authService'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { Loader2 } from 'lucide-react'

interface LoginPageProps {
  onAuthStateChange: (authState: AuthState) => void
}

export function LoginPage({ onAuthStateChange }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await authService.initialize()
        const authState = authService.getAuthState()
        onAuthStateChange(authState)
      } catch (error) {
        setErrorMessage('Failed to initialize authentication')
        console.error('Auth initialization error:', error)
      } finally {
        setIsInitializing(false)
      }
    }

    initializeAuth()

    const unsubscribe = authService.onAuthStateChange((authState) => {
      onAuthStateChange(authState)
    })

    return unsubscribe
  }, [])

  const handleGoogleSignIn = async () => {
    console.log("what happened?");
        
    //console.log("here1");
    setIsLoading(true)
    setErrorMessage(null);
    //console.log("here2");
    
    try {
      
      const auth = authService.getAuth()
      if (!auth) {
        throw new Error('Authentication service not initialized')
      }
      
      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')
      
      await signInWithPopup(auth, provider);
      
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to sign in with Google')
      console.error('Google sign-in error:', error)
    } finally {
      setIsLoading(false)
    }
    
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="mb-6">
            <div className="h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎾</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Ace book</h1>
            <p className="text-gray-600 mt-2">Book your tennis court with ease</p>
          </div>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errorMessage}
            </div>
          )}

          <Button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path 
                    fill="#4285F4" 
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path 
                    fill="#34A853" 
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path 
                    fill="#FBBC05" 
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path 
                    fill="#EA4335" 
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <p className="mt-6 text-xs text-gray-500 text-center">
            Hello AI SG/SEA 2025 Hackathon!<br /><br />
            puttitang@google.com<br />
            wittawin@google.com<br />
            wattw@google.com
          </p>
        </div>
      </div>
    </div>
  )
}