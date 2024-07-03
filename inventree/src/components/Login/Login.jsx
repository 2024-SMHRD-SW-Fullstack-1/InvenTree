/**
 * @fileoverview 로그인 컴포넌트
 * 사용자 인증 및 로그인 기능을 제공합니다.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import style from './Login.module.css';

/**
 * Login 컴포넌트
 * @param {function} onLoginSuccess - 로그인 성공 시 호출될 콜백 함수
 */
const Login = ({ onLoginSuccess }) => {
  // 상태 변수들
  const [mbId, setMbId] = useState('');
  const [mbPw, setMbPw] = useState('');
  const [corpIdx, setCorpIdx] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  const navigate = useNavigate();
  const { setDarkMode } = useDarkMode();

  /**
   * 세션 체크 함수
   * 사용자의 로그인 상태를 확인합니다.
   */
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

  // 컴포넌트 마운트 시 세션 체크
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  /**
   * 로그인 처리 함수
   * 사용자 입력을 검증하고 서버에 로그인 요청을 보냅니다.
   */
  const handleLogin = async () => {
    if (!captchaToken) {
      alert('로봇이 아닙니다에 체크해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8090/tree/api/login',
        {
          mbId,
          mbPw,
          corpIdx,
          captchaToken,
        },
        {
          withCredentials: true,
        },
      );

      const result = response.data;

      if (result.status === 'success') {
        localStorage.setItem('corpIdx', corpIdx);

        // 테마 설정
        const userTheme = result.theme;
        if (userTheme === 'dark') {
          localStorage.setItem('darkMode', 'true');
          setDarkMode(true);
        } else {
          localStorage.setItem('darkMode', 'false');
          setDarkMode(false);
        }

        onLoginSuccess();
        navigate('/main');
      } else {
        // 로그인 실패 처리
        let errorMsg = '로그인 실패: ';
        switch (result.error) {
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
      setErrorMessage('로그인 중 에러 발생: ' + (error.response?.data || error.message));
      setLoginFailed(true);
    }
  };

  // 로그인 폼 렌더링
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
            {/* 아이디 입력 필드 */}
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
            {/* 비밀번호 입력 필드 */}
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
            {/* 회사코드 입력 필드 */}
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
            {/* CAPTCHA */}
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
        {/* 로그인 버튼 */}
        <button type="button" className={style.loginButton} onClick={handleLogin}>
          로그인
        </button>
        {/* 로그인 실패 알림 */}
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
