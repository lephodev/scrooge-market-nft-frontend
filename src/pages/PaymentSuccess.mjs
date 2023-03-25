import React, { useState,useEffect } from "react";
import Layout from "./Layout.mjs";
import { useSearchParams } from "react-router-dom";


export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status,setStatus]=useState('')

  useEffect(() => {
      const params = searchParams.get("status");
      if (params) {
        setStatus(params);
      }
    
  }, [searchParams]);

  console.log("status",status);

  return (
    <Layout>
      <div className='payment-success-content'>
        <div className='container'>
          <div className='payment-success'>
            <div className='payment-success-card'>
              <div className='card-check'>
                {/* <svg viewBox='0 0 26 26' xmlns='http://www.w3.org/2000/svg'>
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
                </svg> */}

              {status==="success" ?
                <div class='check-container'>
                  <div className='check-background'>
                    <svg
                      viewBox='0 0 65 51'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M7 25L27.3077 44L58.5 7'
                        stroke='white'
                        stroke-width='11'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </div>
                  <div class='check-shadow'></div>
                </div>
                :""}
              </div>
              {status==="success" ?
              <>
              <h1>Success</h1>
              <p>
                We received your purchase request;
                <br /> we'll be in touch shortly!
              </p>
              </>
               :<>
               <h1>Faild</h1>
              <p>
               Payment purchase request faild
                <br /> we'll be in touch shortly!
              </p>
               </>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
