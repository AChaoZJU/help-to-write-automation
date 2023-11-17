import {RetrievalQAChain} from "langchain/chains";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {CacheBackedEmbeddings} from "langchain/embeddings/cache_backed";
import {InMemoryStore} from "langchain/storage/in_memory";
import {FaissStore} from "langchain/vectorstores/faiss";
import {prompt, writeStrToFile} from './concat'
import {ChatPromptTemplate, FewShotChatMessagePromptTemplate,} from "langchain/prompts";
import {examples} from "./constants/constant";
import {getDocuments} from "./utils";

export function RunMessage() {
  return new Promise(async (resolve, reject) => {
    try {
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

      const documents = await getDocuments()


      const vectorStore = await FaissStore.fromDocuments(
          documents,
          cacheBackedEmbeddings
      );

      const model = new ChatOpenAI({
        openAIApiKey: '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'
      });

       const examplePrompt = ChatPromptTemplate.fromTemplate(`${prompt}
       Human: {input}
AI: {output}`);
      const fewShotPrompt = new FewShotChatMessagePromptTemplate({
        examplePrompt,
        examples,
        inputVariables: [], // no input variables
      });

      const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
        prompt: fewShotPrompt,
      });

      const response = await chain.call({
        query: 'Please help to write the automation script for TC73066 in the prompt.',
      });

      console.log(response)

      writeStrToFile(JSON.stringify(response.text), 'response.txt')
    } catch (err: any) {
      console.log(err)
      reject(new Error(`GPT returns an error: ${err.message}`))
    }
  })
}

RunMessage().then((res) => {
  console.log(res)
})
