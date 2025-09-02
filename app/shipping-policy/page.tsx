export default function ShippingPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6 text-[#e1a93c]">Shipping Policy</h1>
      <p className="text-black mb-4">Our Shipping Policy outlines the terms and conditions regarding the delivery of products purchased from our website.</p>
      <ul className="list-disc pl-6 text-black space-y-2">
        <li>Orders are processed within 2-3 business days after payment confirmation.</li>
        <li>Shipping times may vary based on your location.</li>
        <li>We will provide tracking information once your order has shipped.</li>
        <li>Contact info@72sports.com for any shipping-related queries.</li>
      </ul>
    </div>
  );
}
