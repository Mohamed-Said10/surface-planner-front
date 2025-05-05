
export function sendBookingRequest(data: any) {
  const apiEndpoint = '/api/booking';

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