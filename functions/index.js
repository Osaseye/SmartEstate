const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
require('dotenv').config();
const { getEmailTemplate } = require("./emailTemplate");

admin.initializeApp();
const db = admin.firestore();

// Configure SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(SENDGRID_API_KEY);

const SENDER_EMAIL = "smartestatenotifications@gmail.com";

/* 
 * Helper: Send Email via SendGrid
 */
async function sendEmail(to, subject, htmlContent) {
    const msg = {
        to: to,
        from: SENDER_EMAIL, 
        subject: subject,
        html: htmlContent,
    };
    try {
        await sgMail.send(msg);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
}

/* 
 * Helper: Get Manager Email for an Estate
 */
async function getManagerEmail(estateId) {
    console.log(`Getting manager email for estateId: ${estateId}`);
    if (!estateId) {
        console.log("No estateId provided");
        return null;
    }
    
    // 1. Get Estate
    const estateDoc = await db.collection("estates").doc(estateId).get();
    if (!estateDoc.exists) {
        console.log(`Estate document ${estateId} does not exist`);
        return null;
    }
    const estateData = estateDoc.data();
    
    // 2. Get Manager User
    // Assuming estate has managerId
    if (!estateData.managerId) {
        console.log(`Estate ${estateId} has no managerId`);
        return null;
    }
    
    const managerDoc = await db.collection("users").doc(estateData.managerId).get();
    if (!managerDoc.exists) {
        console.log(`Manager user ${estateData.managerId} does not exist`);
        return null;
    }
    
    const email = managerDoc.data().personalEmail || managerDoc.data().email;
    console.log(`Found manager email: ${email}`);
    return email;
}

/*
 * TRIGGER 1: Tenant Approved (Notify Tenant)
 * TRIGGER 1b: New Tenant Request (Notify Manager)
 */
exports.onUserUpdate = functions.firestore
  .document("users/{userId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const userId = context.params.userId;

    console.log(`onUserUpdate triggered for ${userId}`);
    console.log(`Before: completed=${before.hasCompletedOnboarding}, status=${before.verificationStatus}`);
    console.log(`After: completed=${after.hasCompletedOnboarding}, status=${after.verificationStatus}`);

    // Case A: Tenant Approved (verificationStatus: pending -> verified)
    if (before.verificationStatus === "pending" && after.verificationStatus === "verified") {
        console.log("Detecting verification flow: Approved");
        try {
            const estateId = after.estateId;
            let estateName = "Your Estate";
            if (estateId) {
                const estateDoc = await db.collection("estates").doc(estateId).get();
                if (estateDoc.exists) estateName = estateDoc.data().name;
            }

            const emailBody = `
                <p>Hi ${after.name},</p>
                <p>Good news! Your request to join <strong>${estateName}</strong> has been approved by the estate manager.</p>
                <p>You can now access your resident dashboard to:</p>
                <ul>
                    <li>Pay your rent/levies online</li>
                    <li>Request maintenance</li>
                    <li>View estate announcements</li>
                </ul>
                <p>We are excited to have you on board.</p>
            `;

            const htmlContent = getEmailTemplate(
                `Welcome to ${estateName}!`,
                emailBody,
                "https://smartestate.app/login",
                "Access Dashboard"
            );

            const mailOptions = {
                to: after.email,
                subject: `Welcome Home! You're Approved to Join ${estateName}`,
                htmlContent: htmlContent
            };
            
            await sendEmail(mailOptions.to, mailOptions.subject, mailOptions.htmlContent);
            console.log(`Approval email sent to ${after.email}`);

        } catch (error) {
            console.error("Error sending approval email:", error);
        }
    }

    // Case B: New Tenant Request
    // Check if user just completed onboarding OR if verification status switched to pending (e.g. re-application)
    const justCompletedOnboarding = !before.hasCompletedOnboarding && after.hasCompletedOnboarding;
    const justRequestedVerification = after.verificationStatus === 'pending' && before.verificationStatus !== 'pending';
    
    if ((justCompletedOnboarding || justRequestedVerification) && after.verificationStatus === 'pending') {
        console.log("Detecting new tenant request flow");
        try {
            const managerEmail = await getManagerEmail(after.estateId);
            
            if (managerEmail) {
                const emailBody = `
                    <p><strong>${after.name}</strong> has requested to join your estate.</p>
                    <p><strong>Phone:</strong> ${after.phone || 'N/A'}</p>
                    <p>Please review their documents and approve or decline the request.</p>
                `;

                const htmlContent = getEmailTemplate(
                    "New Resident Request",
                    emailBody,
                    "https://smartestate.app/manager/tenants",
                    "Review Request"
                );

                const mailOptions = {
                    to: managerEmail, // Ensure this is not null
                    subject: `New Resident Request: ${after.name}`,
                    htmlContent: htmlContent
                };
                await sendEmail(mailOptions.to, mailOptions.subject, mailOptions.htmlContent);
                console.log(`New tenant notification sent to manager at ${managerEmail}`);
            } else {
                console.error(`Could not send email: No manager email found for estate ${after.estateId}`);
            }
        } catch (error) {
             console.error("Error notifying manager of new tenant:", error);
        }
    }
});


/*
 * TRIGGER 2: New Maintenance Request (Notify Manager)
 */
exports.onMaintenanceCreate = functions.firestore
  .document("maintenance/{ticketId}")
  .onCreate(async (snap, context) => {
      const ticket = snap.data();
      
      try {
          // Get Manager Email
          const managerEmail = await getManagerEmail(ticket.estateId);
          
          if (managerEmail) {
              const emailBody = `
                  <p><strong>Tenant:</strong> ${ticket.tenantName || 'A resident'}</p>
                  <p><strong>Issue:</strong> ${ticket.title}</p>
                  <p><strong>Priority:</strong> ${ticket.priority || 'Medium'}</p>
                  <p><strong>Description:</strong> ${ticket.description}</p>
              `;

              const htmlContent = getEmailTemplate(
                  "New Maintenance Ticket",
                  emailBody,
                  "https://smartestate.app/manager/maintenance",
                  "View Ticket"
              );

              const mailOptions = {
                  to: managerEmail,
                  subject: `New Maintenance Request: ${ticket.title}`,
                  htmlContent: htmlContent
              };
              
              await sendEmail(mailOptions.to, mailOptions.subject, mailOptions.htmlContent);
              console.log(`Maintenance notification sent to manager at ${managerEmail}`);
          }
      } catch (error) {
          console.error("Error sending maintenance notification:", error);
      }
  });
