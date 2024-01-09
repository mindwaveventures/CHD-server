import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

// https://github.com/jsonmaur/xss-clean/blob/master/src/xss.js
export function xssCleanObject(data: object) {
  let _data = JSON.stringify(data);
  _data = xss(_data).trim();
  return JSON.parse(_data);
}

export default (req: Request, res: Response, next: NextFunction) => {
  if (req.body) req.body = xssCleanObject(req.body);
  if (req.query) req.query = xssCleanObject(req.query);
  if (req.params) req.params = xssCleanObject(req.params);
  next();
};