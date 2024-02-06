export interface IErrorInResponse {
  code: null | string;
  message: string;
}

export interface IResponse<T> {
  result: boolean;
  payload: T;
  error?: IErrorInResponse;
}
