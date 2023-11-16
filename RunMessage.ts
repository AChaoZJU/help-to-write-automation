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
import {str, prompt, writeStrToFile, getFilesWithPrefix, isDirectory} from './concat'
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import fs from "fs";

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

      const getDocumentFromFiles = (files: string[]) => {
        return files.forEach((file) => {
          const isDir = isDirectory(file)
          if(isDir) {
            const dirFiles = fs.readdirSync(file)
            const dirFilesPath = dirFiles.map((dirFile: string) => {
              return `${file}/${dirFile}`
            })
            getDocumentFromFiles(dirFilesPath)
          }else {
            const fileContent = fs.readFileSync(file, 'utf-8')
            const doc = new Document({ pageContent: fileContent });
            console.log(`read ${file}`)
            docs = [...docs, doc]
          }
        });
      }


      let docs: Document[] = [];
      const dirs =  getFilesWithPrefix(['features', 'pages/webPages', 'steps/editor', 'utils/web-utils'])

      getDocumentFromFiles(dirs)

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 0,
      });
      const documents = await splitter.splitDocuments(docs);

      const vectorStore = await FaissStore.fromDocuments(
          documents,
          cacheBackedEmbeddings
      );

// Many keys logged with hashed values

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
      const model = new ChatOpenAI({
        openAIApiKey: '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'
      });
      const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

      console.log(prompt)

      const response = await chain.call({
        query: prompt,
      });

      console.log(response)

      writeStrToFile(JSON.stringify(response.text), 'response.txt')
    } catch (err: any) {
      console.log(err)
      reject(new Error(`GPT returns an error: ${err.message}`))
    }
  })
}

RunMessage(0, 'test').then((res) => {
  console.log(res)
})
