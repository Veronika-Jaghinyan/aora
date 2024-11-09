import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppwrite from '@/lib/useAppwrite';
import { getSavedPosts } from '@/lib/appwrite';
import VideoCard from '@/components/VideoCard';
import { useGlobalContext } from '@/context/GlobalProvider';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';

const Bookmark = () => {
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getSavedPosts(user.$id));

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={posts}
        keyExtractor={(item: any) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} refetch={refetch} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View className='my-6 px-4'>
            <Text className='font-semibold text-2xl text-white'>
              Saved Videos
            </Text>

            <View className='mt-6 mb-8'>
              <SearchInput bookmark />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title='No Saved Videos'
            subtitle="You don't have saved videos yet"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Bookmark;
