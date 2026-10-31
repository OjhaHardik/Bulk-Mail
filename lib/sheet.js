// Client for the Apps Script web app in apps_script/Code.gs.
export async function callSheet(action, params = {}) {
  const res = await fetch(process.env.SHEET_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ token: process.env.SHEET_API_TOKEN, action, ...params }),
    redirect: 'follow', // Apps Script answers with a redirect to the result
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Sheet API '${action}' failed: ${data.error}`);
  return data;
}
