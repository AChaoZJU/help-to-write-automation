import {isDirectory } from "../scripts/concat";
import fs from "fs";
import {Document} from "langchain/document";
import {RecursiveCharacterTextSplitter, CharacterTextSplitter} from "langchain/text_splitter";
import {getFilesWithPrefix} from "./file";

export const goThroughFiles = (files: string[], cb: Function) => {
  return files.forEach((file) => {
    const isDir = isDirectory(file)
    if(isDir) {
      const dirFiles = fs.readdirSync(file)
      const dirFilesPath = dirFiles.map((dirFile: string) => {
        return `${file}/${dirFile}`
      })
      goThroughFiles(dirFilesPath, cb)
    }else {
      const fileContent = fs.readFileSync(file, 'utf-8')
      cb?.(file, fileContent)
    }
  });
}

export const getDocuments = async () => {
  let JSDocs: Document[] = [];
  let specDocs: Document[] = [];
  let HTMLDocs: Document[] = [];

  const cb = (file: string, fileContent: string) => {
    const doc = new Document({ pageContent: fileContent });
    console.log(`read ${file}`)
    if (file.match(/js$/) ) {
      JSDocs = [...JSDocs, doc]
    } else if (file.match(/html$/)) {
      HTMLDocs = [...HTMLDocs, doc]
    } else {
      specDocs = [...specDocs, doc]
    }
  }


  const dirs =  [...getFilesWithPrefix(['features', 'pages/webPages', 'steps/editor', 'utils/web-utils']), './constants/forms.html']

  goThroughFiles(dirs, cb)

  const JSSplitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
    chunkSize: 500,
    chunkOverlap: 0,
  });
  const HTMLSplitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
    chunkSize: 500,
    chunkOverlap: 0,
  });


  const splitter = new CharacterTextSplitter({
    separator: "\n",
    chunkSize: 300,
    chunkOverlap: 0,
  });

  const JSDocuments = await JSSplitter.splitDocuments(JSDocs)
  const HTMLDocuments = await HTMLSplitter.splitDocuments(HTMLDocs)
  const specDocuments = await splitter.splitDocuments(specDocs)
  const documents = [...JSDocuments, ...HTMLDocuments, ...specDocuments]
  console.log(`${documents.length} documents`)
  return documents
}
