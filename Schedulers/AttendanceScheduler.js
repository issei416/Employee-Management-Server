import cron from 'node-cron'
import Attendance from '../Models/attendance.schema.js'

cron.schedule('0 0 * * *', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0); //gets the yesterday date to calculate attendance

    const attendance = await Attendance.findOne({ "date": yesterday });
    
    if (attendance) {
        attendance.attendance.forEach(async (empAttendance) => {
            if (empAttendance.totalTime >= 8 * 60 * 60 * 1000) {
                empAttendance.status = "Present";
            } else {
                empAttendance.status = 'Absent';
            }
        });

        await attendance.save();
        console.log("daily attendance calculation completed");
    }
})

// cron.schedule('*/5 * * * * *', () => {
//     console.log("cron runnin");
// })
