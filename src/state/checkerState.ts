export interface CheckerState {
    isRunning: boolean;
    isChecking: boolean;

    intervalId: NodeJS.Timeout | null;

    lastSlots: string[];
}

export const checkerState: CheckerState = {
    isRunning: false,
    isChecking: false,

    intervalId: null,

    lastSlots: [],
};
