import dayjs from "dayjs";

const Answer = function (responce, user, score, date) {
  this.responce = responce;
  this.user = user;
  this.score = score;
  this.date = date;
};

const Question = function (text, user, date) {
  this.text = text;
  this.user = user;
  this.date = date;
  this.answers = [];
  this.add = (answer) => {
    this.answers.push(answer);
  };
  this.find = (user) => {
    return this.answers.filter(a => a.user === user);
  };
  this.afterDate = (date) => {
    const ans = [...this.answers];
    return ans.filter(a => a.date.isAfter(date) || a.date.isSame(date))
  }

  this.listByDate = () => {
    const ans = [...this.answers];
    // return ans.sort((a, b) => b.date.valueOf() - a.date.valueOf());
    return ans.sort((a, b) => {
      if (a.date.isAfter(b.date))
        return -1;
      else if (a.date.isBefore(b.date))
        return 1;
      else
        return 0;
    });
  }

  this.listByScore = () => {
    const ans = [...this.answers];
    ans.sort((a, b) => b.score - a.score)
    return ans;
  }

};

let a1 = new Answer("Of Course!", "Emad47", 6, dayjs("2024-03-26"));
let q1 = new Question("How can I ?", "Reza", dayjs("2024-03-20"));

q1.add(a1);
q1.add(new Answer("Maybe", "Ali", -2, dayjs()));
q1.add(new Answer("IDK", "Emad47", 0, dayjs("2024-03-25")));
q1.add(new Answer("Yes", "Fulvio", 9, dayjs("2024-03-23")));
q1.add(new Answer("No", "Ali", 4, dayjs("2024-03-24")));

// console.log(q1);
// console.log(q1.find("Emad47"));
// console.log(q1.afterDate("2024-03-24"));
// console.log(q1.listByDate());
console.log(q1.listByScore());




