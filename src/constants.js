export const C = {
  bg: "#000000",
  bgAlt: "#0A0A0A",
  bgCard: "#1A1A1A",
  bgCard2: "#141414",
  cyan: "#5BBCD5",
  cyanDark: "#4AA3BA",
  cyanBg: "rgba(91,188,213,0.1)",
  text: "#FFFFFF",
  textMuted: "#999999",
  textDim: "#666666",
  border: "#2A2A2A",
  borderLight: "#333333",
  danger: "#E74C3C",
  success: "#2ECC71",
  pending: "#F39C12",
};

export const serif = "'Playfair Display', Georgia, serif";
export const sans = "'Inter', -apple-system, sans-serif";

// EmailJS Configuration (replace with real keys in production)
export const EMAILJS_CONFIG = {
  serviceId: "service_gaucho",
  templateId: "template_concierge",
  publicKey: "YOUR_PUBLIC_KEY", // Replace with real EmailJS public key
  managerEmails: {
    "Algodon Mansion": "manager@mansion.com",
    "Algodon Wine Estates": "manager@awe.com",
    "Casa Gaucho": "manager@mansion.com",
  },
};

// Stripe Configuration (replace with real keys in production)
export const STRIPE_CONFIG = {
  publishableKey: "pk_test_YOUR_STRIPE_KEY", // Replace with real Stripe publishable key
  // Payment amounts in cents
  prices: {
    transfer: 10000, // $100
    makeWine: 2000, // $20 per person
    asado: 5000, // $50 per person
    tennisClass: 3000, // $30 per class
    mateando: 2000, // $20 per person
    picnic: 2000, // $20 per person
    personalChef: 10000, // $100 + food
    fillFridge: 5000, // $50
    lotReserve: 100000, // $1,000
  },
};

// Stripe payment handler (placeholder - connect real Stripe when account is ready)
export const handleStripePayment = async (amount, description, onSuccess) => {
  // In production, create a Stripe Checkout Session via your backend:
  // const response = await fetch('/api/create-checkout-session', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ amount, description }),
  // });
  // const { url } = await response.json();
  // window.location.href = url;

  // For demo, simulate payment
  const confirmed = window.confirm(`Payment Required: $${(amount / 100).toFixed(2)}\n\n${description}\n\nIn production, this will redirect to Stripe Checkout.\n\nSimulate successful payment?`);
  if (confirmed && onSuccess) onSuccess();
  return confirmed;
};

export const sendManagerEmail = async (request, eventType = "new_request") => {
  const managerEmail = EMAILJS_CONFIG.managerEmails[request.property] || "manager@mansion.com";
  const templateParams = {
    to_email: managerEmail,
    guest_name: request.guestName,
    reservation_number: request.reservationNumber,
    request_type: request.type,
    request_details: request.details,
    property: request.property,
    event_type: eventType === "answer_requested" ? "Guest Requests Answer" : "New Concierge Request",
    submitted_date: request.date,
  };

  // In production, use EmailJS:
  // await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams, EMAILJS_CONFIG.publicKey);
  console.log(`[EMAIL] ${templateParams.event_type} → ${managerEmail}`, templateParams);

  // For demo, show a subtle toast
  return templateParams;
};
