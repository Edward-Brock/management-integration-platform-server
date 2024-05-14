import { Request } from 'express';

interface RequestMainInfo {
  url: string;
  host: string;
  ip: string | undefined;
  method: string;
  query: any;
  body: any;
}

export const requestUtils = (req: Request): RequestMainInfo => {
  const { query, headers, url, method, body, connection } = req;

  // 获取 IP
  let ip: string | undefined;
  if (headers['X-Real-IP']) {
    ip = headers['X-Real-IP'] as string;
  } else if (headers['X-Forwarded-For']) {
    ip = headers['X-Forwarded-For'] as string;
  } else if (req.ip) {
    ip = req.ip;
  } else if (connection?.remoteAddress) {
    ip = connection.remoteAddress;
  }

  return {
    url,
    host: headers.host || '',
    ip,
    method,
    query,
    body,
  };
};
