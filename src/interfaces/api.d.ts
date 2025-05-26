declare type HttpResponse<D> = {
    statusCode: number;
    message: string;
    content: D;
    dateTime: string;
    messageConstants?: any;
  };