import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { icons } from '@/constants';

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
}: any) => {
  const [showPassowrd, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-gray-100 font-pmidium'>{title}</Text>
      <View className='flex-row border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center'>
        <TextInput
          className='flex-1 text-white font-psemibold text-base'
          value={value}
          placeholder={placeholder}
          placeholderTextColor='#7b7b8b'
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassowrd}
        />
        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassowrd)}>
            <Image
              className='w-6 h-6'
              resizeMode='contain'
              source={showPassowrd ? icons.eye : icons.eyeHide}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
