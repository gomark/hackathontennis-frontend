import { authService } from '@/shared/services/authService'

export interface Court {
  primarykey: Long
  courtName: string
  type: string
  courtDesc: string
}

export interface TimeSlot {
  id: string
  time: string
  status: 'available' | 'booked-other' | 'booked-you' | 'outside-hours'
  bookedBy?: string
}

export interface Booking {
  id?: string
  courtId: string
  date: string
  timeSlots: string[]
  userId?: string
  status?: 'confirmed' | 'pending' | 'cancelled'
}

export interface BookingResponse {
  success: boolean
  bookingId?: string
  message?: string
}

export interface CourtsResponse {
  courts: Court[]
}

export interface TimeSlotsResponse {
  timeSlots: TimeSlot[]
}

export interface UserBookingsResponse {
  bookings: Booking[]
}

export class ApiService {
  private static instance: ApiService
  private baseUrl = '/api'

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  async getCourts(): Promise<CourtsResponse> {
    try {
      const response = await authService.callAPIWithAccessToken(
        `${this.baseUrl}/courts`,
        'GET'
      )
      console.log(response);

      return JSON.parse(response)
    } catch (error) {
      console.error('Failed to fetch courts:', error)
      return {
        courts: [
          { id: 'court-1', name: 'Court 1', type: 'Hard Court' },
          { id: 'court-2', name: 'Court 2', type: 'Clay Court' },
          { id: 'court-3', name: 'Court 3', type: 'Hard Court' },
          { id: 'court-4', name: 'Court 4', type: 'Grass Court' }
        ]
      }
    }
  }

  async getTimeSlots(courtId: string, date: string): Promise<TimeSlotsResponse> {
    try {
      const response = await authService.callAPIWithAccessToken(
        `${this.baseUrl}/courts/${courtId}/timeslots?date=${date}`,
        'GET'
      )
      return JSON.parse(response)
    } catch (error) {
      console.error('Failed to fetch time slots:', error)
      return {
        timeSlots: [
          { id: '06:00', time: '06:00 AM', status: 'outside-hours' },
          { id: '07:00', time: '07:00 AM', status: 'outside-hours' },
          { id: '08:00', time: '08:00 AM', status: 'available' },
          { id: '09:00', time: '09:00 AM', status: 'booked-other' },
          { id: '10:00', time: '10:00 AM', status: 'available' },
          { id: '11:00', time: '11:00 AM', status: 'available' },
          { id: '12:00', time: '12:00 PM', status: 'booked-you' },
          { id: '13:00', time: '01:00 PM', status: 'available' },
          { id: '14:00', time: '02:00 PM', status: 'available' },
          { id: '15:00', time: '03:00 PM', status: 'booked-other' },
          { id: '16:00', time: '04:00 PM', status: 'available' },
          { id: '17:00', time: '05:00 PM', status: 'available' },
          { id: '18:00', time: '06:00 PM', status: 'available' },
          { id: '19:00', time: '07:00 PM', status: 'available' },
          { id: '20:00', time: '08:00 PM', status: 'outside-hours' },
          { id: '21:00', time: '09:00 PM', status: 'outside-hours' }
        ]
      }
    }
  }

  async createBooking(booking: Booking): Promise<BookingResponse> {
    try {
      const response = await authService.callAPIWithAccessToken(
        `${this.baseUrl}/bookings`,
        'POST',
        booking
      )
      const result = JSON.parse(response)
      return {
        success: true,
        bookingId: result.bookingId || result.id,
        message: 'Booking created successfully'
      }
    } catch (error) {
      console.error('Failed to create booking:', error)
      return {
        success: false,
        message: 'Failed to create booking. Please try again.'
      }
    }
  }

  async getUserBookings(): Promise<UserBookingsResponse> {
    try {
      const response = await authService.callAPIWithAccessToken(
        `${this.baseUrl}/bookings/user`,
        'GET'
      )
      return JSON.parse(response)
    } catch (error) {
      console.error('Failed to fetch user bookings:', error)
      return { bookings: [] }
    }
  }

  async cancelBooking(bookingId: string): Promise<BookingResponse> {
    try {
      await authService.callAPIWithAccessToken(
        `${this.baseUrl}/bookings/${bookingId}`,
        'DELETE'
      )
      return {
        success: true,
        message: 'Booking cancelled successfully'
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error)
      return {
        success: false,
        message: 'Failed to cancel booking. Please try again.'
      }
    }
  }

  async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<BookingResponse> {
    try {
      await authService.callAPIWithAccessToken(
        `${this.baseUrl}/bookings/${bookingId}`,
        'PATCH',
        updates
      )
      return {
        success: true,
        message: 'Booking updated successfully'
      }
    } catch (error) {
      console.error('Failed to update booking:', error)
      return {
        success: false,
        message: 'Failed to update booking. Please try again.'
      }
    }
  }

  async sendChatMessage(message: string): Promise<{ response: string }> {
    try {
      const response = await authService.callAPIWithAccessToken(
        `${this.baseUrl}/chat`,
        'POST',
        { message }
      )
      return JSON.parse(response)
    } catch (error) {
      console.error('Failed to send chat message:', error)
      return {
        response: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact support for assistance with your tennis court booking."
      }
    }
  }
}

export const apiService = ApiService.getInstance()