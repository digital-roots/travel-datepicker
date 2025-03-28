export interface UpdateMonthYearArgs {
  instance: number,
  month: number,
  year: number,
}

export enum CountType {
  DAY = 'day',
  NIGHT = 'night',
}

export interface PublicMethods {
  open: () => void,
}
