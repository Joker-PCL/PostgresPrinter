import {
  _id,
  _timestamp,
  _serial_number,
  _operator1,
  _operator2,
  _set_pcs,
  _pcs,
  _isVerified,
} from './_mock';

export const _data_pcs = [...Array(24)].map((_, index) => ({
  id: _id(index),
  timestamp: _timestamp(index),
  serial_number: _serial_number(index),
  operator1: _operator1(index),
  operator2: _operator2(index),
  setPcs: _set_pcs(index),
  pcs: _pcs(index),
  isVerified: _isVerified(index),
}));