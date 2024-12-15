export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjQyNzUsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg0M2Q5MzJCZmQwNjg2YTczMzVGZERlMDUwNzgyOGE1RjJCYTM0ZWRFIn0",
      payload: "eyJkb21haW4iOiJtaW5lc3dlZXBlci1mcmFtZS1mb3gtdGFsZXMudmVyY2VsLmFwcCJ9",
      signature: "MHg0Y2RlZjJiZGU4YTVhZDVhZGVhMzIxNWQxZTkzYjlhNjZhNTJjMDZmOWIzYWNiYjA4YmQzNmFhOGE5MGE5NTdiNDk4NjVkZjFkNTNiZTE3NjcxOWEwNmI3YTEzYzIxZDg5YjU3YWIyNDBmODQ0YjMyMjBmYTcyODY4MzE5M2U5ODFi"
    },
    frame: {
      version: "0.1.0",
      name: "Minesweeper",
      iconUrl: `${appUrl}/icon.png`,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#ffffff",
      homeUrl: appUrl,
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
