import React, { useState } from "react";
import { useAcceptJs } from "react-acceptjs";

const authData = {
  apiLoginID: "92WEDagC2em3",
  clientKey: "9uNB7U4aR988xfYE8hE8U8b7VhPXFW7vQ9sEZQP8Ep6d8FSrc9Z5ET84d3v2Z3MY",
};

// type BasicCardInfo = {
//   cardNumber: string,
//   cardCode: string,
//   month: string,
//   year: string,
// };

const PaymentCustom = () => {
  const { dispatchData, loading, error } = useAcceptJs({ authData });
  const [cardData, setCardData] = useState({
    cardNumber: "",
    month: "",
    year: "",
    cardCode: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Dispatch CC data to Authorize.net and receive payment nonce for use on your server
    const response = await dispatchData({ cardData });
    console.log("Received response:", response);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        name='cardNumber'
        value={cardData.cardNumber}
        onChange={(event) =>
          setCardData({ ...cardData, cardNumber: event.target.value })
        }
      />
      <input
        type='text'
        name='month'
        value={cardData.month}
        onChange={(event) =>
          setCardData({ ...cardData, month: event.target.value })
        }
      />
      <input
        type='text'
        name='year'
        value={cardData.year}
        onChange={(event) =>
          setCardData({ ...cardData, year: event.target.value })
        }
      />
      <input
        type='text'
        name='cardCode'
        value={cardData.cardCode}
        onChange={(event) =>
          setCardData({ ...cardData, cardCode: event.target.value })
        }
      />
      <button type='submit' disabled={loading || error}>
        Pay
      </button>
    </form>
  );
};

export default PaymentCustom;
