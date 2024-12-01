let students = []; // Array to store all student data
let lectures = []; // Array to store all lecture data
//adds student
function addStudent(id,name,surname){
    if(!isValidID(id)){
        alert("Invalid id") // Alert if the ID format is incorrect
        return;
    }
    if (students.find(student => student.id === id)) {
        console.log("Student is already registered."); // Prevent duplicate student IDs
        return;
    }
    students.push({id,name,surname,courses:[]})
    console.log(`${name} added sucessfuly`)
}
// Updates the information of an existing student
function updateStudent(studentid,newId,newName,newSurname){
    let student = students.find(st => st.id ===studentid);
    if(!student){
        console.log("Student not found.")
        return;}
    if(newId && newId !== studentid){
        
        if(!isValidID(newId)){
            console.log("New ID has incorect form.")
            return;
        }else if(students.find(st =>st.id === newId)){
            console.log("Another student has this id.")
            return;
        }
        //changes the id's of student in lectures
        lectures.forEach(lecture => {
            let studentInLecture = lecture.students.find(st => st.id === studentid);
            if (studentInLecture) {
                studentInLecture.id = newId;
            }
        });
        student.id = newId; //changes the id of the student
    }
    //changes the name and surname of the student in the lectures.
    if (newName || newSurname) {
        lectures.forEach(lecture => {
            let studentInLecture = lecture.students.find(st => st.id === (newId || studentid));
            if (studentInLecture) {
                if (newName) studentInLecture.name = newName;
                if (newSurname) studentInLecture.surname = newSurname;
            }
            
        });
        if (newName) student.name = newName;
        if (newSurname) student.surname = newSurname;
    }
    console.log("Öğrenci bilgileri başarıyla güncellendi:");
    console.table({
        ID: student.id,
        Name: student.name,
        Surname: student.surname
    });
    //adds consol outpu to html
    const output = document.getElementById("consoleOutput");
    output.textContent = JSON.stringify({
        ID: student.id,
        Name: student.name,
        Surname: student.surname
    }, null, 2);

    updateStudentDropdown();
}
//adds lecture
function addLectures(lectureCode,LectureName,teacher){
    if(isValidLecture(lectureCode)){
        alert("Lecture alredy exist")
        return;
    }
    // Add the lecture to the lectures array
    lectures.push({id:lectureCode,name:LectureName,teacher:teacher,students:[]});
    console.log("Lecture succesfuly added.")
    console.table(lectures);
    updateLectureDropdowns(); // Refresh dropdown menus
}
function updateLecture(lectureCode,newLectureCode,newName,newTeacher){
    let lecture = lectures.find(l=>l.id === lectureCode);
    if(!lecture){
        console.log("Lecture not found");
        return;
    }
    
    if(newLectureCode && newLectureCode !== lectureCode){
        lecture.id = newLectureCode;
        students.forEach(student =>{
            student.courses.forEach(course =>{
                if(course.id === lectureCode){
                    course.id = newLectureCode;
                }
            })
        })
    }
}
// Updates the information of an existing lecture
function updateLecture(currentLectureId, newLectureId, newName, newTeacher) {
    // Dersin mevcut ID'sini kullanarak dersi bul
    let lecture = lectures.find(l => l.id === currentLectureId);
    if (!lecture) {
        console.log("Lecture not found.");
        return;
    }

      // Update lecture ID if a new one is provided
    if (newLectureId && newLectureId !== currentLectureId) {
        if (lectures.find(l => l.id === newLectureId)) {
            console.log("Another lecture already exists with this ID.");
            return;
        }

        // Update the lecture ID in students' course records
        students.forEach(student => {
            student.courses.forEach(course => {
                if (course.courseID === currentLectureId) {
                    course.courseID = newLectureId;
                }
            });
        });

        lecture.id = newLectureId; 
    }

    // Update the name of the lecture if new name exist
    if (newName) {
        lecture.name = newName;
    }

    // Update the name of the teacher
    if (newTeacher) {
        lecture.teacher = newTeacher;
    }

    console.log("Lecture updated successfully:");
    console.table({
        ID: lecture.id,
        Name: lecture.name,
        Teacher: lecture.teacher
    });

    updateLectureDropdowns(); // updates the dropdpwn menues
}

//shows the stundents of the given lecture
function showRegisteredStudents(courseID){
    let course = lectures.find(c=> c.id ===courseID);
    if(!course){
        console.log("Lecture does not exist");
        return;
    }else{
        console.table(course.students.map(s=>({
            ID:s.ID,
            Name : s.name,
            Midter:s.midterm,
            Final:s.final,
            Grade:s.grade

        })))
    }
}
// Displays all students registered in a specific lecture
function showStudentLecture(studentID){
    let student = students.find(st => st.id === studentID);
    if(!student){
        console.log("student not found")
        return;
    }
    console.log(`${student.name} ${student.surname} is enroled thise courses.`)
    console.table(student.courses.map(c=>({
        ID : c.courseID,
        Midterm:c.midterm,
        Final:c.final,
        Grade:c.grade
    })))
}
//registers student to the given course
function addStudentToLecture(lectureCode,studentId,midterm,final){
    if(!isValidScore(midterm)){
        alert("invalid midterm")
        return;
    }
    if(!isValidScore(final)){
        alert("invalid final")
        return;
    }
    let lecture = lectures.find(l => l.id === lectureCode)
    let student = students.find(st => st.id === studentId)
    if(!student){
        console.log("Student not find")
        return;
    }
    if(!lecture.students.find(st=> st.id === studentId)){
        let grade = calculateGrade(midterm,final);
        lecture.students.push({id:studentId,name:student.name,midterm,final,grade});
        student.courses.push({courseID:lectureCode,midterm,final,grade});
        console.log(`${student.name} is addet to the ${lecture.name}`);
    }else {
        console.log(`${student.name} already registered to ${lecture.name}.`);
    }
}
// Helper function to validate lecture ID
function isValidLecture(lectureCode){
    let lecture = lectures.find(l => l.id === lectureCode)
    return lecture;

}
// Filters and displays students who passed a specific lecture
function passedStudents(lectureId){
    let lecture = lectures.find(l => l.id === lectureId);
    if (!lecture) {
        console.log("Lecture not exist.");
        return;
    }
    // filters the passed students
    let passedStd = lecture.students.filter(student => student.grade !== "F");
    // creates the table
    if (passedStd.length > 0) {
        console.table(
            passedStd.map(s => ({
                ID: s.id,
                Name: s.name,
                Surname: s.surname,
                Grade: s.grade
            }))
            
        );
    } else {
        console.log("No students passed this lecture.");
    }
    return passedStd;
}
// Filters and displays students who failed a specific lecture
function failedStudents(lectureId){
    let lecture = lectures.find(l => l.id === lectureId);
    if (!lecture) {
        console.log("Lecture not exist.");
        return;
    }
    // filters the failed students
    let failedStd = lecture.students.filter(student => student.grade === "F"); // Filter students with a grade of "F"
    // creates the table
    if (failedStd.length > 0) {
        console.table(
            failedStd.map(s => ({
                ID: s.id,
                Name: s.name,
                Surname: s.surname,
                Grade: s.grade
            }))
        );
    } else {
        console.log("No students failed this lecture.");
    }
    return failedStd;
}
// Calculates a student's grade based on midterm and final scores
function calculateGrade(midterm,final){
    let average = midterm * 0.4 + final * 0.6;
    if (average >= 90) return "A";
    if (average >= 80) return "B";
    if (average >= 70) return "C";
    if (average >= 60) return "D";
    return "F";
}
// Calculates the average grade of all students in a specific lecture
function calculateClassAverage(lectureId) {
    // Find the lecture by its id 
    const lecture = lectures.find(l => l.id === lectureId);
    if (!lecture) {
        console.log("Lecture not exist.");
        return null;
    }

    // Check if there are any students registered for the lecture
    if (lecture.students.length === 0) {
        console.log("No students are registered for this lecture.");
        return null;
    }

    // Sum up all students scores 
    let totalScores = 0;
    lecture.students.forEach(student => {
        const midterm = parseFloat(student.midterm) || 0; // // Use 0 if no midterm score
        const final = parseFloat(student.final) || 0;     // Use 0 if no final score
        totalScores += midterm * 0.4 + final * 0.6;      // Calculate weighted average
    });

    // Calculate average of the class
    const average = (totalScores / lecture.students.length).toFixed(2); 

    // return average
    console.log(`Class average for lecture ${lecture.name}: ${average}`);
    return average;
}

function calculateGPA(studentId) {
    // find student
    const student = students.find(st => st.id === studentId);
    if (!student) {
        console.log("Student not found.");
        return null;
    }

    // Map of letter grades to grade points
    const gradePoints = {
        "A": 4.0,
        "B": 3.0,
        "C": 2.0,
        "D": 1.0,
        "F": 0.0
    };

   // Get the list of courses the student has taken
    const courses = student.courses;
    if (courses.length === 0) {
        console.log("Student has not taken any courses.");
        return 0;
    }

     // Calculate the total grade points and total credits
    let totalPoints = 0;
    let totalCredits = courses.length; // Assume each course has 1 credit

    courses.forEach(course => {
        const grade = course.grade;
        const point = gradePoints[grade];
        if (point !== undefined) {
            totalPoints += point; // Add grade points for valid grades
        } else {
            console.log(`Invalid grade "${grade}" found.`);
        }
    });

    // Calculate GPA 
    const gpa = (totalPoints / totalCredits).toFixed(2); 
    return gpa;
}
// Validates if a student ID is a 9-digit number
function isValidID(id){
    id = Number(id);
    return !isNaN(id) && id >= 100000000 && id <= 999999999;
}
// Validates if a score is between 0 and 100
function isValidScore(score){
    score = Number(score);
    console.log(score);
    return  score >= 0 && score <= 100;
    
}
// Handles the addition of a new lecture
function handleAddLecture(){
    const lectureCode = document.getElementById("lectureCode").value;
    const lectureName = document.getElementById("lectureName").value;
    const teacherName = document.getElementById("teacherName").value;

    // Validate that no fields are empty
    if (!lectureCode || !lectureName || !teacherName) {
        alert("All fields must be filled!");
        return;
    }
    addLectures(lectureCode,lectureName,teacherName);
    updateLectureDropdowns();

    // Clear the form fields after submission
    document.getElementById("lectureCode").value = "";
    document.getElementById("lectureName").value = "";
    document.getElementById("teacherName").value = "";
}
// Handles the addition of a new student
function handleAddStudent() {
    const studentId = document.getElementById("studentId").value;
    const studentName = document.getElementById("studentName").value;
    const studentSurname = document.getElementById("studentSurname").value;

     // Validate that no fields are empty
    if (!studentId || !studentName || !studentSurname) {
        alert("All fields must be filled!");
        return;
    }

    addStudent(studentId, studentName, studentSurname);
    updateStudentDropdown();

    // Clear the form fields after submission
    document.getElementById("studentId").value = "";
    document.getElementById("studentName").value = "";
    document.getElementById("studentSurname").value = "";
}
// Handles registering a student to a lecture
function handleRegisterStudent(){
    const lectureCode = document.getElementById("selectLecture").value;
    const studentId = document.getElementById("selectStudent").value;
    const midterm = document.getElementById("midtermScore").value;
    const final = document.getElementById("finalScore").value;
    addStudentToLecture(lectureCode,studentId,midterm,final);
}
// Handles displaying all students registered in a lecture
function handleViewLectureStudents() {
    const lectureCode = document.getElementById("viewLecture").value;
    const lecture = lectures.find(l => l.id === lectureCode);
    const tbody = document.getElementById("studentTable").querySelector("tbody");
    tbody.innerHTML ="";
    if(lecture){
        // Populate the table with registered students
        lecture.students.forEach(student => {
            const row = tbody.insertRow();
            row.insertCell(0).textContent = student.id;
            row.insertCell(1).textContent = student.name;
            row.insertCell(2).textContent = student.midterm;
            row.insertCell(3).textContent = student.final;
            row.insertCell(4).textContent = student.grade;
        });

        // Add the total number of students to the summary
        const summary = document.getElementById("summary");
        summary.textContent = `Total Students Enrolled: ${lecture.students.length}`;
    }else {
        console.log("Lecture does not exist.");
        const summary = document.getElementById("summary");
        summary.textContent = "No students found.";
    }
}
// Updates the dropdown menus for lectures
function updateLectureDropdowns(){
    const lectureDropdonws = [
        document.getElementById("selectLecture"),
        document.getElementById("viewLecture"),
        document.getElementById("passOrFail"),
        document.getElementById("classAverageLecture")
    ];
    lectureDropdonws.forEach(dropDown =>{
        dropDown.innerHTML ="";
        lectures.forEach(lecture =>{
            const option = document.createElement("option");
            option.value = lecture.id;
            option.textContent = lecture.name;// Display lecture name
            dropDown.appendChild(option);
        })
    })
}
// Updates the dropdown menu for students
function updateStudentDropdown(){
    const studentDropdown = document.getElementById("selectStudent");
    studentDropdown.innerHTML ="";
    students.forEach(student =>{
        const option = document.createElement("option");
        option.value = student.id;
        option.textContent = student.name; // Display student name
        studentDropdown.appendChild(option);
    })
}
// Handles updating a student's details (ID, name, or surname)
function handleUpdateStudentDetails(){
    const stID = document.getElementById("updateStudentCurrentId").value;
    const newStID = document.getElementById("updateStudentNewId").value;
    const newStName = document.getElementById("updateStudentNewName").value;
    const newStSurname = document.getElementById("updateStudentNewSurname").value;

    updateStudent(stID,newStID,newStName,newStSurname);
}
// Handles displaying students who passed a specific lecture
function handleViewPassedStudents() {
    const lectureCode = document.getElementById("passOrFail").value;
    const passedStd = passedStudents(lectureCode);// Get passed students
    const tbody = document.getElementById("studentTable2").querySelector("tbody");
    tbody.innerHTML ="";

        passedStd.forEach(student => {
        const row = tbody.insertRow(); // Create a new row for each student
        row.insertCell(0).textContent = student.id;
        row.insertCell(1).textContent = student.name;
        row.insertCell(2).textContent = student.grade;
        });

    // Display the total number of passed students
    const summary = document.getElementById("summary");
    summary.textContent = `Total Passed Students: ${passedStd.length}`;
}
// Handles displaying students who failed a specific lecture
function handleViewFailedStudents() {
    const lectureCode = document.getElementById("passOrFail").value;
    const failedStd = failedStudents(lectureCode);// Get failed students
    const tbody = document.getElementById("studentTable2").querySelector("tbody");
    tbody.innerHTML ="";
    
        failedStd.forEach(student => {
        const row = tbody.insertRow(); // Create a new row for each student
        row.insertCell(0).textContent = student.id;
        row.insertCell(1).textContent = student.name;
        row.insertCell(2).textContent = student.grade;
        });

    // Toplam kalan öğrenci sayısını ekleyin
    const summary = document.getElementById("summary");
    summary.textContent = `Total Failed Students: ${failedStd.length}`;
}
// Handles updating lecture details (ID, name, or teacher)
function handleUpdateLecture() {
    const currentId = document.getElementById("currentLectureId").value;
    const newId = document.getElementById("newLectureId").value;
    const newName = document.getElementById("newLectureName").value;
    const newTeacher = document.getElementById("newTeacherName").value;

    updateLecture(currentId, newId, newName, newTeacher);

     // Clear the form fields after updating
    document.getElementById("currentLectureId").value = "";
    document.getElementById("newLectureId").value = "";
    document.getElementById("newLectureName").value = "";
    document.getElementById("newTeacherName").value = "";
}
// Handles calculating and displaying a student's GPA
function handleCalculateGPA() {
    const studentId = document.getElementById("studentIdGPA").value; // Get the student's ID
    const gpa = calculateGPA(studentId);

    const gpaResultElement = document.getElementById("gpaResult"); 
    if (gpa !== null) {
        gpaResultElement.textContent = `Student ${studentId}'s GPA: ${gpa}`;// Display the GPA
    } else {
        gpaResultElement.textContent = "Error: Student not found or no courses available.";
    }
}

document.getElementById("btnCalculateGPA").addEventListener("click", handleCalculateGPA);
// Handles calculating and displaying the class average for a lecture
function handleCalculateClassAverage() {
    const lectureId = document.getElementById("classAverageLecture").value;// Get the lecture ID
    const average = calculateClassAverage(lectureId);

    const resultElement = document.getElementById("classAverageResult"); // Calculate the class average
    if (average !== null) {
        resultElement.textContent = `Class Average: ${average}`;
    } else {
        resultElement.textContent = "Error: No data available for this lecture.";
    }
}

document.getElementById("btnCalculateClassAverage").addEventListener("click", handleCalculateClassAverage);

const btnAddLecture = document.querySelector("#btnAddLecture");
const btnAddStudent = document.querySelector("#btnAddStudent");
const btnUpdateStudent = document.querySelector("#btnUpdateStudent");
const btnRegister = document.querySelector("#btnRegister");
const btnShowStudent = document.querySelector("#btnShowStudent");
const btnShowPassedStudents = document.querySelector("#btnShowPassedStudents");
const btnShowFailedStudents = document.querySelector("#btnShowFailedStudents");
const btnUpdateLecture = document.querySelector("#btnUpdateLecture");

btnAddLecture.addEventListener("click",handleAddLecture);
btnAddStudent.addEventListener("click",handleAddStudent);
btnUpdateStudent.addEventListener("click",handleUpdateStudentDetails);
btnRegister.addEventListener("click",handleRegisterStudent);
btnShowStudent.addEventListener("click",handleViewLectureStudents);
btnShowPassedStudents.addEventListener("click",handleViewPassedStudents);
btnShowFailedStudents.addEventListener("click",handleViewFailedStudents);
btnUpdateLecture.addEventListener("click", handleUpdateLecture);
