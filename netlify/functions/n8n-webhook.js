// 9LMNTS Working Webhook Function - Sends to your n8n production
exports.handler = async (event, context) => {
  const { leadData } = JSON.parse(event.body);
  
  try {
    // Send to your production n8n webhook
    const response = await fetch('https://ixlmnts.app.n8n.cloud/webhook/9lmnts-leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Lead processed by n8n:', result);
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          message: 'Lead processed successfully',
          payment_link: result.processed?.payment_link || 'https://PayPal.Me/9LMNTSSTUDIO/500'
        })
      };
    } else {
      console.log('⚠️ n8n not responding, using fallback');
      // Fallback: Generate PayPal link directly
      const budget = parseInt(leadData.budget) || 500;
      const paypalLink = budget >= 3000 
        ? `https://PayPal.Me/9LMNTSSTUDIO/${Math.floor(budget * 0.8)}`
        : 'https://PayPal.Me/9LMNTSSTUDIO/500';
      
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          message: 'Fallback payment link generated',
          payment_link: paypalLink
        })
      };
    }
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
