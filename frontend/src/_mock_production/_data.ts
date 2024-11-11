import {
  _id,
  _timestamp,
  _lot_number,
  _product_names,
  _machine,
  _start_product,
  _finish_product,
  _notes,
} from './_mock';

// ----------------------------------------------------------------------
export const _data_production = [...Array(24)].map((_, index) => ({
  id: _id(index),
  timestamp: _timestamp(index),
  lot_number: _lot_number(index),
  product_names: _product_names(index),
  machine: _machine(index),
  start_product: _start_product(index),
  finish_product: _finish_product(index),
  notes: _notes(index),
}));
