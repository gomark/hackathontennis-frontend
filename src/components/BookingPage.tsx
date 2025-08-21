import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { authService } from '@/shared/services/authService'
import { signOut } from 'firebase/auth'
import { format, addDays } from 'date-fns'
import { Calendar, Clock, MapPin, User, LogOut } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'
import { apiService, Court, TimeSlot, Booking } from '@/services/apiService'
import { ChatBot } from '@/components/ChatBot'
import { AuthState } from '@/shared/services/authService'
import { toast } from 'sonner'
import { getEnvs } from '@/shared/services/utils'

interface BookingPageProps {
  onAuthStateChange: (authState: AuthState) => void
}

export function BookingPage({ onAuthStateChange }: BookingPageProps) {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [selectedBaseDate, setSelectedBaseDate] = useState<Date>(new Date())
  const [selectedCourt, setSelectedCourt] = useState<string>('')
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])
  const [courts, setCourts] = useState<Court[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [showChatbot, setShowChatbot] = useState(false)
  const [user] = useState(authService.getCurrentUser())
  const [isLoading, setIsLoading] = useState(false)

  const [agentUserId, setAgentUserId] = useState(0);
  const [agentSession, setAgentSession] = useState<string>('');

  const loadCourts = async () => {
    try {
      const response = await apiService.getCourts()
      console.log('Courts response:', response.courts)
      setCourts(response.courts)
    } catch (error) {
      console.error('Failed to load courts:', error)
      toast.error('Failed to load courts', {
        description: 'Please refresh the page or try again later.'
      })
    }
  }

  const loadTimeSlots = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await apiService.getTimeSlots(selectedCourt, selectedDate)
      setTimeSlots(response.timeSlots)
      setSelectedTimeSlots([])
    } catch (error) {
      console.error('Failed to load time slots:', error)
      toast.error('Failed to load time slots', {
        description: 'Unable to fetch available time slots. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }, [selectedCourt, selectedDate])

  useEffect(() => {
    loadCourts()

  }, [])

  useEffect(() => {
    if (selectedCourt && selectedDate) {
      loadTimeSlots()
    }
  }, [selectedCourt, selectedDate, loadTimeSlots])

  useEffect(() => {
    if (courts.length > 0 && !selectedCourt) {
      const firstCourt = courts[0]
      const courtId = firstCourt.primaryKey?.toString() || firstCourt.id || 'court-1'
      setSelectedCourt(courtId)
    }
  }, [courts, selectedCourt])

  
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((authState) => {
      onAuthStateChange(authState)
    })

    return unsubscribe
  }, [onAuthStateChange])
  

  useEffect(() => {
    console.log("my event");
    if (authService.getAuthState().isLoggedIn == true) {
      console.log("is login");
    } else {
      console.log("is logout");
    }
  }, [onAuthStateChange]);

  const handleSignOut = async () => {
    try {
      const auth = authService.getAuth()
      if (auth) {
        await apiService.deleteAgentSession();
        
        await signOut(auth)
        toast.success('Signed out successfully', {
          description: 'You have been logged out. See you next time!'
        })

        

        // Update the auth state to redirect to login page
        onAuthStateChange({
          isLoggedIn: false,
          user: null,
          auth: null,
          isInitialized: true
        })
      }
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out', {
        description: 'Please try again or refresh the page.'
      })
    }
  }

  const handleTimeSlotToggle = (timeSlotId: string, status: string) => {
    if (status === 'outside-hours' || status === 'booked-other') {
      return
    }

    if (status === 'booked-you') {
      setSelectedTimeSlots(prev => prev.filter(id => id !== timeSlotId))
      return
    }

    if (selectedTimeSlots.includes(timeSlotId)) {
      setSelectedTimeSlots(prev => prev.filter(id => id !== timeSlotId))
    } else {
      setSelectedTimeSlots(prev => [...prev, timeSlotId])
    }
  }

  const handleBooking = async () => {
    if (!selectedCourt || selectedTimeSlots.length === 0) {
      toast.error('Please select a court and time slots')
      return
    }

    try {
      setIsLoading(true)
      const booking: Booking = {
        courtId: selectedCourt,
        date: selectedDate,
        timeSlots: selectedTimeSlots
      }

      const response = await apiService.createBooking(booking)
      if (response.success) {
        toast.success('Booking successful!', {
          description: 'Your tennis court has been booked successfully.'
        })
        setSelectedTimeSlots([])
        await loadTimeSlots()
      } else {
        toast.error(response.message || 'Booking failed. Please try again.')
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Booking failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getTimeSlotButtonClass = (status: string, isSelected: boolean) => {
    const baseClass = "p-3 rounded-lg text-sm font-medium transition-all duration-200 border-2"
    
    switch (status) {
      case 'available':
        return `${baseClass} ${isSelected 
          ? 'bg-green-600 text-white border-green-600' 
          : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`
      case 'booked-other':
        return `${baseClass} bg-red-50 text-red-500 border-red-200 cursor-not-allowed opacity-75`
      case 'booked-you':
        return `${baseClass} bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100`
      case 'outside-hours':
        return `${baseClass} bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-50`
      default:
        return baseClass
    }
  }

  const handleBaseDateChange = (date: Date) => {
    setSelectedBaseDate(date)
    setSelectedDate(format(date, 'yyyy-MM-dd'))
    toast.info('Date range updated', {
      description: `Now showing 7 days starting from ${format(date, 'MMM d, yyyy')}`
    })
  }

  const getDateOptions = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = addDays(selectedBaseDate, i)
      dates.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'EEE, MMM d')
      })
    }
    return dates
  }

  const onToggleEvent = async () => {
    console.log("showChatbot=" + showChatbot);
    setShowChatbot(!showChatbot)

    // going to show chatbot
    const checkSessionResponse = await apiService.checkAgentSession();
    if (checkSessionResponse.found == false) {
      console.log("creating agent session");
      const payload = {          
        username: user?.displayName          
      }
      const createResponse = await apiService.createAgentSession(payload);
      console.log(createResponse);
    }
        
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-xl">🎾</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Ace book</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.displayName || user?.email}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Select Date</h2>
                </div>
                <div className="w-full sm:w-64">
                  <DatePicker
                    value={selectedBaseDate}
                    onChange={handleBaseDateChange}
                    placeholder="Pick a starting date"
                  />
                </div>
              </div>
              
              <div className="mb-3 text-sm text-gray-600">
                Showing 7 days starting from {format(selectedBaseDate, 'EEEE, MMMM d, yyyy')}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {getDateOptions().map((date) => (
                  <Button
                    key={date.value}
                    variant={selectedDate === date.value ? "default" : "outline"}
                    className={`p-3 text-sm ${selectedDate === date.value ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    onClick={() => setSelectedDate(date.value)}
                  >
                    {date.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Select Court</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {courts.map((court, index) => {
                  // Handle both new and legacy API formats
                  const courtId = court.primaryKey?.toString() || court.id || `court-${index + 1}`
                  const courtName = court.courtName || court.name || `Court ${index + 1}`
                  const courtType = court.courtDesc || 'Standard Court'
                  
                  return (
                    <Button
                      key={courtId}
                      variant={selectedCourt === courtId ? "default" : "outline"}
                      className={`p-4 h-auto flex flex-col items-start ${
                        selectedCourt === courtId ? 'bg-green-600 hover:bg-green-700 text-white' : ''
                      }`}
                      onClick={() => setSelectedCourt(courtId)}
                    >
                      <span className="font-medium">{courtName}</span>
                      <span className="text-xs opacity-75">{courtType}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Select Time Slots</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {isLoading ? (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    Loading time slots...
                  </div>
                ) : (
                  timeSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      className={getTimeSlotButtonClass(
                        slot.status, 
                        selectedTimeSlots.includes(slot.id)
                      )}
                      onClick={() => handleTimeSlotToggle(slot.id, slot.status)}
                      disabled={slot.status === 'outside-hours' || slot.status === 'booked-other'}
                    >
                      {slot.time}
                    </Button>
                  ))
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-50 border-2 border-green-200 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-50 border-2 border-red-200 rounded"></div>
                  <span>Booked by Others</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-50 border-2 border-blue-200 rounded"></div>
                  <span>Your Bookings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-50 border-2 border-gray-200 rounded"></div>
                  <span>Outside Hours</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2 font-medium">{format(new Date(selectedDate), 'EEE, MMM d, yyyy')}</span>
                </div>
                
                <div>
                  <span className="text-gray-600">Court:</span>
                  <span className="ml-2 font-medium">
                    {(() => {
                      const selectedCourtData = courts.find((c, index) => {
                        const courtId = c.primaryKey?.toString() || c.id || `court-${index + 1}`
                        return courtId === selectedCourt
                      })
                      return selectedCourtData?.courtName || selectedCourtData?.name || 'None selected'
                    })()}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-600">Time Slots:</span>
                  <div className="ml-2 mt-1">
                    {selectedTimeSlots.length === 0 ? (
                      <span className="text-gray-400">None selected</span>
                    ) : (
                      <div className="space-y-1">
                        {selectedTimeSlots.map(slotId => {
                          const slot = timeSlots.find(s => s.id === slotId)
                          return (
                            <div key={slotId} className="text-sm font-medium">
                              {slot?.time}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="ml-2 font-medium">{selectedTimeSlots.length}</span>
                </div>
              </div>
              
              <Button 
                onClick={handleBooking}
                disabled={!selectedCourt || selectedTimeSlots.length === 0 || isLoading}
                className="w-full mt-6 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isLoading ? 'Booking...' : 'Book Now'}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 right-6">
        <ChatBot 
          isOpen={showChatbot} 
          onToggle={onToggleEvent} 
          user={user}
        />
      </div>
    </div>
  )
}

