import { View, Text, FlatList } from 'react-native';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import useAppwrite from '@/lib/useAppwrite';
import { searchPosts } from '@/lib/appwrite';
import VideoCard from '@/components/VideoCard';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  const onRefresh = async () => {
    await refetch();
  };

  useEffect(() => {
    onRefresh();
  }, [query]);

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={posts}
        keyExtractor={(item: any) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} refetch={refetch} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View className='my-6 px-4'>
            <Text className='font-pmedium text-sm text-gray-100'>
              Search Results
            </Text>
            <Text className='text-2xl font-psemibold text-white'>{query}</Text>

            <View className='mt-6 mb-8'>
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title='No Videos Found'
            subtitle='No videos found for this search query'
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
