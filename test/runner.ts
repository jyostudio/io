export type TestFunction = () => Promise<void> | void;

export interface TestCase {
    name: string;
    func: TestFunction;
}

export interface TestSuite {
    name: string;
    cases: TestCase[];
}

const suites: TestSuite[] = [];

// 简单的全局变量模拟
let currentSuite: TestSuite | null = null;

export function describe(name: string, setup: () => void) {
    currentSuite = { name, cases: [] };
    suites.push(currentSuite);
    setup();
    currentSuite = null;
}

export function it(name: string, func: TestFunction) {
    if (currentSuite) {
        currentSuite.cases.push({ name, func });
    } else {
        console.warn(`Test case "${name}" defined outside of a suite.`);
    }
}

export async function runTests() {
    const app = document.getElementById('app');
    if (!app) return;

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    const summaryEl = document.createElement('div');
    summaryEl.className = 'summary';
    summaryEl.innerHTML = '<p>正在运行测试...</p>';
    app.appendChild(summaryEl);

    for (const suite of suites) {
        const suiteEl = document.createElement('div');
        suiteEl.className = 'suite';
        
        const suiteTitle = document.createElement('h2');
        suiteTitle.textContent = suite.name;
        suiteEl.appendChild(suiteTitle);

        const casesEl = document.createElement('div');
        casesEl.className = 'cases';
        suiteEl.appendChild(casesEl);

        for (const testCase of suite.cases) {
            totalTests++;
            const caseEl = document.createElement('div');
            caseEl.className = 'case pending';
            caseEl.textContent = `⏳ ${testCase.name}`;
            casesEl.appendChild(caseEl);

            try {
                await testCase.func();
                caseEl.className = 'case passed';
                caseEl.textContent = `✅ ${testCase.name}`;
                passedTests++;
            } catch (e) {
                caseEl.className = 'case failed';
                caseEl.textContent = `❌ ${testCase.name}: ${e}`;
                console.error(`Test failed: ${suite.name} - ${testCase.name}`, e);
                failedTests++;
            }
        }
        app.appendChild(suiteEl);
    }

    summaryEl.innerHTML = `
        <h3>测试结果汇总</h3>
        <p>总计: <strong>${totalTests}</strong></p>
        <p class="passed">通过: <strong>${passedTests}</strong></p>
        <p class="failed">失败: <strong>${failedTests}</strong></p>
    `;
}

export function expect(actual: any) {
    const matchers = (isNot: boolean) => ({
        toBe(expected: any) {
            const pass = actual === expected;
            if (isNot ? pass : !pass) {
                throw new Error(`Expected ${actual} ${isNot ? 'not ' : ''}to be ${expected}`);
            }
        },
        toEqual(expected: any) {
            const pass = JSON.stringify(actual) === JSON.stringify(expected);
            if (isNot ? pass : !pass) {
                throw new Error(`Expected ${JSON.stringify(actual)} ${isNot ? 'not ' : ''}to equal ${JSON.stringify(expected)}`);
            }
        },
        toBeTruthy() {
            const pass = !!actual;
            if (isNot ? pass : !pass) {
                throw new Error(`Expected ${actual} ${isNot ? 'not ' : ''}to be truthy`);
            }
        },
        toBeFalsy() {
            const pass = !actual;
            if (isNot ? pass : !pass) {
                throw new Error(`Expected ${actual} ${isNot ? 'not ' : ''}to be falsy`);
            }
        },
        toThrow() {
            let threw = false;
            try {
                if (typeof actual === 'function') {
                    actual();
                } else {
                    throw new Error("Expect actual to be a function for toThrow check");
                }
            } catch {
                threw = true;
            }
            if (isNot ? threw : !threw) {
                throw new Error(`Expected function ${isNot ? 'not ' : ''}to throw`);
            }
        },
        toBeGreaterThan(expected: number) {
            const pass = actual > expected;
            if (isNot ? pass : !pass) {
                throw new Error(`Expected ${actual} ${isNot ? 'not ' : ''}to be greater than ${expected}`);
            }
        },
        toBeLessThan(expected: number) {
            const pass = actual < expected;
            if (isNot ? pass : !pass) {
                throw new Error(`Expected ${actual} ${isNot ? 'not ' : ''}to be less than ${expected}`);
            }
        }
    });

    const baseMatchers = matchers(false);
    return {
        ...baseMatchers,
        get not() {
            return matchers(true);
        }
    };
}
