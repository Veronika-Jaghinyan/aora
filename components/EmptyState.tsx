import { View, Text, Image } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { images } from '@/constants';
import CustomButton from './CustomButton';

const EmptyState = ({ title, subtitle, noButton }: any) => {
  return (
    <View className='justify-center items-center px-4'>
      <Image
        source={images.empty}
        resizeMode='contain'
        className='w-[270px] h-[215px]'
      />
      <Text className='text-xl text-center font-psemibold text-white mt-2'>
        {title}
      </Text>
      <Text className='text-gray-100 text-sm font-pmedium'>{subtitle}</Text>
      {noButton ? null : (
        <CustomButton
          title='Create video'
          handlePress={() => router.push('/create')}
          containerStyles='w-full my-5'
        />
      )}
    </View>
  );
};

export default EmptyState;
