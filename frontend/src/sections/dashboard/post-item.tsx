import type { CardProps } from '@mui/material/Card';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { fDateTime } from 'src/utils/format-time';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

export type PostItemProps = {
  serial_number: string;
  machine: string;
  machine_img: string;
  lot_number: string;
  product: string;
  batch_size: number;
  start_product: string;
  finish_product: string;
  gramCount: number;
  pcsCount: number;
  last_connect: string | null;
  group_image: string
};

export function PostItem({ sx, post, ...other }: CardProps & { post: PostItemProps; }) {
  const navigate = useNavigate();

  const handleOpenDetail = (_post: PostItemProps) => () => {
    if (_post.lot_number) {
      navigate('/Details', {
        state: _post
      });
    } else {
      Swal.fire({
        icon: "question",
        title: `เครื่อง ${_post.machine}`,
        text: "ไม่พบข้อมูลการผลิต, ยังไม่มีข้อมูลการผลิตในวันนี้!",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: '+ เพิ่มข้อมูล'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/production/form');
        }
      });
    }
  };

  const renderMachineImg = (
    <Box
      component="img"
      alt={post.machine}
      src={post.machine_img ? post.machine_img : "/assets/images/machine/default.png"}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderMachineGroupImg = (
    <Avatar
      alt={post.machine}
      src={post.group_image}
      sx={{
        left: 24,
        zIndex: 9,
        bottom: -24,
        position: 'absolute',
      }}
    />
  );

  const renderDetail = (
    <>
      <Typography
        variant="body1"
        component="div"
        sx={{
          color: 'darkcyan',
        }}
      >
        {`เลขที่ผลิต ${post.lot_number ? post.lot_number : "XXXXXX"}`}
      </Typography>
      <Typography
        variant="body1"
        component="div"
        sx={{
          color: 'darkcyan',
          // color: 'grey',
        }}
      >
        {`ชื่อยา ${post.product ? post.product : "XXXXXX"}`}
      </Typography>
      <Typography
        variant="body2"
        component="div"
        sx={{
          color: 'grey',
        }}
      >
        {`ขนาดการผลิต ${post.batch_size ? post.batch_size.toLocaleString() : "XXXXXX"}`}
      </Typography>
      <Typography
        variant="body2"
        component="div"
        sx={{
          mb: 1,
          // color: 'darkcyan',
          color: 'grey',
        }}
      >
        {`เริ่มการผลิต ${post.start_product ? fDateTime(post.start_product) : "XXXXXX"}`}
        <br />
        {`จบการผลิต ${post.finish_product ? fDateTime(post.finish_product) : "XXXXXX"}`}
      </Typography>
    </>
  );

  const renderTitle = (
    // <Link
    //   color="inherit"
    //   variant="subtitle2"
    //   underline="hover"
    //   href="/Details"
    //   sx={{
    //     fontSize: "16px",
    //     height: 44,
    //     overflow: 'hidden',
    //     WebkitLineClamp: 2,
    //     display: '-webkit-box',
    //     WebkitBoxOrient: 'vertical',
    //     cursor: 'pointer',
    //   }}
    //   onClick={() => console.log(post.machine)}
    // >
    // </Link>
    // <LinkRouter to='/Details' >{post.machine}</LinkRouter>
    <Typography
      variant="body1"
      component="div"
      onClick={handleOpenDetail(post)}
      sx={{
        color: 'cornflowerblue',
        textDecoration: 'underline',
        fontWeight: '500',
        cursor: 'pointer',
      }}
    >
      {post.machine}
    </Typography>
  );

  const renderDate = (
    <Typography
      variant="caption"
      component="div"
      sx={{
        mb: 1,
        color: 'text.disabled',
      }}
    >
      {post.last_connect ? fDateTime(post.last_connect) : "XXXXXX"}
    </Typography>
  );

  const renderInfo = (
    <Box
      gap={1.5}
      display="flex"
      flexWrap="wrap"
      justifyContent="flex-end"
      sx={{
        mt: 3,
        color: 'text.disabled',
      }}
    >
      {[
        { number: post.gramCount, unit: 'Gram', color: 'primary.main', icon: 'skill-icons:unity-light' },
        { number: post.pcsCount, unit: 'Pcs', color: 'secondary.main', icon: 'material-symbols:scale' },
        // { number: post.totalShares, unit: 'Total', color: 'error.main', icon: 'solar:share-bold' },
      ].map((info, _index) => (
        <Box
          key={_index}
          display="flex"
        >
          {/* <Iconify width={16} icon={info.icon} sx={{ mr: 0.5 }} /> */}
          <Typography variant="body1" sx={{ mr: 0.5, color: info.color, fontWeight: '500' }} alignItems='center'>
            {info.unit}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: '500' }}>{info.number.toLocaleString()}</Typography>
        </Box>
      ))}
    </Box>
  );

  const renderShape = (
    <SvgColor
      width={88}
      height={36}
      src="/assets/icons/shape-avatar.svg"
      sx={{
        left: 0,
        zIndex: 9,
        bottom: -16,
        position: 'absolute',
        color: 'background.paper',
      }}
    />
  );

  return (
    <Card sx={sx} {...other}>
      <Box
        sx={(theme) => ({
          position: 'relative',
          pt: 'calc(100% * 3 / 4)',
        })}
      >
        {renderShape}
        {renderMachineGroupImg}
        {renderMachineImg}
      </Box>

      <Box
        sx={(theme) => ({
          p: theme.spacing(6, 3, 3, 3),
        })}
      >
        {renderDetail}
        {renderTitle}
        {renderDate}
        {renderInfo}
      </Box>
    </Card>
  );
}
