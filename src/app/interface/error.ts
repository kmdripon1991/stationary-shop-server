export type TErrorSources = {
  path: string | number;
  message: string;
}[];

export type TGenericErrorResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  errorSources: TErrorSources;
};
