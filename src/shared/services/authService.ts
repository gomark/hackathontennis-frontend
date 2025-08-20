import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getEnvs } from "./utils";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  auth: Auth | null;
  isInitialized: boolean;
}

export class AuthService {
  private static instance: AuthService;
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private authState: AuthState = {
    isLoggedIn: false,
    user: null,
    auth: null,
    isInitialized: false
  };
  private listeners: ((state: AuthState) => void)[] = [];
  private unsubscribeAuth: (() => void) | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async initialize(): Promise<void> {
    if (this.authState.isInitialized) {
      return;
    }

    try {
      // Fetch Firebase config from API
      const response: any = await getEnvs("/first/getEnvs?keys=", "apiKey,authDomain,tenantId");
      
      console.log("Fetched Firebase config:", response);

      const firebaseConfig: FirebaseConfig = {
        apiKey: response.apiKey,
        authDomain: response.authDomain,
        
      };

      // Initialize Firebase
      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      this.auth.tenantId = response.tenantId;

      // Set up auth state listener
      this.unsubscribeAuth = onAuthStateChanged(this.auth, (user) => {
        this.authState = {
          isLoggedIn: !!user,
          user,
          auth: this.auth,
          isInitialized: true
        };

        
        console.log("Auth state changed:", user ? "logged in" : "not logged in");
        console.log("tenantId=" + user?.tenantId);
        console.log(user);
        this.notifyListeners();
      });

      this.authState.isInitialized = true;
      this.authState.auth = this.auth;

    } catch (error) {
      console.error('Failed to initialize auth service:', error);
      throw error;
    }
  }

  getAuthState(): AuthState {
    return { ...this.authState };
  }

  getAuth(): Auth | null {
    return this.auth;
  }

  getCurrentUser(): User | null {
    return this.authState.user;
  }

  isLoggedIn(): boolean {
    return this.authState.isLoggedIn;
  }

  async callAPIWithAccessToken(endpoint: string, method: string = 'GET', body?: any): Promise<string> {
    try {
      console.log("Making authenticated API call to:", endpoint);
      
      if (!this.auth?.currentUser) {
        throw new Error('User not authenticated');
      }

      // Get the ID token from Firebase Auth
      const idToken = await this.auth.currentUser.getIdToken();
      
      const headers: HeadersInit = {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      };

      const requestOptions: RequestInit = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) })
      };

      const response = await fetch(endpoint, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      return data;
    } catch (error) {
      console.error('Authenticated API call failed:', error);
      throw error;
    }
  }

  onAuthStateChange(callback: (state: AuthState) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.authState));
  }

  async destroy(): Promise<void> {
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth();
      this.unsubscribeAuth = null;
    }
    this.listeners = [];
    this.authState = {
      isLoggedIn: false,
      user: null,
      auth: null,
      isInitialized: false
    };
    this.auth = null;
    this.app = null;
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
export type { AuthState };