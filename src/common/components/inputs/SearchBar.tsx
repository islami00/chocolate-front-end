import { createStyles, Select, SelectProps } from '@mantine/core';
import { forwardRef } from 'react';
import { SearchIcon } from '../icons/SearchIcon';
import data from './projectMock.json';
import type { ItemProps } from './SelectItemComponent';
import { SelectItemComponent } from './SelectItemComponent';
import { filterItems } from './utils';

const useStyles = createStyles((theme) => ({
  search: {
    width: theme.spacing.md,
    '& > path': {
      fill: theme.colors.gray[4],
    },
  },
}));

const SelectItemRef = forwardRef<HTMLDivElement, ItemProps>(SelectItemComponent);
type SearchBarProps = Omit<SelectProps, 'data'> & React.RefAttributes<HTMLInputElement>;
export function SearchBar(props: SearchBarProps = {}): JSX.Element {
  const { classes } = useStyles();
  return (
    <Select
      {...props}
      icon={<SearchIcon className={classes.search} />}
      itemComponent={SelectItemRef}
      placeholder='Search for a project'
      data={data}
      rightSection={<> </>}
      searchable
      nothingFound='Nobody here'
      filter={filterItems}
    />
  );
}
