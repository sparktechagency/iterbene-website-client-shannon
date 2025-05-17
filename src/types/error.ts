export type TError = {
  status: number;
  data: {
    code: number;
    message: string;
    error: string[];
  };
};
