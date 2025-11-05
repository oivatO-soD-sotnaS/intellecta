import smtplib
import ssl
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("EMAIL_HOST", "smtp.gmail.com")
        self.port = int(os.getenv("EMAIL_PORT", 587))
        self.sender_email = os.getenv("EMAIL_USERNAME")
        self.sender_password = os.getenv("EMAIL_PASSWORD")
        self.sender_name = os.getenv("EMAIL_SENDER", "Intellecta")

    def send_mail(self, to_email, to_name, subject, body, alt_body=''):
        message = MIMEMultipart('alternative')
        message["From"] = f"{self.sender_name} <{self.sender_email}>"
        message["To"] = f"{to_name} <{to_email}>"
        message["Subject"] = subject

        # Convert body to plain and HTML parts
        part1 = MIMEText(alt_body or self._strip_tags(body), 'plain', 'utf-8')
        part2 = MIMEText(body, 'html', 'utf-8')

        # Attach both versions
        message.attach(part1)
        message.attach(part2)

        context = ssl.create_default_context()
        try:
            with smtplib.SMTP(self.smtp_server, self.port) as server:
                server.starttls(context=context)
                server.login(self.sender_email, self.sender_password)
                server.sendmail(self.sender_email, to_email, message.as_string())
            print(f"[✔] Sent: {to_email}")
            return True
        except Exception as e:
            print(f"[✘] Failed to send to {to_email}: {e}")
            return False

    def _strip_tags(self, html_content):
        import re
        clean = re.compile('<.*?>')
        return re.sub(clean, '', html_content)
