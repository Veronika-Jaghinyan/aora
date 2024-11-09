import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { Video, ResizeMode, Audio } from 'expo-av';
import { icons } from '@/constants';
import { bookmarkPost } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
    ...props
  },
  refetch,
}: any) => {
  const [play, setPlay] = useState(false);
  const { user } = useGlobalContext();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!play) return;
    const func = async () => {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    };
    func();
  }, [play]);

  useEffect(() => {
    if (
      props.bookmark_users.find(
        (bookmarkUser: any) => bookmarkUser.$id === user.$id
      )
    ) {
      setBookmarked(true);
    } else {
      setBookmarked(false);
    }
  }, [user, props]);

  const handleBookmark = async () => {
    await bookmarkPost(props.$id, bookmarked, user);
    refetch();
  };

  return (
    <View className='flex-col items-center px-4 mb-14'>
      <View className='flex-row gap-3 items-start'>
        <View className='justify-center items-center flex-row flex-1'>
          <View className='w-[45px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5'>
            <Image
              source={{ uri: avatar }}
              className='w-full h-full rounded-lg'
              resizeMode='cover'
            />
          </View>
          <View className='justify-center flex-1 ml-3 gap-y-1'>
            <Text
              numberOfLines={1}
              className='text-white font-psemibold text-sm'
            >
              {title}
            </Text>
            <Text className='text-xs text-gray-100 font-pregular'>
              {username}
            </Text>
          </View>
        </View>
        <View className='pt-2'>
          <TouchableOpacity onPress={handleBookmark} className='px-2'>
            <Image
              source={bookmarked ? icons.bookmarked : icons.bookmark}
              className='w-5 h-5'
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
      </View>
      {play ? (
        <Video
          source={{ uri: video }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status: any) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
          style={{
            width: '100%',
            height: 240,
            borderRadius: 35,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            marginTop: 15,
          }}
          isMuted={true}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'
        >
          <Image
            source={{ uri: thumbnail }}
            className='w-full h-full rounded-xl mt-3'
            resizeMode='cover'
          />
          <Image
            source={icons.play}
            resizeMode='contain'
            className='w-12 h-12 absolute'
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
