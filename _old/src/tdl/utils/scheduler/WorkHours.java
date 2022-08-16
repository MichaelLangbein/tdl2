package tdl.utils.scheduler;

import java.util.Calendar;
import java.util.Date;

public class WorkHours {

	private Calendar calendar;
	
	public WorkHours() {
		this.calendar = Calendar.getInstance();
	}
	
	public Date addSecondsToDate(double estimate, Date date) {
		Date outDate = new Date();
		Date beginWorkDay = getBeginWorkday(date);
		Date endWorkDay = getEndWorkday(date);
		long secondsLeftToday = secondsBetween(date, endWorkDay);
		
		if(secondsLeftToday < 0) { // Working after closing hours again ...
			double remainder = estimate;
			Date nextDay = getNextWorkDayMorning(date);
			outDate = addSecondsToDate(remainder, nextDay);
		} 
		
		else if(estimate < secondsLeftToday) { // Can still finish this today!
			outDate = addSecondsToDateSimple(estimate, date);
		} 
		
		else { // Screw it. We'll do it tomorrow.
			double remainder = estimate - secondsLeftToday;
			Date nextDay = getNextWorkDayMorning(date);
			outDate = addSecondsToDate(remainder, nextDay);
		}
		
		return outDate;
	}
	
	public long workSecondsBetweenDates(Date beginDate, Date endDate) {
		long secs = 0;
		
		Date endWorkDay = getEndWorkday(beginDate);
		if(endDate.before(endWorkDay)) {
			long diff = secondsBetween(beginDate, endDate);
			secs += diff;
		}else {
			long diff = secondsBetween(beginDate, endWorkDay);
			secs += diff;
			Date nextWorkMorning = getNextWorkDayMorning(beginDate);
			secs += workSecondsBetweenDates(nextWorkMorning, endDate);
		}
		
		return secs;
	}
	
	
	public String secsToHumanReadable(long seconds) {
		long numberOfDays = seconds / 28800;
		long numberOfHours = (seconds % 28800 ) / 3600;
		long numberOfMinutes = ((seconds % 28800 ) % 3600 ) / 60;
		long numberOfSeconds = ((seconds % 28800 ) % 3600 ) % 60;
		String readable = numberOfDays + "d, " + numberOfHours + "h, " + numberOfMinutes + "m, " + numberOfSeconds + "s";
		return readable;
	}


	private Date addSecondsToDateSimple(double estimate, Date date) {
		calendar.setTime(date);
		calendar.add(Calendar.SECOND, (int)estimate);
		Date newDate = calendar.getTime();
		return newDate;
	}
	
	
	private Date getNextWorkDayMorning(Date date) {
		calendar.setTime(date);
		int dow = calendar.get(Calendar.DAY_OF_WEEK);
		switch(dow) {
		case Calendar.SUNDAY:
		case Calendar.MONDAY:
		case Calendar.TUESDAY:
		case Calendar.WEDNESDAY:
		case Calendar.THURSDAY:
			calendar.add(Calendar.DAY_OF_MONTH, 1);
			break;
		case Calendar.FRIDAY:
			calendar.add(Calendar.DAY_OF_MONTH, 3);
			break;
		case Calendar.SATURDAY:
			calendar.add(Calendar.DAY_OF_MONTH, 2);
			break;
		}
		calendar.set(Calendar.HOUR_OF_DAY, 8);
		calendar.set(Calendar.MINUTE, 0);
		Date outDate = calendar.getTime();
		return outDate;
	}
	
	private Date getBeginWorkday(Date date) {
		calendar.setTime(date);
		calendar.set(Calendar.HOUR_OF_DAY, 8);
		calendar.set(Calendar.MINUTE, 0);
		Date outDate = calendar.getTime();
		return outDate;
	}
	
	private Date getEndWorkday(Date date) {
		calendar.setTime(date);
		calendar.set(Calendar.HOUR_OF_DAY, 17);
		calendar.set(Calendar.MINUTE, 0);
		Date outDate = calendar.getTime();
		return outDate;
	}
	
	private long secondsBetween(Date d1, Date d2) {
		return (d2.getTime() - d1.getTime()) / 1000;
	}


}
