import { eq } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getTestDBInstance } from '@/database/server/core/dbForTest';

import {
  files,
  messagePlugins,
  messageTTS,
  messageTranslates,
  messages,
  messagesFiles,
  sessions,
  topics,
  users,
} from '../../schemas/lobechat';
import { MessageModel } from '../message';

let serverDB = await getTestDBInstance();

vi.mock('@/database/server/core/db', async () => ({
  get serverDB() {
    return serverDB;
  },
}));

const userId = 'message-db';
const messageModel = new MessageModel(userId);

beforeEach(async () => {
  // 在每个测试用例之前，清空表
  await serverDB.transaction(async (trx) => {
    await trx.delete(users);
    await trx.insert(users).values([{ id: userId }, { id: '456' }]);

    await trx.insert(sessions).values([
      // { id: 'session1', userId },
      // { id: 'session2', userId },
      { id: '1', userId },
    ]);
    await trx.insert(files).values({
      id: 'f1',
      userId: userId,
      url: 'abc',
      name: 'file-1',
      fileType: 'image/png',
      size: 1000,
    });
  });
});

afterEach(async () => {
  // 在每个测试用例之后，清空表
  await serverDB.delete(users);
});

describe('MessageModel', () => {
  describe('query', () => {
    it('should query messages by user ID', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values([
        { id: '1', userId, role: 'user', content: 'message 1', createdAt: new Date('2023-01-01') },
        { id: '2', userId, role: 'user', content: 'message 2', createdAt: new Date('2023-02-01') },
        {
          id: '3',
          userId: '456',
          role: 'user',
          content: 'message 3',
          createdAt: new Date('2023-03-01'),
        },
      ]);

      // 调用 query 方法
      const result = await messageModel.query();

      // 断言结果
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('should return empty messages if not match the user ID', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values([
        { id: '1', userId: '456', role: 'user', content: '1', createdAt: new Date('2023-01-01') },
        { id: '2', userId: '456', role: 'user', content: '2', createdAt: new Date('2023-02-01') },
        { id: '3', userId: '456', role: 'user', content: '3', createdAt: new Date('2023-03-01') },
      ]);

      // 调用 query 方法
      const result = await messageModel.query();

      // 断言结果
      expect(result).toHaveLength(0);
    });

    it('should query messages with pagination', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values([
        { id: '1', userId, role: 'user', content: 'message 1', createdAt: new Date('2023-01-01') },
        { id: '2', userId, role: 'user', content: 'message 2', createdAt: new Date('2023-02-01') },
        { id: '3', userId, role: 'user', content: 'message 3', createdAt: new Date('2023-03-01') },
      ]);

      // 测试分页
      const result1 = await messageModel.query({ current: 0, pageSize: 2 });
      expect(result1).toHaveLength(2);

      const result2 = await messageModel.query({ current: 1, pageSize: 1 });
      expect(result2).toHaveLength(1);
      expect(result2[0].id).toBe('2');
    });

    it('should filter messages by sessionId', async () => {
      // 创建测试数据
      await serverDB.insert(sessions).values([
        { id: 'session1', userId },
        { id: 'session2', userId },
      ]);
      await serverDB.insert(messages).values([
        {
          id: '1',
          userId,
          role: 'user',
          sessionId: 'session1',
          content: 'message 1',
          createdAt: new Date('2022-02-01'),
        },
        {
          id: '2',
          userId,
          role: 'user',
          sessionId: 'session1',
          content: 'message 2',
          createdAt: new Date('2023-02-02'),
        },
        { id: '3', userId, role: 'user', sessionId: 'session2', content: 'message 3' },
      ]);

      // 测试根据 sessionId 过滤
      const result = await messageModel.query({ sessionId: 'session1' });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('should filter messages by topicId', async () => {
      // 创建测试数据
      const sessionId = 'session1';
      await serverDB.insert(sessions).values([{ id: sessionId, userId }]);
      const topicId = 'topic1';
      await serverDB.insert(topics).values([
        { id: topicId, sessionId, userId },
        { id: 'topic2', sessionId, userId },
      ]);

      await serverDB.insert(messages).values([
        { id: '1', userId, role: 'user', topicId, content: '1', createdAt: new Date('2022-04-01') },
        { id: '2', userId, role: 'user', topicId, content: '2', createdAt: new Date('2023-02-01') },
        { id: '3', userId, role: 'user', topicId: 'topic2', content: 'message 3' },
      ]);

      // 测试根据 topicId 过滤
      const result = await messageModel.query({ topicId });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('should query messages with join', async () => {
      // 创建测试数据
      await serverDB.transaction(async (trx) => {
        await trx.insert(messages).values([
          {
            id: '1',
            userId,
            role: 'user',
            content: 'message 1',
            createdAt: new Date('2023-01-01'),
          },
          {
            id: '2',
            userId,
            role: 'user',
            content: 'message 2',
            createdAt: new Date('2023-02-01'),
          },
          {
            id: '3',
            userId: '456',
            role: 'user',
            content: 'message 3',
            createdAt: new Date('2023-03-01'),
          },
        ]);
        await trx.insert(files).values([
          { id: 'f-0', url: 'abc', name: 'file-1', userId, fileType: 'image/png', size: 1000 },
          { id: 'f-1', url: 'abc', name: 'file-1', userId, fileType: 'image/png', size: 100 },
          { id: 'f-3', url: 'abc', name: 'file-3', userId, fileType: 'image/png', size: 400 },
        ]);
        await trx
          .insert(messageTTS)
          .values([{ id: '1' }, { id: '2', voice: 'a', fileId: 'f-1', contentMd5: 'abc' }]);

        await trx.insert(messagesFiles).values([
          { fileId: 'f-0', messageId: '1' },
          { fileId: 'f-3', messageId: '1' },
        ]);
      });

      // 调用 query 方法
      const result = await messageModel.query();

      // 断言结果
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[0].imageList).toEqual([
        { alt: 'file-1', id: 'f-0', url: expect.stringContaining('/abc') },
        { alt: 'file-3', id: 'f-3', url: expect.stringContaining('/abc') },
      ]);

      expect(result[1].id).toBe('2');
      expect(result[1].imageList).toEqual([]);
    });

    it('should include translate, tts and other extra fields in query result', async () => {
      // 创建测试数据
      await serverDB.transaction(async (trx) => {
        await trx.insert(messages).values([
          {
            id: '1',
            userId,
            role: 'user',
            content: 'message 1',
            createdAt: new Date('2023-01-01'),
          },
        ]);
        await trx
          .insert(messageTranslates)
          .values([{ id: '1', content: 'translated', from: 'en', to: 'zh' }]);
        await trx
          .insert(messageTTS)
          .values([{ id: '1', voice: 'voice1', fileId: 'f1', contentMd5: 'md5' }]);
      });

      // 调用 query 方法
      const result = await messageModel.query();

      // 断言结果
      expect(result[0].extra.translate).toEqual({ content: 'translated', from: 'en', to: 'zh' });
      expect(result[0].extra.tts).toEqual({
        contentMd5: 'md5',
        file: 'f1',
        voice: 'voice1',
      });
    });

    it('should handle edge cases of pagination parameters', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values([
        { id: '1', userId, role: 'user', content: 'message 1' },
        { id: '2', userId, role: 'user', content: 'message 2' },
        { id: '3', userId, role: 'user', content: 'message 3' },
      ]);

      // 测试 current 和 pageSize 的边界情况
      const result1 = await messageModel.query({ current: 0, pageSize: 2 });
      expect(result1).toHaveLength(2);

      const result2 = await messageModel.query({ current: 1, pageSize: 2 });
      expect(result2).toHaveLength(1);

      const result3 = await messageModel.query({ current: 2, pageSize: 2 });
      expect(result3).toHaveLength(0);
    });
  });

  describe('queryAll', () => {
    it('should return all messages belonging to the user in ascending order', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values([
        {
          id: '1',
          userId,
          role: 'user',
          content: 'message 1',
          createdAt: new Date('2023-01-01'),
        },
        {
          id: '2',
          userId,
          role: 'user',
          content: 'message 2',
          createdAt: new Date('2023-02-01'),
        },
        {
          id: '3',
          userId: '456',
          role: 'user',
          content: 'message 3',
          createdAt: new Date('2023-03-01'),
        },
      ]);

      // 调用 queryAll 方法
      const result = await messageModel.queryAll();

      // 断言结果
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });
  });

  describe('findById', () => {
    it('should find message by ID', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values([
        { id: '1', userId, role: 'user', content: 'message 1' },
        { id: '2', userId: '456', role: 'user', content: 'message 2' },
      ]);

      // 调用 findById 方法
      const result = await messageModel.findById('1');

      // 断言结果
      expect(result?.id).toBe('1');
      expect(result?.content).toBe('message 1');
    });

    it('should return undefined if message does not belong to user', async () => {
      // 创建测试数据
      await serverDB
        .insert(messages)
        .values([{ id: '1', userId: '456', role: 'user', content: 'message 1' }]);

      // 调用 findById 方法
      const result = await messageModel.findById('1');

      // 断言结果
      expect(result).toBeUndefined();
    });
  });

  describe('queryBySessionId', () => {
    it('should query messages by sessionId', async () => {
      // 创建测试数据
      const sessionId = 'session1';
      await serverDB.insert(sessions).values([
        { id: 'session1', userId },
        { id: 'session2', userId },
      ]);
      await serverDB.insert(messages).values([
        {
          id: '1',
          userId,
          role: 'user',
          sessionId,
          content: 'message 1',
          createdAt: new Date('2022-01-01'),
        },
        {
          id: '2',
          userId,
          role: 'user',
          sessionId,
          content: 'message 2',
          createdAt: new Date('2023-02-01'),
        },
        { id: '3', userId, role: 'user', sessionId: 'session2', content: 'message 3' },
      ]);

      // 调用 queryBySessionId 方法
      const result = await messageModel.queryBySessionId(sessionId);

      // 断言结果
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });
  });

  describe('queryByKeyWord', () => {
    it('should query messages by keyword', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values([
        { id: '1', userId, role: 'user', content: 'apple', createdAt: new Date('2022-02-01') },
        { id: '2', userId, role: 'user', content: 'banana' },
        { id: '3', userId, role: 'user', content: 'pear' },
        { id: '4', userId, role: 'user', content: 'apple pie', createdAt: new Date('2024-02-01') },
      ]);

      // 测试查询包含特定关键字的消息
      const result = await messageModel.queryByKeyword('apple');

      // 断言结果
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('4');
      expect(result[1].id).toBe('1');
    });

    it('should return empty array when keyword is empty', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values([
        { id: '1', userId, role: 'user', content: 'apple' },
        { id: '2', userId, role: 'user', content: 'banana' },
        { id: '3', userId, role: 'user', content: 'pear' },
        { id: '4', userId, role: 'user', content: 'apple pie' },
      ]);

      // 测试当关键字为空时返回空数组
      const result = await messageModel.queryByKeyword('');

      // 断言结果
      expect(result).toHaveLength(0);
    });
  });

  describe('createMessage', () => {
    it('should create a new message', async () => {
      // 调用 createMessage 方法
      await messageModel.create({ role: 'user', content: 'new message', sessionId: '1' });

      // 断言结果
      const result = await serverDB
        .select()
        .from(messages)
        .where(eq(messages.userId, userId))
        .execute();
      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('new message');
    });

    it('should create a message', async () => {
      const sessionId = 'session1';
      await serverDB.insert(sessions).values([{ id: sessionId, userId }]);

      const result = await messageModel.create({
        content: 'message 1',
        role: 'user',
        sessionId: 'session1',
      });

      expect(result.id).toBeDefined();
      expect(result.content).toBe('message 1');
      expect(result.role).toBe('user');
      expect(result.sessionId).toBe('session1');
      expect(result.userId).toBe(userId);
    });

    it('should generate message ID automatically', async () => {
      // 调用 createMessage 方法
      await messageModel.create({
        role: 'user',
        content: 'new message',
        sessionId: '1',
      });

      // 断言结果
      const result = await serverDB
        .select()
        .from(messages)
        .where(eq(messages.userId, userId))
        .execute();
      expect(result[0].id).toBeDefined();
      expect(result[0].id).toHaveLength(18);
    });

    it('should create a tool message and insert into messagePlugins table', async () => {
      // 调用 create 方法
      const result = await messageModel.create({
        content: 'message 1',
        role: 'tool',
        sessionId: '1',
        tool_call_id: 'tool1',
        plugin: {
          apiName: 'api1',
          arguments: 'arg1',
          identifier: 'plugin1',
          type: 'default',
        },
      });

      // 断言结果
      expect(result.id).toBeDefined();
      expect(result.content).toBe('message 1');
      expect(result.role).toBe('tool');
      expect(result.sessionId).toBe('1');

      const pluginResult = await serverDB
        .select()
        .from(messagePlugins)
        .where(eq(messagePlugins.id, result.id))
        .execute();
      expect(pluginResult).toHaveLength(1);
      expect(pluginResult[0].identifier).toBe('plugin1');
    });

    it('should create tool message ', async () => {
      // 调用 create 方法
      const state = {
        query: 'Composio',
        answers: [],
        results: [
          {
            url: 'https://www.composio.dev/',
            score: 16,
            title: 'Composio - Connect 90+ tools to your AI agents',
            engine: 'bing',
            content:
              'Faster DevelopmentHigher ReliabilityBetter Integrations. Get Started Now. Our platform lets you ditch the specs and seamlessly integrate any tool you need in less than 5 mins.',
            engines: ['bing', 'qwant', 'brave', 'duckduckgo'],
            category: 'general',
            template: 'default.html',
            positions: [1, 1, 1, 1],
            thumbnail: '',
            parsed_url: ['https', 'www.composio.dev', '/', '', '', ''],
            publishedDate: null,
          },
          {
            url: 'https://www.composio.co/',
            score: 10.75,
            title: 'Composio',
            engine: 'bing',
            content:
              'Composio was created to help streamline the entire book creation process! Writing. Take time out to write / Make a schedule to write consistently. We have writing software that optimizes your books for printing or ebook format. Figure out what you want to write. Collaborate and write with others. Professional editing is a necessity.',
            engines: ['qwant', 'duckduckgo', 'google', 'bing', 'brave'],
            category: 'general',
            template: 'default.html',
            positions: [5, 2, 1, 5, 4],
            thumbnail: null,
            parsed_url: ['https', 'www.composio.co', '/', '', '', ''],
            publishedDate: null,
          },
        ],
        unresponsive_engines: [],
      };
      const result = await messageModel.create({
        content: '[{}]',
        plugin: {
          apiName: 'searchWithSearXNG',
          arguments: '{\n  "query": "Composio"\n}',
          identifier: 'lobe-web-browsing',
          type: 'builtin',
        },
        pluginState: state,
        role: 'tool',
        tool_call_id: 'tool_call_ymxXC2J0',
        sessionId: '1',
      });

      // 断言结果
      expect(result.id).toBeDefined();
      expect(result.content).toBe('[{}]');
      expect(result.role).toBe('tool');
      expect(result.sessionId).toBe('1');

      const pluginResult = await serverDB
        .select()
        .from(messagePlugins)
        .where(eq(messagePlugins.id, result.id))
        .execute();
      expect(pluginResult).toHaveLength(1);
      expect(pluginResult[0].identifier).toBe('lobe-web-browsing');
      expect(pluginResult[0].state!).toMatchObject(state);
    });
  });

  describe('batchCreateMessages', () => {
    it('should batch create messages', async () => {
      // 准备测试数据
      const newMessages = [
        { id: '1', role: 'user', content: 'message 1' },
        { id: '2', role: 'assistant', content: 'message 2' },
      ];

      // 调用 batchCreateMessages 方法
      await messageModel.batchCreate(newMessages);

      // 断言结果
      const result = await serverDB
        .select()
        .from(messages)
        .where(eq(messages.userId, userId))
        .execute();
      expect(result).toHaveLength(2);
      expect(result[0].content).toBe('message 1');
      expect(result[1].content).toBe('message 2');
    });
  });

  describe('updateMessage', () => {
    it('should update message content', async () => {
      // 创建测试数据
      await serverDB
        .insert(messages)
        .values([{ id: '1', userId, role: 'user', content: 'message 1' }]);

      // 调用 updateMessage 方法
      await messageModel.update('1', { content: 'updated message' });

      // 断言结果
      const result = await serverDB.select().from(messages).where(eq(messages.id, '1')).execute();
      expect(result[0].content).toBe('updated message');
    });

    it('should only update messages belonging to the user', async () => {
      // 创建测试数据
      await serverDB
        .insert(messages)
        .values([{ id: '1', userId: '456', role: 'user', content: 'message 1' }]);

      // 调用 updateMessage 方法
      await messageModel.update('1', { content: 'updated message' });

      // 断言结果
      const result = await serverDB.select().from(messages).where(eq(messages.id, '1')).execute();
      expect(result[0].content).toBe('message 1');
    });

    it('should update message tools', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values([
        {
          id: '1',
          userId,
          role: 'user',
          content: 'message 1',
          tools: [
            {
              id: 'call_Z8UU8LedZcoJHFGkfqYecjmT',
              type: 'builtin',
              apiName: 'searchWithSearXNG',
              arguments:
                '{"query":"杭州洪水 2023","searchEngines":["google","bing","baidu","duckduckgo","brave"]}',
              identifier: 'lobe-web-browsing',
            },
          ],
        },
      ]);

      // 调用 updateMessage 方法
      await messageModel.update('1', {
        tools: [
          {
            id: 'call_Z8UU8LedZcoJHFGkfqYecjmT',
            type: 'builtin',
            apiName: 'searchWithSearXNG',
            arguments: '{"query":"2024 杭州暴雨","searchEngines":["duckduckgo","google","brave"]}',
            identifier: 'lobe-web-browsing',
          },
        ],
      });

      // 断言结果
      const result = await serverDB.select().from(messages).where(eq(messages.id, '1')).execute();
      expect(result[0].tools[0].arguments).toBe(
        '{"query":"2024 杭州暴雨","searchEngines":["duckduckgo","google","brave"]}',
      );
    });
  });

  describe('deleteMessage', () => {
    it('should delete a message', async () => {
      // 创建测试数据
      await serverDB
        .insert(messages)
        .values([{ id: '1', userId, role: 'user', content: 'message 1' }]);

      // 调用 deleteMessage 方法
      await messageModel.deleteMessage('1');

      // 断言结果
      const result = await serverDB.select().from(messages).where(eq(messages.id, '1')).execute();
      expect(result).toHaveLength(0);
    });

    it('should delete a message with tool calls', async () => {
      // 创建测试数据
      await serverDB.transaction(async (trx) => {
        await trx.insert(messages).values([
          { id: '1', userId, role: 'user', content: 'message 1', tools: [{ id: 'tool1' }] },
          { id: '2', userId, role: 'tool', content: 'message 1' },
        ]);
        await trx
          .insert(messagePlugins)
          .values([{ id: '2', toolCallId: 'tool1', identifier: 'plugin-1' }]);
      });

      // 调用 deleteMessage 方法
      await messageModel.deleteMessage('1');

      // 断言结果
      const result = await serverDB.select().from(messages).where(eq(messages.id, '1')).execute();
      expect(result).toHaveLength(0);

      const result2 = await serverDB
        .select()
        .from(messagePlugins)
        .where(eq(messagePlugins.id, '2'))
        .execute();

      expect(result2).toHaveLength(0);
    });

    it('should only delete messages belonging to the user', async () => {
      // 创建测试数据
      await serverDB
        .insert(messages)
        .values([{ id: '1', userId: '456', role: 'user', content: 'message 1' }]);

      // 调用 deleteMessage 方法
      await messageModel.deleteMessage('1');

      // 断言结果
      const result = await serverDB.select().from(messages).where(eq(messages.id, '1')).execute();
      expect(result).toHaveLength(1);
    });
  });

  describe('deleteMessages', () => {
    it('should delete 2 messages', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values([
        { id: '1', userId, role: 'user', content: 'message 1' },
        { id: '2', userId, role: 'user', content: 'message 2' },
      ]);

      // 调用 deleteMessage 方法
      await messageModel.deleteMessages(['1', '2']);

      // 断言结果
      const result = await serverDB.select().from(messages).where(eq(messages.id, '1')).execute();
      expect(result).toHaveLength(0);
      const result2 = await serverDB.select().from(messages).where(eq(messages.id, '2')).execute();
      expect(result2).toHaveLength(0);
    });

    it('should only delete messages belonging to the user', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values([
        { id: '1', userId: '456', role: 'user', content: 'message 1' },
        { id: '2', userId: '456', role: 'user', content: 'message 1' },
      ]);

      // 调用 deleteMessage 方法
      await messageModel.deleteMessages(['1', '2']);

      // 断言结果
      const result = await serverDB.select().from(messages).where(eq(messages.id, '1')).execute();
      expect(result).toHaveLength(1);
    });
  });

  describe('deleteAllMessages', () => {
    it('should delete all messages belonging to the user', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values([
        { id: '1', userId, role: 'user', content: 'message 1' },
        { id: '2', userId, role: 'user', content: 'message 2' },
        { id: '3', userId: '456', role: 'user', content: 'message 3' },
      ]);

      // 调用 deleteAllMessages 方法
      await messageModel.deleteAllMessages();

      // 断言结果
      const result = await serverDB
        .select()
        .from(messages)
        .where(eq(messages.userId, userId))
        .execute();
      expect(result).toHaveLength(0);

      const otherResult = await serverDB
        .select()
        .from(messages)
        .where(eq(messages.userId, '456'))
        .execute();
      expect(otherResult).toHaveLength(1);
    });
  });

  describe('updatePluginState', () => {
    it('should update the state field in messagePlugins table', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values({ id: '1', content: 'abc', role: 'user', userId });
      await serverDB
        .insert(messagePlugins)
        .values([
          { id: '1', toolCallId: 'tool1', identifier: 'plugin1', state: { key1: 'value1' } },
        ]);

      // 调用 updatePluginState 方法
      await messageModel.updatePluginState('1', { key2: 'value2' });

      // 断言结果
      const result = await serverDB
        .select()
        .from(messagePlugins)
        .where(eq(messagePlugins.id, '1'))
        .execute();
      expect(result[0].state).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it('should throw an error if plugin does not exist', async () => {
      // 调用 updatePluginState 方法
      await expect(messageModel.updatePluginState('1', { key: 'value' })).rejects.toThrowError(
        'Plugin not found',
      );
    });
  });
  describe('updateMessagePlugin', () => {
    it('should update the state field in messagePlugins table', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values({ id: '1', content: 'abc', role: 'user', userId });
      await serverDB
        .insert(messagePlugins)
        .values([
          { id: '1', toolCallId: 'tool1', identifier: 'plugin1', state: { key1: 'value1' } },
        ]);

      // 调用 updatePluginState 方法
      await messageModel.updateMessagePlugin('1', { identifier: 'plugin2' });

      // 断言结果
      const result = await serverDB
        .select()
        .from(messagePlugins)
        .where(eq(messagePlugins.id, '1'))
        .execute();
      expect(result[0].identifier).toEqual('plugin2');
    });

    it('should throw an error if plugin does not exist', async () => {
      // 调用 updatePluginState 方法
      await expect(messageModel.updatePluginState('1', { key: 'value' })).rejects.toThrowError(
        'Plugin not found',
      );
    });
  });

  describe('updateTranslate', () => {
    it('should insert a new record if message does not exist in messageTranslates table', async () => {
      // 创建测试数据
      await serverDB
        .insert(messages)
        .values([{ id: '1', userId, role: 'user', content: 'message 1' }]);

      // 调用 updateTranslate 方法
      await messageModel.updateTranslate('1', {
        content: 'translated message 1',
        from: 'en',
        to: 'zh',
      });

      // 断言结果
      const result = await serverDB
        .select()
        .from(messageTranslates)
        .where(eq(messageTranslates.id, '1'))
        .execute();
      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('translated message 1');
    });

    it('should update the corresponding fields if message exists in messageTranslates table', async () => {
      // 创建测试数据
      await serverDB.transaction(async (trx) => {
        await trx
          .insert(messages)
          .values([{ id: '1', userId, role: 'user', content: 'message 1' }]);
        await trx
          .insert(messageTranslates)
          .values([{ id: '1', content: 'translated message 1', from: 'en', to: 'zh' }]);
      });

      // 调用 updateTranslate 方法
      await messageModel.updateTranslate('1', { content: 'updated translated message 1' });

      // 断言结果
      const result = await serverDB
        .select()
        .from(messageTranslates)
        .where(eq(messageTranslates.id, '1'))
        .execute();
      expect(result[0].content).toBe('updated translated message 1');
    });
  });

  describe('updateTTS', () => {
    it('should insert a new record if message does not exist in messageTTS table', async () => {
      // 创建测试数据
      await serverDB
        .insert(messages)
        .values([{ id: '1', userId, role: 'user', content: 'message 1' }]);

      // 调用 updateTTS 方法
      await messageModel.updateTTS('1', { contentMd5: 'md5', file: 'f1', voice: 'voice1' });

      // 断言结果
      const result = await serverDB
        .select()
        .from(messageTTS)
        .where(eq(messageTTS.id, '1'))
        .execute();
      expect(result).toHaveLength(1);
      expect(result[0].voice).toBe('voice1');
    });

    it('should update the corresponding fields if message exists in messageTTS table', async () => {
      // 创建测试数据
      await serverDB.transaction(async (trx) => {
        await trx
          .insert(messages)
          .values([{ id: '1', userId, role: 'user', content: 'message 1' }]);
        await trx
          .insert(messageTTS)
          .values([{ id: '1', contentMd5: 'md5', fileId: 'f1', voice: 'voice1' }]);
      });

      // 调用 updateTTS 方法
      await messageModel.updateTTS('1', { voice: 'updated voice1' });

      // 断言结果
      const result = await serverDB
        .select()
        .from(messageTTS)
        .where(eq(messageTTS.id, '1'))
        .execute();
      expect(result[0].voice).toBe('updated voice1');
    });
  });

  describe('deleteMessageTranslate', () => {
    it('should delete the message translate record', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values([{ id: '1', role: 'abc', userId }]);
      await serverDB.insert(messageTranslates).values([{ id: '1' }]);

      // 调用 deleteMessageTranslate 方法
      await messageModel.deleteMessageTranslate('1');

      // 断言结果
      const result = await serverDB
        .select()
        .from(messageTranslates)
        .where(eq(messageTranslates.id, '1'))
        .execute();
      expect(result).toHaveLength(0);
    });
  });

  describe('deleteMessageTTS', () => {
    it('should delete the message TTS record', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values([{ id: '1', role: 'abc', userId }]);
      await serverDB.insert(messageTTS).values([{ id: '1' }]);

      // 调用 deleteMessageTTS 方法
      await messageModel.deleteMessageTTS('1');

      // 断言结果
      const result = await serverDB
        .select()
        .from(messageTTS)
        .where(eq(messageTTS.id, '1'))
        .execute();
      expect(result).toHaveLength(0);
    });
  });

  describe('count', () => {
    it('should return the count of messages belonging to the user', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values([
        { id: '1', userId, role: 'user', content: 'message 1' },
        { id: '2', userId, role: 'user', content: 'message 2' },
        { id: '3', userId: '456', role: 'user', content: 'message 3' },
      ]);

      // 调用 count 方法
      const result = await messageModel.count();

      // 断言结果
      expect(result).toBe(2);
    });
  });

  describe('countToday', () => {
    it('should return the count of messages created today', async () => {
      // 创建测试数据
      await serverDB.insert(messages).values([
        {
          id: '1',
          userId,
          role: 'user',
          content: 'message 1',
          createdAt: new Date(),
        },
        {
          id: '2',
          userId,
          role: 'user',
          content: 'message 2',
          createdAt: new Date(),
        },
        {
          id: '3',
          userId,
          role: 'user',
          content: 'message 3',
          createdAt: new Date('2023-01-01'),
        },
      ]);

      // 调用 countToday 方法
      const result = await messageModel.countToday();

      // 断言结果
      expect(result).toBe(2);
    });
  });
});
