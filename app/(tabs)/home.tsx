import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import { images } from '@/constants';
import useAppwrite from '@/lib/useAppwrite';
import { getAllPosts, getLatestPosts } from '@/lib/appwrite';
import VideoCard from '@/components/VideoCard';
import SearchInput from '@/components/SearchInput';
import Trending from '@/components/Trending';
import EmptyState from '@/components/EmptyState';

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={posts}
        keyExtractor={(item: any) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} refetch={refetch} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View className='my-6 px-4 space-y-6'>
            <View className='justify-between items-start flex-row mb-6'>
              <View>
                <Text className='font-pmedium text-sm text-gray-100'>
                  Welcome Back
                </Text>
                <Text className='text-2xl font-psemibold text-white'>
                  {user?.username || ''}
                </Text>
              </View>
              <View className='mt-1.5'>
                <Image
                  className='w-9 h-10'
                  resizeMode='contain'
                  source={images.logoSmall}
                />
              </View>
            </View>
            <SearchInput />
            <View className='w-full flex-1 pt-5 pb-8'>
              <Text className='text-gray-100 text-lg font-pregular mb-3'>
                Latest videos
              </Text>
              <Trending posts={latestPosts} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title='No Videos Found'
            subtitle='Be the first one to upload a video'
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
