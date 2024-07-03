# InvenTree

주의 사항!<br/>
1. 같은 파일 동시에 수정 금지<br/>
2. pull, push 작업을 할 때 꼭 commit을 통해서 Local repository 최신화 시켜주기<br/>
3. 개발을 한 후 commit >push 할 때 꼭 팀원들에게 알려주기<br/>
4. 작업시 서로 프로젝트명 동일해야 함
5. React 프로젝트 명 inventree로 푸쉬 할 예정
<h1>6.실행 시, 주의사항</h1>
<p>InvenTreeSpring\src\main\java\com\inven\tree\config의 recaptchaFilePath 경로 확인</p>
<p>\InvenTreeSpring\src\main\webapp\WEB-INF\spring의 Google reCAPTCHA 설정 경로 확인</p>
<h2>서비스 소개</h2>
<p>쉽고 간편한 재고 관리 시스템</p>

<h2>프로젝트 기간</h2>
<p>5월 27일 ~ 7월 1일</p>

<h2>주요 기능</h2>
<ul>
  <li>창고배치도로 제품 위치 관리</li>
  <li>재고 변동 알림 기능</li>
  <li>입출고 그래프 기능</li>
  <li>입/출고 관리 기능</li>
  <li>엑셀 삽입/추출 기능</li>
</ul>

<h2>기술 스택</h2>
<ul>
  <li>프론트엔드: HTML, CSS, JavaScript, React</li>
  <li>백엔드: JAVA, Spring</li>
  <li>데이터베이스: MySQL</li>
  <li>기타: Git</li>
</ul>

<h2>시스템 아키텍처</h2>
<p>여기에 시스템 아키텍처 설명을 작성하세요.</p>
<img src="https://github.com/2024-SMHRD-SW-Fullstack-1/InvenTree/assets/86646622/021b34e6-2ef5-42d8-8b21-344907b9986d" alt="시스템 아키텍처" />

<h2>유스케이스</h2>
<p>여기에 유스케이스 설명을 작성하세요.</p>
<img src="https://github.com/2024-SMHRD-SW-Fullstack-1/InvenTree/assets/86646622/5bd0ed69-24ac-4907-abbc-4fa59900d400" alt="유스케이스 다이어그램" />

<h2>ER 다이어그램</h2>
<p>여기에 ER 다이어그램 설명을 작성하세요.</p>
<img src="https://github.com/2024-SMHRD-SW-Fullstack-1/InvenTree/assets/86646622/1eaa02ae-ba96-4ad2-8114-5876080ec08b" alt="ER 다이어그램" />

<h2>화면 구성</h2>
<p>여기에 화면 구성 설명을 작성하세요.</p>
<img src="https://github.com/2024-SMHRD-SW-Fullstack-1/InvenTree/assets/86646622/3f233a2b-3d85-4c25-9b28-37564a3f3449" alt="화면 구성" />

<h2>팀원 역할</h2>
<ul>
  <li>팀장 김  솔 : Front-End/Back-End</li>
  <li>팀원 오승철 : Front-End/Back-End</li>
  <li>팀원 차수연 : Front-End</li>
  <li>팀원 이현규 : Front-End/Back-End</li>
</ul>

<h2>트러블슈팅</h2>

<h3>예외 처리 가이드</h3>
<p><code>DataIntegrityViolationException</code>과 같은 예외가 발생했을 때 이를 처리하는 방법에 대해 설명합니다. 특히 창고 및 선반 삭제 시 발생하는 예외에 중점을 둡니다.</p>

<h3>데이터 무결성 위반 예외 처리</h3>
<p><code>DataIntegrityViolationException</code>이 발생하면 데이터 무결성 제약 조건이 위반되었음을 의미합니다. 이는 주로 중복 키 삽입 시도, 필수 필드에 NULL 값 삽입 시도, 또는 외래 키 제약 조건 위반 시 발생할 수 있습니다.</p>

<h4>예외 처리 코드</h4>
<p>다음은 <code>DataIntegrityViolationException</code>을 처리하는 예외 처리 코드입니다:</p>
<img src="https://github.com/2024-SMHRD-SW-Fullstack-1/InvenTree/assets/86646622/d615b162-3459-45ff-9e93-d82ec2a092af" alt="트러블슈팅" />
