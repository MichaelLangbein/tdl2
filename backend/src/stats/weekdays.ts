/**
 * Working hours are every week, Monday to Friday, 9am to 5pm
 */
export class Workdays {

    /**
     * @param workHours: number - number of working hours from now
     * @returns Date - time at which `workHours` hours will have passed during working time
     */
    static getWorkingDateNHoursFromNow(workHours: number) {
        throw new Error("Method not implemented.");
    }

    /**
     * @param deadline: Date | unix-timestamp
     * @returns number - number of working hours left from now until the deadline
     */
    static getWorkingHoursUntil(deadline: Date | number): number {
        throw new Error("Method not implemented.");
    }
}