import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, isSameMonth, isSameDay, addMonths, subMonths, isToday, isBefore, startOfDay } from 'date-fns'

interface DatePickerProps {
  value?: Date
  onChange: (date: Date) => void
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({ value, onChange, placeholder = "Pick a date", disabled }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(value || new Date())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleDateSelect = (date: Date) => {
    onChange(date)
    setIsOpen(false)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1))
  }

  const monthStart = startOfMonth(currentMonth)

  const today = new Date()
  const startOfToday = startOfDay(today)

  // Get the first day of the week for the month start
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - monthStart.getDay())

  // Generate calendar days (including previous/next month days)
  const calendarDays = []
  for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    calendarDays.push(date)
  }

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full justify-start text-left font-normal"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value ? format(value, 'PPP') : placeholder}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white border rounded-lg shadow-lg z-50 min-w-[300px] max-w-[calc(100vw-2rem)] sm:max-w-none">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevMonth}
              className="p-1 h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h3 className="font-semibold text-lg">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              className="p-1 h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const isCurrentMonth = isSameMonth(date, currentMonth)
              const isSelected = value && isSameDay(date, value)
              const isTodayDate = isToday(date)
              const isPastDate = isBefore(date, startOfToday)

              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDateSelect(date)}
                  disabled={isPastDate}
                  className={`
                    p-1 h-8 w-8 text-sm
                    ${!isCurrentMonth ? 'text-gray-300' : ''}
                    ${isSelected ? 'bg-green-600 text-white hover:bg-green-700' : ''}
                    ${isTodayDate && !isSelected ? 'bg-green-100 text-green-800' : ''}
                    ${isPastDate ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {date.getDate()}
                </Button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}