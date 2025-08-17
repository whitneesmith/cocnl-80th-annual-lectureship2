import { useEffect, useRef, useState } from 'react';

interface SquarePaymentProps {
  amount: number;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: any) => void;
}

declare global {
  interface Window {
    Square: any;
  }
}

function SquarePayment({ amount, customerInfo, onPaymentSuccess, onPaymentError }: SquarePaymentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentForm, setPaymentForm] = useState<any>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeSquare = async () => {
      try {
        // Initialize Square payments
        const payments = window.Square.payments(
          'YOUR_SQUARE_APPLICATION_ID', // Replace with your Square Application ID
          'YOUR_SQUARE_LOCATION_ID'     // Replace with your Square Location ID
        );

        const card = await payments.card();
        await card.attach(cardContainerRef.current);

        setPaymentForm({ payments, card });
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize Square:', error);
        onPaymentError(error);
        setIsLoading(false);
      }
    };

    // Load Square SDK if not already loaded
    if (!window.Square) {
      const script = document.createElement('script');
      script.src = 'https://sandbox-web.squarecdn.com/v1/square.js'; // Use https://web.squarecdn.com/v1/square.js for production
      script.onload = initializeSquare;
      script.onerror = () => {
        console.error('Failed to load Square SDK');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else {
      initializeSquare();
    }
  }, [onPaymentError]);

  const handlePayment = async () => {
    if (!paymentForm) return;

    try {
      setIsLoading(true);

      // Tokenize the payment method
      const result = await paymentForm.card.tokenize();
      
      if (result.status === 'OK') {
        // Send the token to your server to process the payment
        const paymentResponse = await fetch('/api/process-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceId: result.token,
            amount: amount * 100, // Square expects amount in cents
            currency: 'USD',
            customerInfo: customerInfo,
            idempotencyKey: `registration-${Date.now()}-${Math.random()}`,
          }),
        });

        const paymentResult = await paymentResponse.json();
        
        if (paymentResult.success) {
          onPaymentSuccess(paymentResult);
        } else {
          onPaymentError(paymentResult.error);
        }
      } else {
        onPaymentError(result.errors);
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-green-300">
      <div className="mb-4">
        <h4 className="font-semibold text-green-900 mb-2">Secure Credit Card Payment</h4>
        <p className="text-sm text-green-800">
          <strong>Amount:</strong> ${amount.toFixed(2)}
        </p>
      </div>

      {/* Square Card Container */}
      <div className="mb-4">
        <div 
          ref={cardContainerRef}
          id="card-container"
          className="min-h-[60px] border border-gray-300 rounded-lg p-3"
        >
          {isLoading && (
            <div className="flex items-center justify-center h-16">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">Loading payment form...</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isLoading || !paymentForm}
        className={`w-full font-bold py-3 px-6 rounded-lg transition-colors duration-200 ${
          isLoading || !paymentForm
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </span>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </button>

      <div className="mt-3 text-xs text-green-600">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p>💳 We accept Visa, Mastercard, American Express, and Discover</p>
      </div>
    </div>
  );
}

export default SquarePayment;