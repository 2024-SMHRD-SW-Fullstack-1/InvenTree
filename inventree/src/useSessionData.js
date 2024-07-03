import { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * 사용자의 세션 데이터를 가져오는 커스텀 훅.
 * @returns {Object|null} - 세션 데이터를 반환하거나, 데이터를 가져오는 중일 때는 null을 반환.
 */
const useSessionData = () => {
  const [sessionData, setSessionData] = useState(null); // 세션 데이터를 저장할 상태를 초기화.

  useEffect(() => {
    // 세션 데이터를 가져오기 위한 비동기 요청.
    axios
      .get('http://localhost:8090/tree/api/session/data', { withCredentials: true })
      .then((response) => {
        // 성공적으로 데이터를 가져왔을 때, 상태를 업데이트.
        setSessionData(response.data);
      })
      .catch((error) => {
        // 데이터를 가져오는 중 오류가 발생했을 때 콘솔에 오류 메시지 출력.
        console.error('There was an error fetching the session data!', error);
      });
  }, []); // 의존성 배열이 비어 있으므로, 이 훅은 컴포넌트가 처음 렌더링될 때 한 번만 실행.

  return sessionData; // 현재 세션 데이터를 반환.
};

export default useSessionData;
