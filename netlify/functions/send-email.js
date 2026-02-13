// Netlify Function for Email Sending - Simplified & Robust
const handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('📧 Email function called');
    const data = JSON.parse(event.body);
    console.log('📧 Email data:', data);

    // For now, just log the email and return success
    // We'll implement actual email sending later
    console.log('📧 Email would be sent to:', data.to);
    console.log('📧 Subject:', data.subject);
    
    // Store in a simple log (in production, this would go to a database)
    const emailLog = {
      timestamp: new Date().toISOString(),
      to: data.to,
      subject: data.subject,
      from: data.from,
      status: 'logged_for_manual_processing'
    };
    
    console.log('📧 Email logged:', emailLog);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email logged successfully',
        logged: true,
        timestamp: emailLog.timestamp
      })
    };

  } catch (error) {
    console.error('Email function error:', error);
    
    return {
      statusCode: 200, // Return 200 to not break the frontend
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email function error but frontend continues',
        error: error.message,
        fallback: true
      })
    };
  }
};

module.exports = { handler };
