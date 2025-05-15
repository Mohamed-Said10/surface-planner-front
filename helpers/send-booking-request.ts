
export function sendBookingRequest(data: any) {
  const apiEndpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings`;

  fetch(apiEndpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err
    });
}
export function createBooking(data: any) {
  const apiEndpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings`;

  fetch("http://localhost:3000/api/bookings", {
    method: 'POST',
    credentials: 'include', // This is crucial for sending cookies
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err
    });
}
