import sgMail from '@sendgrid/mail';
import sgClient from '@sendgrid/client';

if (!process.env.NEXT_PUBLIC_SENDGRID_API_KEY) {
  console.warn('SENDGRID_API_KEY is not set in environment variables');
}

const apiKey = process.env.NEXT_PUBLIC_SENDGRID_API_KEY || '';
sgMail.setApiKey(apiKey);
sgClient.setApiKey(apiKey);

type EmailTemplate = 
  | 'welcome-business' 
  | 'welcome-marketer' 
  | 'password-reset' 
  | 'email-verification';

const templates: Record<EmailTemplate, string> = {
  'welcome-business': 'd-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your business welcome template ID
  'welcome-marketer': 'd-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your marketer welcome template ID
  'password-reset': 'd-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'email-verification': 'd-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
};

// SendGrid List IDs
const lists = {
  businessOnboarding: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // Replace with your business list ID
  marketerOnboarding: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // Replace with your marketer list ID
};

interface SendEmailOptions {
  to: string;
  template: EmailTemplate;
  dynamicData?: Record<string, any>;
}

export async function sendEmail({ to, template, dynamicData = {} }: SendEmailOptions) {
  try {
    const msg = {
      to,
      from: process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL || 'dispatch@callmargo.com',
      templateId: templates[template],
      dynamicTemplateData: {
        ...dynamicData,
        appName: 'Margo OS',
        supportEmail: 'support@callmargo.com',
      },
    };

    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to} using template ${template}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

interface ContactData {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  userType: 'business' | 'marketer';
  customFields?: Record<string, any>;
}

export async function addContactToList(contactData: ContactData) {
  try {
    const listId = contactData.userType === 'business' 
      ? lists.businessOnboarding 
      : lists.marketerOnboarding;

    const data = {
      list_ids: [listId],
      contacts: [{
        email: contactData.email,
        first_name: contactData.firstName,
        last_name: contactData.lastName,
        company: contactData.company,
        custom_fields: contactData.customFields,
      }],
    };

    const request = {
      url: '/v3/marketing/contacts',
      method: 'PUT' as const,
      body: data,
    };

    await sgClient.request(request);
    console.log(`Contact ${contactData.email} added to ${contactData.userType} onboarding list`);
    return true;
  } catch (error) {
    console.error('Error adding contact to list:', error);
    throw new Error('Failed to add contact to list');
  }
}

// Helper functions for specific email types
export async function sendBusinessWelcomeEmail(email: string, name: string, company: string) {
  await Promise.all([
    sendEmail({
      to: email,
      template: 'welcome-business',
      dynamicData: {
        name,
        company,
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/signin`,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        setupGuideUrl: `${process.env.NEXT_PUBLIC_APP_URL}/guide/business`,
      },
    }),
    addContactToList({
      email,
      firstName: name.split(' ')[0],
      lastName: name.split(' ')[1],
      company,
      userType: 'business',
      customFields: {
        onboarding_stage: 'welcome',
        signup_date: new Date().toISOString(),
      },
    }),
  ]);
}

export async function sendMarketerWelcomeEmail(email: string, name: string, expertise: string[]) {
  await Promise.all([
    sendEmail({
      to: email,
      template: 'welcome-marketer',
      dynamicData: {
        name,
        expertise: expertise.join(', '),
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/signin`,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        setupGuideUrl: `${process.env.NEXT_PUBLIC_APP_URL}/guide/marketer`,
      },
    }),
    addContactToList({
      email,
      firstName: name.split(' ')[0],
      lastName: name.split(' ')[1],
      userType: 'marketer',
      customFields: {
        onboarding_stage: 'welcome',
        signup_date: new Date().toISOString(),
        expertise: expertise,
      },
    }),
  ]);
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  return sendEmail({
    to: email,
    template: 'password-reset',
    dynamicData: {
      resetUrl,
      expiryHours: 24,
    },
  });
}

export async function sendVerificationEmail(email: string, verificationUrl: string) {
  return sendEmail({
    to: email,
    template: 'email-verification',
    dynamicData: {
      verificationUrl,
    },
  });
}
