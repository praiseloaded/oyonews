// pages/api/hello.ts

// Next.js API route support: https://nextjs.org/docs/api-routes/introductio
export const config = {
  runtime: 'edge',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function handler(_: Request) {
  return new Response(JSON.stringify({ name: "John Doe" }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
