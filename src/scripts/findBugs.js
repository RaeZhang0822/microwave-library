import { getReaderList, editCard } from "../apis.js";

//找到疑似重复的卡片
async function findDupNameCards() {
  return new Promise(async function (resolve, reject) {
    const res = [];
    const allCards = (await getReaderList())?.data?.list ?? [];
    allCards.forEach((card, index) => {
      const { name } = card;
      const next = allCards.slice(index + 1).find((x) => x.name === name);
      if (next) {
        res.push([card, next]);
      }
    });
    resolve(res);
  });
}

// 找到所有学校名缺失的图书卡并补充学校
async function addSchoolForCards() {
  const allCards = (await getReaderList())?.data?.list ?? [];
  allCards.forEach((card) => {
    if (!card.school) {
      editCard({ ...card, school: "上海弘梅二小陇西校区" });
    }
  });
}
