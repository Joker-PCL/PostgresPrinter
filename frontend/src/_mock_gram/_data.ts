import {
  _id,
  _timestamp,
  _serial_number,
  _operator1,
  _operator2,
  _min_weight,
  _max_weight,
  _weight,
  _result,
} from './_mock';

export const _data_gram = [...Array(24)].map((_, index) => ({
  id: _id(index),
  timestamp: _timestamp(index),
  serial_number: _serial_number(index),
  operator1: _operator1(index),
  operator2: _operator2(index),
  minWeight: _min_weight(index),
  maxWeight: _max_weight(index),
  weight: _weight(index),
  result: _result(index),
}));