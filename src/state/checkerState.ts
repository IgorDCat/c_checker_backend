export interface CheckerState {
    isRunning: boolean;
    intervalId: NodeJS.Timeout | null;
    lastSlots: string[];
}

export const checkerState: CheckerState = {
    isRunning: false,
    intervalId: null,
    lastSlots: [],
};
