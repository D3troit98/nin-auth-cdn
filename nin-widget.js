// 1. Widget SDK Script (to be hosted on your CDN)
// File: nin-widget.js

(function() {
    // Configuration
    window.NINAuth = window.NINAuth || {};

    // Main initialization function
    window.NINAuth.initialize = function(apiKey, options = {}) {
      // Store configuration
      const config = {
        apiKey,
        onSuccess: options.onSuccess || function() {},
        onError: options.onError || function() {},
        onClose: options.onClose || function() {},
        ...options
      };

      // Create and inject CSS
      const style = document.createElement('style');
      style.textContent = `
        .nin-auth-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .nin-auth-modal {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 550px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .nin-auth-header {
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nin-auth-logo {
          display: flex;
          align-items: center;
        }

        .nin-auth-logo img {
          height: 40px;
        }

        .nin-auth-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .nin-auth-content {
          padding: 20px 30px;
        }

        .nin-auth-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 10px;
          color: #333;
        }

        .nin-auth-description {
          color: #666;
          margin-bottom: 25px;
        }

        .nin-auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .nin-auth-input {
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          width: 100%;
        }

        .nin-auth-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .nin-auth-checkbox input {
          margin-top: 4px;
        }

        .nin-auth-checkbox-label {
          color: #555;
          font-size: 14px;
        }

        .nin-auth-submit {
          background-color: #00a884;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .nin-auth-submit:hover {
          background-color: #008f6d;
        }

        .nin-auth-footer {
          text-align: center;
          padding: 15px;
          border-top: 1px solid #f0f0f0;
          color: #777;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .nin-auth-footer svg {
          width: 16px;
          height: 16px;
        }

        .nin-auth-steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px 10px;
          background-color: #f9f9f9;
        }

        .nin-auth-step {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nin-auth-step-icon {
          width: 24px;
          height: 24px;
          background-color: #f0f0f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00a884;
        }

        .nin-auth-step.active .nin-auth-step-icon {
          background-color: #e1f7f1;
        }

        .nin-auth-step-text {
          font-size: 14px;
          color: #666;
        }

        .nin-auth-step.active .nin-auth-step-text {
          font-weight: 600;
          color: #333;
        }
      `;
      document.head.appendChild(style);

      // Method to open the verification modal
      window.NINAuth.verify = function() {
        // Create modal container
        const overlay = document.createElement('div');
        overlay.className = 'nin-auth-overlay';

        // Create modal content
        overlay.innerHTML = `
          <div class="nin-auth-modal">
            <div class="nin-auth-header">
              <div class="nin-auth-logo">
               <svg width="118" height="32" viewBox="0 0 118 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_9395_27509)">
<path d="M27.8848 21.9748V3.80762H31.016L39.1877 17.1735V3.80762H42.0388V21.9748H38.9076L30.7106 8.63495V21.9748H27.8848Z" fill="#059661"/>
<path d="M44.6797 21.9748V3.80762H47.6581V21.9748H44.6797Z" fill="#059661"/>
<path d="M50.3008 21.9748V3.80762H53.432L61.6036 17.1735V3.80762H64.4548V21.9748H61.3236L53.1265 8.63495V21.9748H50.3008Z" fill="#059661"/>
<path d="M79.1135 21.9748L77.5351 17.6925H70.2036L68.6252 21.9748H65.5449L72.4692 3.80762H75.244L82.1938 21.9748H79.1135ZM71.171 15.0713H76.5678L73.8694 7.80435L71.171 15.0713Z" fill="#0A1E29"/>
<path d="M94.4834 8.89453V21.9749H91.7086V19.7949C91.2673 20.5216 90.6818 21.1012 89.9521 21.5337C89.2223 21.9663 88.4077 22.1825 87.5083 22.1825C86.1166 22.1825 84.9923 21.7544 84.1352 20.8979C83.2782 20.0415 82.8496 18.9125 82.8496 17.5111V8.8946H85.6244V16.8622C85.6244 17.6927 85.862 18.3632 86.3372 18.8735C86.8124 19.384 87.4573 19.6392 88.2719 19.6392C89.3411 19.6392 90.1812 19.198 90.7921 18.3156C91.4031 17.4331 91.7086 16.2047 91.7086 14.6303V8.8946H94.4834V8.89453Z" fill="#0A1E29"/>
<path d="M104.178 21.8705C103.567 22.0781 102.889 22.1819 102.142 22.1819C100.869 22.1819 99.8464 21.8186 99.0743 21.0919C98.3021 20.3652 97.916 19.2838 97.916 17.8478V11.3075H95.6758V8.89388H97.916V5.00098H100.691V8.89388H104V11.3075H100.691V17.692C100.691 18.3322 100.848 18.8209 101.162 19.1583C101.476 19.4958 101.904 19.6644 102.447 19.6644C103.058 19.6644 103.576 19.5606 104 19.353L104.178 21.8704L104.178 21.8705Z" fill="#0A1E29"/>
<path d="M106.107 21.9744V3.59961H108.882V11.152C109.782 9.50836 111.182 8.68642 113.083 8.68642C114.542 8.68642 115.709 9.11468 116.583 9.97111C117.457 10.8276 117.894 11.9652 117.894 13.3839V21.9744H115.119V14.0328C115.119 13.1677 114.869 12.4843 114.368 11.9825C113.868 11.4808 113.184 11.2299 112.319 11.2299C111.25 11.2299 110.41 11.6798 109.799 12.5795C109.188 13.4792 108.882 14.725 108.882 16.3168V21.9745H106.107V21.9744Z" fill="#0A1E29"/>
<path d="M98.5299 30.9971C98.3227 30.9971 98.1325 30.953 97.9593 30.8647C97.786 30.7764 97.6674 30.665 97.6033 30.5306V30.9511H97.123V26.873H97.6033V28.4628C97.6937 28.3246 97.8245 28.2132 97.996 28.1287C98.1674 28.0442 98.3472 28.002 98.5355 28.002C98.9649 28.002 99.3001 28.1412 99.5412 28.4196C99.7822 28.6979 99.9027 29.058 99.9027 29.4996C99.9027 29.9412 99.7813 30.3012 99.5383 30.5796C99.2954 30.858 98.9592 30.9972 98.5298 30.9972L98.5299 30.9971ZM97.8152 30.2686C97.9828 30.4624 98.206 30.5594 98.4847 30.5594C98.7634 30.5594 98.9876 30.4624 99.157 30.2686C99.3265 30.0746 99.4112 29.8183 99.4112 29.4996C99.4112 29.1808 99.3264 28.9245 99.157 28.7306C98.9875 28.5366 98.7634 28.4397 98.4847 28.4397C98.206 28.4397 97.9828 28.5366 97.8152 28.7306C97.6476 28.9245 97.5638 29.1808 97.5638 29.4996C97.5638 29.8183 97.6476 30.0746 97.8152 30.2686Z" fill="#0A1E29"/>
<path d="M102.299 28.0488H102.791L101.299 32.0002H100.808L101.22 30.9115L100.107 28.0488H100.627L101.463 30.2722L102.299 28.0488Z" fill="#0A1E29"/>
<path d="M104.639 30.9519V26.9199H105.209L107.204 30.1282V26.9199H107.707V30.9519H107.136L105.142 27.7551V30.9519H104.639Z" fill="#0A1E29"/>
<path d="M108.531 30.9519V26.9199H109.045V30.9519H108.531Z" fill="#0A1E29"/>
<path d="M109.863 30.9519V26.9199H110.485L111.818 30.1916L113.151 26.9199H113.773V30.9519H113.264V27.9106L112.033 30.9519H111.603L110.366 27.9106V30.9519H109.863Z" fill="#0A1E29"/>
<path d="M116.333 30.9971C115.798 30.9971 115.344 30.8176 114.971 30.4586C114.599 30.0996 114.412 29.5917 114.412 28.9351C114.412 28.2785 114.599 27.7706 114.974 27.4116C115.349 27.0526 115.802 26.873 116.333 26.873C116.762 26.873 117.127 26.9873 117.426 27.2158C117.726 27.4443 117.917 27.7543 118 28.146L117.491 28.2612C117.427 27.9695 117.295 27.7429 117.093 27.5816C116.891 27.4203 116.636 27.3397 116.327 27.3397C115.913 27.3397 115.579 27.4799 115.325 27.7602C115.07 28.0405 114.943 28.4322 114.943 28.9352C114.943 29.4382 115.07 29.8289 115.325 30.1073C115.579 30.3857 115.913 30.5249 116.327 30.5249C116.633 30.5249 116.884 30.4481 117.082 30.2945C117.279 30.141 117.414 29.924 117.486 29.6437L118 29.7532C117.898 30.1372 117.7 30.4405 117.407 30.6632C117.113 30.886 116.755 30.9973 116.333 30.9973V30.9971Z" fill="#0A1E29"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.9101 0C18.4879 0 23.8202 5.43628 23.8202 12.1423C23.8202 18.8484 18.4879 24.2846 11.9101 24.2846C5.33225 24.2846 0 18.8484 0 12.1423C0 5.43628 5.33225 0 11.9101 0ZM14.1398 18.9174H9.69391C8.67531 18.9445 7.844 17.893 8.08539 16.884L9.40758 12.3379C8.31215 11.3947 7.81251 9.90708 8.12648 8.43664C8.4411 6.96413 9.62531 5.76602 11.073 5.45552C12.2437 5.2037 13.4385 5.49329 14.3507 6.24769C15.263 7.00256 15.7863 8.12181 15.7863 9.31825C15.7863 10.4893 15.2796 11.5895 14.4128 12.337L15.738 16.8417C15.9955 17.8964 15.1808 18.9327 14.1402 18.9174H14.1398H14.1398Z" fill="#059661"/>
<path d="M11.7482 30.2121C7.97114 30.2121 4.1941 28.7476 1.31716 25.8187C0.765396 25.2651 0.730184 24.3612 1.25026 23.7647C1.78727 23.1486 2.7116 23.0931 3.31576 23.6404L3.31661 23.6412C3.33797 23.6606 3.35888 23.6806 3.37913 23.7012C7.98963 28.4014 15.4884 28.4063 20.1043 23.7145C20.37 23.4365 20.7412 23.2639 21.1519 23.2639C21.96 23.2639 22.6153 23.9315 22.6153 24.7553C22.6153 25.151 22.4611 25.5312 22.1866 25.8109C19.3087 28.745 15.5285 30.212 11.7482 30.212H11.7482L11.7482 30.2121Z" fill="#059661" fill-opacity="0.980392"/>
<path d="M21.1523 23.2647C20.7416 23.2647 20.3703 23.4373 20.1046 23.7152C17.7987 26.0591 14.7735 27.2307 11.748 27.2305V30.2129L11.7486 30.2128C15.5288 30.2128 19.309 28.7459 22.187 25.8118C22.4614 25.532 22.6156 25.1518 22.6156 24.7562C22.6155 23.9321 21.9605 23.2646 21.1523 23.2646V23.2647Z" fill="#12BA74" fill-opacity="0.980392"/>
</g>
<defs>
<clipPath id="clip0_9395_27509">
<rect width="118" height="32" fill="white"/>
</clipPath>
</defs>
</svg>

              </div>
              <button class="nin-auth-close">&times;</button>
            </div>

            <div class="nin-auth-steps">
              <div class="nin-auth-step active">
                <div class="nin-auth-step-icon">✓</div>
                <div class="nin-auth-step-text">NIN Submission</div>
              </div>
              <div class="nin-auth-step">
                <div class="nin-auth-step-icon"></div>
                <div class="nin-auth-step-text">Facial Verification</div>
              </div>
              <div class="nin-auth-step">
                <div class="nin-auth-step-icon"></div>
                <div class="nin-auth-step-text">Data Consent</div>
              </div>
            </div>

            <div class="nin-auth-content">
              <h2 class="nin-auth-title">NIN Submission</h2>
              <p class="nin-auth-description">Your National Identity Number will be verified securely</p>

              <form class="nin-auth-form" id="nin-auth-form">
                <input type="text" class="nin-auth-input" placeholder="Enter 11-digit NIN" maxlength="11" pattern="[0-9]{11}" required>

                <div class="nin-auth-checkbox">
                  <input type="checkbox" id="nin-consent" required>
                  <label class="nin-auth-checkbox-label" for="nin-consent">
                    I consent to the processing of the NIN data for identity verification purposes, in accordance with the Nigeria Data Protection Act (NDPA).
                  </label>
                </div>

                <button type="submit" class="nin-auth-submit">Submit</button>
              </form>
            </div>

            <div class="nin-auth-footer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              YOUR DATA IS ENCRYPTED AND SECURED BY NINAUTH
            </div>
          </div>
        `;

        // Add to DOM
        document.body.appendChild(overlay);

        // Handle close button
        const closeButton = overlay.querySelector('.nin-auth-close');
        closeButton.addEventListener('click', function() {
          document.body.removeChild(overlay);
          config.onClose();
        });

        // Handle form submission
        const form = overlay.querySelector('#nin-auth-form');
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          const ninInput = form.querySelector('input[type="text"]');
          const ninValue = ninInput.value;

          // Send verification request to your backend
          fetch('https://api.yourdomain.com/verify-nin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({ nin: ninValue })
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              config.onSuccess(data);
              document.body.removeChild(overlay);
            } else {
              config.onError(data.error);
            }
          })
          .catch(error => {
            config.onError(error.message);
          });
        });
      };
    };
  })();
