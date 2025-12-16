// Define types for booking status data
export interface StatusHistory {
  id: string
  bookingId: string
  userId: string
  status: string
  notes: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    firstname: string
    lastname: string
    email: string
    role: string
  }
}

export interface BookingStatus {
  id: string
  shortId?: string // Optional for easier display
  steps: {
    label: string
    date: string
    completed: boolean
    inProgress: boolean
  }[]
}

export interface Booking {
  id: string
  status: string
  appointmentDate: string
  statusHistory?: StatusHistory[]
}

// Status mapping for display
export const statusMap: Record<string, string> = {
  BOOKING_CREATED: "Booking Requested",
  PHOTOGRAPHER_ASSIGNED: "Photographer Assigned",
  SHOOTING: "Shoot in Progress",
  EDITING: "Editing",
  COMPLETED: "Order Delivery",
}

// All possible statuses in order
export const allStatuses = ["BOOKING_CREATED", "PHOTOGRAPHER_ASSIGNED", "SHOOTING", "EDITING", "COMPLETED"]

/**
 * Transforms status history data into a format suitable for UI display
 */
export function transformStatusHistory(apiData: {
  bookingId: string
  statusHistory: StatusHistory[]
}): BookingStatus {
  const sortedHistory = [...apiData.statusHistory].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const currentStatus = sortedHistory[0]?.status || ""
  const currentIndex = allStatuses.indexOf(currentStatus)
  const nextStepIndex = currentIndex + 1

  const steps = allStatuses.map((status, index) => {
    const historyItem = sortedHistory.find((item) => item.status === status)
    const isCompleted = index <= currentIndex
    const isInProgress = index === nextStepIndex

    let date = "Pending"
    if (historyItem) {
      const dateObj = new Date(historyItem.createdAt)
      date = dateObj.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    } else if (status === "ORDER_DELIVERED" && currentIndex >= 3) {
      const editingStartItem = sortedHistory.find((item) => item.status === "EDITING_IN_PROGRESS")
      if (editingStartItem) {
        const deliveryDate = new Date(editingStartItem.createdAt)
        deliveryDate.setDate(deliveryDate.getDate() + 3)
        date = `Expected ${deliveryDate.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`
      }
    }

    return {
      label: statusMap[status] || status,
      date,
      completed: isCompleted,
      inProgress: isInProgress,
    }
  })

  return {
    id: apiData.bookingId,
    steps,
  }
}

/**
 * Transforms status history array directly from API into BookingStatus format
 */
export function transformStatusHistoryArray(statusHistoryArray: StatusHistory[]): BookingStatus | null {
  if (!statusHistoryArray || statusHistoryArray.length === 0) {
    return null
  }

  // Get bookingId from the first item
  const bookingId = statusHistoryArray[0].bookingId

  // Use the existing transform function by restructuring the data
  return transformStatusHistory({
    bookingId,
    statusHistory: statusHistoryArray,
  })
}

/**
 * Gets status steps for a booking
 */
export function getStatusSteps(booking: Booking) {
  // If we have status history, use it
  if (booking.statusHistory) {
    return transformStatusHistory({
      bookingId: booking.id,
      statusHistory: booking.statusHistory,
    }).steps
  }

  // Otherwise, create steps based on current status
  const currentStatus = booking.status
  const currentIndex = allStatuses.indexOf(currentStatus)

  return allStatuses.map((status, index) => {
    const isCompleted = index <= currentIndex
    const isInProgress = index === currentIndex

    let date = "Pending"
    if (isCompleted || isInProgress) {
      // For simplicity, use appointment date for the current status
      // In a real app, you'd want to use actual status change dates
      date = new Date(booking.appointmentDate).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    }

    return {
      label: statusMap[status] || status,
      date,
      completed: isCompleted,
      inProgress: isInProgress,
    }
  })
}

/**
 * Calculates progress statistics for status steps
 */
export function getProgressStats(steps: BookingStatus["steps"]) {
  const totalSteps = steps.length - 1 // -1 because we're measuring gaps between steps
  const completedSteps = steps.filter((step) => step.completed).length - 1
  const inProgressStep = steps.findIndex((step) => step.inProgress)

  // Calculate progress percentage (each completed step represents a percentage of the total)
  const progressPercentage = totalSteps > 0 ? Math.max(0, Math.min(100, (completedSteps / totalSteps) * 100)) : 0

  return {
    completedSteps,
    inProgressStep,
    progressPercentage,
  }
}

/**
 * Gets color class for a status
 */
export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "booking_created":
    case "scheduled":
      return "bg-yellow-100 text-yellow-800"
    case "shoot_done":
    case "shoot in progress":
    case "shooting":
      return "bg-blue-100 text-blue-800"
    case "editing":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

/**
 * Formats a status string for display
 */
export function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Formats a date string for display
 */
export function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  return new Date(dateString).toLocaleDateString("en-US", options)
}
