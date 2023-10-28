import { autoGetCardNum, createCardForStudent } from "../apis.js";
import { concurrencyController } from "../util.js";

export async function createCard(student) {
  const { name, grade, classNum, id } = student;
  const cardNum = (await autoGetCardNum())?.data;
  const params = {
    // 必填项
    name,
    card_num: cardNum,
    borrow_rule_id: 59, // 借阅规则："学生 普通卡"
    gender: 3, // 性别：其它
    expire_time: "9999-01-01 00:00:00", // 永不过期
    grade,

    // 有数据的选填项
    class: classNum,
    number: id, //学号
    school: "上海弘梅二小陇西校区",

    // 无数据的选填项
    avatar: "",
    phone: "",
    address_detail: "",
    birthday: "",
    deposit: "",
    identity: "",
    ethnicity: "",
    contact_name: "",
    contact_phone: "",
    note: "",
    client: 2,
  };

  return createCardForStudent(params);
}

export async function batchCreateCards(students) {
  const tasks = students.map((student) => () => createCard(student));
  concurrencyController(tasks, 1).then((list) => {
    list.map(({ code, message }) => {
      if (code === 20000) console.log(`阅读卡创建成功`);
      else {
        console.log("message", message);
      }
    });
  });
}
