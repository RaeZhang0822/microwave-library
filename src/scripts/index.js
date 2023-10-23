import { readXlsx } from "../util.js";

const excelPath = "/Users/rae/Desktop/test.xlsx";
const classSheets = readXlsx(excelPath); // 每一个sheet是一个班级

// todo 每个学生要做的处理
function handleStudent(student) {
  // console.log(student);
}

const studentsByClass = {};
classSheets.forEach((_class) => {
  const { name, data } = _class;
  studentsByClass[name] = [];
  data.forEach((row) => {
    if (row.length > 0) {
      if (typeof row[0] === "number" && !!row[2]) {
        studentsByClass[name].push({ id: row[1], name: row[2] });
      }
      if (typeof row[8] === "number" && !!row[10]) {
        studentsByClass[name].push({ id: row[9], name: row[10] });
      }
    }
  });
});

Object.entries(studentsByClass).map(([classname, students]) => {
  console.log(`${classname}共有${students.length}名学生`);
  students.map((student) => {
    handleStudent(student);
  });
});
