import { readXlsx, getGradeAndClass } from "../util.js";
import { getReaderList } from "../apis.js";
// import { batchCreateCards } from "./studentHandler.js";

const excelPath = "/Users/rae/code/microwave-library/src/data/students.xlsx";
const classSheets = readXlsx(excelPath); // 每一个sheet是一个班级

// todo 每个学生要做的处理
const studentsWithoutCard = [];

const studentsByClass = {};
const allCards = (await getReaderList())?.data?.list ?? [];
if (allCards.length === 0) {
  console.log("获取卡信息失败");
} else {
  console.log(`共${allCards.length}张卡`);
}
classSheets.forEach((_class) => {
  const { name, data } = _class;
  studentsByClass[name] = [];
  data.forEach((row) => {
    if (row.length > 0) {
      const { grade, classNum } = getGradeAndClass(name);
      if (typeof row[0] === "number" && !!row[2]) {
        studentsByClass[name].push({
          id: row[1],
          name: row[2].replace(" ", ""), // 处理名字中间的空格
          grade,
          classNum,
        });
      }
      if (typeof row[8] === "number" && !!row[10]) {
        studentsByClass[name].push({
          id: row[9],
          name: row[10].replace(" ", ""),
          grade,
          classNum,
        });
      }
    }
  });
});

let studentCount = 0;
Object.entries(studentsByClass).map(([classname, students]) => {
  // console.log(`${classname}共有${students.length}名学生`);
  studentCount += students.length;
  students.map((student) => {
    const card = allCards.find((card) => card.name === student.name);
    // 补卡
    if (!card) {
      studentsWithoutCard.push(student);
    }
  });
});
console.log("学生总数", studentCount);
console.log(`${studentsWithoutCard.length}个学生没有卡`, studentsWithoutCard);

// batchCreateCards(studentsWithoutCard);
