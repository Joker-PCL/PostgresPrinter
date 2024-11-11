import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { SvgColor } from 'src/components/svg-color';
// import Pagination from '@mui/material/Pagination';

import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'

// import { _posts } from 'src/_mock_home';
import { DashboardContent } from 'src/layouts/dashboard';

import { PostItem } from '../post-item';
import { PostSort } from '../post-sort';
import { PostSearch } from '../post-search';

import type { PostItemProps } from '../post-item';
import { emptyRows, applyFilter, getComparator } from '../utils';

import { Loading } from '../../../components/loading/loading';

import { DashboardApi } from '../../../api/api'

// ----------------------------------------------------------------------

export function DashboardView() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('latest');
  const [filterName, setFilterName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getData = await DashboardApi(); // Wait for the promise to resolve
        setIsLoading(false);
        setData(getData);
        console.log(getData);
      } catch (error) {
        if (error.status === 401 || error.status === 403) {
          navigate('/sign-in');
        }
        else {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด...",
            text: "ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้!",
            showConfirmButton: false,
          });
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData(); // Call the async function to fetch the data

  }, [navigate]);

  const dataFiltered: PostItemProps[] = applyFilter({
    inputData: data,
    filterName,
  });

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  return (
    <>
      <Loading isShowing={isLoading} />
      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Typography variant="h4" flexGrow={1}>
            Dashboard
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={
              <SvgColor
                src="/assets/icons/iconify/add.svg"
                width="20px" height="20px"
              />
            }
          >
            เพิ่มรายการเครื่องจักร
          </Button>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
          <PostSearch
            posts={data}
            onSearch={(event: React.SyntheticEvent, value: string) => {
              setFilterName(value);
            }}
          />
          <PostSort
            sortBy={sortBy}
            onSort={handleSort}
            options={[
              { value: 'latest', label: 'Latest' },
              { value: 'popular', label: 'Popular' },
              { value: 'oldest', label: 'Oldest' },
            ]}
          />
        </Box>

        <Grid container spacing={3}>
          {
            !isLoading ? (filterName ? dataFiltered : data).map((post, index) => {
              const _post = <Grid key={post.serial_number} xs={12} sm={6} md={4} xl={3}>
                <PostItem post={post} />
              </Grid>
              return _post;
            }) : ""
          }
        </Grid>

        {/* <Pagination count={_posts.length / 10} color="primary" sx={{ mt: 8, mx: 'auto' }} /> */}
      </DashboardContent>
    </>
  );
}
