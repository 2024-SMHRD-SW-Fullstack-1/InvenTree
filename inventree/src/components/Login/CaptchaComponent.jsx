import React, { useState, useEffect } from 'react';

const CaptchaComponent = ({ onCaptchaChange }) => {
  const [captchaKey, setCaptchaKey] = useState('');
  const [captchaUrl, setCaptchaUrl] = useState('');

  useEffect(() => {
    const fetchCaptchaKey = async () => {
      try {
        const response = await fetch('http://localhost:8090/tree/api/captcha/key', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCaptchaKey(data.key);
        setCaptchaUrl(`http://localhost:8090/tree/api/captcha/image/${data.key}`);
        onCaptchaChange(data.key); // CAPTCHA 키를 부모 컴포넌트로 전달
      } catch (error) {
        console.error('CAPTCHA 키 가져오기 실패:', error);
      }
    };

    fetchCaptchaKey();
  }, [onCaptchaChange]);

  return <div>{captchaUrl && <img src={captchaUrl} alt="CAPTCHA" />}</div>;
};

export default CaptchaComponent;
