import {
  View,
  Text,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { createUser, getCurrentUser } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import { images } from '@/constants';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';

const SignUp = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const submit = async () => {
    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
    setIsLoading(true);
    try {
      const res = await createUser(form.email, form.password, form.username);
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);
      router.replace('/home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
            <Image
              source={images.logo}
              resizeMode='contain'
              className='w-[115px] h-[35px]'
            />
            <Text className='text-2xl text-semibold text-white mt-10 font-psemibold'>
              Log in to Aora
            </Text>
            <FormField
              title='Username'
              value={form.username}
              handleChangeText={(e: any) => setForm({ ...form, username: e })}
              otherStyles='mt-7'
              keyboardType='email-address'
            />
            <FormField
              title='Email'
              value={form.email}
              handleChangeText={(e: any) => setForm({ ...form, email: e })}
              otherStyles='mt-10'
            />
            <FormField
              title='Password'
              value={form.password}
              handleChangeText={(e: any) => setForm({ ...form, password: e })}
              otherStyles='mt-7'
            />
            <CustomButton
              title='Sign Up'
              handlePress={submit}
              containerStyles='w-full mt-7'
              isLoading={isLoading}
            />
            <View className='justify-center pt-5 flex-row gap-2'>
              <Text className='text-lg text-gray-100 font-pregular'>
                Already have an account?
              </Text>
              <Link
                href='/sign-in'
                className='text-secondary text-lg font-psemibold'
              >
                Sign in
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
