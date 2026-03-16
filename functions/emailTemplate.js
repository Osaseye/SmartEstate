
const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/smartestate-a2d99.firebasestorage.app/o/logo.png?alt=media";
const ICON_URL = "https://firebasestorage.googleapis.com/v0/b/smartestate-a2d99.firebasestorage.app/o/icon.png?alt=media&token=ea670e05-1f22-4fc6-9b99-0194f8035979";

/**
 * Generates a responsive HTML email template
 * @param {string} title - The main headline
 * @param {string} body - The HTML content of the message
 * @param {string} ctaLink - (Optional) URL for the call-to-action button
 * @param {string} ctaText - (Optional) Text for the call-to-action button
 */
function getEmailTemplate(title, body, ctaLink = null, ctaText = "View Dashboard") {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); }
        .header { background-color: #ffffff; padding: 30px 0; text-align: center; border-bottom: 2px solid #f9fafb; display: flex; justify-content: center; align-items: center; }
        .logo { height: 40px; width: auto; }
        .logo-text-accent { color: #16a34a; }
        .content { padding: 40px 48px; color: #4b5563; line-height: 1.7; font-size: 16px; }
        .h1 { color: #1f2937; font-size: 26px; font-weight: 800; margin-bottom: 24px; margin-top: 0; letter-spacing: -0.5px; }
        .content p { margin-top: 0; margin-bottom: 20px; }
        .content ul { padding-left: 20px; margin-bottom: 24px; }
        .content li { margin-bottom: 8px; }
        .button-container { text-align: center; margin-top: 36px; margin-bottom: 16px; }
        .button { background-color: #16a34a; color: #ffffff !important; padding: 16px 36px; border-radius: 12px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 16px; transition: all 0.2s ease; border: 1px solid #15803d; }
        .button:hover { background-color: #15803d; transform: translateY(-1px); }
        .divider { height: 1px; background-color: #e5e7eb; margin: 36px 0; }
        .footer { background-color: #f9fafb; padding: 32px 48px; text-align: center; }
        .footer-icon { width: 32px; height: auto; opacity: 0.7; margin-bottom: 12px; }
        .footer-text { color: #6b7280; font-size: 13px; margin: 0 0 12px; line-height: 1.5; }
        .footer-address { color: #9ca3af; font-size: 12px; margin: 0; }
        
        @media only screen and (max-width: 600px) {
            .content { padding: 32px 24px; }
            .footer { padding: 24px; }
            .wrapper { padding: 20px 10px; }
            .h1 { font-size: 22px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <!-- Header -->
            <div class="header">
                <img src="${LOGO_URL}" alt="SmartEstate Logo" class="logo">
            </div>

            <!-- Content -->
            <div class="content">
                <h1 class="h1">${title}</h1>
                ${body}
                
                ${ctaLink ? `
                <div class="button-container">
                    <a href="${ctaLink}" class="button">${ctaText}</a>
                </div>
                ` : ''}
                <div class="divider"></div>
                <p style="font-size: 14px; color: #6b7280; margin-bottom: 0;">If you didn't request this email, or need help, please reach out to your estate management directly.</p>
            </div>

            <!-- Footer -->
            <div class="footer">
                <img src="${ICON_URL}" alt="SmartEstate Icon" class="footer-icon">
                <p class="footer-text">You received this email because it affects your SmartEstate account.<br>Please do not reply directly to this automated email.</p>
                <p class="footer-address">&copy; ${new Date().getFullYear()} SmartEstate. Built for modern communities.</p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}

module.exports = { getEmailTemplate };
