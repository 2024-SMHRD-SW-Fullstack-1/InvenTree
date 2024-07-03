import React, { useState, useEffect } from 'react';

/**
 * CAPTCHA 컴포넌트
 * @param {Object} props - 컴포넌트의 props
 * @param {Function} props.onCaptchaChange - CAPTCHA 키가 변경될 때 호출되는 콜백 함수
 */
const CaptchaComponent = ({ onCaptchaChange }) => {
  // 상태 변수 선언
  const [captchaKey, setCaptchaKey] = useState('');
  const [captchaUrl, setCaptchaUrl] = useState('');

  /**
   * CAPTCHA 키를 가져오는 비동기 함수
   */
  useEffect(() => {
    const fetchCaptchaKey = async () => {
      try {
        // CAPTCHA 키를 서버에서 가져오기
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

  // CAPTCHA 이미지를 렌더링
  return <div>{captchaUrl && <img src={captchaUrl} alt="CAPTCHA" />}</div>;
};

export default CaptchaComponent;
