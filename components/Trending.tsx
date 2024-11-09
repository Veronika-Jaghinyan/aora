import { useEffect, useState } from 'react';
import {
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Video, ResizeMode, Audio } from 'expo-av';
import { icons } from '@/constants';

const zoomIn = {
  0: {
    opacity: 1,
    scale: 0.9,
  },
  1: {
    opacity: 1,
    scale: 1.1,
  },
};

const zoomOut = {
  0: {
    opacity: 1,
    scale: 1.1,
  },
  1: {
    opacity: 1,
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }: any) => {
  const [play, setPlay] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

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

  return (
    <Animatable.View
      className='mr-5'
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status: any) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
          style={{
            width: 208,
            height: 288,
            borderRadius: 35,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            marginTop: 15,
          }}
          className='w-52 h-72 rounded-[35px] mt-3 bg-white/10'
          isMuted={true}
        />
      ) : (
        <TouchableOpacity
          className='relative justify-center items-center'
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            resizeMode='cover'
            className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40'
          />
          <Image
            source={icons.play}
            className='w-12 h-12 absolute'
            resizeMode='contain'
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }: any) => {
  const [activeItem, setActiveItem] = useState(posts[1]);

  const viewableItemsChanges = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item: any) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanges}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 70, y: 0 }}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Trending;
