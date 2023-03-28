import React, { useState, useEffect } from "react";
import Layout from "./Layout.mjs";
import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("");

  useEffect(() => {
    const params = searchParams.get("status");
    if (params) {
      setStatus(params);
    }
  }, [searchParams]);

  console.log("status", status);

  return (
    <Layout>
      <div className='payment-success-content'>
        <div className='container'>
          <div className='payment-success'>
            <div className='payment-success-card'>
              <div className='card-check'>
                {status === "success" ? (
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
                ) : (
                  <div class='check-container'>
                    <div className='cross-background'>
                      <svg
                        version='1.0'
                        xmlns='http://www.w3.org/2000/svg'
                        width='512.000000pt'
                        height='512.000000pt'
                        viewBox='0 0 512.000000 512.000000'
                        preserveAspectRatio='xMidYMid meet'
                        fill='#fff'
                        stroke-width='11'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      >
                        <g transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'>
                          <path
                            d='M580 5099 c-111 -18 -171 -59 -341 -228 -127 -127 -162 -168 -187
-221 -62 -129 -62 -270 0 -400 29 -59 102 -135 847 -882 l815 -818 -815 -818
c-745 -747 -818 -823 -847 -882 -62 -130 -62 -271 0 -400 25 -53 60 -94 187
-221 197 -197 240 -222 397 -227 112 -5 169 8 254 56 28 16 351 331 858 836
l812 810 818 -815 c956 -954 870 -884 1082 -884 122 0 127 1 195 34 59 29 95
59 226 190 127 127 162 168 187 221 62 129 62 270 0 400 -29 59 -102 135 -847
882 l-815 818 815 818 c745 747 818 823 847 882 62 130 62 271 0 400 -25 53
-60 94 -187 221 -127 127 -168 162 -221 187 -129 62 -270 62 -400 0 -59 -29
-135 -102 -882 -847 l-818 -815 -817 816 c-755 753 -823 818 -883 846 -36 17
-95 36 -130 41 -73 12 -74 12 -150 0z'
                          />
                        </g>
                      </svg>
                    </div>
                    <div class='cross-shadow'></div>
                  </div>
                )}
              </div>
              {status === "success" ? (
                <>
                  <h1>Success</h1>
                  <p>
                    We received your purchase request;
                    <br /> we'll be in touch shortly!
                  </p>
                </>
              ) : (
                <>
                  <h1>Failed</h1>
                  <p>
                    Payment purchase request faild
                    <br /> we'll be in touch shortly!
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
