export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  const runtime = locals.runtime;
  if (!runtime?.env?.DB) {
    return new Response(JSON.stringify([]), { status: 503 });
  }

  const url = new URL(request.url);
  const date = url.searchParams.get('date');

  if (!date) {
    return new Response(JSON.stringify([]), { status: 400 });
  }

  try {
    const { results } = await runtime.env.DB
      .prepare("SELECT time FROM bookings WHERE date = ? AND status != 'rejected'")
      .bind(date)
      .all();
    
    // Return array of booked times
    const bookedTimes = results.map((r: any) => r.time);
    
    return new Response(JSON.stringify(bookedTimes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify([]), { status: 500 });
  }
};
