## Getting Started
you can manually run the test to generate log and compare them on the interface

```
git clone https://github.com/anshss/compare-test.git
cd server
TOTAL_RUNS=10 npm run test-client
npm i
node server
```

```
cd interface
cp .env.example .env.local
npm i
npm run run dev
```

## Error chances 
As both the test runs are merged through timestamp, there is a possibility of two log files being generated for a single test run which would appear as two rows on the interface as well