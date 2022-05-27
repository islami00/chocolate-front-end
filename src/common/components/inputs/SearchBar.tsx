import { createStyles, Select } from '@mantine/core';
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
export function SearchBar(): JSX.Element {
  const { classes } = useStyles();
  return (
    <Select
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
