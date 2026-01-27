import {
    Body,
    Container,
    Column,
    Head,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface OrderItem {
    product_name: string;
    product_image?: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface OrderConfirmationEmailProps {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
    shippingAddress: {
        firstName: string;
        lastName: string;
        address: string;
        apartment?: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
        phone: string;
    };
    paymentStatus: string;
}

export const OrderConfirmationEmail = ({
    orderNumber = 'VW-20260127-0001',
    customerName = 'Guest Customer',
    customerEmail = 'customer@example.com',
    items = [],
    subtotal = 0,
    shippingCost = 0,
    discount = 0,
    total = 0,
    shippingAddress,
    paymentStatus = 'pending',
}: OrderConfirmationEmailProps) => {
    const previewText = `Order ${orderNumber} confirmed - Vishwa Wellness`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Text style={headerTitle}>VISHWA WELLNESS</Text>
                        <Text style={tagline}>Ancient Wisdom, Modern Living</Text>
                    </Section>

                    {/* Order Confirmation */}
                    <Section style={content}>
                        <Text style={heading}>Order Confirmation</Text>
                        <Text style={paragraph}>
                            Thank you for your order, {customerName}!
                        </Text>
                        <Text style={paragraph}>
                            Your order has been received and is being processed.
                        </Text>

                        {/* Order Details Box */}
                        <Section style={orderBox}>
                            <Row>
                                <Column>
                                    <Text style={orderLabel}>Order Number</Text>
                                    <Text style={orderValue}>{orderNumber}</Text>
                                </Column>
                                <Column>
                                    <Text style={orderLabel}>Payment Status</Text>
                                    <Text style={orderValue}>{paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}</Text>
                                </Column>
                            </Row>
                        </Section>

                        {/* Order Items */}
                        <Text style={sectionTitle}>Order Items</Text>
                        {items.map((item, index) => (
                            <Section key={index} style={itemRow}>
                                <Row>
                                    <Column style={{ width: '80px' }}>
                                        {item.product_image && (
                                            <Img
                                                src={item.product_image}
                                                alt={item.product_name}
                                                width="64"
                                                height="64"
                                                style={productImage}
                                            />
                                        )}
                                    </Column>
                                    <Column style={{ paddingLeft: '16px' }}>
                                        <Text style={productName}>{item.product_name}</Text>
                                        <Text style={productDetails}>
                                            Qty: {item.quantity} × ₹{item.unit_price.toFixed(2)}
                                        </Text>
                                    </Column>
                                    <Column align="right">
                                        <Text style={productPrice}>₹{item.total_price.toFixed(2)}</Text>
                                    </Column>
                                </Row>
                            </Section>
                        ))}

                        <Hr style={divider} />

                        {/* Order Summary */}
                        <Section style={summary}>
                            <Row>
                                <Column><Text style={summaryLabel}>Subtotal</Text></Column>
                                <Column align="right"><Text style={summaryValue}>₹{subtotal.toFixed(2)}</Text></Column>
                            </Row>
                            <Row>
                                <Column><Text style={summaryLabel}>Shipping</Text></Column>
                                <Column align="right"><Text style={summaryValue}>₹{shippingCost.toFixed(2)}</Text></Column>
                            </Row>
                            {discount > 0 && (
                                <Row>
                                    <Column><Text style={summaryLabel}>Discount</Text></Column>
                                    <Column align="right"><Text style={summaryValueDiscount}>-₹{discount.toFixed(2)}</Text></Column>
                                </Row>
                            )}
                            <Hr style={divider} />
                            <Row>
                                <Column><Text style={totalLabel}>Total</Text></Column>
                                <Column align="right"><Text style={totalValue}>₹{total.toFixed(2)}</Text></Column>
                            </Row>
                        </Section>

                        {/* Shipping Address */}
                        <Text style={sectionTitle}>Shipping Address</Text>
                        <Section style={addressBox}>
                            <Text style={addressText}>
                                {shippingAddress.firstName} {shippingAddress.lastName}<br />
                                {shippingAddress.address}
                                {shippingAddress.apartment && `, ${shippingAddress.apartment}`}<br />
                                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}<br />
                                {shippingAddress.country}<br />
                                Phone: {shippingAddress.phone}
                            </Text>
                        </Section>

                        {/* CTA */}
                        <Section style={ctaSection}>
                            <Link href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://vishwawellness.com'}/account/orders`} style={button}>
                                View Order Details
                            </Link>
                        </Section>

                        {/* Footer */}
                        <Hr style={divider} />
                        <Text style={footerText}>
                            Questions about your order? Reply to this email or contact us at{' '}
                            <Link href="mailto:support@vishwawellness.com" style={link}>
                                support@vishwawellness.com
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

export default OrderConfirmationEmail;

// Styles
const main = {
    backgroundColor: '#f5f2f2',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
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

const sectionTitle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#222',
    margin: '24px 0 12px',
};

const orderBox = {
    backgroundColor: '#f9f9f9',
    border: '2px solid #C73C2E',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px 0',
};

const orderLabel = {
    fontSize: '12px',
    color: '#777',
    textTransform: 'uppercase' as const,
    margin: '0 0 4px',
};

const orderValue = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#222',
    margin: '0',
};

const itemRow = {
    padding: '12px 0',
    borderBottom: '1px solid #eee',
};

const productImage = {
    borderRadius: '8px',
    objectFit: 'cover' as const,
};

const productName = {
    fontSize: '16px',
    fontWeight: '500',
    color: '#222',
    margin: '0 0 4px',
};

const productDetails = {
    fontSize: '14px',
    color: '#777',
    margin: '0',
};

const productPrice = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#222',
    margin: '0',
};

const divider = {
    borderColor: '#eee',
    margin: '20px 0',
};

const summary = {
    margin: '16px 0',
};

const summaryLabel = {
    fontSize: '14px',
    color: '#555',
    margin: '4px 0',
};

const summaryValue = {
    fontSize: '14px',
    color: '#222',
    margin: '4px 0',
};

const summaryValueDiscount = {
    fontSize: '14px',
    color: '#27ae60',
    margin: '4px 0',
};

const totalLabel = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#222',
    margin: '8px 0',
};

const totalValue = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#C73C2E',
    margin: '8px 0',
};

const addressBox = {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '16px',
    margin: '12px 0',
};

const addressText = {
    fontSize: '14px',
    lineHeight: '22px',
    color: '#555',
    margin: '0',
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
