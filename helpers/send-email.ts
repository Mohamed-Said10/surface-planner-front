
export function sendEmail(data: any, source: string) {
  const apiEndpoint = '/api/'+ source;

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