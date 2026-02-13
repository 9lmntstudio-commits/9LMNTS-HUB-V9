
// Netlify function to forward Supabase data to n8n
exports.handler = async (event, context) => {
  const { leadData } = JSON.parse(event.body);
  
  try {
    // Forward to n8n webhook
    const n8nResponse = await fetch('https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData)
    });
    
    if (n8nResponse.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Lead forwarded to automation' })
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to forward to n8n' })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
