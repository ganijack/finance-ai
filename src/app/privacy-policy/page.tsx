export default function PrivacyPolicyPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px", fontFamily: "system-ui, sans-serif", lineHeight: 1.8, color: "#333" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>Last updated: August 14, 2026</p>

      <h2>1. Introduction</h2>
      <p>
        FinanceAI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates a financial management platform with integrated WhatsApp commerce features. 
        This Privacy Policy explains how we collect, use, and protect your personal information.
      </p>

      <h2>2. Information We Collect</h2>
      <ul>
        <li><strong>Account Information:</strong> Name, email address, and profile details when you register.</li>
        <li><strong>Financial Data:</strong> Expense records, receipts, and transaction data you input into our platform.</li>
        <li><strong>WhatsApp Data:</strong> Phone number and message content when you interact with our WhatsApp bot for ordering products.</li>
        <li><strong>Payment Data:</strong> Transaction details processed through our payment partner (Midtrans). We do not store your credit card or bank details.</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <ul>
        <li>To provide and maintain our financial management services.</li>
        <li>To process orders and payments through WhatsApp commerce.</li>
        <li>To send order confirmations and payment links via WhatsApp.</li>
        <li>To improve our services and user experience.</li>
      </ul>

      <h2>4. Data Sharing</h2>
      <p>
        We do not sell your personal data. We share information only with:
      </p>
      <ul>
        <li><strong>Meta (WhatsApp):</strong> For message delivery through the WhatsApp Business API.</li>
        <li><strong>Midtrans:</strong> For secure payment processing.</li>
      </ul>

      <h2>5. Data Security</h2>
      <p>
        We implement industry-standard security measures to protect your data, including encryption in transit and at rest.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You have the right to access, correct, or delete your personal data at any time by contacting us.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at: <strong>admin@financeai.com</strong>
      </p>
    </div>
  );
}
