import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { createPost, getCurrentUser, uploadPostImage } from '../services/api';

function getTags(colors, isDark) {
  return [
    { key: 'general', label: 'General', color: colors.grey, bg: colors.greyCard },
    { key: 'progress', label: 'Progress', color: colors.blue, bg: colors.blueLight },
    { key: 'questions', label: 'Question', color: isDark ? '#A78BFA' : '#7C3AED', bg: isDark ? '#2D1B69' : '#EDE9FE' },
    { key: 'challenges', label: 'Challenge', color: isDark ? '#34D399' : '#059669', bg: isDark ? '#064E3B' : '#D1FAE5' },
  ];
}

export default function ComposeScreen() {
  const { colors, isDark } = useTheme();
  const tags = getTags(colors, isDark);

  // If navigated here from a challenge page, these params arrive pre-filled —
  // letting someone post their attempt directly without manually picking the tag
  const { challengeId, challengeName } = useLocalSearchParams();

  const [text, setText] = useState('');
  // Default to the "challenges" tag automatically when arriving from a challenge page
  const [selectedTag, setSelectedTag] = useState(challengeId ? 'challenges' : null);
  const [posting, setPosting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const data = await getCurrentUser();
      setUser(data);
    }
    fetchUser();
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : '??';

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  }

  const canPost = text.trim().length > 0;

  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New post</Text>
        <TouchableOpacity
          style={[styles.postButton, (!canPost || posting) && styles.postButtonDisabled]}
          disabled={!canPost || posting}
          onPress={async () => {
            try {
              setPosting(true);
              let imageUrl = null;
              if (selectedImage) {
                setUploadingImage(true);
                const uploaded = await uploadPostImage(selectedImage);
                imageUrl = uploaded.image_url;
                setUploadingImage(false);
              }
              await createPost(
                text.trim(),
                selectedTag || 'general',
                challengeId ? parseInt(challengeId) : null,
                imageUrl
              );
              router.back();
            } catch (err) {
              console.log('Post failed:', err.message);
              setPosting(false);
              setUploadingImage(false);
            }
          }}
        >
          <Text style={[styles.postButtonText, (!canPost || posting) && styles.postButtonTextDisabled]}>
            {uploadingImage ? 'Uploading...' : posting ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* Challenge banner — only shows when posting from a challenge page */}
        {challengeId && (
          <View style={styles.challengeBanner}>
            <Feather name="zap" size={14} color={colors.blue} />
            <Text style={styles.challengeBannerText}>
              Posting to <Text style={styles.challengeBannerName}>{challengeName}</Text>
            </Text>
          </View>
        )}

        {/* User avatar and text input */}
        <View style={styles.inputRow}>
          {user?.profile_picture ? (
            <Image source={{ uri: user.profile_picture }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}
          <TextInput
            style={styles.textInput}
            placeholder={challengeId
              ? "Share how it went — your attempt, your numbers, anything..."
              : "Share your progress, ask a question, or start a challenge..."}
            placeholderTextColor={colors.greyLight}
            multiline
            autoFocus
            value={text}
            onChangeText={setText}
            maxLength={500}
          />
        </View>

        {/* Character count */}
        <Text style={styles.charCount}>{text.length}/500</Text>

        {/* Photo picker */}
        {selectedImage ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Feather name="x" size={16} color={'#FFFFFF'} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.photoPlaceholder} onPress={handlePickImage}>
            <Feather name="camera" size={24} color={colors.greyLight} />
            <Text style={styles.photoPlaceholderText}>Add a photo</Text>
            <Text style={styles.photoPlaceholderSub}>Tap to choose from library</Text>
          </TouchableOpacity>
        )}

        {/* Tag selector — hidden when posting from a challenge, since it's locked to "challenges" */}
        {!challengeId && (
          <>
            <Text style={styles.tagLabel}>Tag your post</Text>
            <View style={styles.tags}>
              {tags.map(tag => (
                <TouchableOpacity
                  key={tag.key}
                  style={[
                    styles.tag,
                    { backgroundColor: tag.bg },
                    selectedTag === tag.key && styles.tagSelected,
                    selectedTag === tag.key && { borderColor: tag.color },
                  ]}
                  onPress={() => setSelectedTag(tag.key)}
                >
                  {selectedTag === tag.key && (
                    <Feather name="check" size={12} color={tag.color} />
                  )}
                  <Text style={[styles.tagText, { color: tag.color }]}>
                    {tag.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Guidelines */}
        <View style={styles.guidelines}>
          <Feather name="info" size={14} color={colors.greyLight} />
          <Text style={styles.guidelinesText}>
            Be respectful and supportive. This is a community built on encouragement.
          </Text>
        </View>

      </ScrollView>

    </View>
  );
}

function makeStyles(colors) { return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.greyBorder,
  },

  cancelButton: {
    paddingVertical: 8,
  },

  cancelText: {
    fontSize: 16,
    color: colors.grey,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.black,
  },

  postButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 100,
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  postButtonDisabled: {
    backgroundColor: colors.greyBorder,
    shadowOpacity: 0,
    elevation: 0,
  },

  postButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  postButtonTextDisabled: {
    color: colors.grey,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },

  challengeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.blueLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },

  challengeBannerText: {
    fontSize: 13,
    color: colors.blue,
    fontWeight: '400',
  },

  challengeBannerName: {
    fontWeight: '700',
  },

  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top',
  },

  charCount: {
    fontSize: 12,
    color: colors.greyLight,
    textAlign: 'right',
    marginBottom: 24,
  },

  photoPlaceholder: {
    height: 120,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.greyBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    backgroundColor: colors.greyCard,
  },

  photoPlaceholderText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.grey,
  },

  photoPlaceholderSub: {
    fontSize: 12,
    color: colors.greyLight,
  },

  imagePreviewContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },

  imagePreview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
  },

  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tagLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 12,
  },

  tags: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },

  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },

  tagSelected: {
    borderWidth: 1.5,
  },

  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },

  guidelines: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    backgroundColor: colors.greyCard,
    padding: 16,
    borderRadius: 12,
  },

  guidelinesText: {
    fontSize: 13,
    color: colors.grey,
    lineHeight: 20,
    flex: 1,
    fontWeight: '300',
  },
}); }