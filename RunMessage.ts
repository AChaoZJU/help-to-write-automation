import { Document } from "langchain/document";
import {MemoryVectorStore} from "langchain/vectorstores/memory";
import {CheerioWebBaseLoader} from "langchain/document_loaders/web/cheerio";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CacheBackedEmbeddings } from "langchain/embeddings/cache_backed";
import { InMemoryStore } from "langchain/storage/in_memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { FaissStore } from "langchain/vectorstores/faiss";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { str, prompt } from './concat'

const  { OpenAI } = require('langchain/llms/openai')
const { BufferMemory } = require('langchain/memory')
const { ConversationChain, LLMChain } = require('langchain/chains')
const { PromptTemplate } = require('langchain/prompts')
const axios = require('axios');

enum MessageType {
  GenerateSQL = 0,
  ExplainSQL = 1,
}

export function RunMessage(type: MessageType, newMessage: string) {
  return new Promise(async (resolve, reject) => {
    try {
      // const llm = new OpenAI({
      //   openAIApiKey: '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',
      //   temperature: 0,
      // })
      //
      // const text =
      //     "What is task decomposition?";
      //
      // const llmResult = await llm.predict(text)
      //
      // console.log(llmResult)

      /* Create instance */

      // const doc = new Document({
      //   pageContent: str
      // })
     // const loader = new CheerioWebBaseLoader(
     //      "https://lilianweng.github.io/posts/2023-06-23-agent/"
     //  );
     //  const data = await loader.load();

      // const textSplitter = new RecursiveCharacterTextSplitter({
      //   chunkSize: 500,
      //   chunkOverlap: 0,
      // });
      //
      // const splitDocs = await textSplitter.splitDocuments([doc]);
      //
      // console.log(splitDocs.length)

      const underlyingEmbeddings = new OpenAIEmbeddings(
          {
            openAIApiKey: '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'
          }
      );

      const inMemoryStore = new InMemoryStore();
      const cacheBackedEmbeddings = CacheBackedEmbeddings.fromBytesStore(
          underlyingEmbeddings,
          inMemoryStore,
          {
            namespace: underlyingEmbeddings.modelName,
          }
      );
      const loader = new TextLoader("./prompt.txt");
      const rawDocuments = await loader.load();
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 0,
      });
      const documents = await splitter.splitDocuments(rawDocuments);

// No keys logged yet since the cache is empty
      for await (const key of inMemoryStore.yieldKeys()) {
        console.log(key);
      }

      let time = Date.now();
      const vectorstore = await FaissStore.fromDocuments(
          documents,
          cacheBackedEmbeddings
      );
      console.log(`Initial creation time: ${Date.now() - time}ms`);
      /*
        Initial creation time: 1905ms
      */

// The second time is much faster since the embeddings for the input docs have already been added to the cache
      time = Date.now();
      const vectorstore2 = await FaissStore.fromDocuments(
          documents,
          cacheBackedEmbeddings
      );
      console.log(`Cached creation time: ${Date.now() - time}ms`);
      /*
        Cached creation time: 8ms
      */

// Many keys logged with hashed values
      const keys = [];
      for await (const key of inMemoryStore.yieldKeys()) {
        keys.push(key);
      }

      console.log(keys.slice(0, 5));

      // const embeddings = new OpenAIEmbeddings(
      //     {
      //       openAIApiKey: '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'
      //     }
      // );
      //
      // const vectorStore = await MemoryVectorStore.fromDocuments(
      //     splitDocs,
      //     embeddings
      // );
      //
      // const model = new ChatOpenAI({
      //   openAIApiKey: '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'
      // });
      // const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
      //
      // const response = await chain.call({
      //   query: prompt,
      // });
      //
      // console.log(response)
    } catch (err: any) {
      console.log(err)
      reject(new Error(`GPT returns an error: ${err.message}`))
    }
  })
}

RunMessage(0, 'test').then((res) => {
  console.log(res)
})
