// emailService.ts
interface EmailData {
  to: string;
  subject: string;
  body: string;
}

/**
 * Sends an email with the provided data
 * @param emailData The email data containing recipient, subject and body
 * @returns Promise resolving to true if the email was sent successfully
 * @throws Error if sending fails
 */
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    console.log("Sending email:", emailData);
    
    // In a real implementation, you would call a backend API or service
    // For demo, we'll simulate a successful email send after a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

/**
 * Validates email data before sending
 * @param emailData The email data to validate
 * @returns Object containing validation result and any error messages
 */
export const validateEmailData = (emailData: EmailData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check for required fields
  if (!emailData.to) errors.push("Recipient email is required");
  if (!emailData.subject) errors.push("Subject is required");
  if (!emailData.body) errors.push("Email body is required");
  
  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailData.to && !emailRegex.test(emailData.to)) {
    errors.push("Invalid email format");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sends a batch of emails
 * @param emailsData Array of email data objects
 * @returns Promise resolving to an array of results for each email
 */
export const sendBatchEmails = async (emailsData: EmailData[]): Promise<Array<{ success: boolean, to: string }>> => {
  const results = await Promise.all(
    emailsData.map(async (email) => {
      try {
        await sendEmail(email);
        return { success: true, to: email.to };
      } catch (error) {
        return { success: false, to: email.to };
      }
    })
  );
  
  return results;
};

// Export the EmailData interface for use in other components
export type { EmailData };