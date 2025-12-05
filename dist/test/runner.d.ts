export type TestFunction = () => Promise<void> | void;
export interface TestCase {
    name: string;
    func: TestFunction;
}
export interface TestSuite {
    name: string;
    cases: TestCase[];
}
export declare function describe(name: string, setup: () => void): void;
export declare function it(name: string, func: TestFunction): void;
export declare function runTests(): Promise<void>;
export declare function expect(actual: any): {
    not: {
        toBe(expected: any): void;
        toEqual(expected: any): void;
        toBeTruthy(): void;
        toBeFalsy(): void;
        toThrow(): void;
        toBeGreaterThan(expected: number): void;
        toBeLessThan(expected: number): void;
    };
    toBe(expected: any): void;
    toEqual(expected: any): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toThrow(): void;
    toBeGreaterThan(expected: number): void;
    toBeLessThan(expected: number): void;
};
//# sourceMappingURL=runner.d.ts.map