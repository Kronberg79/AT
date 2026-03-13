import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    let name, email, message, company, phone;

    // Handle both JSON and FormData submissions gracefully
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      name = body.name || 'No Name';
      email = body.email || 'No Email';
      message = body.message || 'No Message';
      company = body.company || '';
      phone = body.phone || '';
    } else {
      const data = await request.formData();
      name = data.get('name')?.toString() || 'No Name';
      email = data.get('email')?.toString() || 'No Email';
      message = data.get('message')?.toString() || 'No Message';
      company = data.get('company')?.toString() || '';
      phone = data.get('phone')?.toString() || '';
    }

    const apiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing Resend API key in environment variables.' }), { status: 500 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'Archipelago Technics <info@a-t.fi>', // Must be a verified domain in Resend
        to: 'support@a-t.fi',                       // Fixed destination per request
        reply_to: email,
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
        `
      })
    });

    const responseData = await res.json().catch(() => ({ message: 'No JSON response from Resend' }));

    if (!res.ok) {
      // Return exact error from Resend
      return new Response(JSON.stringify({ error: responseData.message || 'Failed to send via Resend', details: responseData }), { status: res.status });
    }

    return new Response(JSON.stringify({ success: true, message: 'Message sent successfully' }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
};

// SIMULATION ENDPOINT: Add a GET method so you can easily test it via browser
export const GET: APIRoute = async ({ request }) => {
  try {
    const apiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing Resend API key in environment variables.' }, null, 2), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'Archipelago Technics <info@a-t.fi>',
        to: 'support@a-t.fi',
        subject: 'Test Simulation Message from System',
        html: '<p>This is a simulated test message. If you receive this, the API key is correct and info@a-t.fi is successfully verified on Resend to send emails.</p>'
      })
    });

    const responseData = await res.json().catch(() => ({ message: 'No JSON response from Resend' }));

    if (!res.ok) {
      return new Response(JSON.stringify({
        error: 'Test failed. Resend rejected the request.',
        details: responseData
      }, null, 2), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
        success: true,
        message: 'Simulation successful! Test message was sent to support@a-t.fi.',
        resendResponse: responseData
    }, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }, null, 2), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
};
