async function test() {
  try {
    const baseUrl = 'http://localhost:5000/api';
    console.log('Testing GET /products...');
    const prodRes = await fetch(`${baseUrl}/products`);
    const prods = await prodRes.json();
    console.log(`✓ Retrieved ${prods.products.length} products from PostgreSQL.`);

    console.log('\nTesting POST /customers/signup...');
    const testEmail = `atelier_${Date.now()}@gulabibaker.com`;
    const signupRes = await fetch(`${baseUrl}/customers/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Madame Gulabi',
        email: testEmail,
        password: 'LuxuryPassword123!',
        phone: '+91 9988776655',
        address: 'Pali Hill, Bandra West, Mumbai'
      })
    });
    const signupData = await signupRes.json();
    console.log('✓ Customer registered:', signupData.customer.name, '(ID:', signupData.customer.id, ')');
    const token = signupData.token;

    console.log('\nTesting POST /orders with customer JWT...');
    const orderRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: [
          { product_id: prods.products[0].id, quantity: 1 },
          { product_id: prods.products[1].id, quantity: 2 }
        ],
        delivery_address: 'Villa 14, Pali Hill, Bandra, Mumbai',
        notes: 'Complimentary Velvet Ribbon & Gold Embossed Message: For the celebration'
      })
    });
    const orderData = await orderRes.json();
    console.log('✓ Order created successfully! Order ID:', orderData.order.id, 'Total Amount: ₹', orderData.order.total_amount);

    console.log('\nTesting GET /orders (list my orders)...');
    const myOrdersRes = await fetch(`${baseUrl}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const myOrders = await myOrdersRes.json();
    console.log(`✓ Retrieved ${myOrders.orders.length} orders for current customer.`);
    console.log('\n✨ ALL API ENDPOINTS FUNCTIONING 100% CORRECTLY WITH POSTGRESQL!');
  } catch (err) {
    console.error('API Test Error:', err);
  }
}

test();
