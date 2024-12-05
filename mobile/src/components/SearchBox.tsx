import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';

interface IProps {
  placeholder?: string;
  isNotShown?: boolean;
  doSearch: (search: string) => void;
}

export const SearchBox = ({ placeholder, isNotShown, doSearch }: IProps) => {
  const [search, setSearch] = useState('');

  const prepareSearch = (query: any) => {
    const q = '' +query;
    setSearch(q);
    doSearch(q);
  };

  const cancelSearch = () => {
    setSearch('')
    doSearch('')
  }
  return (
    <>
      {!isNotShown ? (
        <Searchbar
        placeholder={placeholder ? placeholder : "Search..."}
          onChangeText={prepareSearch}
          // onIconPress={cancelSearch}
          value={search}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flex: 9,
  },
  searchContainer: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
