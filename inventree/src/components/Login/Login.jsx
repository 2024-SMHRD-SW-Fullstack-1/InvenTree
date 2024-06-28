import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import style from './Login.module.css';

const Login = ({ onLoginSuccess }) => {
  const [mbId, setMbId] = useState('');
  const [mbPw, setMbPw] = useState('');
  const [corpIdx, setCorpIdx] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const navigate = useNavigate();

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8090/tree/api/checkSession', {
        method: 'GET',
        credentials: 'include',
      });

      const result = await response.text();

      if (result === 'loggedIn') {
        console.log('User is logged in');
        onLoginSuccess();
        navigate('/main');
      } else {
        console.log('User is logged out');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  }, [navigate, onLoginSuccess]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleLogin = async () => {
    if (!captchaToken) {
      alert('로봇이 아닙니다에 체크해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8090/tree/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mbId,
          mbPw,
          corpIdx,
          captchaToken,
        }),
        credentials: 'include',
      });

      const result = await response.text();

      if (result.trim() === 'success') {
        localStorage.setItem('corpIdx', corpIdx);
        onLoginSuccess();
        navigate('/main');
      } else {
        let errorMsg = '로그인 실패: ';
        switch (result.trim()) {
          case 'invalid_email':
            errorMsg += '유효하지 않은 이메일 형식입니다.';
            break;
          case 'invalid_password':
            errorMsg += '유효하지 않은 비밀번호 형식입니다.';
            break;
          case 'invalid_corp_code':
            errorMsg += '유효하지 않은 회사코드 형식입니다.';
            break;
          case 'invalid_captcha':
            errorMsg += '유효하지 않은 CAPTCHA 입력입니다.';
            break;
          default:
            errorMsg += '입력하신 내용을 다시 확인해주세요.';
        }
        setErrorMessage(errorMsg);
        setLoginFailed(true);
        setFailedAttempts(failedAttempts + 1);
      }
    } catch (error) {
      console.error('로그인 중 에러 발생:', error);
      setErrorMessage('로그인 중 에러 발생: ' + error.message);
      setLoginFailed(true);
    }
  };

  return (
    <div className={`${style.loginPage} ${style.flexColumn}`}>
      <div className={`${style.loginHeader} ${style.flexCenter} ${style.textCenter}`}>
        <h1>InvenTree</h1>
      </div>
      <div
        className={`${style.loginContainer} ${style.boxShadow} ${style.borderRadius} ${style.borderLight} ${style.flexColumn}`}
      >
        <table className={style.loginTable}>
          <tbody>
            <tr>
              <td>아이디*</td>
            </tr>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="아이디를 입력하세요."
                  className={style.customInput}
                  value={mbId}
                  onChange={(e) => setMbId(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>비밀번호*</td>
            </tr>
            <tr>
              <td>
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요."
                  className={style.customInput}
                  value={mbPw}
                  onChange={(e) => setMbPw(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>회사코드*</td>
            </tr>
            <tr>
              <td>
                <input
                  type="text"
                  placeholder="회사코드를 입력하세요."
                  className={style.customInput}
                  value={corpIdx}
                  onChange={(e) => setCorpIdx(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>CAPTCHA*</td>
            </tr>
            <tr>
              <td>
                <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || ''} onChange={setCaptchaToken} />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="button" className={style.loginButton} onClick={handleLogin}>
          로그인
        </button>
        {loginFailed && (
          <div className={`${style.loginFailedAlert} ${style.boxShadow} ${style.borderRadius} ${style.borderLight}`}>
            <div className={`${style.loginFailedContent} ${style.flexColumn} ${style.textCenter}`}>
              <h2>로그인 실패</h2>
              <p>{errorMessage}</p>
              <button
                type="button"
                onClick={() => setLoginFailed(false)}
                className={`${style.boxShadow} ${style.borderRadius}`}
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
