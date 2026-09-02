import {
    Body,
    Column,
    Container,
    Head,
    Hr,
    Html,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface SubscriptionConfirmationEmailProps {
    email: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://vishwawellness.com';

const benefits = [
    {
        title: 'Rituals & Bhasma practice',
        description: 'Traditional preparations explained step by step, for use at home.',
    },
    {
        title: 'Wellness recipes',
        description: 'Seasonal formulations drawn from Ayurvedic practice.',
    },
    {
        title: 'New releases & subscriber offers',
        description: 'Early access to collections before they are announced publicly.',
    },
    {
        title: 'Agnihotra retreat dates',
        description: 'Programme announcements and enrolment windows as they open.',
    },
];

export const SubscriptionConfirmationEmail = ({
    email = 'subscriber@example.com',
}: SubscriptionConfirmationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Your subscription to the Vishwa Wellness journal is confirmed</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Masthead */}
                    <Section style={header}>
                        <Text style={headerTitle}>VISHWA WELLNESS</Text>
                        <Text style={tagline}>Ancient Wisdom, Modern Living</Text>
                    </Section>

                    {/* Accent rule beneath the masthead */}
                    <Section style={accentBar} />

                    <Section style={content}>
                        <Text style={eyebrow}>SUBSCRIPTION CONFIRMED</Text>
                        <Text style={heading}>Welcome to the Sacred Circle</Text>

                        <Text style={paragraph}>
                            Thank you for subscribing. You have joined a community of readers who
                            practise the sacred science of ash — and you will now hear from us
                            whenever there is something genuinely worth sharing.
                        </Text>

                        <Hr style={divider} />

                        <Text style={sectionLabel}>WHAT YOU WILL RECEIVE</Text>

                        {benefits.map((benefit) => (
                            <Row key={benefit.title} style={benefitRow}>
                                <Column style={benefitMarkerCell}>
                                    <Text style={benefitMarker}>&#10022;</Text>
                                </Column>
                                <Column>
                                    <Text style={benefitTitle}>{benefit.title}</Text>
                                    <Text style={benefitDescription}>{benefit.description}</Text>
                                </Column>
                            </Row>
                        ))}

                        <Hr style={divider} />

                        <Text style={paragraph}>
                            In the meantime, explore our collection of authentic Bhasma-based
                            products, each crafted from sacred fire rituals.
                        </Text>

                        <Section style={ctaSection}>
                            <Link href={`${SITE_URL}/shop`} style={button}>
                                Explore the Collection
                            </Link>
                        </Section>

                        <Text style={secondaryLinkWrap}>
                            <Link href={`${SITE_URL}/awt-retreats`} style={secondaryLink}>
                                Or read about our wellness retreats
                            </Link>
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            This email was sent to{' '}
                            <Link href={`mailto:${email}`} style={footerEmailLink}>
                                {email}
                            </Link>{' '}
                            because you subscribed to the Vishwa Wellness newsletter.
                        </Text>
                        <Text style={footerText}>
                            Questions? Write to us at{' '}
                            <Link href="mailto:CRM@VISHWAGLOBAL.COM" style={footerLink}>
                                CRM@VISHWAGLOBAL.COM
                            </Link>
                        </Text>
                        <Text style={footerMeta}>
                            &copy; {new Date().getFullYear()} Vishwa Wellness. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default SubscriptionConfirmationEmail;

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* Brand tokens mirror globals.css: navy #222, primary #C73C2E,        */
/* gold #d4a574, cream #f5f2f2, ash #777.                              */
/* ------------------------------------------------------------------ */

const SANS =
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif';
// The site sets headings in Cormorant Garamond; Georgia is the closest
// serif that email clients reliably have installed.
const SERIF = 'Georgia,"Times New Roman",Times,serif';

const main = {
    backgroundColor: '#f5f2f2',
    fontFamily: SANS,
    margin: '0',
    padding: '0',
};

const container = {
    margin: '0 auto',
    padding: '32px 0 40px',
    width: '600px',
    maxWidth: '100%',
};

const header = {
    backgroundColor: '#1a1a2e',
    padding: '40px 24px 34px',
    textAlign: 'center' as const,
};

const headerTitle = {
    color: '#ffffff',
    fontFamily: SERIF,
    fontSize: '26px',
    fontWeight: '400',
    letterSpacing: '5px',
    margin: '0',
};

const tagline = {
    color: '#d4a574',
    fontSize: '12px',
    fontStyle: 'italic',
    letterSpacing: '0.6px',
    margin: '10px 0 0',
};

const accentBar = {
    backgroundColor: '#C73C2E',
    fontSize: '0',
    height: '3px',
    lineHeight: '3px',
};

const content = {
    backgroundColor: '#ffffff',
    padding: '40px 44px 44px',
};

const eyebrow = {
    color: '#C73C2E',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1.6px',
    margin: '0 0 12px',
};

const heading = {
    color: '#222222',
    fontFamily: SERIF,
    fontSize: '30px',
    fontWeight: '400',
    lineHeight: '38px',
    margin: '0 0 20px',
};

const paragraph = {
    color: '#555555',
    fontSize: '15px',
    lineHeight: '26px',
    margin: '0 0 16px',
};

const divider = {
    borderColor: '#eeeeee',
    borderTopWidth: '1px',
    margin: '30px 0',
};

const sectionLabel = {
    color: '#777777',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1.4px',
    margin: '0 0 20px',
};

const benefitRow = {
    marginBottom: '18px',
};

const benefitMarkerCell = {
    verticalAlign: 'top' as const,
    width: '26px',
};

const benefitMarker = {
    color: '#d4a574',
    fontSize: '14px',
    lineHeight: '22px',
    margin: '0',
};

const benefitTitle = {
    color: '#222222',
    fontSize: '15px',
    fontWeight: '600',
    lineHeight: '22px',
    margin: '0 0 3px',
};

const benefitDescription = {
    color: '#777777',
    fontSize: '13px',
    lineHeight: '20px',
    margin: '0 0 14px',
};

const ctaSection = {
    margin: '30px 0 18px',
    textAlign: 'center' as const,
};

const button = {
    backgroundColor: '#C73C2E',
    borderRadius: '2px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '1.1px',
    padding: '16px 40px',
    textDecoration: 'none',
    textTransform: 'uppercase' as const,
};

const secondaryLinkWrap = {
    margin: '0',
    textAlign: 'center' as const,
};

const secondaryLink = {
    color: '#777777',
    fontSize: '13px',
    textDecoration: 'underline',
};

const footer = {
    backgroundColor: '#f5f2f2',
    borderTop: '1px solid #e6e0e0',
    padding: '26px 44px 30px',
};

const footerText = {
    color: '#999999',
    fontSize: '12px',
    lineHeight: '20px',
    margin: '0 0 8px',
    textAlign: 'center' as const,
};

const footerEmailLink = {
    color: '#777777',
    textDecoration: 'none',
};

const footerLink = {
    color: '#C73C2E',
    textDecoration: 'none',
};

const footerMeta = {
    color: '#b0a9a9',
    fontSize: '11px',
    lineHeight: '18px',
    margin: '12px 0 0',
    textAlign: 'center' as const,
};
