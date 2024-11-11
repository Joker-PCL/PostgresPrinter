import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'รายการผลิต',
    path: '/production',
    icon: icon('ic-cart'),
  },
  {
    title: 'ออกจากระบบ',
    path: '/sign-in',
    icon: icon('ic-lock'),
  }
];
