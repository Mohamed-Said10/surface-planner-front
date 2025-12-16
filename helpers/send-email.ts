
export function sendEmail(data: any, source: string) {
  const apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/`+ source;

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