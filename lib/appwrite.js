import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Storage,
  Query,
} from 'react-native-appwrite';

export const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.jsm.aora',
  projectId: '672bd13c003657b3bbcf',
  databaseId: '672bd2660009a7b845c9',
  userCollectionId: '672bd27e003227595c8b',
  videoCollectionId: '672bd2990030a08a7c73',
  storageId: '672bd3ea000a78e7ff8c',
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc('$createdAt')]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const searchPosts = async (query, userId) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search('title', query), Query.orderDesc('$createdAt')]
    );
    const postsList = userId
      ? posts.documents.filter((post) =>
          post['bookmark_users'].find((user) => user.$id === userId)
        )
      : posts.documents;
    return postsList;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSavedPosts = async (userId) => {
  const posts = await getAllPosts();
  return posts.filter((post) =>
    post['bookmark_users'].find((user) => user.$id === userId)
  );
};

export const signOut = async (userId) => {
  try {
    const session = await account.deleteSession('current');
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === 'video') {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === 'image') {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        'top',
        100
      );
    } else {
      throw new Error('Invalid file type');
    }
    if (!fileUrl) {
      throw new Error('No file URL');
    }
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadFile = async (file, type) => {
  if (!file) return;
  const { mimeType, ...rest } = file;
  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    if (!uploadedFile) {
      throw new Error('FIle is not uploaded');
    }
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const createPost = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video'),
    ]);

    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );
    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};

export const bookmarkPost = async (postId, bookmarked, currentUser) => {
  try {
    const video = await databases.getDocument(
      config.databaseId,
      config.videoCollectionId,
      postId
    );
    let bookmarkedUsers = video['bookmark_users'] || [];
    if (bookmarked) {
      // Remove user from bookmark-users
      bookmarkedUsers = bookmarkedUsers.filter((user) => user.$id !== currentUser.$id);
    } else {
      // Add user to bookmark-users
      bookmarkedUsers.push(currentUser);
    }

    const updatedPost = await databases.updateDocument(
      config.databaseId,
      config.videoCollectionId,
      postId,
      { bookmark_users: bookmarkedUsers }
    );
    return updatedPost;
  } catch (error) {
    throw new Error(error);
  }
};
