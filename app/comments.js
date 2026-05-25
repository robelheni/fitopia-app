import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../constants/colors';

// Hardcoded comments — comes from backend later
const initialComments = {
  '1': [
    { id: 'c1', name: 'Yonas B.', initials: 'YB', avatarColor: '#DC2626', text: 'Amazing progress! Keep it up!', time: '1h ago' },
    { id: 'c2', name: 'Sara M.', initials: 'SM', avatarColor: '#059669', text: 'Week 3 is when it really starts to click. Great work!', time: '30m ago' },
  ],
  '2': [
    { id: 'c3', name: 'Dawit K.', initials: 'DK', avatarColor: '#7C3AED', text: 'The fasting workouts are seriously underrated.', time: '4h ago' },
  ],
  '3': [
    { id: 'c4', name: 'Abebu T.', initials: 'AT', avatarColor: colors.blue, text: 'I do light workouts on both fasting days. Works well for me.', time: '7h ago' },
    { id: 'c5', name: 'Meron H.', initials: 'MH', avatarColor: '#D4A843', text: 'I only do one. Listen to your body!', time: '6h ago' },
    { id: 'c6', name: 'Sara M.', initials: 'SM', avatarColor: '#059669', text: 'Depends on the type of fast too. Wet vs dry fasting makes a big difference.', time: '5h ago' },
  ],
  '4': [
    { id: 'c7', name: 'Yonas B.', initials: 'YB', avatarColor: '#DC2626', text: 'This is so inspiring. Congratulations!', time: '23h ago' },
  ],
  '5': [
    { id: 'c8', name: 'Abebu T.', initials: 'AT', avatarColor: colors.blue, text: 'Day 5 here. Shoulders are on fire!', time: '20h ago' },
    { id: 'c9', name: 'Meron H.', initials: 'MH', avatarColor: '#D4A843', text: 'Let\'s go! Day 2 for me.', time: '18h ago' },
  ],
};

export default function CommentsScreen() {
  const { postId, postText, postName } = useLocalSearchParams();
  const [comments, setComments] = useState(initialComments[postId] || []);
  const [newComment, setNewComment] = useState('');

  function handleSubmit() {
    if (!newComment.trim()) return;
    const comment = {
      id: `new_${Date.now()}`,
      name: 'You',
      initials: 'HE',
      avatarColor: colors.blue,
      text: newComment.trim(),
      time: 'Just now',
    };
    setComments(prev => [...prev, comment]);
    setNewComment('');
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comments</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* Original post */}
        <View style={styles.originalPost}>
          <Text style={styles.originalPostName}>{postName}</Text>
          <Text style={styles.originalPostText}>{postText}</Text>
        </View>

        <View style={styles.divider} />

        {/* Comments */}
        <Text style={styles.commentsCount}>
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </Text>

        {comments.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="message-circle" size={40} color={colors.greyLight} />
            <Text style={styles.emptyText}>No comments yet</Text>
            <Text style={styles.emptySub}>Be the first to comment</Text>
          </View>
        ) : (
          <View style={styles.commentsList}>
            {comments.map(comment => (
              <View key={comment.id} style={styles.commentCard}>
                <View style={[styles.avatar, { backgroundColor: comment.avatarColor }]}>
                  <Text style={styles.avatarText}>{comment.initials}</Text>
                </View>
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentName}>{comment.name}</Text>
                    <Text style={styles.commentTime}>{comment.time}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

      </ScrollView>

      {/* Comment input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputAvatar}>
          <Text style={styles.inputAvatarText}>HE</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor={colors.greyLight}
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={300}
        />
        <TouchableOpacity
          style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
          onPress={handleSubmit}
          disabled={!newComment.trim()}
        >
          <Feather
            name="send"
            size={18}
            color={newComment.trim() ? colors.white : colors.greyLight}
          />
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.greyCard,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.black,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },

  originalPost: {
    marginBottom: 16,
  },

  originalPostName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 6,
  },

  originalPostText: {
    fontSize: 15,
    color: colors.grey,
    lineHeight: 22,
    fontWeight: '300',
  },

  divider: {
    height: 0.5,
    backgroundColor: colors.greyBorder,
    marginBottom: 16,
  },

  commentsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 16,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey,
  },

  emptySub: {
    fontSize: 13,
    color: colors.greyLight,
    fontWeight: '300',
  },

  commentsList: {
    gap: 16,
  },

  commentCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },

  commentContent: {
    flex: 1,
    backgroundColor: colors.greyCard,
    borderRadius: 16,
    padding: 12,
  },

  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  commentName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.black,
  },

  commentTime: {
    fontSize: 11,
    color: colors.greyLight,
  },

  commentText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 20,
    fontWeight: '300',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: colors.greyBorder,
    backgroundColor: colors.white,
  },

  inputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  inputAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
    maxHeight: 80,
    paddingVertical: 8,
  },

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  sendButtonDisabled: {
    backgroundColor: colors.greyCard,
    shadowOpacity: 0,
    elevation: 0,
  },
});