import { readXlsx, getGradeAndClass } from "../util.js";
import { getReaderList } from "../apis.js";
import { RULE_IDS } from "../const.js";
import { batchCreateCards, batchFreezeCards } from "./studentHandler.js";

const excelPath = "/Users/rae/code/microwave-library/src/data/students.xlsx";
const classSheets = readXlsx(excelPath); // 每一个sheet是一个班级

// 读取所有卡
const allCards = (await getReaderList())?.data?.list ?? [];
if (allCards.length === 0) {
  console.log("获取卡信息失败");
} else {
  console.log(`共${allCards.length}张卡`);
}

// 读取所有学生
const allStudents = [];
classSheets.forEach((_class) => {
  const { name, data } = _class;
  data.forEach((row) => {
    if (row.length > 0) {
      const { grade, classNum } = getGradeAndClass(name);
      if (typeof row[0] === "number" && !!row[2]) {
        const student = {
          id: row[1],
          name: row[2].replace(" ", ""), // 处理名字中间的空格
          grade,
          classNum,
        };
        allStudents.push(student);
      }
      if (typeof row[8] === "number" && !!row[10]) {
        const student = {
          id: row[9],
          name: row[10].replace(" ", ""),
          grade,
          classNum,
        };
        allStudents.push(student);
      }
    }
  });
});
console.log("学生总数", allStudents.length);

// 补卡
const studentsWithoutCard = [];
allStudents.map((student) => {
  const card = allCards.find((card) => card.name === student.name);
  if (!card) {
    studentsWithoutCard.push(student);
  }
});
if (studentsWithoutCard.length > 0) {
  console.log(`${studentsWithoutCard.length}个学生没有卡`, studentsWithoutCard);
  batchCreateCards(studentsWithoutCard);
}

// 冻结卡
const invalidCards = [];
allCards.map((card) => {
  if (
    !allStudents.find((student) => student.name === card.name) &&
    card.borrow_rule_id === RULE_IDS.NORMAL
  ) {
    invalidCards.push(card);
  }
});
if (invalidCards.length > 0) {
  console.log(`${invalidCards.length}张无效普通学生卡`, invalidCards);
  batchFreezeCards(invalidCards);
}
