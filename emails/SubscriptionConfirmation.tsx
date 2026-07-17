import {
    Body,
    Container,
    Head,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface SubscriptionConfirmationEmailProps {
    email: string;
}

export const SubscriptionConfirmationEmail = ({
    email = 'subscriber@example.com',
}: SubscriptionConfirmationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Welcome to Vishwa Wellness — You&apos;re now part of our Sacred Circle</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Text style={headerTitle}>VISHWA WELLNESS</Text>
                        <Text style={tagline}>Ancient Wisdom, Modern Living</Text>
                    </Section>

                    {/* Content */}
                    <Section style={content}>
                        <Text style={heading}>Welcome to Our Sacred Circle 🙏</Text>
                        <Text style={paragraph}>
                            Thank you for subscribing to the Vishwa Wellness newsletter!
                        </Text>
                        <Text style={paragraph}>
                            You&apos;ll now receive exclusive updates on:
                        </Text>
                        <Text style={listItem}>✦ Sacred rituals and Bhasma practices</Text>
                        <Text style={listItem}>✦ DIY wellness recipes</Text>
                        <Text style={listItem}>✦ Exclusive product launches and offers</Text>
                        <Text style={listItem}>✦ Agnihotra Wellness Retreat announcements</Text>
                        <Text style={listItem}>✦ Ancient wisdom for modern living</Text>

                        <Hr style={divider} />

                        <Text style={paragraph}>
                            In the meantime, explore our collection of authentic Bhasma-based
                            wellness products crafted from sacred fire rituals.
                        </Text>

                        {/* CTA */}
                        <Section style={ctaSection}>
                            <Link
                                href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://vishwawellness.com'}/shop`}
                                style={button}
                            >
                                Explore Our Products
                            </Link>
                        </Section>

                        {/* Footer */}
                        <Hr style={divider} />
                        <Text style={footerText}>
                            This email was sent to {email} because you subscribed to the
                            Vishwa Wellness newsletter.
                        </Text>
                        <Text style={footerText}>
                            Questions? Contact us at{' '}
                            <Link href="mailto:CRM@VISHWAGLOBAL.COM" style={link}>
                                CRM@VISHWAGLOBAL.COM
                            </Link>
                        </Text>
                        <Text style={footerText}>
                            © {new Date().getFullYear()} Vishwa Wellness. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default SubscriptionConfirmationEmail;

// Styles
const main = {
    backgroundColor: '#f5f2f2',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0',
    width: '600px',
};

const header = {
    backgroundColor: '#1a1a2e',
    padding: '32px 24px',
    textAlign: 'center' as const,
};

const headerTitle = {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '2px',
    margin: '0',
};

const tagline = {
    color: '#d4a574',
    fontSize: '14px',
    fontStyle: 'italic',
    margin: '8px 0 0',
};

const content = {
    backgroundColor: '#ffffff',
    padding: '32px 24px',
};

const heading = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#222',
    margin: '0 0 16px',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#555',
    margin: '0 0 12px',
};

const listItem = {
    fontSize: '15px',
    lineHeight: '28px',
    color: '#444',
    margin: '0',
    paddingLeft: '8px',
};

const divider = {
    borderColor: '#eee',
    margin: '24px 0',
};

const ctaSection = {
    margin: '32px 0',
    textAlign: 'center' as const,
};

const button = {
    backgroundColor: '#C73C2E',
    borderRadius: '6px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: '600',
    padding: '14px 32px',
    textDecoration: 'none',
};

const footerText = {
    fontSize: '12px',
    color: '#999',
    lineHeight: '20px',
    margin: '8px 0',
    textAlign: 'center' as const,
};

const link = {
    color: '#C73C2E',
    textDecoration: 'underline',
};
