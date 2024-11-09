import { View, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { icons } from '@/constants';
import useAppwrite from '@/lib/useAppwrite';
import { getUserPosts, signOut } from '@/lib/appwrite';
import VideoCard from '@/components/VideoCard';
import { useGlobalContext } from '@/context/GlobalProvider';
import InfoBox from '@/components/InfoBox';
import EmptyState from '@/components/EmptyState';

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace('/sign-in');
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={posts}
        keyExtractor={(item: any) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} refetch={refetch} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View className='w-full mt-6 mb-12 justify-center items-center px-4'>
            <TouchableOpacity
              onPress={handleLogout}
              className='w-full items-end mb-10'
            >
              <Image
                source={icons.logout}
                resizeMode='contain'
                className='w-6 h-6'
              />
            </TouchableOpacity>
            <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center'>
              <Image
                source={{ uri: user?.avatar }}
                resizeMode='contain'
                className='w-[90%] h-[90%] rounded-lg'
              />
            </View>
            <InfoBox
              title={user?.username}
              titleStyles='text-lg'
              containerStyles='mt-5'
            />
            <View className='mt-5 flex-row'>
              <InfoBox
                title={posts?.length || 0}
                subtitle='Posts'
                titleStyles='text-xl'
                containerStyles='mr-10'
              />
              <InfoBox
                title='1.2k'
                subtitle='Followers'
                titleStyles='text-xl'
              />
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

export default Profile;
