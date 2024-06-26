import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Login.module.css";
import CaptchaComponent from "./Captcha"; // CaptchaComponent를 import합니다.

const Login = ({ onLoginSuccess }) => {
    const [mbId, setMbId] = useState("");
    const [mbPw, setMbPw] = useState("");
    const [corpIdx, setCorpIdx] = useState("");
    const [captchaInput, setCaptchaInput] = useState(""); // 사용자가 입력한 CAPTCHA 텍스트
    const [captchaKey, setCaptchaKey] = useState(""); // 서버에서 발급받은 CAPTCHA 키
    const [loginFailed, setLoginFailed] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [members, setMembers] = useState([]);
    const [failedAttempts, setFailedAttempts] = useState(0); // 비밀번호 입력 실패 횟수
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:8090/tree/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mbId: mbId,
                    mbPw: mbPw,
                    corpIdx: corpIdx,
                    captchaKey: captchaKey, // CAPTCHA 키를 함께 전송합니다.
                    captchaInput: captchaInput, // 사용자가 입력한 CAPTCHA 텍스트를 함께 전송합니다.
                }),
                credentials: "include",
            });

            const result = await response.text();

            if (result.trim() === "success") {
                localStorage.setItem("corpIdx", corpIdx);
                onLoginSuccess();
                navigate("/main");
            } else {
                let errorMsg = "로그인 실패: ";
                switch (result.trim()) {
                    case "invalid_email":
                        errorMsg += "유효하지 않은 이메일 형식입니다.";
                        break;
                    case "invalid_password":
                        errorMsg += "유효하지 않은 비밀번호 형식입니다.";
                        break;
                    case "invalid_corp_code":
                        errorMsg += "유효하지 않은 회사코드 형식입니다.";
                        break;
                    case "invalid_captcha":
                        errorMsg += "유효하지 않은 CAPTCHA 입력입니다.";
                        break;
                    default:
                        errorMsg += "입력하신 내용을 다시 확인해주세요.";
                }
                setErrorMessage(errorMsg);
                setLoginFailed(true);
                fetchMembers();
                setFailedAttempts(failedAttempts + 1); // 실패 횟수 증가
            }
        } catch (error) {
            console.error("로그인 중 에러 발생:", error);
            setErrorMessage("로그인 중 에러 발생: " + error.message);
            setLoginFailed(true);
            fetchMembers();
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await fetch("http://localhost:8090/tree/api/members", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setMembers(data);
        } catch (error) {
            console.error("회원 정보 가져오기 중 에러 발생:", error);
            console.log(members);
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
                        {failedAttempts >= 3 && (
                            <>
                                <tr>
                                    <td>CAPTCHA*</td>
                                </tr>
                                <tr>
                                    <td>
                                        <CaptchaComponent onCaptchaChange={setCaptchaKey} />
                                        <input
                                            type="text"
                                            placeholder="CAPTCHA를 입력하세요."
                                            className={style.customInput}
                                            value={captchaInput}
                                            onChange={(e) => setCaptchaInput(e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
                <button type="button" className={style.loginButton} onClick={handleLogin}>
                    로그인
                </button>
                {loginFailed && (
                    <div
                        className={`${style.loginFailedAlert} ${style.boxShadow} ${style.borderRadius} ${style.borderLight}`}
                    >
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
