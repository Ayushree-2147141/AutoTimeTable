var programapp = angular.module('programapp', [])
programapp.controller('programctrl', function ($scope, $http) {
    $http.get('http://localhost:3000/getprogram')
        .success(function (response) {
            // console.log(response)
            $scope.programs = response;
            // console.log($scope.programs);
            // console.log(response);
        })

    $scope.setStatus = function (id, stat) {
        //alert("clicked")    
        $http.post("http://localhost:3000/setStatus/" + id + '/' + stat)
            .success(function (data) {
                $http.get('http://localhost:3000/getprogram')
                    .success(function (response) {
                        $scope.programs = response;
                    })
            })
    }

    // form data posting
    $scope.addProgram = function () {
        var form = {
            programName: $scope.programName,
            programIsActive: $scope.active
        }
        // alert(form);
        // console.log(form);
        $http({
            withCredentials: false,
            method: 'POST',
            url: 'http://localhost:3000/addProgram',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(form)
        }).success()
    }
})

// course app
var courseapp = angular.module('courseapp', [])
courseapp.controller('coursectrl', function ($scope, $http) {
    $http.get('http://localhost:3000/getcourse')
        .success(function (response) {
            // console.log(response)
            $scope.courses = response;
            // console.log($scope.courses);
            // console.log(response);
        })


    $scope.setStatus = function (id, stat) {
        //alert("clicked")    
        $http.post("http://localhost:3000/setCourseStatus/" + id + '/' + stat)
            .success(function (data) {
                $http.get('http://localhost:3000/getcourse')
                    .success(function (response) {
                        $scope.courses = response;
                    })
            })
    }

    $scope.addCourse = function (courseName, active, selectedRoomTypeId) {
        console.log(selectedRoomTypeId);
        console.log(courseName);
        console.log($scope.active);
        // var form = {
        //     CourseName: $scope.CourseName,
        //     // RoomTypeId: selectedRoomTypeId.RoomTypeId,
        //     CourseIsActive: $scope.active
        // }
        console.log(form);
        // $http({
        //     withCredentials: false,
        //     method: 'POST',
        //     url: 'http://localhost:3000/addCourse',
        //     headers: { 'Content-Type': 'application/json' },
        //     data: JSON.stringify(form)
        // }).success()

        // $http.post('http://localhost:3000/addCourse/'+form['RoomTypeId'])
        // .success(function(response) {
        //     $scope.courses = response;
        // })
    }

    $http.get('http://localhost:3000/getroomtype')
        .success(function (response) {
            $scope.rooms = response;
        })

})

var timetableapp = angular.module('timetableapp', [])
timetableapp.controller('timetablectrl', function ($scope, $http) {

    $scope.generateTimeTable = function (sectionId) {
        console.log(sectionId);
        // var sectionId = sectionId.ProgramSemesterSectionId;
        $http.get('http://localhost:3000/gettimetable/' + sectionId)
            .success(function (response) {
                $scope.timeslots = [];
                $scope.slots = [];
                $scope.time = []
                $scope.MCA1A = {};


                for (var i = 0; i < response.length; i++) {
                    var course = response[i];
                    if (!$scope.MCA1A[course.DayName]) {
                        $scope.MCA1A[course.DayName] = [];
                    }

                    var Stime = response[i]['SlotStartTime'];
                    var Etime = response[i]['SlotEndTime'];

                    if (!$scope.time.includes(Stime)) {
                        $scope.time.push(Stime);

                    }

                    if (!$scope.time.includes(Etime)) {

                        $scope.time.push(Etime);

                    }

                    $scope.MCA1A[course.DayName][course.TTTimeslotId - 1] = course;
                }
                $scope.time.sort()
                console.log($scope.time);

                var currentSlot = $scope.time[0];
                console.log('Current time : ', currentSlot);

                var endTime = $scope.time[$scope.time.length - 2];
                console.log('End time : ', endTime);

                while (currentSlot < endTime) {
                    var parts = currentSlot.split(":");
                    var hour = parseInt(parts[0]);
                    var nextHour = hour + 1;
                    var nextHourString = nextHour < 10 ? '0' + nextHour : nextHour.toString();
                    var nextSlot = nextHourString + ':' + parts[1];
                    $scope.timeslots.push(currentSlot + '-' + nextSlot);
                    currentSlot = nextSlot;
                }

                console.log($scope.timeslots);
                console.log($scope.MCA1A);


                for (var i = 0; i < $scope.timeslots.length; i++) {
                    $scope.slots.push((i + 1).toString());
                }

                console.log($scope.slots);

                $scope.getCourseName = function (courses, slot) {
                    var parts = $scope.timeslots[0].split(":");
                    var diff = parseInt(parts[0]) - 7;
                    // console.log(diff);
                    var course = courses[slot - 1 + diff];
                    // console.log(courses);
                    if (course) {
                        return course.CourseName;
                    } else {
                        return '';
                    }
                };

            })
    }


    $scope.generateAllTimeTable = async function () {
        // alert('clicked');
    
        try {
            const response = await $http.get('http://localhost:3000/getalltimetable');
            $scope.slots = ['1', '2', '3', '4', '5', '6', '7', '8'];
            $scope.timeslots = ['7:00-8:00', '8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00'];
            $scope.MCA1A = {};
            console.log(response);
            for (var i = 0; i < response.length; i++) {
                var course = response[i];
    
                if (!$scope.MCA1A[course.DayName]) {
                    $scope.MCA1A[course.DayName] = [];
                }
    
                $scope.MCA1A[course.DayName][course.TTTimeslotId - 1] = course;
            }
    
            $scope.getCourseName = function (courses, day, slot) {
                var course = courses[slot - 1];
                if (course) {
                    return course.CourseName;
                } else {
                    return '';
                }
            };
            console.log($scope.MCA1A);
    
        } catch (error) {
            console.error(error);
        }
    }



    $scope.generateMCATimeTable = function () {
        // alert('clicked')
        $http.get('http://localhost:3000/gettimetableMCA1A')

            .success(function (response) {
                $scope.slots = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
                $scope.timeslots = ['7:00-8:00', '8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00'];
                $scope.MCA1A = {};

                for (var i = 0; i < response.length; i++) {
                    var course = response[i];

                    if (!$scope.MCA1A[course.DayName]) {
                        $scope.MCA1A[course.DayName] = [];
                    }

                    $scope.MCA1A[course.DayName][course.TTTimeslotId - 1] = course;
                }

                $scope.getCourseName = function (courses, day, slot) {
                    var course = courses[slot - 1];
                    if (course) {
                        return course.CourseName;
                    } else {
                        return '';
                    }
                };


            })
    }

    $scope.getSectionTimetable = function (getSectionTimetable) {
        $http.get('http://localhost:3000/getsection/' + getSectionTimetable)
            .success(function (response) {
                // $scope.sectionTimetable = response;
                $scope.slots = ['1', '2', '3', '4', '5', '6', '7', '8'];
                $scope.timeslots = ['7:00-8:00', '8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00'];
                $scope.MCA1A = {};
                console.log(response);
                for (var i = 0; i < response.length; i++) {
                    var course = response[i];

                    if (!$scope.MCA1A[course.DayName]) {
                        $scope.MCA1A[course.DayName] = [];
                    }

                    $scope.MCA1A[course.DayName][course.TTTimeslotId - 1] = course;
                }

                $scope.getCourseName = function (courses, day, slot) {
                    var course = courses[slot - 1];
                    if (course) {
                        return course.CourseName;
                    } else {
                        return '';
                    }
                };
                console.log($scope.MCA1A);


                // console.log(response);
            })
    }
    $scope.displayAllTable = function () {
        $http.get('http://localhost:3000/getsection')
            .success(function (response) {

                $scope.sections = response;
                // console.log(response);
            })

    }

    $http.get('http://localhost:3000/gettimetable')
        .success(function (response) {
            $scope.fulltimetable = response;
            // console.log(response);
        })

    $http.get('http://localhost:3000/getsection')
        .success(function (response) {
            $scope.sections = response;
            // console.log(response);
        })


    $http.get('http://localhost:3000/gettimetableMCA1B')
        .success(function (response) {
            // console.log(response)
            // $scope.MCA1B = response;
        })

})

var teacherapp = angular.module('teacherapp', [])
teacherapp.controller('teacherctrl', function ($scope, $http) {
    $http.get('http://localhost:3000/getteachers')
        .success(function (response) {
            $scope.teachers = response;
        })

    // form data posting
    $scope.addTeacher = function () {
        var form = {
            teacherName: $scope.teacherName,
            teacherShortName: $scope.teacherShortName,
            programIsActive: $scope.active
        }
        console.log(form);
        $http({
            withCredentials: false,
            method: 'POST',
            url: 'http://localhost:3000/addTeacher',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(form)
        }).success()
    }

    $scope.setTeacherStatus = function (id, stat) {
        // alert("clicked")    
        // console.log(id+'-------'+stat);
        $http.post("http://localhost:3000/setTeacherStatus/" + id + '/' + stat)
            .success(function (data) {
                $http.get('http://localhost:3000/getteachers')
                    .success(function (response) {
                        $scope.teachers = response;
                    })
            })
    }
    

})


var programsemapp = angular.module('programsemapp', [])
programsemapp.controller('programsemctrl', function ($scope, $http) {
    $http.get('http://localhost:3000/getprogramsem')
        .success(function (response) {
            $scope.programsemesters = response;
        })

    $scope.setStatus = function (id, stat) {
        //alert("clicked")    
        $http.post("http://localhost:3000/setProgramSemStatus/" + id + '/' + stat)
            .success(function (data) {
                $http.get('http://localhost:3000/getprogramsem')
                    .success(function (response) {
                        $scope.programsemesters = response;
                    })
            })
    }

    $http.get('http://localhost:3000/getactiveprograms')
        .success(function (response) {
            $scope.programs = response;
        })

    $http.get('http://localhost:3000/getsemesters')
        .success(function (response) {
            $scope.semesters = response;
        })


})

var programsemsectionapp = angular.module('programsemsectionapp', []);
programsemsectionapp.controller('programsemsectionctrl', function ($scope, $http) {
    $http.get('http://localhost:3000/getprogramsemsection')
        .success(function (response) {
            $scope.programsemsections = response;
        })

    $scope.setStatus = function (id, stat) {
        // alert("clicked") 
        // console.log(id);   
        // console.log(stat);
        $http.post("http://localhost:3000/setProgramSemSectionStatus/" + id + '/' + stat)
            .success(function (data) {
                $http.get('http://localhost:3000/getprogramsemsection')
                    .success(function (response) {
                        $scope.programsemsections = response;
                    })
            })
    }

    $http.get('http://localhost:3000/getsections')
        .success(function (response) {
            // console.log(response);
            $scope.sections = response;
            // console.log($scope.sections);
        })

    $http.get('http://localhost:3000/getactiveprograms')
        .success(function (response) {
            $scope.programs = response;
        })

    $http.get('http://localhost:3000/getsemesters')
        .success(function (response) {
            $scope.semesters = response;
        })

    $http.get('http://localhost:3000/getrooms')
        .success(function (response) {
            $scope.rooms = response;
        })

    $scope.getActiveProgramSemesters = function (programString) {
        // console.log(programId);
        var parts = programString.split(':')
        var programName = parts[1];
        var programId = parts[0];

        $http.get('http://localhost:3000/getactiveprogramsemesters/' + programId)
            .then(function (response) {
                $scope.activeprogramsemesters = response.data;
                console.log($scope.activeprogramsemesters);
            });
    }


})

var programsemcourseapp = angular.module('programsemcourseapp', []);
programsemcourseapp.controller('programsemcoursectrl', function ($scope, $http) {
    $http.get('http://localhost:3000/getprogramsemcourses')
        .success(function (response) {
            $scope.programsemcourses = response;
        })

    $http.get('http://localhost:3000/getactiveprograms')
        .success(function (response) {
            $scope.programs = response;
        })

    $http.get('http://localhost:3000/getcourses')
        .success(function (response) {
            $scope.courses = response;
        })

        $scope.getActiveProgramSemesters = function (programString) {
            // console.log(programId);
            var parts = programString.split(':')
            var programName = parts[1];
            var programId = parts[0];
    
            $http.get('http://localhost:3000/getactiveprogramsemesters/' + programId)
                .then(function (response) {
                    $scope.activeprogramsemesters = response.data;
                    console.log($scope.activeprogramsemesters);
                });
        }


})

var sectioncourseteacherapp = angular.module('sectioncourseteacherapp', [])
sectioncourseteacherapp.controller('sectioncourseteacherctrl', function ($scope, $http) {
    $http.get('http://localhost:3000/getactiveprograms')
        .success(function (response) {
            $scope.programs = response;
            // console.log(response);
        })

    $http.get('http://localhost:3000/getsections')
        .success(function (response) {
            $scope.sections = response;
        })

    $http.get('http://localhost:3000/getcourse')
        .success(function (response) {
            $scope.allocatedcourses = response;
            console.log($scope.allocatedcourses);
        })

    $http.get('http://localhost:3000/getactiveteachers')
        .success(function (response) {
            $scope.activeteachers = response;
        })

    $http.get('http://localhost:3000/getassignedteachers')
        .success(function (response) {
            $scope.teachers = response;
        })
    
    

    $scope.setTeacherStatus = function (id, stat) {
        // alert("clicked")    
        console.log(id+'-------'+stat);
        $http.post("http://localhost:3000/setTeacherStatus/" + id + '/' + stat)
            .success(function (data) {
                $http.get('http://localhost:3000/getassignedteachers')
                    .success(function (response) {
                        $scope.teachers = response;
                    })
            })
    }
    var progId ;
    $scope.getActiveProgramSemesters = function (programString) {
        // console.log(programId);
        var parts = programString.split(':')
        var programName = parts[1];
        var programId = parts[0];
        progId = programId;

        $http.get('http://localhost:3000/getactiveprogramsemesters/' + programId)
            .then(function (response) {
                $scope.activeprogramsemesters = response.data;
                console.log($scope.activeprogramsemesters);
            });

        $http.get('http://localhost:3000/getactiveprogramsections/'+programId)
        .then(function (response) {
            $scope.activeprogramsections = response.data;
            console.log($scope.activeprogramsections);
        })
    }

    $scope.getActiveProgramSemsterCourse = function (semesterString) {
        // console.log(semesterString);
        // console.log(progId);
        var parts = semesterString.split(':')
        var semId = parts[0]
        var semName = parts[1]

        $http.get('http://localhost:3000/getprogramsemcourse/'+progId+'/'+semId)
        .then(function(response) {
            $scope.courses = response.data;
        })

    }

    var roomTypeId ;
    var roomName ;

    $scope.updateRoomNumber = function(coursestring){
        // alert(coursestring);
        // console.log(coursestring);
        var part = coursestring.split(':')
        var courseId = part[0];
        var courseName = part[1];

        // console.log(courseId+'   '+courseName);
        $http.get('http://localhost:3000/getroomnumber/'+courseId)
        .then(function(response) {
            console.log(response.data[0]);
            roomTypeId = response.data[0].RoomTypeId;
            roomName = response.data[0].RoomTypeName;
            // roomId = $scope.roomId;
            $scope.roomData = response.data[0];
            
        })
    }

    $scope.submitProgSemCourse = function(selectedSemester,selectedSection,selectedCourse,selectedTeacher)
    {

        console.log(selectedSection);
        var selectedSemesterV = selectedSemester.split(':');
        var programSemesterId = selectedSemesterV[1]
        // console.log(programSemesterId);

        var programSemesterSectionV = selectedSection.split(':'); 
        var programSemesterSectionId = programSemesterSectionV[1];

        var selectedCourseV = selectedCourse.split(':');
        var programsemestercourseId = selectedCourseV[2];

        var selectedTeacherV = selectedTeacher.split(':');
        var LecturerId = selectedTeacherV[0];

        form = {
            programSemesterId: programSemesterId,
            programSemesterSectionId : programSemesterSectionId,
            programsemestercourseId : programsemestercourseId,
            LecturerId : LecturerId,
            roomTypeId : roomTypeId
        }
        // console.log(selectedProgram,selectedSemester,selectedSection,selectedCourse,roomId,selectedTeacher);
        console.log(form);
        // console.log(roomNumber);

        $http({
            withCredentials: false,
            method: 'POST',
            url: 'http://localhost:3000/addprogramsemseccourseteacher',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(form)
        }).then(function(response) {
            // Reload the page after the data is submitted
            $window.location.reload();
        }).catch(function(error) {
            console.log(error);
        });
    }
    
})

var programtimeslotapp = angular.module('programtimeslotapp', [])
programtimeslotapp.controller('programtimeslotctrl', function ($scope, $http) {
    $http.get('http://localhost:3000/getactiveprograms')
        .success(function (response) {
            $scope.programs = response
        })

    $http.get('http://localhost:3000/getdays')
        .success(function (response) {
            $scope.days = response
        })

    $http.get('http://localhost:3000/gettimeslots')
        .success(function (response) {
            $scope.timeslots = response
        })

    $http.get('http://localhost:3000/getjoinedtimeslots')
        .success(function (response) {
            $scope.joinedtimeslots = response;
        })

    $scope.setProgramTimeSlotStatus = function (id, stat) {
        //alert("clicked")    
        $http.post("http://localhost:3000/setProgramTimeSlotStatus/" + id + '/' + stat)
            .success(function (data) {
                $http.get('http://localhost:3000/getjoinedtimeslots')
                    .success(function (response) {
                        $scope.joinedtimeslots = response;
                    })
            })
    }



})


var teachertimeslotapp = angular.module('teachertimeslotapp', [])
teachertimeslotapp.controller('teachertimeslotctrl', function ($scope, $http) {
    $http.get('http://localhost:3000/getjoinedteachertimeslots')
        .success(function (response) {
            $scope.joinedteachertimeslots = response;
        })

    $scope.setTeacherTimeSlotStatus = function (id, stat) {
        //alert("clicked")    
        $http.post("http://localhost:3000/setTeacherTimeSlotStatus/" + id + '/' + stat)
            .success(function (data) {
                $http.get('http://localhost:3000/getjoinedteachertimeslots')
                    .success(function (response) {
                        $scope.joinedteachertimeslots = response;
                    })
            })
    }



    $scope.setTeacherTimeSlotAvailabilityStatus = function (id, stat) {
        //alert("clicked")    
        $http.post("http://localhost:3000/setTeacherTimeSlotAvailabilityStatus/" + id + '/' + stat)
            .success(function (data) {
                $http.get('http://localhost:3000/getjoinedtimeslots')
                    .success(function (response) {
                        $scope.joinedteachertimeslots = response;
                    })
            })
    }

})

var roomapp = angular.module('roomapp', [])
roomapp.controller('roomctrl', function ($scope, $http) {
    $http.get('http://localhost:3000/getrooms')
        .success(function (response) {
            $scope.rooms = response;
        })

    $scope.setRoomActiveStatus = function (id, stat) {
        //alert("clicked")    
        $http.post("http://localhost:3000/setRoomActiveStatus/" + id + '/' + stat)
            .success(function (data) {
                $http.get('http://localhost:3000/getrooms')
                    .success(function (response) {
                        $scope.rooms = response;
                    })
            })
    }
})

var labapp = angular.module('labapp', [])
labapp.controller('labctrl', function ($scope, $http) {
    $http.get('http://localhost:3000/getlabs')
        .success(function (response) {
            $scope.labs = response;
        })

    $scope.setLabActiveStatus = function (id, stat) {
        //alert("clicked")    
        $http.post("http://localhost:3000/setLabActiveStatus/" + id + '/' + stat)
            .success(function (data) {
                $http.get('http://localhost:3000/getlabs')
                    .success(function (response) {
                        $scope.labs = response;
                    })
            })
    }
})

var labtimeslotapp = angular.module('labtimeslotapp', [])
labtimeslotapp.controller('labtimeslotctrl', function ($scope, $http) {
    $http.get('http://localhost:3000/getjoinedlabtimeslots')
        .success(function (response) {
            $scope.joinedlabtimeslots = response;
        })

    $scope.setLabTimeSlotStatus = function (id, stat) {
        //alert("clicked")    
        $http.post("http://localhost:3000/setLabTimeSlotStatus/" + id + '/' + stat)
            .success(function (data) {
                $http.get('http://localhost:3000/getjoinedlabtimeslots')
                    .success(function (response) {
                        $scope.joinedlabtimeslots = response;
                    })
            })
    }


    $scope.setLabTimeSlotAvailabilityStatus = function (id, stat) {
        //alert("clicked")    
        $http.post("http://localhost:3000/setLabTimeSlotAvailabilityStatus/" + id + '/' + stat)
            .success(function (data) {
                $http.get('http://localhost:3000/getjoinedlabtimeslots')
                    .success(function (response) {
                        $scope.joinedlabtimeslots = response;
                    })
            })
    }
})