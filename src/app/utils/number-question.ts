import { QuestionBase } from './question-base';

export class NumberQuestion extends QuestionBase<string> {
  override controlType = 'numberbox';
}