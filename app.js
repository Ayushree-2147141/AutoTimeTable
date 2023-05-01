const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');


const cors = require('cors');
app.use(cors({
    orgin: "*",
}))
app.use(bodyParser.json())

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));

var connection = require('./database');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/gentimetable.html')
});

app.get('/courses', function (req, res) {
    res.sendFile(__dirname + '/views/courses.html')
});

app.get('/lab', function (req, res) {
    res.sendFile(__dirname + '/views/lab.html')
});

app.get('/room', function (req, res) {
    res.sendFile(__dirname + '/views/room.html')
});
app.get('/program', function (req, res) {
    res.sendFile(__dirname + '/views/program.html')
});
app.get('/teachers', function (req, res) {
    res.sendFile(__dirname + '/views/teachers.html')
});

app.get('/programSem', function (req, res) {
    res.sendFile(__dirname + '/views/relationship/programSem.html')
});

app.get('/semesterCourse', function (req, res) {
    res.sendFile(__dirname + '/views/relationship/semesterCourse.html')
});

app.get('/semesterSection', function (req, res) {
    res.sendFile(__dirname + '/views/relationship/semesterSection.html')
});

app.get('/programtimeslot', function (req, res) {
    res.sendFile(__dirname + '/views/programtimeslot.html')
})

app.get('/labtimeslot', function (req, res) {
    res.sendFile(__dirname + '/views/labtimeslot.html')
})

app.get('/teachertimeslot', function (req, res) {
    res.sendFile(__dirname + '/views/teachertimeslot.html')
})

app.get('/sectioncourseteacher', function (req, res) {
    res.sendFile(__dirname + '/views/relationship/sectionCourseTeacher.html')
})

app.get('/getprogram', function (req, res) {
    let sql = 'select * from programtable';
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})



app.get('/getcourse', function (req, res) {
    let sql = 'select * from coursetable';
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

app.get('/gettimetable', function (req, res) {
    let sql = 'select * from timetabletable';
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

app.get('/gettimetableMCA1A', function (req, res) {
    let sql = `select daytable.DayName , timetabletable.TTDayId, timetabletable.TTTimeslotId, timetabletable.CourseName, timetabletable.LecturerShortName, timeslottable.SlotStartTime, timeslottable.SlotEndTime  from daytable join timetabletable on daytable.DayId = timetabletable.TTDayId join timeslottable on timeslottable.TimeSlotId = timetabletable.TTTimeslotId where TTProgramSemesterSectionId = 1;`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
        // console.log(result[TTDayId]);
    })
})

app.get('/getsection', function (req, res) {
    let sql = `select distinct ProgramSemesterSectionTitle, ProgramSemesterSectionId from  programsemestersectiontable where IsActive = 1`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    })
})

app.get('/gettimetable/:id', function (req, res) {
    var id = req.params.id;
    let sql = `select daytable.DayName , timetabletable.TTDayId, timetabletable.TTTimeslotId, timetabletable.CourseName, timetabletable.LecturerShortName, timeslottable.SlotStartTime, timeslottable.SlotEndTime, timetabletable.LecturerShortName
    from daytable 
    join timetabletable on daytable.DayId = timetabletable.TTDayId 
    join timeslottable on timeslottable.TimeSlotId = timetabletable.TTTimeslotId 
    where TTProgramSemesterSectionId = ${id}
    order by timetabletable.TTDayId`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    })
})

app.get('/getteachertimetable/:id', function (req, res) {
    var id = req.params.id;
    let sql = `select timetabletable.TTDayId, timetabletable.TTTimeslotId, timetabletable.TTProgramSemesterSectionTitle, timetabletable.CourseName, timetabletable.TTLecturerId, lecturertable.LecturerName , daytable.DayName, timeslottable.SlotStartTime, timeslottable.SlotEndTime
    from timetabletable 
    join lecturertable on timetabletable.TTLecturerId = lecturertable.LecturerId
    join daytable on daytable.DayId = timetabletable.TTDayId
    join timeslottable on timeslottable.TimeSlotId = timetabletable.TTTimeslotId
    where TTLecturerId = ${id}
    order by timetabletable.TTDayId;`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    })
})

app.get('/getselectedTeacherName/:id', function (req, res) {
    var id = req.params.id;
    let sql = `select * from lecturertable where LecturerId = ${id};`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    })
})

app.get('/gettimetableMCA1B', function (req, res) {
    let sql = `select * from timetabletable where RoomName = 'MCA1B'`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })

})

app.get('/getprograms', function (req, res) {
    let sql = `select * from programtable`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

// app.get('/getroomno', function(req, res) {
//     let sql = ``
// })

app.get('/getsemesters', function (req, res) {
    let sql = `select * from semestertable`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

app.get('/getrooms', function (req, res) {
    let sql = 'select * from roomtable';
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

app.get('/getcourses', function (req, res) {
    let sql = 'select * from coursetable';
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    })
})

app.get('/getteachers', function (req, res) {
    let sql = `select * from lecturertable;`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

app.get('/getassignedteachers', function (req, res) {
    let sql = `SELECT programtable.ProgramName, semestertable.SemesterTitle, sectiontable.SectionName, 
        lecturertable.LecturerName, lecturertable.LecturerShortName, coursetable.CourseName
        FROM sectioncourselecturertable
        JOIN programsemestertable ON sectioncourselecturertable.ProgramSemesterId3 = programsemestertable.ProgramSemesterId
        JOIN programsemestersectiontable ON sectioncourselecturertable.ProgramSemesterSectionId3 = programsemestersectiontable.ProgramSemesterSectionId
        JOIN programsemestercoursetable ON sectioncourselecturertable.ProgramSemesterCourseId3 = programsemestercoursetable.ProgramSemesterCourseId
        JOIN lecturertable ON sectioncourselecturertable.LecturerId = lecturertable.LecturerId
        JOIN programtable ON programsemestertable.ProgramId = programtable.ProgramId
        JOIN semestertable ON programsemestertable.SemesterId = semestertable.SemesterId
        JOIN sectiontable ON programsemestersectiontable.SectionId1 = sectiontable.SectionId
        JOIN coursetable ON programsemestercoursetable.CourseId1 = coursetable.CourseId`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

app.get('/getprogramsem', function (req, res) {
    let sql = `select * from programsemestertable`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

app.get('/getprogramsemsection', function (req, res) {
    let sql = `select programsemestersectiontable.ProgramSemesterSectionId , programsemestersectiontable.Program_Id , programsemestersectiontable.ProgramSemesterId , programsemestersectiontable.SectionId1 , programsemestersectiontable.ProgramSemesterSectionTitle, programsemestersectiontable.RoomId, programsemestersectiontable.IsActive, roomtable.RoomName , roomtable.RoomIsActive , programsemestersectiontable.ClassCapacity
    from programsemestersectiontable
    join roomtable on roomtable.RoomId = programsemestersectiontable.RoomId
    where roomtable.RoomIsActive = 1;`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })

})

app.get('/getsections', function (req, res) {
    let sql = `select * from sectiontable`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})



app.get('/getalltimetable', function (req, res) {
    let sql = 'call generate_time_table()';
    // console.log(sql);
    connection.query(sql, (error, results, fields) => {
        // console.log(results);
        if (error) {
            console.log(error);
            throw error
        };
        res.send(results);
    });
})

app.get('/getroomtype', function (req, res) {
    let sql = `select * from roomtype`;
    connection.query(sql, (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
})

app.get('/getsemesters', function (req, res) {
    let sql = `select * from semestertable`;
    connection.query(sql, (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });

})


app.get('/getactiveprograms', function (req, res) {
    let sql = `select * from programtable where ProgramIsActive = 1`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

app.get('/getdays', function (req, res) {
    let sql = `select * from daytable`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

app.get('/gettimeslots', function (req, res) {
    let sql = `select * from timeslottable`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

app.get('/getjoinedteachertimeslots', function (req, res) {
    let sql = `select lecturertable.LecturerName , daytable.DayName, timeslottable.SlotStartTime, timeslottable.SlotEndTime , lecturerdaytimeslottable.LecturerIsActive , 
    lecturerdaytimeslottable.LecturerIsAvailable,
    lecturerdaytimeslottable.LecturerDayTimeSlotId
        from lecturerdaytimeslottable 
        join lecturertable on lecturertable.LecturerId = lecturerdaytimeslottable.LecturerId2
        join daytable on lecturerdaytimeslottable.DayId2 = daytable.DayId
        join timeslottable on lecturerdaytimeslottable.TimeSlotId2 = timeslottable.TimeSlotId
        WHERE lecturertable.LecturerIsActive = 1
        and daytable.DayIsActive = 1
        ORDER BY 
            CASE daytable.DayName
                WHEN 'Monday' THEN 1
                WHEN 'Tuesday' THEN 2
                WHEN 'Wednesday' THEN 3
                WHEN 'Thursday' THEN 4
                WHEN 'Friday' THEN 5
                WHEN 'Saturday' THEN 6
                WHEN 'Sunday' THEN 7
            END,
            lecturertable.LecturerName ,
            timeslottable.SlotStartTime`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })

})

app.get('/getjoinedtimeslots', function (req, res) {
    let sql = `SELECT programtable.ProgramName, daytable.DayName, timeslottable.SlotStartTime, timeslottable.SlotEndTime, programdaytimeslottable.DayTimeSlotIsActive, programdaytimeslottable.ProgramDayTimeSlotId
    FROM programtable
    JOIN programdaytimeslottable ON programtable.programId = programdaytimeslottable.ProgramsId
    JOIN daytable ON daytable.DayId = programdaytimeslottable.DayId
    JOIN timeslottable ON timeslottable.TimeSlotId = programdaytimeslottable.TimeSlotId
    WHERE programtable.ProgramIsActive = 1
    AND daytable.DayIsActive = 1
    ORDER BY 
        CASE daytable.DayName
            WHEN 'Monday' THEN 1
            WHEN 'Tuesday' THEN 2
            WHEN 'Wednesday' THEN 3
            WHEN 'Thursday' THEN 4
            WHEN 'Friday' THEN 5
            WHEN 'Saturday' THEN 6
            WHEN 'Sunday' THEN 7
        END,
        programtable.ProgramName,
        timeslottable.SlotStartTime`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

app.get('/getactivecourse', function (req, res) {
    let sql = 'select * from coursetable where CourseIsActive = 1';
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })

})

app.get('/getactiveteachers', function (req, res) {
    let sql = `select LecturerName, LecturerID, LecturerIsActive, LecturerShortName from lecturertable where LecturerIsActive = 1`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

app.get('/getprogramsemcourses', function (req, res) {
    let sql = `select coursetable.CourseName ,coursetable.CourseID, programsemestercoursetable.ProgramSemesterId1, semestertable.SemesterTitle,  programsemestercoursetable.courseHrs
                from programsemestercoursetable 
                join coursetable on coursetable.CourseId = programsemestercoursetable.CourseId1
                join semestertable on semestertable.SemesterId = programsemestercoursetable.ProgramSemesterId1;
                `;

    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

app.get('/getrooms', function (req, res) {
    let sql = `select * from roomtable`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

app.get('/getlabs', function (req, res) {
    let sql = `select * from labtable`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

app.get('/getjoinedlabtimeslots', function (req, res) {
    let sql = `select labdaytimeslot.LabName , daytable.DayName, timeslottable.SlotStartTime, timeslottable.SlotEndTime , labdaytimeslot.LabIsActive , 
    labdaytimeslot.LabIsAvailable,
    labdaytimeslot.LabDayTimeSlotId
        from labdaytimeslot 
        join labtable on labtable.LabId = labdaytimeslot.LabId4
        join daytable on labdaytimeslot.DayId4 = daytable.DayId
        join timeslottable on labdaytimeslot.TimeSlotId4 = timeslottable.TimeSlotId
        where labtable.IsActive = 1
        and daytable.DayIsActive = 1
        ORDER BY 
            CASE daytable.DayName
                WHEN 'Monday' THEN 1
                WHEN 'Tuesday' THEN 2
                WHEN 'Wednesday' THEN 3
                WHEN 'Thursday' THEN 4
                WHEN 'Friday' THEN 5
                WHEN 'Saturday' THEN 6
                WHEN 'Sunday' THEN 7
            END,
            labdaytimeslot.LabName ,
            timeslottable.SlotStartTime`;

    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })

})

app.get('/getactiveprogramsemesters/:id', function (req, res) {
    let id = req.params.id;
    let sql = `select programsemestertable.ProgramSemesterId, programsemestertable.ProgramSemesterName, programsemestertable.ProgramId, programsemestertable.SemesterId, programsemestertable.ProgramSemesterIsActive , semestertable.SemesterTitle 
    from programsemestertable
    join semestertable on programsemestertable.SemesterId = semestertable.SemesterId 
    where programsemestertable.ProgramSemesterIsActive = 1 and programsemestertable.ProgramId = ${id};`
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })
})

app.get('/getactiveprogramsections/:id', function (req, res) {
    let id = req.params.id;
    let sql = `select distinct sectiontable.SectionName , programsemestersectiontable.ProgramSemesterSectionId,  sectiontable.SectionId, programsemestersectiontable.Program_Id, programsemestersectiontable.ProgramSemesterSectionTitle
from programsemestersectiontable
join sectiontable on programsemestersectiontable. SectionId1 = sectiontable.SectionId 
where programsemestersectiontable.Program_Id = ${id}
group by sectiontable.SectionName;`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })

})

app.get('/getactiveprogramsections/:id/:semid', function (req, res) {
    let pid = req.params.id;
    let sid = req.params.semid;

    let sql = `select distinct sectiontable.SectionName, programsemestersectiontable.ProgramSemesterSectionId, programsemestersectiontable.ProgramSemesterSectionTitle, programsemestersectiontable.Program_Id , sectiontable.SectionId, programsemestersectiontable.RoomId, programsemestersectiontable.IsActive, programsemestertable.ProgramId
    from programsemestersectiontable
    join sectiontable on programsemestersectiontable.SectionId1 = sectiontable.SectionId
    join programsemestertable on programsemestertable.ProgramSemesterId = programsemestersectiontable.ProgramSemesterId
    where programsemestersectiontable.Program_Id = ${pid}
    and programsemestertable.SemesterId = ${sid}
    and programsemestersectiontable.IsActive = 1;`;

    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })  
})

app.get('/getprogramsemcourse/:progId/:semId', function (req, res) {
    let progId = req.params.progId;
    let semId = req.params.semId;

    let sql = `
    select coursetable.CourseName,coursetable.CourseID, programsemestercoursetable.ProgramSemesterCourseId
    from coursetable
    join programsemestercoursetable on programsemestercoursetable.CourseId1 = coursetable.CourseID 
    join programsemestertable on programsemestertable.ProgramSemesterId = programsemestercoursetable.ProgramSemesterId1
    where programsemestertable.ProgramId = ${progId} and programsemestertable.SemesterId = ${semId}`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(result);
        res.send(result);
    })

})

app.post('/addProgram', function (req, res) {
    console.log(req.body);
    var ProgramName = req.body.programName;
    var activestatus = req.body.active;
    // console.log(activestatus);
    var active = 0;
    if (activestatus.includes("on"))
        active = 1;
    // console.log(ProgramName);
    const sql = `
    insert into programtable (ProgramName, ProgramIsActive) values (?, ?);
    delete from programdaytimeslottable;
    alter table programdaytimeslottable auto_increment = 1;
    insert into programdaytimeslottable (ProgramsId, DayId, TimeSlotId)
    select p.ProgramId, d.DayId, t.TimeSlotId
    from programtable as p
    cross join daytable as d
    cross join timeslottable as t
    where d.DayIsActive = 1;
  `;
  
  connection.query(sql, [ProgramName, active], function (err, result) {
    if (err) throw err;
    res.sendFile(__dirname + '/views/program.html');
  });
})

app.post('/addprogramsem', function (req, res) {
    var selectedProgram = req.body.selectedProgram;
    var values = selectedProgram.split(':');
    var programId = values[1];
    var programName = values[2];

    var selectedSemester = req.body.selectedSemester;
    console.log(selectedSemester);
    var value = selectedSemester.split(':');
    var semesterId = value[1];
    var semesterName = value[2];
    var activestatus = req.body.active;
    var active = 0;
    if (activestatus.includes("on"))
        active = 1;
    var programSemesterName = programName + semesterName;
    let sql = 'insert into programsemestertable (ProgramSemesterName, ProgramId, SemesterId, ProgramSemesterIsActive) values(?, ?, ?, ?)';
    connection.query(sql, [programSemesterName, programId, semesterId, active], function (err, results) {
        if (err) throw err;
        res.sendFile(__dirname + '/views/relationship/programSem.html')
    })

})

app.post('/addprogramsemestercourse', function (req, res) {
    console.log(req.body);
    var selectedProgram = req.body.selectedProgram;
    var selectedSemester = req.body.selectedSemester;
    var selectedCourse = req.body.selectedCourse;


    var selectedProgramPart = selectedProgram.split(':')
    var selectedSemesterPart = selectedSemester.split(':')
    var selectedCoursePart = selectedCourse.split(':')
    // var selectedCoursHoursPart = selectedCourseHours.split(':') 

    var programSemsterId = selectedSemesterPart[1]
    var programId = selectedProgramPart[1]
    var courseId = selectedCoursePart[1]
    // var courseHours = selectedCourseHours;
    var selectedCourseHours = req.body.selectedCourseHours;

    let sql = 'insert into programsemestercoursetable (ProgramSemesterId1, CourseId1, courseHrs) values (?, ?, ?)';
    connection.query(sql, [programSemsterId, courseId, selectedCourseHours], function (err, results) {
        if (err) throw err;
        res.sendFile(__dirname + '/views/relationship/semesterCourse.html')
    })

})

app.post('/addprogramsemsections', function (req, res) {
    // console.log(req.body);
    var selectedProgram = req.body.selectedProgram;
    var selectedSemester = req.body.selectedSemester;
    var selectedSection = req.body.selectedSection;
    var selectedRoom = req.body.selectedRoom;


    var selectedProgramPart = selectedProgram.split(':')
    var selectedSemesterPart = selectedSemester.split(':')
    var selectedSectionPart = selectedSection.split(':')
    var selectedRoomPart = selectedRoom.split(':')
    // var selectedCapacityPart = selectedCapacity.split(':')

    var programId = selectedProgramPart[1]
    var programName = selectedProgramPart[2]
    var semesterId = selectedSemesterPart[1]
    var semesterName = selectedSemesterPart[2]
    var sectionId = selectedSectionPart[1]
    var sectionName = selectedSectionPart[2]
    var roomId = selectedRoomPart[1]
    var roomName = selectedRoomPart[2]
    var selectedCapacity = req.body.selectedCapacity;


    var activestatus = req.body.active;
    var active = 0;
    if (activestatus.includes("on"))
        active = 1;
    var programSemesterSectionName = programName + semesterName + sectionName;
    console.log(programSemesterSectionName);
    let sql = `insert into programsemestersectiontable (Program_Id, ProgramSemesterId, SectionId1, ProgramSemesterSectionTitle, RoomId, IsActive, ClassCapacity) values (?, ?, ?, ?, ?, ?, ?);
                delete FROM alltimeslottable;
                Alter table alltimeslottable auto_increment=1;
                insert into alltimeslottable (Program_Id,ProgramSemester_Id,ProgramSemesterSection_Id,Day_Id,TimeSlot_Id,TimeSlotIsActive)
                select pss.Program_Id, pss.ProgramSemesterId, pss.ProgramSemesterSectionId,
                pdts.DayId, pdts.TimeSlotId, pdts.DayTimeSlotIsActive
                from programsemestersectiontable as pss 
                cross join programdaytimeslottable as pdts on pss.Program_Id = pdts.ProgramsId
                where pdts.DayTimeSlotIsActive = 1 and pss.IsActive = 1;
    `;

    connection.query(sql, [programId, semesterId, sectionId, programSemesterSectionName, roomId, active, selectedCapacity], function (err, results) {
        if (err) throw err;
        res.sendFile(__dirname + '/views/relationship/semesterSection.html')
    })

})


app.post('/addprogramsemseccourseteacher', function (req, res) {
    console.log(req.body);
    var programSemesterId = req.body.programSemesterId;
    var programSemesterSectionId = req.body.programSemesterSectionId;
    var programsemestercourseId = req.body.programsemestercourseId;
    var LecturerId = req.body.LecturerId;

    // console.log('hi');

    var roomTypeId = req.body.roomTypeId;
    let sql = '';
    if (roomTypeId == 1) {
        sql = `insert into sectioncourselecturertable(ProgramSemesterId3, ProgramSemesterSectionId3, ProgramSemesterCourseId3, LecturerId, RoomId) values (?, ?, ?, ?, ?)`;
    }
    else {
        sql = `insert into sectioncourselecturertable(ProgramSemesterId3, ProgramSemesterSectionId3, ProgramSemesterCourseId3, LecturerId, LabId) values (?, ?, ?, ?, ?)`;
    }

    connection.query(sql, [programSemesterId, programSemesterSectionId, programsemestercourseId, LecturerId, roomTypeId], function (err, results) {
        if (err) throw err;
        res.sendFile(__dirname + '/views/relationship/sectionCourseTeacher.html')
    })


})

app.get('/getroomnumber/:id', function (req, res) {
    var courseId = req.params.id;
    let sql = `select roomtype.RoomTypeName, roomtype.RoomTypeId
    from roomtype
    join coursetable on coursetable.RoomTypeId = roomtype.RoomTypeId
    where coursetable.courseId = ${courseId}`;
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results)
    })

})


app.post('/addTeacher', function (req, res) {
    // console.log(req.body);
    var teacherName = req.body.teacherName;
    var teacherShortName = req.body.teacherShortName
    var activestatus = req.body.active;
    // console.log(activestatus);
    var active = 0;
    if (activestatus.includes("on"))
        active = 1;
    // console.log(ProgramName);
    let sql = `INSERT INTO lecturertable (LecturerName, LecturerIsActive, LecturerShortName) VALUES (?, ?, ?);
                delete FROM autotimetable.lecturerdaytimeslottable;
                Alter table autotimetable.lecturerdaytimeslottable auto_increment=1; 
                insert into autotimetable.lecturerdaytimeslottable (LecturerId2, DayId2, TimeSlotId2)
                select LecturerId, DayId, TimeSlotId
                from lecturertable as l
                cross join daytable as d
                cross join timeslottable as t
                where d.DayIsActive=1;    
    `;
    // console.log(sql);
    connection.query(sql, [teacherName, active, teacherShortName], function (err, results) {
        if (err) throw err;
        res.sendFile(__dirname + '/views/teachers.html')
    })
})


app.post('/addLab', function (req, res) {
    // console.log(req.body);
    var labName = req.body.labName;
    // var teacherShortName = req.body.teacherShortName
    var activestatus = req.body.active;
    // console.log(activestatus);
    var active = 0;
    if (activestatus.includes("on"))
        active = 1;
    // console.log(ProgramName);
    let sql = `INSERT INTO labtable (LabName, IsActive) VALUES (?, ?);
                delete FROM autotimetable.labdaytimeslot;
                Alter table autotimetable.labdaytimeslot auto_increment=1; 
                insert into labdaytimeslot (LabId4,LabName,DayId4,TimeSlotId4)
                select l.LabId, l.LabName,
                d.DayId, t.TimeSlotId 
                from labtable as l
                cross join daytable as d
                cross join timeslottable as t
                where d.DayIsActive=1;
    `;
    // console.log(sql);
    connection.query(sql, [labName, active], function (err, results) {
        if (err) throw err;
        res.sendFile(__dirname + '/views/lab.html')
    })
})

app.post('/setStatus/:id/:s', function (req, res) {
    var stat;
    let sql;
    if (req.params.s == 1)
    {
        // for making inactive
        stat = 0;
        sql =`
        UPDATE programtable SET ProgramIsActive=? WHERE programId=?;
                update autotimetable.programdaytimeslottable as pdts 
                join Programtable as p on pdts.ProgramsId = p.ProgramId
                set DayTimeSlotIsActive = 0 
                where p.ProgramIsActive = 0;
        `;
    }
       
    else
    {
        stat = 1;
        sql =`
        UPDATE programtable SET ProgramIsActive=? WHERE programId=?;
                update autotimetable.programdaytimeslottable as pdts 
                join Programtable as p on pdts.ProgramsId = p.ProgramId
                set DayTimeSlotIsActive = 1 
                where p.ProgramIsActive = 1;
        `;
    }
    connection.query(sql, [stat, req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        }
        else
            console.log(err);
    })

})

// setting teacher status
app.post('/setTeacherStatus/:id/:s', function (req, res) {
    // console.log(id);
    var id = req.params.id;
    console.log(id);
    var stat;
    let sql;
    if (req.params.s == 1)
    {
       stat = 0;
       sql = `update lecturertable set LecturerIsActive = ? where LecturerId = ?;
       update autotimetable.lecturerdaytimeslottable as ldts 
       join lecturertable as l on ldts.LecturerId2 = l.LecturerId
       set ldts.LecturerIsActive = 0
       where l.LecturerIsActive = 0;
       `;
    }
    else
    {
        stat = 1;
        sql = `update lecturertable set LecturerIsActive = ? where LecturerId = ?;
        update autotimetable.lecturerdaytimeslottable as ldts 
        join lecturertable as l on ldts.LecturerId2 = l.LecturerId
        set ldts.LecturerIsActive = 1
        where l.LecturerIsActive = 1;
       `;
    }
        
    connection.query(sql, [stat, id], (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        }
        else
            console.log(err);
    })

})

app.post('/setProgramSemStatus/:id/:s', function (req, res) {
    var stat;
    if (req.params.s == 1)
        stat = 0;
    else
        stat = 1;
    
    connection.query('UPDATE programsemestertable SET ProgramSemesterIsActive=? WHERE ProgramSemesterId=?', [stat, req.params.id], (err, rows, fields) => {
        if (!err) {
            
            res.send(rows)
        }
        else
            console.log("error");
    })
})


app.post('/setRoomActiveStatus/:id/:s', function (req, res) {
    var stat;
    if (req.params.s == 1)
        stat = 0;
    else
        stat = 1;
    connection.query('UPDATE roomtable SET RoomIsActive=? WHERE RoomId=?', [stat, req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        }
        else
            console.log(err);
    })
})

app.post('/setLabActiveStatus/:id/:s', function (req, res) {
    var stat;
    let sql;

    if (req.params.s == 1)
    {
        stat = 0;
        sql = `UPDATE labtable SET IsActive=? WHERE LabId=?;
        update autotimetable.labdaytimeslot as ldts 
        join labtable as l on ldts.LabId4 = l.LabId
        set LabIsActive = 0 
        where l.IsActive = 0;
        `;
    }
        
    else
    {
        stat = 1;
        sql = `UPDATE labtable SET IsActive=? WHERE LabId=?;
        update autotimetable.labdaytimeslot as ldts 
        join labtable as l on ldts.LabId4 = l.LabId
        set LabIsActive = 1 
        where l.IsActive = 1;
        `;
    }
        
    connection.query(sql, [stat, req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        }
        else
            console.log(err);
    })
})

app.post('/setProgramSemSectionStatus/:id/:s', function (req, res) {
    var stat;
    let sql ;
    var id = req.params.id;
    var s = req.params.s;
    // console.log(s);
    if (s == 1)
    {
        stat = 0;
        sql = `UPDATE programsemestersectiontable SET IsActive=? WHERE ProgramSemesterSectionId=?;
        update alltimeslottable as ats
        join programsemestersectiontable as pss on ats.ProgramSemesterSection_Id = pss.ProgramSemesterSectionId
        set ats.TimeSlotIsActive = 0
        where pss.IsActive = 0;
        `; 
        // sql = `UPDATE programsemestersectiontable SET IsActive=? WHERE ProgramSemesterSectionId=?;`; 

    }
    else
    {
        stat = 1;
        sql = `UPDATE programsemestersectiontable SET IsActive=? WHERE ProgramSemesterSectionId=?;
        update alltimeslottable as ats
        join programsemestersectiontable as pss on ats.ProgramSemesterSection_Id = pss.ProgramSemesterSectionId
        set ats.TimeSlotIsActive = 1
        where pss.IsActive = 1;
        `; 
    
    }

    connection.query(sql, [stat, id], (err, rows, fields) => {
        if (!err) {
            // console.log ("success")
            res.send(rows)
        }
        else
            console.log(err);
    })
})


app.post('/setProgramTimeSlotStatus/:id/:s', function (req, res) {
    var stat;
    if (req.params.s == 1) {
        stat = 0;
        sql = `UPDATE programdaytimeslottable SET DayTimeSlotIsActive=? WHERE ProgramDayTimeSlotId=?;
        update autotimetable.programdaytimeslottable as pdts 
        join Programtable as p on pdts.ProgramsId = p.ProgramId
        set DayTimeSlotIsActive = 0 
        where p.ProgramIsActive = 0;
        `;

    }

    else
    {
        stat = 1;
        sql = `UPDATE programdaytimeslottable SET DayTimeSlotIsActive=? WHERE ProgramDayTimeSlotId=?;
        update autotimetable.programdaytimeslottable as pdts 
        join Programtable as p on pdts.ProgramsId = p.ProgramId
        set DayTimeSlotIsActive = 1 
        where p.ProgramIsActive = 1;
        `;
    }
        
    connection.query(sql, [stat, req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        }
        else
            console.log(err);
    });
})


app.post('/setTeacherTimeSlotStatus/:id/:s', function (req, res) {
    var stat;
    if (req.params.s == 1)
        stat = 0;
    else
        stat = 1;
    connection.query('UPDATE lecturerdaytimeslottable SET LecturerIsActive=? WHERE LecturerDayTimeSlotId=?', [stat, req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        }
        else
            console.log("error");
    })
})


app.post('/setTeacherTimeSlotAvailabilityStatus/:id/:s', function (req, res) {
    var stat;
    if (req.params.s == 1)
        stat = 0;
    else
        stat = 1;
    connection.query('UPDATE lecturerdaytimeslottable SET LecturerIsAvailable=? WHERE LecturerDayTimeSlotId=?', [stat, req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        }
        else
            console.log("error");
    })
})


app.post('/setLabTimeSlotStatus/:id/:s', function (req, res) {
    var stat;
    if (req.params.s == 1)
        stat = 0;
    else
        stat = 1;
    connection.query('UPDATE labdaytimeslot SET LabIsActive=? WHERE LabDayTimeSlotId=?', [stat, req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        }
        else
            console.log("error");
    })
})


app.post('/setLabTimeSlotAvailabilityStatus/:id/:s', function (req, res) {
    var stat;
    if (req.params.s == 1)
        stat = 0;
    else
        stat = 1;
    connection.query('UPDATE labdaytimeslot SET LabIsAvailable=? WHERE LabDayTimeSlotId=?', [stat, req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        }
        else
            console.log("error");
    })
})




app.post('/addCourse', function (req, res) {
    // console.log(req.body);
    var CourseName = req.body.CourseName;
    var RoomTypeId = req.body.RoomTypeId;
    // console.log("Id:",RoomTypeId);
    var activestatus = req.body.active;
    // console.log(activestatus);
    var active = 0;
    if (activestatus.includes("no"))
        active = 1;
    // console.log(active);
    let sql = `INSERT INTO coursetable (CourseName, CourseIsActive, RoomTypeId) VALUES (?, ?, ?)`;
    console.log();
    // console.log(sql);
    connection.query(sql, [CourseName, active, RoomTypeId], function (err, results) {
        if (err) throw err;
        res.sendFile(__dirname + '/views/courses.html')
    })
})


// app.post('/addTeacher', function (req, res) {
//     // console.log(req.body);
//     var teacherName = req.body.teacherName;
//     var teacherShortName = req.body.teacherShortName;
//     // console.log("Id:",RoomTypeId);
//     var activestatus = req.body.active;
//     // console.log(activestatus);
//     var active = 0;
//     if (activestatus.includes("no"))
//         active = 1;
//     // console.log(active);
//     let sql = `INSERT INTO lecturertable (LecturerName, LecturerIsActive, LecturerShortName) VALUES (?, ?, ?)`;
//     console.log();
//     // console.log(sql);
//     connection.query(sql, [teacherName, active, teacherShortName], function (err, results) {
//         if (err) throw err;
//         res.sendFile(__dirname + '/views/teachers.html')
//     })
// })


app.post('/addRoom', function (req, res) {
    // console.log(req.body);
    var roomName = req.body.roomName;
    // var teacherShortName = req.body.teacherShortName;
    // console.log("Id:",RoomTypeId);
    var activestatus = req.body.active;
    // console.log(activestatus);
    var active = 0;
    if (activestatus.includes("no"))
        active = 1;
    // console.log(active);
    let sql = `INSERT INTO roomtable (RoomName, RoomIsActive) VALUES (?, ?)`;
    console.log();
    // console.log(sql);
    connection.query(sql, [roomName, active], function (err, results) {
        if (err) throw err;
        res.sendFile(__dirname + '/views/room.html')
    })
})

app.post('/setCourseStatus/:id/:s', function (req, res) {
    var stat;
    if (req.params.s == 1)
        stat = 0;
    else
        stat = 1;
    connection.query('UPDATE coursetable SET CourseIsActive=? WHERE CourseID=?', [stat, req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        }
        else
            console.log("error");
    })
    //res.redirect('/activities/'+id);
})

//database connection
app.listen('3000', () => {
    console.log('Server started on port 3000 -> http://localhost:3000');
    connection.connect(function (err) {
        if (err) throw err;
        console.log('Database connected');
    })
});
