import { JWTPayload } from '@/const/auth';
import { AsyncTaskModel } from '@/database/server/models/asyncTask';
import { FileModel } from '@/database/server/models/file';
import { ChunkContentParams, ContentChunk } from '@/server/modules/ContentChunk';
import { createAsyncServerClient } from '@/server/routers/async';
import { AsyncTaskStatus, AsyncTaskType } from '@/types/asyncTask';

export class ChunkService {
  private userId: string;
  private chunkClient: ContentChunk;
  private fileModel: FileModel;
  private asyncTaskModel: AsyncTaskModel;

  constructor(userId: string) {
    this.userId = userId;

    this.chunkClient = new ContentChunk();

    this.fileModel = new FileModel(userId);
    this.asyncTaskModel = new AsyncTaskModel(userId);
  }

  async chunkContent(params: ChunkContentParams) {
    return this.chunkClient.chunkContent(params);
  }

  async asyncEmbeddingFileChunks(fileId: string, payload: JWTPayload) {
    const result = await this.fileModel.findById(fileId);

    if (!result) return;

    // 1. create a asyncTaskId
    const asyncTaskId = await this.asyncTaskModel.create({
      status: AsyncTaskStatus.Pending,
      type: AsyncTaskType.Embedding,
    });

    await this.fileModel.update(fileId, { embeddingTaskId: asyncTaskId });

    const asyncCaller = await createAsyncServerClient(this.userId, payload);

    // trigger embedding task asynchronously
    await asyncCaller.file.embeddingChunks.mutate({ fileId, taskId: asyncTaskId });

    return asyncTaskId;
  }

  /**
   * parse file to chunks with async task
   */
  async asyncParseFileToChunks(fileId: string, payload: JWTPayload, skipExist?: boolean) {
    const result = await this.fileModel.findById(fileId);

    if (!result) return;

    // skip if already exist chunk tasks
    if (skipExist && result.chunkTaskId) return;

    // 1. create a asyncTaskId
    const asyncTaskId = await this.asyncTaskModel.create({
      status: AsyncTaskStatus.Processing,
      type: AsyncTaskType.Chunking,
    });

    await this.fileModel.update(fileId, { chunkTaskId: asyncTaskId });

    const asyncCaller = await createAsyncServerClient(this.userId, payload);

    // trigger parse file task asynchronously
    asyncCaller.file.parseFileToChunks.mutate({ fileId: fileId, taskId: asyncTaskId });

    return asyncTaskId;
  }
}
