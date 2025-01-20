## Description

Road Hazard Management Service

본 서비스는 도로 이상 감지 장비로부터 들어오는 이벤트를 저장 및 처리합니다.

도로 위의 위험물에 대한 빠른 대응을 할 수 있도록 자동화된 처리 필요 중요도 분석과 빠른 작업 생성이 가능하도록한 중앙 관리  서비스 입니다.

데이터의 지속적인 수집으로 분석 및 시각화도 가능하도록 발전이 가능합니다.

## 서버 아키텍처 다이어그램
![제목 없는 다이어그램 drawio (1) (1)](https://github.com/maybe-finance/maybe/assets/71453094/dbd511b3-86fd-4246-a05c-f8e94dd6abfe)
## DB ERD
![Untitled (2)](https://github.com/maybe-finance/maybe/assets/71453094/098ade70-f974-4300-8a9f-b345cfa90dea)
## API Docs
본 명세는 감지 장비와의 통신 규약을 다루고 있습니다.

통신 데이터 형태는 JSON 형태이며 REST 규칙을 따르고 있습니다.

🔗[도로 위험물 알림 서비스 API 명세](https://extreme-stocking-5cc.notion.site/WCRC-API-4cc7ccaa912440f69a842d635c867eb2)

## Demo
### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
