export interface ISuccessResponse<T> {
  code: number;
  message: string;
  data: {
    attributes: T;
  };
}
