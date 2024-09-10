import cron from 'node-cron'
import Attendance from '../Models/attendance.schema.js'

cron.schedule('0 0 * * *', async () => {
    try {
        // Get today's date and set it to midnight
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
    
        // Check if today's attendance record already exists
        const existingAttendance = await Attendance.findOne({ date: today });
    
        // If attendance record doesn't exist, create a new one
        if (!existingAttendance) {
          // Fetch all employees from the database
          const employees = await User.find(); // Make sure User model is correctly imported
    
          // Initialize attendance entries for each employee with default values
          const attendanceEntries = employees.map((employee) => ({
            employeeId: employee._id,
            sessions: [], // Initialize empty swipe sessions
            totalTime: 0, // Default total time set to 0
            swipedIn: false, // Default swipedIn status
            status: 'Absent', // Default status set to Absent
          }));
    
          // Create a new attendance document for today
          const newAttendance = new Attendance({
            date: today,
            attendance: attendanceEntries,
          });
    
          // Save the new attendance record
          await newAttendance.save();
          console.log('Attendance record created for all employees for today.');
        } else {
          console.log('Attendance record for today already exists.');
        }
      } catch (error) {
        console.error('Error in initializing daily attendance:', error);
      }
})

cron.schedule('59 23 * * *', async () => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.seUTCHours(0, 0, 0, 0); // Sets to midnight of the previous day
  
      const attendance = await Attendance.findOne({ date: yesterday });
  
      if (attendance) {
        attendance.attendance.forEach((empAttendance) => {
          // Update the status based on total time recorded
          if (empAttendance.totalTime >= 8 * 60 * 60 * 1000) {
            empAttendance.status = 'Present';
          } else {
            empAttendance.status = 'Absent';
          }
        });
  
        await attendance.save();
        console.log('Daily attendance calculation completed.');
      }
    } catch (error) {
      console.error('Error in calculating daily attendance:', error);
    }
  });

// cron.schedule('*/5 * * * * *', () => {
//     console.log("cron runnin");
// })
