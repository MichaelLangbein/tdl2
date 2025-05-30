/**
 * TODO: connect to outlook and block all appointments as unavailable
 * 
 * Working hours are every week, Monday to Friday, 9am to 5pm
 */
export class Workdays {
    private static readonly WORKDAY_START_HOUR = 9;
    private static readonly WORKDAY_END_HOUR = 17;
    private static readonly WORKDAY_DURATION_HOURS = Workdays.WORKDAY_END_HOUR - Workdays.WORKDAY_START_HOUR;
    private static readonly WEEKDAYS = [0, 1, 2, 3, 4]; // Monday to Friday (0 = Sunday, 6 = Saturday)
    private static readonly MILLISECONDS_IN_HOUR = 60 * 60 * 1000;
    private static readonly MILLISECONDS_IN_DAY = 24 * Workdays.MILLISECONDS_IN_HOUR;

    /**
     * @param workHours: number - number of working hours from now
     * @returns Date - time at which `workHours` hours will have passed during working time
     */
    static getWorkingDateNHoursFromNow(workHours: number): Date {
        let remainingWorkHours = workHours;
        let currentDate = new Date();

        while (remainingWorkHours > 0) {
            const dayOfWeek = currentDate.getDay();
            const currentHour = currentDate.getHours();
            const currentMinute = currentDate.getMinutes();
            const currentSecond = currentDate.getSeconds();
            const currentMillisecond = currentDate.getMilliseconds();

            if (Workdays.WEEKDAYS.includes(dayOfWeek)) {
                if (currentHour < Workdays.WORKDAY_START_HOUR) {
                    // Before work starts, move to the start of the workday
                    currentDate.setHours(Workdays.WORKDAY_START_HOUR, 0, 0, 0);
                } else if (currentHour >= Workdays.WORKDAY_END_HOUR) {
                    // After work ends, move to the start of the next workday
                    currentDate.setDate(currentDate.getDate() + 1);
                    while (!Workdays.WEEKDAYS.includes(currentDate.getDay())) {
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                    currentDate.setHours(Workdays.WORKDAY_START_HOUR, 0, 0, 0);
                } else {
                    // Within working hours
                    const hoursLeftInDay = Workdays.WORKDAY_END_HOUR - currentHour - (currentMinute > 0 || currentSecond > 0 || currentMillisecond > 0 ? 1 : 0);

                    if (remainingWorkHours <= hoursLeftInDay) {
                        currentDate.setTime(currentDate.getTime() + remainingWorkHours * Workdays.MILLISECONDS_IN_HOUR);
                        remainingWorkHours = 0;
                    } else {
                        remainingWorkHours -= hoursLeftInDay + (currentMinute > 0 || currentSecond > 0 || currentMillisecond > 0 ? 1 : 0);
                        currentDate.setDate(currentDate.getDate() + 1);
                        while (!Workdays.WEEKDAYS.includes(currentDate.getDay())) {
                            currentDate.setDate(currentDate.getDate() + 1);
                        }
                        currentDate.setHours(Workdays.WORKDAY_START_HOUR, 0, 0, 0);
                    }
                }
            } else {
                // Not a workday, move to the next Monday
                currentDate.setDate(currentDate.getDate() + 1);
                while (!Workdays.WEEKDAYS.includes(currentDate.getDay())) {
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                currentDate.setHours(Workdays.WORKDAY_START_HOUR, 0, 0, 0);
            }
        }

        return currentDate;
    }

    /**
     * @param deadline: Date | unix-timestamp
     * @returns number - number of working hours left from now until the deadline
     */
    static getWorkingHoursUntil(deadline: Date | number): number {
        const now = new Date();
        const deadlineDate = deadline instanceof Date ? deadline : new Date(deadline);

        if (deadlineDate <= now) {
            return 0;
        }

        let workingHours = 0;
        let currentDate = new Date(now);

        while (currentDate < deadlineDate) {
            const dayOfWeek = currentDate.getDay();
            const currentHour = currentDate.getHours();

            if (Workdays.WEEKDAYS.includes(dayOfWeek)) {
                const startOfDay = new Date(currentDate);
                startOfDay.setHours(Workdays.WORKDAY_START_HOUR, 0, 0, 0);
                const endOfDay = new Date(currentDate);
                endOfDay.setHours(Workdays.WORKDAY_END_HOUR, 0, 0, 0);

                let overlapStart = currentDate > startOfDay ? currentDate : startOfDay;
                let overlapEnd = deadlineDate < endOfDay ? deadlineDate : endOfDay;

                if (overlapStart < overlapEnd) {
                    workingHours += (overlapEnd.getTime() - overlapStart.getTime()) / Workdays.MILLISECONDS_IN_HOUR;
                }
            }

            currentDate.setTime(currentDate.getTime() + Workdays.MILLISECONDS_IN_HOUR);
        }

        return Math.max(0, workingHours);
    }
}