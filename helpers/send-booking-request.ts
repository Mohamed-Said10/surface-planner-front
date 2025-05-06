
export function sendBookingRequest(data: any) {
  const apiEndpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/booking`;

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