import { useMutation, useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { queryClient } from '@/api/query-client';
import { queryKeys } from '@/api/query-keys';
import { MessageBubble } from '@/components/chat/message-bubble';
import { OfferMessage } from '@/components/chat/offer-message';
import { ProductChatCard } from '@/components/chat/product-chat-card';
import { QuickReply } from '@/components/chat/quick-reply';
import { ScreenHeader } from '@/components/navigation/screen-header';
import { GlassBottomSheet } from '@/components/ui/glass-bottom-sheet';
import { GlassButton } from '@/components/ui/glass-button';
import { AppText } from '@/components/ui/app-text';
import { CURRENT_USER_ID } from '@/mock/users';
import { messageService, offerService, productService, safetyService } from '@/services';
import { useTheme } from '@/hooks/use-theme';
import { ScreenPadding } from '@/theme';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [report, setReport] = useState(false);
  const conversation = useQuery({
    queryKey: ['conversation', id],
    queryFn: () => messageService.getConversation(id),
  });
  const messages = useQuery({
    queryKey: queryKeys.messages.thread(id),
    queryFn: async () => {
      await messageService.markRead(id);
      return messageService.getMessages(id);
    },
  });
  const product = useQuery({
    queryKey: queryKeys.products.detail(conversation.data?.productId ?? ''),
    queryFn: () => productService.getProductById(conversation.data?.productId ?? ''),
    enabled: Boolean(conversation.data?.productId),
  });
  const offers = useQuery({ queryKey: queryKeys.offers.all, queryFn: () => offerService.getOffers() });
  const send = useMutation({
    mutationFn: (payload: { text?: string; imageUri?: string }) =>
      messageService.sendMessage({
        conversationId: id,
        productId: conversation.data?.productId ?? '',
        recipientId:
          conversation.data?.buyerId === CURRENT_USER_ID
            ? conversation.data.sellerId
            : conversation.data?.buyerId ?? '',
        ...payload,
      }),
    onSuccess: async () => {
      setText('');
      await queryClient.invalidateQueries({ queryKey: queryKeys.messages.thread(id) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations });
    },
  });

  const relatedOffer = offers.data?.find((item) => item.conversationId === id);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ paddingTop: insets.top, paddingHorizontal: ScreenPadding }}>
        <ScreenHeader
          title={product.data?.title ?? 'Inbox'}
          right={
            <Pressable onPress={() => setReport(true)} accessibilityLabel="Report conversation">
              <AppText variant="caption" color="danger">
                Report
              </AppText>
            </Pressable>
          }
        />
        {product.data ? <ProductChatCard product={product.data} /> : null}
        {relatedOffer ? (
          <View style={{ marginTop: 10 }}>
            <OfferMessage
              offer={relatedOffer}
              canRespond={relatedOffer.sellerId === CURRENT_USER_ID && (relatedOffer.status === 'pending' || relatedOffer.status === 'countered')}
              onAccept={() =>
                void offerService.acceptOffer(relatedOffer.id).then(() =>
                  queryClient.invalidateQueries({ queryKey: queryKeys.offers.all }),
                )
              }
              onDecline={() =>
                void offerService.declineOffer(relatedOffer.id).then(() =>
                  queryClient.invalidateQueries({ queryKey: queryKeys.offers.all }),
                )
              }
              onCounter={() => router.push(`/offers/${relatedOffer.id}`)}
            />
          </View>
        ) : null}
      </View>
      <FlatList
        data={messages.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 8, paddingBottom: 12 }}
        renderItem={({ item }) =>
          item.kind === 'offer' && relatedOffer ? (
            <OfferMessage
              offer={relatedOffer}
              canRespond={relatedOffer.sellerId === CURRENT_USER_ID && (relatedOffer.status === 'pending' || relatedOffer.status === 'countered')}
              onAccept={() =>
                void offerService.acceptOffer(relatedOffer.id).then(() =>
                  queryClient.invalidateQueries({ queryKey: queryKeys.offers.all }),
                )
              }
              onDecline={() =>
                void offerService.declineOffer(relatedOffer.id).then(() =>
                  queryClient.invalidateQueries({ queryKey: queryKeys.offers.all }),
                )
              }
              onCounter={() => router.push(`/offers/${relatedOffer.id}`)}
            />
          ) : (
            <MessageBubble message={item} mine={item.senderId === CURRENT_USER_ID} />
          )
        }
      />
      <View style={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 8, gap: 8 }}>
        <QuickReply onSelect={(value) => send.mutate({ text: value })} />
        <View style={styles.composer}>
          <Pressable
            onPress={async () => {
              const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] });
              if (!result.canceled) send.mutate({ imageUri: result.assets[0].uri, text: 'Sent a photo' });
            }}>
            <AppText color="tint">Photo</AppText>
          </Pressable>
          <Pressable onPress={() => send.mutate({ text: 'Here is my meetup pin: BKK1.' })}>
            <AppText color="tint">Location</AppText>
          </Pressable>
          <Pressable onPress={() => router.push({ pathname: '/offers', params: { productId: product.data?.id, make: '1' } })}>
            <AppText color="tint">Offer</AppText>
          </Pressable>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message or offer"
            placeholderTextColor={theme.textTertiary}
            style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElevated, borderColor: theme.border }]}
          />
          <GlassButton onPress={() => text && send.mutate({ text })}>Send</GlassButton>
        </View>
      </View>
      <GlassBottomSheet visible={report} onClose={() => setReport(false)} height="40%">
        <AppText variant="title3">Report conversation</AppText>
        <GlassButton
          onPress={async () => {
            await safetyService.reportUser(conversation.data?.sellerId ?? '', 'spam');
            setReport(false);
          }}>
          Submit report
        </GlassButton>
      </GlassBottomSheet>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  composer: { flexDirection: 'row', gap: 16 },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1,
    minHeight: 48,
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
