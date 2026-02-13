"""
📧 Notification Manager - 9LMNTS Studio
Handles email notifications and communications
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

logger = logging.getLogger(__name__)


class NotificationManager:
    """Manage all notification types"""

    def __init__(self, config):
        self.config = config
        self.smtp_server = config.SMTP_SERVER
        self.smtp_port = config.SMTP_PORT
        self.smtp_user = config.SMTP_USER
        self.smtp_password = config.SMTP_PASSWORD
        self.sender_email = config.SENDER_EMAIL

    def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: str = None
    ) -> bool:
        """Send email notification"""

        if not self.config.FEATURES['email_notifications']:
            logger.info(f"Email notifications disabled, skipping: {subject}")
            return False

        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.sender_email
            msg['To'] = to_email

            if text_content:
                msg.attach(MIMEText(text_content, 'plain'))
            msg.attach(MIMEText(html_content, 'html'))

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)

            logger.info(f"Email sent to {to_email}: {subject}")
            return True

        except Exception as e:
            logger.error(f"Email error: {str(e)}")
            return False

    def send_lead_confirmation(self, lead_data: dict) -> bool:
        """Send confirmation email to lead"""

        subject = f"✅ We Received Your {lead_data.get('service_type')} Request"

        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Thank You, {lead_data.get('name')}!</h2>
                <p>We've received your request for <strong>{lead_data.get('service_type')}</strong>.</p>

                <h3>What's Next?</h3>
                <ol>
                    <li>Our team will review your project</li>
                    <li>We'll qualify your request for fit</li>
                    <li>You'll receive a proposal with details</li>
                </ol>

                <p><strong>Budget:</strong> ${lead_data.get('budget')}</p>
                <p><strong>Timeline:</strong> {lead_data.get('timeline')}</p>

                <p>Questions? Reply to this email or contact us at {self.config.COMPANY_EMAIL}</p>

                <p>Best regards,<br><strong>9LMNTS Studio Team</strong></p>
            </body>
        </html>
        """

        return self.send_email(lead_data.get('email'), subject, html_content)

    def send_admin_notification(self, lead_data: dict, qualification: dict) -> bool:
        """Notify admins of new qualified lead"""

        subject = f"🔥 New Lead: {lead_data.get('name')} ({qualification['category']})"

        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>New Lead Received</h2>

                <h3>Lead Information</h3>
                <table style="border-collapse: collapse; width: 100%;">
                    <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>Name:</strong></td>
                        <td style="border: 1px solid #ddd; padding: 8px;">{lead_data.get('name')}</td></tr>
                    <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>Email:</strong></td>
                        <td style="border: 1px solid #ddd; padding: 8px;">{lead_data.get('email')}</td></tr>
                    <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>Service:</strong></td>
                        <td style="border: 1px solid #ddd; padding: 8px;">{lead_data.get('service_type')}</td></tr>
                    <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>Budget:</strong></td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${lead_data.get('budget')}</td></tr>
                    <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>Timeline:</strong></td>
                        <td style="border: 1px solid #ddd; padding: 8px;">{lead_data.get('timeline')}</td></tr>
                </table>

                <h3>Qualification</h3>
                <p><strong>Score:</strong> {qualification['score']}/100</p>
                <p><strong>Category:</strong> {qualification['category']}</p>
                <p><strong>Action:</strong> {'Prioritize this lead' if qualification['score'] >= 80 else 'Review and follow up'}</p>

                <hr>
                <p><small>This is an automated notification from 9LMNTS Studio automation system.</small></p>
            </body>
        </html>
        """

        return self.send_email(
            self.config.COMPANY_EMAIL,
            subject,
            html_content
        )

    def send_meeting_scheduled(self, lead_data: dict, meeting_link: str, meeting_time: str) -> bool:
        """Notify lead that meeting is scheduled"""

        subject = f"📅 Your {lead_data.get('service_type')} Consultation is Scheduled!"

        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Meeting Scheduled!</h2>
                <p>Hi {lead_data.get('name')},</p>

                <p>Your consultation for <strong>{lead_data.get('service_type')}</strong> is confirmed!</p>

                <h3>Meeting Details</h3>
                <p><strong>Date & Time:</strong> {meeting_time}</p>
                <p><strong>Join Meeting:</strong> <a href="{meeting_link}">{meeting_link}</a></p>

                <h3>What to Expect</h3>
                <ul>
                    <li>Project discovery and requirements</li>
                    <li>Scope and timeline discussion</li>
                    <li>Investment and next steps</li>
                </ul>

                <p>See you soon!</p>
                <p><strong>9LMNTS Studio Team</strong></p>
            </body>
        </html>
        """

        return self.send_email(lead_data.get('email'), subject, html_content)
