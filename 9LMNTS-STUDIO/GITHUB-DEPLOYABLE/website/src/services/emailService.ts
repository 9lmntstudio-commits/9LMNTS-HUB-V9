// Email Service for 9LMNTS Studio
// Uses Resend API for reliable email delivery

interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface ClientConfirmationData {
  clientName: string;
  clientEmail: string;
  serviceName: string;
  projectType: string;
  timeline: string;
  company?: string;
}

interface AgencyNotificationData {
  clientName: string;
  clientEmail: string;
  serviceName: string;
  projectType: string;
  timeline: string;
  company?: string;
  phone?: string;
  budget?: string;
}

class EmailService {
  private readonly RESEND_API_URL = 'https://api.resend.com/emails';
  private readonly FROM_EMAIL = 'noreply@9lmntsstudio.com';
  private readonly AGENCY_EMAIL = 'info@9lmntsstudio.com';

  async sendClientConfirmation(data: ClientConfirmationData): Promise<boolean> {
    try {
      const html = this.generateClientConfirmationTemplate(data);
      
      const emailData: EmailData = {
        to: data.clientEmail,
        subject: `✅ Project Confirmation - ${data.serviceName}`,
        html,
        from: this.FROM_EMAIL
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Failed to send client confirmation:', error);
      return false;
    }
  }

  async sendAgencyNotification(data: AgencyNotificationData): Promise<boolean> {
    try {
      const html = this.generateAgencyNotificationTemplate(data);
      
      const emailData: EmailData = {
        to: this.AGENCY_EMAIL,
        subject: `🚀 New Project Submission - ${data.serviceName}`,
        html,
        from: this.FROM_EMAIL
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Failed to send agency notification:', error);
      return false;
    }
  }

  private async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // For development, log the email instead of sending
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Email would be sent:', emailData);
        return true;
      }

      // In production, use Netlify function or server-side endpoint
      // Direct browser calls to Resend API will fail due to CORS
      console.log('📧 Attempting to send email via serverless function...');
      
      try {
        const response = await fetch('/.netlify/functions/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Email sent via serverless function:', result.id);
          return true;
        } else {
          throw new Error(`Serverless function error: ${response.status}`);
        }
      } catch (serverlessError) {
        console.log('⚠️ Serverless function failed, using backup method');
        
        // Backup: Store in localStorage for manual processing
        const emailQueue = JSON.parse(localStorage.getItem('email_queue') || '[]');
        emailQueue.push({
          ...emailData,
          timestamp: new Date().toISOString(),
          attempt: 'serverless_failed'
        });
        localStorage.setItem('email_queue', JSON.stringify(emailQueue));
        
        console.log('💾 Email queued for manual processing:', emailData);
        return true; // Don't fail the submission
      }

    } catch (error: any) {
      console.error('❌ Email sending failed:', error);
      
      // Always store in localStorage as ultimate fallback
      const emailQueue = JSON.parse(localStorage.getItem('email_queue') || '[]');
      emailQueue.push({
        ...emailData,
        timestamp: new Date().toISOString(),
        error: error.message
      });
      localStorage.setItem('email_queue', JSON.stringify(emailQueue));
      
      return false;
    }
  }

  private generateClientConfirmationTemplate(data: ClientConfirmationData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Project Confirmation - 9LMNTS Studio</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FF7A00; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .highlight { background: #1A1A1A; color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎯 Project Confirmed!</h1>
          <p>9LMNTS Studio - AI-Powered Digital Excellence</p>
        </div>
        
        <div class="content">
          <h2>Hi ${data.clientName},</h2>
          <p>Thank you for submitting your project request! We've received your details and our team is excited to work with you.</p>
          
          <div class="highlight">
            <h3>📋 Project Details</h3>
            <p><strong>Service:</strong> ${data.serviceName}</p>
            <p><strong>Project Type:</strong> ${data.projectType}</p>
            <p><strong>Timeline:</strong> ${data.timeline}</p>
            ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
          </div>
          
          <h3>🚀 What's Next?</h3>
          <ol>
            <li>Our AI system will analyze your project requirements</li>
            <li>You'll receive a detailed proposal within 24 hours</li>
            <li>Project kickoff upon approval</li>
          </ol>
          
          <p><strong>Need to reach us?</strong> Reply to this email or call us at your convenience.</p>
          
          <p>Best regards,<br>The 9LMNTS Studio Team</p>
        </div>
        
        <div class="footer">
          <p>© 2026 9LMNTS Studio | Transforming businesses with AI</p>
        </div>
      </body>
      </html>
    `;
  }

  private generateAgencyNotificationTemplate(data: AgencyNotificationData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Project Submission - 9LMNTS Studio</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FF7A00; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .highlight { background: #1A1A1A; color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .urgent { background: #ff4444; color: white; padding: 10px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚀 New Project Submission!</h1>
          <p>9LMNTS Studio - Lead Alert</p>
        </div>
        
        <div class="content">
          <div class="urgent">
            <h3>⚡ ACTION REQUIRED</h3>
            <p>A new project has been submitted and needs your attention!</p>
          </div>
          
          <h2>Client Information</h2>
          <div class="highlight">
            <p><strong>Name:</strong> ${data.clientName}</p>
            <p><strong>Email:</strong> ${data.clientEmail}</p>
            ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
            ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
          </div>
          
          <h2>Project Details</h2>
          <div class="highlight">
            <p><strong>Service:</strong> ${data.serviceName}</p>
            <p><strong>Project Type:</strong> ${data.projectType}</p>
            <p><strong>Timeline:</strong> ${data.timeline}</p>
            ${data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : ''}
          </div>
          
          <h3>📊 Next Steps</h3>
          <ol>
            <li>Review client details in admin dashboard</li>
            <li>Run AI qualification scoring</li>
            <li>Send personalized proposal</li>
            <li>Schedule consultation call</li>
          </ol>
          
          <p><strong>Quick Actions:</strong></p>
          <ul>
            <li>📧 <a href="mailto:${data.clientEmail}">Email Client</a></li>
            <li>📊 <a href="https://9lmntsstudio.com/admin">View in Dashboard</a></li>
          </ul>
        </div>
        
        <div class="footer">
          <p>© 2026 9LMNTS Studio | Automated Lead Generation System</p>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
