import type { Theme, SxProps } from '@mui/material/styles';

import TextField from '@mui/material/TextField';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import type { ProductListsProps } from './view/production';

// ----------------------------------------------------------------------
type PostSearchProps = {
  posts: ProductListsProps[];
  onSearch: (event: React.SyntheticEvent, value: string) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  product: string | '';
  error: boolean;
  sx?: SxProps<Theme>;
};

export function ProductSearch({ posts, onSearch, onChange, product, error, sx }: PostSearchProps) {
  return (
    <Autocomplete
      autoHighlight
      fullWidth
      freeSolo
      onInputChange={onSearch}
      value={product ?? ''}  // Add this line
      popupIcon={null}
      slotProps={{
        paper: {
          sx: {
            [`& .${autocompleteClasses.option}`]: {
              typography: 'body2',
            },
            ...sx,
          },
        },
      }}
      options={posts}
      getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      renderInput={(params) => (
        <TextField
          {...params}
          name="product"
          label="ชื่อยา"
          placeholder='Product name...'
          value={product ?? ''}
          error={error}
          fullWidth
          onChange={onChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />
      )}
    />
  );
}
