/**
 * This is based on the dynamic form guide on angular.io site
 * https://angular.io/guide/dynamic-form
 */
export class QuestionBase<T> {
  value: T|undefined;
  key: string;
  label: string;
  required: boolean;
  controlType: string;
  type: string;
  options: any[]; // Any for checkboxes

  constructor(options: {
      value?: T;
      key?: string;
      label?: string;
      required?: boolean;
      controlType?: string;
      type?: string;
      options?: any[];
    } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
  }
}