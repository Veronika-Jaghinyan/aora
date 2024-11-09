import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode, Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { createPost } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import FormField from '@/components/FormField';
import { icons } from '@/constants';
import CustomButton from '@/components/CustomButton';

const Create = () => {
  const { user } = useGlobalContext();
  const [form, setForm] = useState<any>({
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
  });
  const [uploading, setUploading] = useState(false);
  const [permissionResponse, requestPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const openPicker = async (selectType: any) => {
    let givedPermission: any = null;

    if (permissionResponse?.granted !== true) {
      givedPermission = await requestPermission();
    }

    if (
      givedPermission?.granted === true ||
      permissionResponse?.granted === true
    ) {
      const result = true
        ? await ImagePicker.launchImageLibraryAsync({
            quality: 1,
            aspect: [4, 3],
            mediaTypes:
              selectType === 'image'
                ? ImagePicker.MediaTypeOptions.Images
                : ImagePicker.MediaTypeOptions.Videos,
          })
        : await DocumentPicker.getDocumentAsync({
            type:
              selectType === 'image'
                ? ['image/png', 'image/jpg']
                : ['video/mp4', 'video/gif'],
          });
      if (!result.canceled) {
        if (selectType === 'image') {
          setForm({ ...form, thumbnail: result.assets[0] });
        }
        if (selectType === 'video') {
          setForm({ ...form, video: result.assets[0] });
        }
      }
    }
  };

  const submit = async () => {
    if (!form.prompt || !form.title || !form.video || !form.thumbnail) {
      return Alert.alert('Please fill in all the fields');
    }
    setUploading(true);
    try {
      await createPost({ ...form, userId: user.$id });
      Alert.alert('Success', 'Post uploaded sucessfully');
      router.push('/home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: '',
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className='px-4 my-6' showsVerticalScrollIndicator={false}>
          <Text className='text-white text-2xl font-psemibold'>
            Upload Video
          </Text>
          <FormField
            title='Video Title'
            value={form.title}
            placeholder='Give your video a catchy title...'
            handleChangeText={(e: any) => setForm({ ...form, title: e })}
            otherStyles='mt-10'
          />
          <View className='mt-7 space-y-2'>
            <Text className='text-base text-gray-100 font-pmedium'>
              Upload Video
            </Text>
            <TouchableOpacity onPress={() => openPicker('video')}>
              {form.video ? (
                <Video
                  source={{ uri: form.video.uri }}
                  resizeMode={ResizeMode.COVER}
                  style={{
                    width: '100%',
                    height: 256,
                    borderRadius: 16,
                  }}
                  isMuted={true}
                />
              ) : (
                <View className='w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center'>
                  <View className='w-14 h-14 border boder-dashed border-secondary-100 justify-center items-center'>
                    <Image
                      source={icons.upload}
                      resizeMode='contain'
                      className='w-1/2 h-1/2'
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View className='mt-7 space-y-2'>
            <Text className='text-base text-gray-100 font-pmedium'>
              Thumbnail image
            </Text>
            <TouchableOpacity onPress={() => openPicker('image')}>
              {form.thumbnail ? (
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  resizeMode='cover'
                  className='w-full h-64 rounded-2xl'
                />
              ) : (
                <View className='w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2'>
                  <Image
                    source={icons.upload}
                    resizeMode='contain'
                    className='w-5 h-5 mr-2'
                  />
                  <Text className='text-sm text-gray-100 font-pmedium'>
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <FormField
            title='AI prompt'
            value={form.prompt}
            placeholder='The prompt to used to create this video'
            handleChangeText={(e: any) => setForm({ ...form, prompt: e })}
            otherStyles='mt-7'
          />
          <CustomButton
            title='Submit & Publish'
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={uploading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Create;
