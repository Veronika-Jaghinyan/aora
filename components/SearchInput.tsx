import { View, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { router, usePathname } from 'expo-router';
import { icons } from '@/constants';

const SearchInput = ({ value, initialQuery, bookmark }: any) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);

  return (
    <View className='space-x-4 flex-row border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center'>
      <TextInput
        className='flex-1 mt-0.5 text-white font-pregular text-base'
        value={value || query}
        placeholder={
          bookmark ? 'Search your saved videos' : 'Search vor a video topic'
        }
        placeholderTextColor='#CDCDE0'
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              'Missing query',
              `Please input something to search results across ${bookmark ? 'your saved videos' : 'database'}`
            );
          }
          if (pathname.startsWith('/search')) {
            router.setParams({ query });
          } else {
            router.push(`/search${bookmark ? '-bookmark' : ''}/${query}`);
          }
        }}
      >
        <Image source={icons.search} resizeMode='contain' className='w-5 h-5' />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
