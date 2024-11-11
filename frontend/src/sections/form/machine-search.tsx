import type { Theme, SxProps } from '@mui/material/styles';

import TextField from '@mui/material/TextField';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import type { MachineListsProps } from './view/production';

// ----------------------------------------------------------------------
type PostSearchProps = {
  posts: MachineListsProps[];
  onSearch: (event: React.SyntheticEvent, value: string) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  machine: string | '';
  error: boolean;
  sx?: SxProps<Theme>;
};

export function MachineSearch({ posts, onSearch, onChange, machine, error, sx }: PostSearchProps) {
  return (
    <Autocomplete
      autoHighlight
      fullWidth
      freeSolo
      onInputChange={onSearch}
      value={machine ?? ''}  // Add this line
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
      getOptionLabel={(option) => typeof option === 'string' ? option : option.machine}
      isOptionEqualToValue={(option, value) => option.machine === value.machine}
      renderInput={(params) => (
        <TextField
          {...params}
          name="machine"
          label="เครื่องจักร"
          placeholder='Machine...'
          value={machine ?? ''}
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
