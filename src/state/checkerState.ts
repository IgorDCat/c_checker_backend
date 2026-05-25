export interface CheckerState {
    isRunning: boolean;
    isChecking: boolean;
    intervalId: NodeJS.Timeout | null;
    lastSlots: string[];
    lastCheckingTime: string;
    lastError: string;
    lastErrorTime: string
}

export const checkerState: CheckerState = {
    isRunning: false,
    isChecking: false,

    intervalId: null,

    lastSlots: [],
    lastCheckingTime: '',
    lastError: '',
    lastErrorTime: ''
};
