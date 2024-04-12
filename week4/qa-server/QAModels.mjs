/* Same of week 03, but without any internal methods */
import dayjs from 'dayjs';

function Answer(id, text, email, date, score = 0) {
  this.id = id;
  this.text = text;
  this.email = email;
  this.score = score;
  this.date = date && dayjs(date);
}

function Question(id, text, email, date) {
  this.id = id;
  this.text = text;
  this.email = email;
  this.date = date && dayjs(date);
}

export { Question, Answer };