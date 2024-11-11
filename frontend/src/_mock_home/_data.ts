import {
  _serial_number,
  _machine,
  _lastConnect,
  _price,
  _company,
  _boolean,
  _fullName,
  _taskNames,
} from './_mock';

// ----------------------------------------------------------------------

export const _posts = [...Array(10)].map((_, index) => ({
  serial_number: _serial_number(index),
  machine: _machine(index),
  last_connect: _lastConnect(index),
  machine_img: `/assets/images/cover/cover-${index + 1}.webp`,
  gramCount: 12856,
  pcsCount: 7977,
  group_image: ""
  // group: {
  //   name: _fullName(index),
  //   img: `/assets/images/avatar/avatar-${index + 1}.webp`,
  // },
}));
