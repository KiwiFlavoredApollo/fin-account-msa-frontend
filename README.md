# Fin Account MSA Frontend

FIN-M 디지털 계좌 통합 관리 플랫폼의 React 기반 Frontend입니다.

계좌 개설 및 조회, 잔액 확인, 입출금, 계좌 이체, 거래 내역 조회 기능을 제공합니다.

Frontend는 각 Microservice에 직접 접근하지 않고 API Gateway를 통해 Backend API를 호출합니다.

## Tech Stack

* React
* Vite
* JavaScript
* Axios
* React Router

## Main Features

* 로그인
* 계좌 개설
* 계좌 상세 조회
* 잔액 조회
* 입금
* 출금
* 계좌 이체
* 거래 내역 조회
* JWT 기반 인증 요청

## Architecture

```text
React Frontend
      |
      | HTTP
      v
API Gateway
      |
      +------------------------+
      |                        |
      v                        v
Account Service       Transaction Service
                              |
                              | OpenFeign
                              v
                       Account Service
                              |
                              | Kafka
                              v
                     Notification Service
```

Frontend는 `/internal/**` API를 직접 호출하지 않습니다.

서비스 간 내부 통신은 Backend에서 OpenFeign을 통해 처리합니다.

## Project Structure

```text
frontend/
├── public/
│
├── src/
│   ├── api/
│   │   ├── apiClient.js
│   │   ├── accountApi.js
│   │   └── transactionApi.js
│   │
│   ├── components/
│   │   ├── AccountCard.jsx
│   │   ├── TransactionList.jsx
│   │   └── Header.jsx
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── AccountPage.jsx
│   │   ├── AccountCreatePage.jsx
│   │   ├── DepositPage.jsx
│   │   ├── WithdrawPage.jsx
│   │   ├── TransferPage.jsx
│   │   └── TransactionHistoryPage.jsx
│   │
│   ├── routes/
│   │   └── AppRouter.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## API

### Account API

| Method | Endpoint                            | Description |
| ------ | ----------------------------------- | ----------- |
| POST   | `/api/accounts`                     | 계좌 개설       |
| GET    | `/api/accounts/{accountId}`         | 계좌 상세 조회    |
| GET    | `/api/accounts/{accountId}/balance` | 잔액 조회       |

### Transaction API

| Method | Endpoint                                  | Description |
| ------ | ----------------------------------------- | ----------- |
| POST   | `/api/transactions/deposit`               | 입금          |
| POST   | `/api/transactions/withdraw`              | 출금          |
| POST   | `/api/transactions/transfer`              | 계좌 이체       |
| GET    | `/api/transactions/{transactionId}`       | 거래 상세 조회    |
| GET    | `/api/transactions?accountId={accountId}` | 계좌 거래내역 조회  |

## Internal API

아래 API는 Frontend에서 직접 호출하지 않습니다.

Transaction Service에서 Account Service를 OpenFeign으로 호출할 때 사용합니다.

```http
GET /internal/accounts/{id}/balance

POST /internal/accounts/{id}/deposit

POST /internal/accounts/{id}/withdraw
```

## Request Flow

### 입금

```text
React
  ↓
POST /api/transactions/deposit
  ↓
API Gateway
  ↓
Transaction Service
  ↓ OpenFeign
Account Service
  ↓
잔액 증가
```

### 출금

```text
React
  ↓
POST /api/transactions/withdraw
  ↓
API Gateway
  ↓
Transaction Service
  ↓ OpenFeign
Account Service
  ↓
잔액 확인 및 감소
```

### 이체

```text
React
  ↓
POST /api/transactions/transfer
  ↓
API Gateway
  ↓
Transaction Service
  ↓
출금 계좌 잔액 조회
  ↓
출금 처리
  ↓
입금 계좌 입금 처리
  ↓
Transaction SUCCESS
  ↓
Kafka Event
  ↓
Notification Service
```

## Environment Variables

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
VITE_API_BASE_URL=http://localhost:8000
```

`.env`는 GitHub에 업로드하지 않습니다.

공유용 설정은 `.env.example`을 사용합니다.

## Installation

```bash
npm install
```

## Run

```bash
npm run dev
```

기본 개발 서버:

```text
http://localhost:5173
```

## Authentication

로그인 성공 후 Backend에서 발급받은 JWT를 저장하고 이후 요청의 `Authorization` Header에 포함합니다.

```text
Authorization: Bearer {JWT}
```

## Notes

Frontend는 화면 구현과 API 연동에 집중하며, 서비스 간 통신, Kafka, Saga, Schema Registry 등의 처리는 Backend에서 담당합니다.

한 가지는 지금 요구사항에서 **로그인 API 경로가 아직 확정되지 않았으니까 README에는 로그인 기능만 적고 `/api/auth/login` 같은 경로는 일부러 확정해서 넣지 않았어.** 백엔드에서 인증 API를 정하면 그때 추가하는 게 맞아.
