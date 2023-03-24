import React from "react";
import Layout from "./Layout.mjs";

export default function PaymentSuccess() {
  return (
    <Layout>
      <div className='payment-success-content'>
        <div className='container'>
          <div className='payment-success'>
            <div className='payment-success-card'>
              <div className='card-check'>
                {/* <i class='checkmark'>✓</i> */}
                <svg viewBox='0 0 26 26' xmlns='http://www.w3.org/2000/svg'>
                  <g
                    stroke='currentColor'
                    stroke-width='2'
                    fill='none'
                    fill-rule='evenodd'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  >
                    <path
                      className='circle'
                      d='M13 1C6.372583 1 1 6.372583 1 13s5.372583 12 12 12 12-5.372583 12-12S19.627417 1 13 1z'
                    />
                    <path
                      className='tick'
                      d='M6.5 13.5L10 17 l8.808621-8.308621'
                    />
                  </g>
                </svg>
              </div>
              <h1>Success</h1>
              <p>
                We received your purchase request;
                <br /> we'll be in touch shortly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
