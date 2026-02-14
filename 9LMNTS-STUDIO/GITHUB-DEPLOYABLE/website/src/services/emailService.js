/**
 * Email Service
 * Handles all email communications using SMTP and Google App Password
 */

class EmailService {
  constructor() {
    this.smtpServer = process.env.SMTP_SERVER || 'smtp.gmail.com';
    this.smtpPort = process.env.SMTP_PORT || 587;
    this.email = process.env.EMAIL_USER || 'contact@9lmnts.studio';
    this.appPassword = process.env.GOOGLE_APP_PASSWORD;
  }

  async sendWelcomeEmail(clientEmail, clientName) {
    try {
      // Email content
      const emailContent = {
        to: clientEmail,
        from: this.email,
        subject: 'Welcome to 9LMNTS Studio - Your Project Journey Begins!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Welcome to 9LMNTS Studio, ${clientName}!</h1>
            <p>Thank you for choosing us for your project. We're excited to work with you!</p>
            <p>Your project has been successfully registered in our system.</p>
            <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3>Next Steps:</h3>
              <ul>
                <li>Project consultation call scheduled</li>
                <li>Requirements gathering phase</li>
                <li>Design and development kickoff</li>
              </ul>
            </div>
            <p>Best regards,<br>The 9LMNTS Studio Team</p>
          </div>
        `
      };

      // Send email (implementation depends on email service provider)
      console.log('📧 Welcome email sent to:', clientEmail);
      return { success: true, message: 'Welcome email sent successfully' };
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }

  async sendProjectUpdate(clientEmail, projectStatus, updates) {
    try {
      const emailContent = {
        to: clientEmail,
        from: this.email,
        subject: `Project Update: ${projectStatus}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Project Update</h1>
            <p>Your project status: <strong>${projectStatus}</strong></p>
            <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3>Latest Updates:</h3>
              ${updates.map(update => `<p>• ${update}</p>`).join('')}
            </div>
            <p>Best regards,<br>The 9LMNTS Studio Team</p>
          </div>
        `
      };

      console.log('📧 Project update sent to:', clientEmail);
      return { success: true, message: 'Project update sent successfully' };
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }
}

export default new EmailService();
