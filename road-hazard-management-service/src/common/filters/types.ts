export interface IResponseError {
  statusCode: number;
  method: string;
  status: boolean;
  message: string;
  code: string;
  timestamp: string;
  path: string;
}
