import {goThroughFiles} from "./index";
import {getFilesWithPrefix} from "./file";

export const getSpecByTCId = (tcId: string) => {
  const dirs =  getFilesWithPrefix(['features'])
  let spec = ''

  const getTCPart = (file: string, fileContent: string) => {
    if (fileContent.match(new RegExp(tcId, 'g'))){
      // extract TC part from the fileContent
      const tcPart = fileContent.split('Scenario').slice(1).find((part: string) => {
        return part.match(new RegExp(`[${tcId}]`, 'g'))
      })
      spec =  'Scenario' + tcPart?.split('\n\n').slice(0,1)
    }
  }
  goThroughFiles(dirs, getTCPart)
  return spec
}

export const getStepsBySpecLines = (specLines: string[]) => {
  const dirs =  getFilesWithPrefix(['steps/editor'])
  let steps = ''

  const getSteps = (file: string, fileContent: string) => {
    const steps = fileContent.split(/(When|Then)/)
  }
  goThroughFiles(dirs, getSteps)
  return steps

}
